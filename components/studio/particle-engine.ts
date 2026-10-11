import * as THREE from 'three'

/**
 * GPU particle field behind the homepage story and the closing call to action.
 *
 * Every particle carries a "from" and a "to" position. Shapes are either point
 * clouds sampled on the CPU (the MAST compass mark, a website wireframe, a word)
 * or procedural shapes computed in the vertex shader every frame (drifting
 * chaos, waves, a rotating globe). `mix` blends the two; halfway through a
 * blend the field swirls and expands, so each change reads as a choreographed
 * explode-and-reform rather than a linear slide.
 */

export type Shape =
  | { kind: 'points'; data: Float32Array }
  | { kind: 'chaos' }
  | { kind: 'waves' }
  | { kind: 'sphere' }

const KIND: Record<Shape['kind'], number> = { points: 0, chaos: 1, waves: 2, sphere: 3 }
const WAVE_ROWS = 22

export type EngineOptions = {
  count: number
  background: string
  ink: string
  accent: string
  /** Faint motion trails behind fast particles. */
  trails?: boolean
  /** Visitors who ask for reduced motion get static, instant shapes. */
  reduced?: boolean
  /** Fraction of the viewport height the shapes are lifted above centre. */
  lift?: number
}

const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute vec3 aRand;
  attribute vec3 aSphere;
  attribute vec4 aSeed;

  uniform float uTime;
  uniform float uMix;
  uniform float uIntro;
  uniform float uTurb;
  uniform float uScale;
  uniform float uLift;
  uniform float uSize;
  uniform float uPR;
  uniform float uPointer;
  uniform float uAttract;
  uniform float uShockT;
  uniform int uFromKind;
  uniform int uToKind;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec2 uShockPos;
  uniform vec2 uTilt;

  varying float vAlpha;
  varying float vAccent;

  vec3 shapePos(int kind, vec3 stat) {
    if (kind == 0) return stat;
    if (kind == 1) {
      vec3 p = aRand * vec3(uRes.x * 1.05, uRes.y * 1.05, 500.0);
      p.x += sin(uTime * 0.45 + aSeed.z * 40.0) * 26.0;
      p.y += cos(uTime * 0.4 + aSeed.z * 57.0) * 26.0;
      return p;
    }
    if (kind == 2) {
      float row = aSeed.x;
      float u = aSeed.y;
      float x = (u - 0.5) * uRes.x * 1.15;
      float y = (row / ${(WAVE_ROWS - 1).toFixed(1)} - 0.5) * uRes.y * 0.46 + uLift;
      y += sin(u * 9.0 + uTime * 1.1 + row * 0.42) * uRes.y * 0.065;
      float z = cos(u * 6.0 + uTime * 0.8 + row * 0.3) * uScale * 0.3;
      return vec3(x, y, z);
    }
    float a = uTime * 0.22;
    float ca = cos(a);
    float sa = sin(a);
    vec3 s = aSphere;
    vec3 r = vec3(s.x * ca + s.z * sa, s.y, -s.x * sa + s.z * ca);
    float ct = cos(0.42);
    float st = sin(0.42);
    r = vec3(r.x, r.y * ct - r.z * st, r.y * st + r.z * ct);
    r *= uScale * 0.34;
    r.y += uLift;
    return r;
  }

  void main() {
    vec3 a = shapePos(uFromKind, aFrom);
    vec3 b = shapePos(uToKind, aTo);
    float m = smoothstep(0.0, 1.0, clamp((uMix - aSeed.z * 0.22) / 0.78, 0.0, 1.0));
    vec3 p = mix(a, b, m);

    float mid = sin(m * 3.14159265);
    float ang = mid * uTurb * (0.9 + aSeed.z * 1.4);
    float c = cos(ang);
    float s = sin(ang);
    p.xy = mat2(c, -s, s, c) * (p.xy - vec2(0.0, uLift)) + vec2(0.0, uLift);
    p += aRand * mid * uTurb * 420.0;

    float intro = clamp((uIntro - aSeed.z * 0.35) / 0.65, 0.0, 1.0);
    intro = 1.0 - pow(1.0 - intro, 4.0);
    p.xy = mix(vec2(0.0, uLift), p.xy, intro);

    vec2 d = p.xy - uMouse;
    float dist = length(d) + 0.0001;
    float push = smoothstep(170.0, 0.0, dist) * uPointer * (1.0 - uAttract);
    p.xy += d / dist * push * 85.0;
    float pull = smoothstep(340.0, 0.0, dist) * uAttract * uPointer;
    p.xy = mix(p.xy, uMouse + d * 0.18, pull * 0.9);

    vec2 sd = p.xy - uShockPos;
    float sdist = length(sd) + 0.0001;
    float ring = uShockT * 950.0;
    float band = exp(-pow((sdist - ring) / 70.0, 2.0)) * exp(-uShockT * 1.6);
    p.xy += sd / sdist * band * 140.0;

    // Turn the whole field a little toward the pointer and project it with a
    // real perspective, so depth in the shapes reads as volume.
    vec3 q = p - vec3(0.0, uLift, 0.0);
    float cy = cos(uTilt.x);
    float sy = sin(uTilt.x);
    q = vec3(q.x * cy + q.z * sy, q.y, -q.x * sy + q.z * cy);
    float cx = cos(uTilt.y);
    float sx = sin(uTilt.y);
    q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);
    float focal = uRes.y * 1.8;
    float persp = focal / max(focal - q.z, focal * 0.25);
    p = vec3(q.xy * persp + vec2(0.0, uLift), q.z);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p.xy, 0.0, 1.0);
    float depth = clamp(p.z / max(uScale * 0.34, 1.0) * 0.5 + 0.5, 0.0, 1.0);
    gl_PointSize = uSize * uPR * persp * (0.55 + depth * 0.95) * (aSeed.w > 0.5 ? 1.6 : 1.0);
    vAlpha = (0.32 + depth * 0.68) * (0.4 + intro * 0.6);
    vAccent = aSeed.w;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    gl_FragColor = vec4(mix(uInk, uAccent, vAccent), a * vAlpha);
  }
