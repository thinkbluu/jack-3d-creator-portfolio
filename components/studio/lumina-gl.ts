import * as THREE from 'three'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/**
 * A dark plaster wall with the headline raised out of it. The text arrives as
 * a texture: red holds a blurred copy (the bevel), green the sharp letters,
 * blue the brass accent words. A warm, wide point light follows the cursor;
 * a horizon glow rises from below as the visitor scrolls (blue hour), and
 * "lights on" crossfades to a calm daylight version of the same surface.
 */
const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uText;
  uniform vec2 uTexel;
  uniform vec2 uRes;
  uniform float uDpr;
  uniform vec3 uLight;
  uniform float uRadius;
  uniform float uPower;
  uniform float uDawn;
  uniform float uDay;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float plaster(vec2 p) { return noise(p * 0.08) * 0.6 + noise(p * 0.31) * 0.3 + noise(p * 1.1) * 0.1; }

  void main() {
    vec2 uv = vUv;
    vec2 px = uv * uRes;

    vec3 t = texture2D(uText, uv).rgb;
    float hl = texture2D(uText, uv - vec2(uTexel.x, 0.0)).r;
    float hr = texture2D(uText, uv + vec2(uTexel.x, 0.0)).r;
    float hd = texture2D(uText, uv - vec2(0.0, uTexel.y)).r;
    float hu = texture2D(uText, uv + vec2(0.0, uTexel.y)).r;

    // Plaster micro relief.
    float p0 = plaster(px);
    float px1 = plaster(px + vec2(1.5, 0.0));
    float py1 = plaster(px + vec2(0.0, 1.5));

    float letter = t.g;
    float accent = t.b;
    vec3 N = normalize(vec3(
      -(hr - hl) * 5.5 - (px1 - p0) * 0.9,
      -(hu - hd) * 5.5 - (py1 - p0) * 0.9,
      1.0
    ));

    vec3 P = vec3(px, t.r * 6.0);
    vec3 Lv = uLight - P;
    float d = length(Lv);
    vec3 L = Lv / d;
    float atten = uPower / (1.0 + (d * d) / (uRadius * uRadius));

    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float diff = max(dot(N, L), 0.0);

    vec3 warm = vec3(1.0, 0.8, 0.56);
    vec3 ground = vec3(0.034, 0.042, 0.06) * (0.8 + p0 * 0.45);
    vec3 stone = vec3(0.58, 0.54, 0.49);
    vec3 brass = vec3(0.78, 0.6, 0.3);
    vec3 albedo = mix(ground, stone, letter);
    albedo = mix(albedo, brass * 0.7, accent);

    float shin = mix(14.0, 70.0, accent);
    float specAmt = mix(0.05, 0.4, letter) + accent * 1.2;
    float spec = pow(max(dot(N, H), 0.0), shin) * specAmt;
    vec3 specColor = mix(warm, brass * 1.4, accent);

    // Never pitch black: a faint navy ambient, rising at blue hour.
    vec3 ambient = mix(vec3(0.04, 0.05, 0.08), vec3(0.09, 0.12, 0.2), uDawn);

    // Horizon glow from below, the first light of the morning.
    float below = pow(1.0 - uv.y, 2.2);
    vec3 dawnDir = normalize(vec3(0.0, -0.9, 0.55));
    float dawnDiff = max(dot(N, dawnDir), 0.0);
    vec3 dawnLight = vec3(0.95, 0.62, 0.36) * uDawn * (0.25 + below * 0.9) * dawnDiff;

    vec3 col = albedo * (ambient + warm * diff * atten + dawnLight) + specColor * spec * atten;
    col += vec3(0.95, 0.6, 0.32) * uDawn * below * 0.18;

    // A little air around the lamp.
    vec2 toL = px - uLight.xy;
    col += warm * 0.045 * uPower * exp(-dot(toL, toL) / (uRadius * uRadius * 0.55));

    // Daylight version: cream wall, ink letters, the same relief.
    float dayShade = 0.86 + 0.14 * dot(N, normalize(vec3(-0.4, 0.5, 0.8)));
    vec3 dayAlbedo = mix(vec3(0.98, 0.968, 0.948), vec3(0.11, 0.1, 0.09), letter);
    dayAlbedo = mix(dayAlbedo, vec3(0.5, 0.4, 0.18), accent);
    vec3 day = dayAlbedo * dayShade;
    col = mix(col, day, uDay);

    // Vignette and grain.
    vec2 c = uv - 0.5;
    col *= mix(1.0 - dot(c, c) * 0.9, 1.0, uDay * 0.8);
    float g = hash(px / uDpr + fract(uTime * 7.0) * 100.0) - 0.5;
    col += g * mix(0.035, 0.015, uDay);

    gl_FragColor = vec4(pow(max(col, 0.0), vec3(1.0 / 1.05)), 1.0);
  }
