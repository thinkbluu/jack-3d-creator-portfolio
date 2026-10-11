import * as THREE from 'three'

export type Rect = { x: number; y: number; width: number; height: number }

const vertex = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // Scroll velocity bends the plane like a sheet being pulled.
    p.y += sin(uv.x * 3.14159265) * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uA;
  uniform sampler2D uB;
  uniform float uMix;
  uniform float uTime;
  uniform float uShift;
  uniform float uHover;
  uniform float uRadius;
  uniform float uDim;
  uniform vec2 uMouse;
  uniform vec2 uSize;
  uniform vec2 uImage;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  // object-fit: cover, anchored to the top of the screenshot.
  vec2 cover(vec2 uv) {
    float planeRatio = uSize.x / uSize.y;
    float imageRatio = uImage.x / uImage.y;
    vec2 scale = planeRatio > imageRatio ? vec2(1.0, imageRatio / planeRatio) : vec2(planeRatio / imageRatio, 1.0);
    vec2 r = uv;
    r.x = (r.x - 0.5) * scale.x + 0.5;
    r.y = 1.0 - (1.0 - r.y) * scale.y;
    return r;
  }

  vec3 sampleShift(sampler2D tex, vec2 uv, float amount) {
    vec2 c = clamp(uv, 0.0, 1.0);
    float r = texture2D(tex, clamp(c + vec2(amount, 0.0), 0.0, 1.0)).r;
    float g = texture2D(tex, c).g;
    float b = texture2D(tex, clamp(c - vec2(amount, 0.0), 0.0, 1.0)).b;
    return vec3(r, g, b);
  }

  void main() {
    vec2 uv = vUv;
    float t = uMix;
    float wave = sin(t * 3.14159265);

    // A soft lens under the cursor.
    vec2 toMouse = uv - uMouse;
    toMouse.x *= uSize.x / uSize.y;
    float lens = exp(-dot(toMouse, toMouse) * 6.0) * uHover;
    uv -= (uv - uMouse) * lens * 0.06;
    uv = (uv - 0.5) * (1.0 - 0.035 * uHover) + 0.5;

    float n = fbm(uv * vec2(3.0, 2.0) + uTime * 0.04);

    // The outgoing image is pushed and zoomed; the incoming one settles in.
    vec2 push = vec2((n - 0.5) * 0.18, (n - 0.5) * 0.32) * wave;
    vec2 uvA = (uv - 0.5) * (1.0 - 0.12 * t) + 0.5 + push * t;
    vec2 uvB = (uv - 0.5) * (1.0 - 0.12 * (1.0 - t)) + 0.5 - push * (1.0 - t);

    float shift = 0.002 * wave + uShift * 0.4;
    vec3 a = sampleShift(uA, cover(uvA), shift);
    vec3 b = sampleShift(uB, cover(uvB), shift);

    // Ink-like reveal from the bottom, its edge broken by noise.
    float g = 0.55 * vUv.y + 0.45 * n;
    float m = smoothstep(g - 0.07, g + 0.07, t * 1.3 - 0.15);
    vec3 color = mix(a, b, m);

    // A band of ink rides the reveal edge.
    float seam = (1.0 - smoothstep(0.0, 0.05, abs(t * 1.3 - 0.15 - g))) * wave;
    color = mix(color, vec3(0.045, 0.085, 0.15), seam * 0.9);

    color *= 1.0 - uDim;

    // Rounded corners, in pixels.
    vec2 px = (vUv - 0.5) * uSize;
    vec2 q = abs(px) - (uSize * 0.5 - uRadius);
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float alpha = 1.0 - smoothstep(-0.75, 0.75, d);

    gl_FragColor = vec4(color, alpha);
  }
`

/**
 * One image plane in pixel space that blends between project covers with a
 * noise-edged, RGB-split transition. The caller drives it every frame.
 */
export class WorkGL {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10)
  private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private textures: THREE.Texture[] = []
  private blank: THREE.Texture
  private pair: [number, number] = [-1, -1]
  readonly ready: Promise<void>

  constructor(canvas: HTMLCanvasElement, sources: string[], dpr: number) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(dpr)
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)

    const data = new Uint8Array([15, 27, 43, 255])
    this.blank = new THREE.DataTexture(data, 1, 1)
    this.blank.needsUpdate = true

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uA: { value: this.blank },
        uB: { value: this.blank },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uShift: { value: 0 },
        uHover: { value: 0 },
        uRadius: { value: 8 },
        uDim: { value: 0 },
        uBend: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uSize: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(1200, 591) },
      },
    })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 32, 1), material)
    this.scene.add(this.mesh)

    const loader = new THREE.TextureLoader()
    this.ready = Promise.all(
      sources.map(
        (src, index) =>
          new Promise<void>((resolve) => {
            loader.load(
              src,
              (texture) => {
                texture.minFilter = THREE.LinearFilter
                texture.magFilter = THREE.LinearFilter
                texture.generateMipmaps = false
                texture.anisotropy = 4
                this.textures[index] = texture
                if (index === 0) {
                  const image = texture.image as { width: number; height: number }
                  material.uniforms.uImage.value.set(image.width, image.height)
                }
                this.pair = [-1, -1]
                resolve()
              },
              undefined,
              () => resolve(),
            )
          }),
      ),
    ).then(() => undefined)
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false)
    this.camera.left = 0
    this.camera.right = width
    this.camera.top = 0
    this.camera.bottom = height
    this.camera.updateProjectionMatrix()
  }

  render(state: {
    rect: Rect
    from: number
    to: number
    mix: number
    time: number
    bend: number
    shift: number
    hover: number
    mouse: [number, number]
    radius: number
    dim: number
  }) {
    const u = this.mesh.material.uniforms
    if (state.from !== this.pair[0] || state.to !== this.pair[1]) {
      u.uA.value = this.textures[state.from] ?? this.blank
      u.uB.value = this.textures[state.to] ?? this.blank
      if (this.textures[state.from] && this.textures[state.to]) this.pair = [state.from, state.to]
    }
    const { x, y, width, height } = state.rect
    this.mesh.position.set(x + width / 2, y + height / 2, 0)
    // The camera's y axis points down, so flip the plane to keep images upright.
    this.mesh.scale.set(width, -height, 1)
    u.uSize.value.set(width, height)
    u.uMix.value = state.mix
    u.uTime.value = state.time
    u.uBend.value = state.bend
    u.uShift.value = state.shift
    u.uHover.value = state.hover
    u.uMouse.value.set(state.mouse[0], state.mouse[1])
    u.uRadius.value = state.radius
    u.uDim.value = state.dim
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.textures.forEach((texture) => texture?.dispose())
    this.blank.dispose()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.renderer.dispose()
  }
}
