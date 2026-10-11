import * as THREE from 'three'

/*
 * A small stable-fluids solver (advect, vorticity, divergence, pressure,
 * gradient subtract) carrying navy ink, and occasionally brass, across cream
 * paper. The headline is a wax resist: ink and flow are kept out of the
 * letters, so the words appear as clean paper wherever the ink pools around
 * them, and as printed navy where the paper is clean.
 */

const baseVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main() {
    vUv = uv;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const head = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
`

const shaders = {
  advect: `${head}
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 dyeTexel;
    uniform float dt;
    uniform float dissipation;
    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = texture2D(uSource, coord) / (1.0 + dissipation * dt);
    }`,
  curl: `${head}
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,
  vorticity: `${head}
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main() {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
      gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
    }`,
  divergence: `${head}
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) L = -C.x;
      if (vR.x > 1.0) R = -C.x;
      if (vT.y > 1.0) T = -C.y;
      if (vB.y < 0.0) B = -C.y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,
  clear: `${head}
    uniform sampler2D uTexture;
    uniform float value;
    void main() { gl_FragColor = value * texture2D(uTexture, vUv); }`,
  pressure: `${head}
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float div = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
    }`,
  gradient: `${head}
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main() {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }`,
  splat: `${head}
    uniform sampler2D uTarget;
    uniform float aspect;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main() {
      vec2 p = vUv - point;
      p.x *= aspect;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
    }`,
  // The letters resist: ink and flow fade out inside them.
  resist: `${head}
    uniform sampler2D uTarget;
    uniform sampler2D uMask;
    uniform float strength;
    void main() {
      vec3 k = texture2D(uMask, vUv).rgb;
      float m = max(k.g, k.b);
      gl_FragColor = texture2D(uTarget, vUv) * (1.0 - m * strength);
    }`,
  display: `${head}
    uniform sampler2D uDye;
    uniform sampler2D uMask;
    uniform vec2 uRes;
    uniform float uFlood;
    uniform float uTime;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) { return noise(p) * 0.55 + noise(p * 2.1) * 0.28 + noise(p * 4.3) * 0.17; }
    void main() {
      vec2 px = vUv * uRes;
      vec3 dye = texture2D(uDye, vUv).rgb;
      float density = max(dye.r, 0.0);
      float gold = clamp(dye.g, 0.0, 1.0);
      // Paper with fibres.
      float fibre = fbm(px * vec2(0.02, 0.09)) * 0.5 + fbm(px * 0.35) * 0.5;
      vec3 paper = vec3(0.955, 0.933, 0.893) - fibre * 0.035;
      // Ink: dilute washes are blue-grey, dense ink is deep navy, and it
      // granulates into the paper.
      float gran = 0.85 + 0.3 * fbm(px * 0.6);
      float a = 1.0 - exp(-density * 2.6 * gran);
      vec3 dilute = vec3(0.36, 0.45, 0.58);
      vec3 navy = vec3(0.045, 0.085, 0.15);
      vec3 ink = mix(dilute, navy, smoothstep(0.15, 0.85, a));
      ink = mix(ink, vec3(0.78, 0.6, 0.28), gold * 0.85);
      vec3 col = mix(paper, ink, a);
      // Darker tide line at the edge of a wash.
      float edge = smoothstep(0.05, 0.25, a) * (1.0 - smoothstep(0.25, 0.6, a));
      col *= 1.0 - edge * 0.12;

      // The headline: printed navy on clean paper, clean paper inside ink.
      float letter = texture2D(uMask, vUv).g;
      vec2 o = texelSize * 7.0;
      float around = 0.0;
      around += texture2D(uDye, vUv + vec2(o.x, 0.0)).r;
      around += texture2D(uDye, vUv - vec2(o.x, 0.0)).r;
      around += texture2D(uDye, vUv + vec2(0.0, o.y)).r;
      around += texture2D(uDye, vUv - vec2(0.0, o.y)).r;
      around += texture2D(uDye, vUv + o).r;
      around += texture2D(uDye, vUv - o).r;
      around = 1.0 - exp(-around / 6.0 * 2.6);
      vec3 printed = mix(vec3(0.07, 0.1, 0.16), vec3(0.97, 0.95, 0.91), smoothstep(0.25, 0.6, around));
      col = mix(col, printed, letter);

      // Flood: ink rising from below to hand over to the next section.
      float rise = uFlood * 1.45 - 0.27 - vUv.y + (fbm(px * 0.006 + uTime * 0.05) - 0.5) * 0.35;
      float flood = smoothstep(-0.02, 0.06, rise);
      col = mix(col, vec3(0.043, 0.059, 0.086), flood);

      col += (hash(px + fract(uTime) * 71.0) - 0.5) * 0.02;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

type Target = THREE.WebGLRenderTarget
class Double {
  read: Target
  write: Target
  constructor(make: () => Target) {
    this.read = make()
    this.write = make()
  }
  swap() {
    const t = this.read
    this.read = this.write
    this.write = t
  }
  dispose() {
    this.read.dispose()
    this.write.dispose()
  }
}

export class InkGL {
  private renderer: THREE.WebGLRenderer
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private scene = new THREE.Scene()
  private quad: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private materials: Record<keyof typeof shaders, THREE.ShaderMaterial>
  private velocity!: Double
  private dye!: Double
  private pressure!: Double
  private divergence!: Target
  private curlTarget!: Target
  private mask: THREE.Texture | null = null
  private blankMask: THREE.DataTexture
  private simSize = new THREE.Vector2(1, 1)
  private dyeSize = new THREE.Vector2(1, 1)
  private width = 1
  private height = 1
  private dpr = 1
  private iterations: number
  private simRes: number
  private dyeRes: number

  constructor(canvas: HTMLCanvasElement, options: { dpr: number; small: boolean }) {
    this.dpr = options.dpr
    this.iterations = options.small ? 14 : 22
    this.simRes = options.small ? 96 : 128
    this.dyeRes = options.small ? 512 : 1024
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: false })
    this.renderer.setPixelRatio(options.dpr)
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.autoClear = false
    if (!this.renderer.capabilities.isWebGL2) throw new Error('webgl2')
    this.blankMask = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
    this.blankMask.needsUpdate = true
    const material = (fragment: string) =>
      new THREE.ShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader: fragment,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          texelSize: { value: new THREE.Vector2() },
          dyeTexel: { value: new THREE.Vector2() },
          uVelocity: { value: null },
          uSource: { value: null },
          uCurl: { value: null },
          uPressure: { value: null },
          uDivergence: { value: null },
          uTexture: { value: null },
          uTarget: { value: null },
          uMask: { value: null },
          uDye: { value: null },
          uRes: { value: new THREE.Vector2() },
          uFlood: { value: 0 },
          uTime: { value: 0 },
          dt: { value: 0.016 },
          dissipation: { value: 0 },
          curl: { value: 22 },
          value: { value: 0.8 },
          aspect: { value: 1 },
          color: { value: new THREE.Vector3() },
          point: { value: new THREE.Vector2() },
          radius: { value: 0.002 },
          strength: { value: 0.35 },
        },
      })
    this.materials = Object.fromEntries(Object.entries(shaders).map(([k, v]) => [k, material(v)])) as Record<
      keyof typeof shaders,
      THREE.ShaderMaterial
    >
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.materials.display)
    this.scene.add(this.quad)
  }

  private target(width: number, height: number, filter: THREE.MagnificationTextureFilter = THREE.LinearFilter) {
    return new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: filter,
      magFilter: filter,
      depthBuffer: false,
      stencilBuffer: false,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    })
  }

  private size(res: number) {
    const aspect = this.width / this.height
    return aspect > 1
      ? new THREE.Vector2(Math.round(res * aspect), res)
      : new THREE.Vector2(res, Math.round(res / aspect))
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.renderer.setSize(width, height, false)
    this.velocity?.dispose()
    this.dye?.dispose()
    this.pressure?.dispose()
    this.divergence?.dispose()
    this.curlTarget?.dispose()
    this.simSize = this.size(this.simRes)
    this.dyeSize = this.size(this.dyeRes)
    const s = this.simSize
    const d = this.dyeSize
    this.velocity = new Double(() => this.target(s.x, s.y))
    this.dye = new Double(() => this.target(d.x, d.y))
    this.pressure = new Double(() => this.target(s.x, s.y, THREE.NearestFilter))
    this.divergence = this.target(s.x, s.y, THREE.NearestFilter)
    this.curlTarget = this.target(s.x, s.y, THREE.NearestFilter)
  }

  setMask(source: HTMLCanvasElement) {
    this.mask?.dispose()
    const texture = new THREE.CanvasTexture(source)
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    this.mask = texture
  }

  private pass(name: keyof typeof shaders, target: Target | null, uniforms: Record<string, unknown>, texel: THREE.Vector2) {
    const material = this.materials[name]
    material.uniforms.texelSize.value.set(1 / texel.x, 1 / texel.y)
    for (const [key, value] of Object.entries(uniforms)) material.uniforms[key].value = value
    this.quad.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }

  /** x, y in 0..1 (y up), dx, dy velocity in px-ish units, ink density and gold amount. */
  splat(x: number, y: number, dx: number, dy: number, ink: number, gold: number, radius = 0.0022) {
    const aspect = this.width / this.height
    this.pass('splat', this.velocity.write, { uTarget: this.velocity.read.texture, aspect, point: new THREE.Vector2(x, y), color: new THREE.Vector3(dx, dy, 0), radius }, this.simSize)
    this.velocity.swap()
    this.pass('splat', this.dye.write, { uTarget: this.dye.read.texture, aspect, point: new THREE.Vector2(x, y), color: new THREE.Vector3(ink, gold, 0), radius: radius * 1.3 }, this.dyeSize)
    this.dye.swap()
  }

  step(dt: number) {
    const s = this.simSize
    const mask = this.mask ?? this.blankMask
    this.pass('curl', this.curlTarget, { uVelocity: this.velocity.read.texture }, s)
    this.pass('vorticity', this.velocity.write, { uVelocity: this.velocity.read.texture, uCurl: this.curlTarget.texture, curl: 18, dt }, s)
    this.velocity.swap()
    this.pass('resist', this.velocity.write, { uTarget: this.velocity.read.texture, uMask: mask, strength: 0.6 }, s)
    this.velocity.swap()
    this.pass('divergence', this.divergence, { uVelocity: this.velocity.read.texture }, s)
    this.pass('clear', this.pressure.write, { uTexture: this.pressure.read.texture, value: 0.8 }, s)
    this.pressure.swap()
    for (let i = 0; i < this.iterations; i++) {
      this.pass('pressure', this.pressure.write, { uPressure: this.pressure.read.texture, uDivergence: this.divergence.texture }, s)
      this.pressure.swap()
    }
    this.pass('gradient', this.velocity.write, { uPressure: this.pressure.read.texture, uVelocity: this.velocity.read.texture }, s)
    this.velocity.swap()
    this.pass('advect', this.velocity.write, { uVelocity: this.velocity.read.texture, uSource: this.velocity.read.texture, dt, dissipation: 0.25 }, s)
    this.velocity.swap()
    this.pass('advect', this.dye.write, { uVelocity: this.velocity.read.texture, uSource: this.dye.read.texture, dt, dissipation: 0.45 }, s)
    this.dye.swap()
    this.pass('resist', this.dye.write, { uTarget: this.dye.read.texture, uMask: mask, strength: 0.5 }, this.dyeSize)
    this.dye.swap()
  }

  render(flood: number, time: number) {
    this.pass(
      'display',
      null,
      {
        uDye: this.dye.read.texture,
        uMask: this.mask ?? this.blankMask,
        uRes: new THREE.Vector2(this.width * this.dpr, this.height * this.dpr),
        uFlood: flood,
        uTime: time,
      },
      this.dyeSize,
    )
  }

  dispose() {
    this.velocity?.dispose()
    this.dye?.dispose()
    this.pressure?.dispose()
    this.divergence?.dispose()
    this.curlTarget?.dispose()
    this.mask?.dispose()
    this.blankMask.dispose()
    Object.values(this.materials).forEach((material) => material.dispose())
    this.quad.geometry.dispose()
    this.renderer.dispose()
  }
}