`

export type LuminaState = {
  light: [number, number]
  power: number
  dawn: number
  day: number
  time: number
}

export class LuminaGL {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private material: THREE.ShaderMaterial
  private texture: THREE.CanvasTexture | null = null
  private width = 1
  private height = 1
  private dpr = 1

  constructor(canvas: HTMLCanvasElement, dpr: number) {
    this.dpr = dpr
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(dpr)
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      uniforms: {
        uText: { value: null },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uDpr: { value: dpr },
        uLight: { value: new THREE.Vector3() },
        uRadius: { value: 400 },
        uPower: { value: 1 },
        uDawn: { value: 0 },
        uDay: { value: 0 },
        uTime: { value: 0 },
      },
    })
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material))
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height, false)
    this.material.uniforms.uRes.value.set(width * this.dpr, height * this.dpr)
    this.material.uniforms.uRadius.value = Math.max(width, height) * 0.27 * this.dpr
  }

  /** The headline map, drawn in device pixels at the canvas size. */
  setText(source: HTMLCanvasElement) {
    this.texture?.dispose()
    const texture = new THREE.CanvasTexture(source)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    this.texture = texture
    this.material.uniforms.uText.value = texture
    this.material.uniforms.uTexel.value.set(1 / source.width, 1 / source.height)
  }

  render(state: LuminaState) {
    const u = this.material.uniforms
    const lightZ = Math.min(this.width, this.height) * 0.42
    u.uLight.value.set(state.light[0] * this.dpr, (this.height - state.light[1]) * this.dpr, lightZ * this.dpr)
    u.uPower.value = state.power
    u.uDawn.value = state.dawn
    u.uDay.value = state.day
    u.uTime.value = state.time
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.texture?.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }
}

/**
 * Rasterise the visible headline into the three-channel map the shader reads,
 * using the real DOM layout of each word so the canvas and the page agree.
 */
export function drawHeadlineMap(stage: HTMLElement, words: HTMLElement[], dpr: number) {
  const box = stage.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(box.width * dpr))
  canvas.height = Math.max(1, Math.round(box.height * dpr))
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.scale(dpr, dpr)

  const pass = (color: string, blur: number, accentOnly: boolean) => {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (const word of words) {
      const accent = word.dataset.accent === '1'
      if (accentOnly && !accent) continue
      const style = getComputedStyle(word)
      const rect = word.getBoundingClientRect()
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
      if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing
      ctx.textBaseline = 'alphabetic'
      const metrics = ctx.measureText(word.textContent ?? '')
      const ascent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * 0.92
      const x = rect.left - box.left
      const y = rect.top - box.top + ascent
      if (blur > 0) {
        // Draw far off-canvas and let only the blurred shadow land in place.
        ctx.shadowColor = color
        ctx.shadowBlur = blur * dpr
        ctx.shadowOffsetX = 10000 * dpr
        ctx.fillStyle = color
        ctx.fillText(word.textContent ?? '', x - 10000, y)
        ctx.fillText(word.textContent ?? '', x - 10000, y)
      } else {
        ctx.shadowColor = 'transparent'
        ctx.fillStyle = color
        ctx.fillText(word.textContent ?? '', x, y)
      }
    }
    ctx.restore()
  }

  pass('#ff0000', 5, false)
  pass('#00ff00', 0, false)
  pass('#0000ff', 0, true)
  return canvas
}