`

export class ParticleEngine {
  readonly count: number
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10)
  private fadeScene = new THREE.Scene()
  private fadeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private material: THREE.ShaderMaterial
  private geometry = new THREE.BufferGeometry()
  private from: Float32Array
  private to: Float32Array
  private opts: EngineOptions
  private raf = 0
  private running = false
  private started = 0
  private width = 1
  private height = 1
  private tween: { from: number; start: number; duration: number } | null = null
  private pointerTarget = { x: -99999, y: -99999, strength: 0 }
  private attractTarget = 0
  private beforeFrame?: (time: number) => void
  private fadeAlpha: { value: number } = { value: 0.26 }
  private lastFrame = 0

  constructor(private canvas: HTMLCanvasElement, opts: EngineOptions) {
    this.opts = opts
    this.count = opts.count
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: !!opts.trails && !opts.reduced,
    })
    this.renderer.setClearColor(new THREE.Color(opts.background), 1)
    this.renderer.autoClear = false

    const n = opts.count
    this.from = new Float32Array(n * 3)
    this.to = new Float32Array(n * 3)
    const rand = new Float32Array(n * 3)
    const sphere = new Float32Array(n * 3)
    const seed = new Float32Array(n * 4)
    const golden = Math.PI * (3 - Math.sqrt(5))
    const perRow = Math.ceil(n / WAVE_ROWS)
    for (let i = 0; i < n; i++) {
      rand[i * 3] = Math.random() - 0.5
      rand[i * 3 + 1] = Math.random() - 0.5
      rand[i * 3 + 2] = Math.random() - 0.5
      const y = 1 - (i / (n - 1)) * 2
      const radius = Math.sqrt(1 - y * y)
      const theta = golden * i
      sphere[i * 3] = Math.cos(theta) * radius
      sphere[i * 3 + 1] = y
      sphere[i * 3 + 2] = Math.sin(theta) * radius
      seed[i * 4] = i % WAVE_ROWS
      seed[i * 4 + 1] = Math.floor(i / WAVE_ROWS) / perRow
      seed[i * 4 + 2] = Math.random()
      seed[i * 4 + 3] = Math.random() < 0.06 ? 1 : 0
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    this.geometry.setAttribute('aFrom', new THREE.BufferAttribute(this.from, 3))
    this.geometry.setAttribute('aTo', new THREE.BufferAttribute(this.to, 3))
    this.geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 3))
    this.geometry.setAttribute('aSphere', new THREE.BufferAttribute(sphere, 3))
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 0 },
        uIntro: { value: opts.reduced ? 1 : 0 },
        uTurb: { value: opts.reduced ? 0 : 1 },
        uScale: { value: 600 },
        uLift: { value: 0 },
        uSize: { value: 2.4 },
        uPR: { value: 1 },
        uPointer: { value: 0 },
        uAttract: { value: 0 },
        uShockT: { value: 99 },
        uFromKind: { value: 1 },
        uToKind: { value: 1 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(-99999, -99999) },
        uShockPos: { value: new THREE.Vector2(-99999, -99999) },
        uTilt: { value: new THREE.Vector2(0, 0) },
        uInk: { value: new THREE.Color(opts.ink) },
        uAccent: { value: new THREE.Color(opts.accent) },
      },
    })
    const points = new THREE.Points(this.geometry, this.material)
    points.frustumCulled = false
    this.scene.add(points)

    const fade = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color(opts.background) }, uAlpha: this.fadeAlpha },
        vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: 'uniform vec3 uColor; uniform float uAlpha; void main(){ gl_FragColor = vec4(uColor, uAlpha); }',
      }),
    )
    this.fadeScene.add(fade)
  }

  get size() {
    return { width: this.width, height: this.height }
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    const pr = Math.min(window.devicePixelRatio || 1, 2)
    this.renderer.setPixelRatio(pr)
    this.renderer.setSize(this.width, this.height, false)
    this.camera.left = -this.width / 2
    this.camera.right = this.width / 2
    this.camera.top = this.height / 2
    this.camera.bottom = -this.height / 2
    this.camera.updateProjectionMatrix()
    const u = this.material.uniforms
    u.uRes.value.set(this.width, this.height)
    u.uScale.value = Math.min(this.width, this.height * 1.25)
    u.uLift.value = this.height * (this.opts.lift ?? 0)
    u.uPR.value = pr
    u.uSize.value = this.width < 700 ? 2.6 : 2.2
    this.renderer.clear()
  }

  private write(target: Float32Array, shape: Shape) {
    if (shape.kind === 'points') target.set(shape.data.subarray(0, target.length))
  }

  /** Point the blend at a new pair of shapes. `mix` is then driven by scroll. */
  setPair(from: Shape, to: Shape) {
    this.write(this.from, from)
    this.write(this.to, to)
    ;(this.geometry.getAttribute('aFrom') as THREE.BufferAttribute).needsUpdate = true
    ;(this.geometry.getAttribute('aTo') as THREE.BufferAttribute).needsUpdate = true
    this.material.uniforms.uFromKind.value = KIND[from.kind]
    this.material.uniforms.uToKind.value = KIND[to.kind]
  }

  setMix(mix: number) {
    const value = this.opts.reduced ? (mix > 0.5 ? 1 : 0) : mix
    this.material.uniforms.uMix.value = Math.min(1, Math.max(0, value))
  }

  /** Morph from whatever is showing to `to` over `duration` ms (used by the CTA). */
  morphTo(current: Shape, to: Shape, duration = 1400) {
    this.setPair(current, to)
    if (this.opts.reduced) {
      this.setMix(1)
      return
    }
    this.material.uniforms.uMix.value = 0
    this.tween = { from: 0, start: performance.now(), duration }
  }

  pointer(x: number, y: number, active: boolean) {
    this.pointerTarget.x = x - this.width / 2
    this.pointerTarget.y = this.height / 2 - y
    this.pointerTarget.strength = active && !this.opts.reduced ? 1 : 0
  }

  attract(on: boolean) {
    this.attractTarget = on && !this.opts.reduced ? 1 : 0
  }

  shock(x: number, y: number) {
    if (this.opts.reduced) return
    this.material.uniforms.uShockPos.value.set(x - this.width / 2, this.height / 2 - y)
    this.material.uniforms.uShockT.value = 0
  }

  onFrame(callback: (time: number) => void) {
    this.beforeFrame = callback
  }

  start() {
    if (this.running) return
    this.running = true
    if (!this.started) this.started = performance.now()
    const loop = (now: number) => {
      if (!this.running) return
      this.frame(now)
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  stop() {
    this.running = false
    this.lastFrame = 0
    cancelAnimationFrame(this.raf)
  }

  private frame(now: number) {
    const u = this.material.uniforms
    const reduced = !!this.opts.reduced
    const elapsed = (now - this.started) / 1000
    this.beforeFrame?.(now)
    if (!reduced) {
      u.uTime.value = elapsed
      u.uIntro.value = Math.min(1, elapsed / 2.2)
      u.uShockT.value = Math.min(99, u.uShockT.value + 1 / 60)
    }
    if (this.tween) {
      const t = Math.min(1, (now - this.tween.start) / this.tween.duration)
      u.uMix.value = t
      if (t >= 1) this.tween = null
    }
    const mouse = u.uMouse.value as THREE.Vector2
    if (mouse.x < -50000) mouse.set(this.pointerTarget.x, this.pointerTarget.y)
    mouse.x += (this.pointerTarget.x - mouse.x) * 0.18
    mouse.y += (this.pointerTarget.y - mouse.y) * 0.18
    u.uPointer.value += (this.pointerTarget.strength - u.uPointer.value) * 0.08
    const tilt = u.uTilt.value as THREE.Vector2
    if (!reduced) {
      const active = this.pointerTarget.strength > 0
      const tx = active ? (this.pointerTarget.x / this.width) * 0.55 : Math.sin(elapsed * 0.31) * 0.16
      const ty = active ? (-this.pointerTarget.y / this.height) * 0.38 : Math.sin(elapsed * 0.23 + 1.3) * 0.07
      tilt.x += (tx - tilt.x) * 0.04
      tilt.y += (ty - tilt.y) * 0.04
    }
    u.uAttract.value += (this.attractTarget - u.uAttract.value) * 0.06

    if (this.opts.trails && !reduced) {
      // Same trail length at any frame rate: 26% fade per 60 Hz frame.
      const dt = this.lastFrame ? Math.min(0.25, (now - this.lastFrame) / 1000) : 1 / 60
      this.fadeAlpha.value = 1 - Math.pow(0.74, dt * 60)
      this.renderer.render(this.fadeScene, this.fadeCamera)
    } else {
      this.renderer.clear()
    }
    this.renderer.render(this.scene, this.camera)
    this.lastFrame = now
  }

  dispose() {
    this.stop()
    this.geometry.dispose()
    this.material.dispose()
    this.fadeScene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        ;(object.material as THREE.Material).dispose()
      }
    })
    this.renderer.dispose()
  }
}