/** Rasterise the headline's letters (green channel) from the real DOM layout. */
export function drawMask(stage: HTMLElement, words: HTMLElement[], scale: number, keepClear: HTMLElement[] = []) {
  const box = stage.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(box.width * scale))
  canvas.height = Math.max(1, Math.round(box.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.scale(scale, scale)
  // Blue: areas the ink keeps away from (the header strip and the small print).
  ctx.save()
  ctx.filter = 'blur(18px)'
  ctx.fillStyle = '#0000ff'
  ctx.fillRect(-40, -40, box.width + 80, 120)
  for (const element of keepClear) {
    const r = element.getBoundingClientRect()
    ctx.fillRect(r.left - box.left - 18, r.top - box.top - 14, r.width + 36, r.height + 28)
  }
  ctx.restore()
  ctx.globalCompositeOperation = 'lighter'
  ctx.fillStyle = '#00ff00'
  ctx.textBaseline = 'alphabetic'
  for (const word of words) {
    const style = getComputedStyle(word)
    const rect = word.getBoundingClientRect()
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing
    const metrics = ctx.measureText(word.textContent ?? '')
    const ascent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * 0.92
    ctx.fillText(word.textContent ?? '', rect.left - box.left, rect.top - box.top + ascent)
  }
  return canvas
}
