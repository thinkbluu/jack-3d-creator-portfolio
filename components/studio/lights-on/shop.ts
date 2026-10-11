import * as THREE from 'three'
import type { ParticleEngine } from '../particle-engine'

/**
 * The MAST shopfront in the "Lights on" story: one textured plane whose
 * shader moves through the six beats (outline, structure, voice, colour,
 * life, lights on), plus the backdrop behind it and the warm glow sprites.
 * Everything is drawn in the particle engine's scene, in centred pixels.
 */

type Rect = { x: number; y: number; w: number; h: number }
export type ShopMeta = { width: number; height: number; sign: Rect[]; windows: Rect[]; groundY: number }

const NIGHT = new THREE.Color('#0b0f16')
/** The door, in facade UV (0..1, y up): where the crowd walks in. */
const DOOR_UV = { x: 0.7, y: 0.05 }

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform sampler2D uSign;
  uniform sampler2D uWin;
  uniform sampler2D uLetters;
  uniform sampler2D uScreen;
  uniform float uBuild;
  uniform float uDraw;
  uniform vec4 uSignRect;
  uniform vec4 uWinRect;
  uniform float uWinAspect;
  uniform float uScreenAspect;
  uniform vec3 uNight;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec4 tex = texture2D(uTex, vUv);
    if (tex.a < 0.02) discard;
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float sign = texture2D(uSign, vUv).r;
    float win = texture2D(uWin, vUv).r;
    // Lines are the bright strokes of the drawing; the cream sign board is a
    // surface, not a line, so only its edge counts as one.
    float signEdge = clamp(fwidth(sign) * 3.0, 0.0, 1.0);
    float line = max(smoothstep(0.15, 0.32, lum) * (1.0 - sign), signEdge);

    // Beat 0: the outline draws itself from the pavement up, with a ragged front.
    float front = uDraw * 1.12 - 0.04;
    float jitter = hash(floor(vUv * vec2(70.0, 90.0))) * 0.05;
    float drawn = 1.0 - smoothstep(front - 0.05, front, vUv.y + jitter);

    float body = smoothstep(0.8, 1.8, uBuild);
    float colour = smoothstep(2.6, 3.4, uBuild);
    float life = smoothstep(3.5, 4.3, uBuild);
    float lit = smoothstep(4.4, 5.0, uBuild);

    vec3 wire = vec3(0.98, 0.97, 0.95) * 0.58;
    vec3 grey = vec3(lum) * vec3(0.93, 0.96, 1.04);
    vec3 surface = mix(grey, tex.rgb, colour);
    vec3 rgb = mix(uNight, wire, line);
    rgb = mix(rgb, surface, body);
    float alpha = tex.a * drawn * max(line, body);

    // The sign board: grey, then dim cream, then lit.
    vec3 board = mix(vec3(0.16, 0.17, 0.19) + lum * 0.1, tex.rgb * 0.45, colour);
    board = mix(board, vec3(1.0, 0.95, 0.83) * 1.06, lit);
    rgb = mix(rgb, board, sign * body);
    alpha = max(alpha, sign * body * drawn * tex.a);

    // Lettering set on the board (beat 2), drawn into a canvas texture.
    vec2 su = (vUv - uSignRect.xy) / uSignRect.zw;
    if (su.x > 0.0 && su.x < 1.0 && su.y > 0.0 && su.y < 1.0) {
      float letters = texture2D(uLetters, su).a;
      vec3 ink = mix(vec3(0.72), vec3(0.30, 0.23, 0.10), colour);
      ink = mix(ink, vec3(0.36, 0.26, 0.09), lit);
      rgb = mix(rgb, ink, letters * sign * body);
    }

    // The window: navy glass, then a live website, then warm light.
    vec2 wu = (vUv - uWinRect.xy) / uWinRect.zw;
    vec2 cu = wu;
    if (uScreenAspect > uWinAspect) cu.x = 0.5 + (wu.x - 0.5) * uWinAspect / uScreenAspect;
    else cu.y = 0.5 + (wu.y - 0.5) * uScreenAspect / uWinAspect;
    vec3 screen = texture2D(uScreen, clamp(cu, 0.0, 1.0)).rgb;
    float glass = win * body;
    rgb = mix(rgb, screen * mix(0.62, 0.95, lit), life * glass);
    rgb += vec3(0.20, 0.12, 0.03) * lit * glass;

    // Before the lights come on, the whole facade sits a little in the dark.
    rgb *= mix(0.84, 1.0, lit);
    gl_FragColor = vec4(rgb, alpha);
  }
`

function radialTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

function glowMaterial(map: THREE.Texture) {
  return new THREE.MeshBasicMaterial({
    map,
    color: new THREE.Color('#ffb65c'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  })
}

function loadTexture(url: string) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    new THREE.TextureLoader().load(url, (texture) => resolve(texture), undefined, reject)
  })
}

/**
 * The live website shown in the window: project covers stacked like a long
 * page that scrolls by itself. A real loop video replaces it when one exists.
 */
class Screen {
  readonly canvas = document.createElement('canvas')
  readonly texture: THREE.Texture
  private images: HTMLImageElement[] = []
  private ctx: CanvasRenderingContext2D
  private video: HTMLVideoElement | null = null
  videoTexture: THREE.VideoTexture | null = null

  constructor(covers: string[], videoSrc: string | null, onVideo: () => void) {
    this.canvas.width = 512
    this.canvas.height = 1024
    this.ctx = this.canvas.getContext('2d')!
    this.ctx.fillStyle = '#172a41'
    this.ctx.fillRect(0, 0, 512, 1024)
    this.texture = new THREE.CanvasTexture(this.canvas)
    for (const src of covers) {
      const image = new Image()
      image.src = src
      this.images.push(image)
    }
    if (!videoSrc) return
    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = videoSrc
    video.addEventListener('loadeddata', () => {
      this.video = video
      this.videoTexture = new THREE.VideoTexture(video)
      onVideo()
    })
    video.addEventListener('error', () => {
      this.video = null
    })
  }

  get aspect() {
    if (this.video && this.video.videoHeight) return this.video.videoWidth / this.video.videoHeight
    return this.canvas.width / this.canvas.height
  }

  play() {
    void this.video?.play().catch(() => undefined)
  }

  pause() {
    this.video?.pause()
  }

  draw(time: number) {
    if (this.video) return
    const ready = this.images.filter((image) => image.complete && image.naturalWidth)
    if (!ready.length) return
    const { ctx } = this
    const w = this.canvas.width
    const heights = ready.map((image) => (image.naturalHeight / image.naturalWidth) * w)
    const total = heights.reduce((sum, h) => sum + h, 0)
    let y = -((time * 38) % total)
    ctx.fillStyle = '#0f1b2b'
    ctx.fillRect(0, 0, w, this.canvas.height)
    for (let pass = 0; pass < 2 && y < this.canvas.height; pass++) {
      for (let i = 0; i < ready.length && y < this.canvas.height; i++) {
        if (y + heights[i] > 0) ctx.drawImage(ready[i], 0, y, w, heights[i])
        y += heights[i]
      }
    }
    this.texture.needsUpdate = true
  }

  dispose() {
    this.texture.dispose()
    this.videoTexture?.dispose()
    this.video?.pause()
    this.video?.removeAttribute('src')
  }
}

export type ShopLayout = {
  /** Centre x of the shop, centred pixels. */
  x: number
  ground: number
  height: number
  width: number
  door: { x: number; y: number }
}

export async function createShop(
  engine: ParticleEngine,
  {
    base = '/street/hero',
    meta,
    covers,
    videoSrc = null,
    signText = 'MAST STUDIO',
    fontFamily,
    backdrop = '/street/backdrop/backdrop-2.webp',
  }: {
    base?: string
    meta: ShopMeta
    covers: string[]
    /** A loop of the MAST site for the window; without it the window scrolls the project covers. */
    videoSrc?: string | null
    signText?: string
    fontFamily: string
    backdrop?: string
  },
) {
  const [tex, sign, win, back] = await Promise.all([
    loadTexture(`${base}/facade.webp`),
    loadTexture(`${base}/mask-sign.png`),
    loadTexture(`${base}/mask-window.png`),
    loadTexture(backdrop).catch(() => null),
  ])
  // The backdrop is drawn by a basic material, which expects sRGB colour.
  if (back) back.colorSpace = THREE.SRGBColorSpace
  for (const t of [tex, sign, win]) {
    t.anisotropy = engine.gl.capabilities.getMaxAnisotropy()
    t.generateMipmaps = true
    t.minFilter = THREE.LinearMipmapLinearFilter
  }

  const signRect = meta.sign[0] ?? { x: 0, y: 0, w: meta.width, h: meta.height * 0.15 }
  const winRect = meta.windows[0] ?? { x: 0, y: 0, w: 1, h: 1 }
  const uvRect = (r: Rect) => new THREE.Vector4(r.x / meta.width, 1 - (r.y + r.h) / meta.height, r.w / meta.width, r.h / meta.height)

  // Lettering for the sign, set one letter at a time.
  const letters = document.createElement('canvas')
  letters.width = 1024
  letters.height = Math.round((1024 * signRect.h) / signRect.w)
  const letterCtx = letters.getContext('2d')!
  const letterTexture = new THREE.CanvasTexture(letters)
  let lettersShown = -1
  const setLetters = (count: number) => {
    if (count === lettersShown) return
    lettersShown = count
    const { width, height } = letters
    letterCtx.clearRect(0, 0, width, height)
    let size = height * 0.42
    letterCtx.font = `400 ${size}px ${fontFamily}`
    const spacing = size * 0.08
    const measure = () => [...signText].reduce((sum, ch) => sum + letterCtx.measureText(ch).width + spacing, -spacing)
    if (measure() > width * 0.8) {
      size *= (width * 0.8) / measure()
      letterCtx.font = `400 ${size}px ${fontFamily}`
    }
    let x = (width - measure()) / 2
    letterCtx.fillStyle = '#fff'
    letterCtx.textBaseline = 'middle'
    ;[...signText].forEach((ch, i) => {
      if (i < count) letterCtx.fillText(ch, x, height * 0.54)
      x += letterCtx.measureText(ch).width + spacing
    })
    letterTexture.needsUpdate = true
  }
  setLetters(0)

  const screen = new Screen(covers, videoSrc, () => {
    material.uniforms.uScreen.value = screen.videoTexture
    material.uniforms.uScreenAspect.value = screen.aspect
  })

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTex: { value: tex },
      uSign: { value: sign },
      uWin: { value: win },
      uLetters: { value: letterTexture },
      uScreen: { value: screen.texture },
      uBuild: { value: 0 },
      uDraw: { value: 0 },
      uSignRect: { value: uvRect(signRect) },
      uWinRect: { value: uvRect(winRect) },
      uWinAspect: { value: winRect.w / winRect.h },
      uScreenAspect: { value: screen.aspect },
      uNight: { value: NIGHT },
    },
  })

  const group = new THREE.Group()
  group.renderOrder = -10
  const shop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  shop.renderOrder = -5

  const glowMap = radialTexture()
  const signGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(glowMap))
  const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(glowMap))
  const spill = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(glowMap))
  for (const glow of [signGlow, windowGlow, spill]) glow.renderOrder = -4

  let backdropMesh: THREE.Mesh | null = null
  if (back) {
    backdropMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: back, transparent: true, opacity: 0, depthTest: false, depthWrite: false }),
    )
    backdropMesh.renderOrder = -8
  }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#a3823a'), transparent: true, opacity: 0, depthTest: false, depthWrite: false }),
  )
  ground.renderOrder = -6

  if (backdropMesh) group.add(backdropMesh)
  group.add(ground, shop, spill, windowGlow, signGlow)
  engine.add(group)

  let layout: ShopLayout = { x: 0, ground: 0, height: 1, width: 1, door: { x: 0, y: 0 } }
  let viewport = { width: 1, height: 1 }

  /** Size and place everything for a viewport; returns where the shop and its door are. */
  const resize = (width: number, height: number, small: boolean) => {
    viewport = { width, height }
    const shopHeight = height * (small ? 0.3 : 0.6)
    const shopWidth = (shopHeight * meta.width) / meta.height
    const groundY = -height / 2 + height * (small ? 0.3 : 0.19)
    const x = small ? 0 : width * 0.17
    layout = {
      x,
      ground: groundY,
      height: shopHeight,
      width: shopWidth,
      door: { x: x - shopWidth / 2 + DOOR_UV.x * shopWidth, y: groundY + DOOR_UV.y * shopHeight },
    }
    shop.scale.set(shopWidth, shopHeight, 1)
    shop.position.set(x, groundY + shopHeight / 2, 0)

    const s = (r: Rect) => ({
      x: x - shopWidth / 2 + ((r.x + r.w / 2) / meta.width) * shopWidth,
      y: groundY + shopHeight - ((r.y + r.h / 2) / meta.height) * shopHeight,
      w: (r.w / meta.width) * shopWidth,
      h: (r.h / meta.height) * shopHeight,
    })
    const sr = s(signRect)
    signGlow.scale.set(sr.w * 1.7, sr.h * 3.2, 1)
    signGlow.position.set(sr.x, sr.y, 0)
    const wr = s(winRect)
    windowGlow.scale.set(wr.w * 2.2, wr.h * 1.4, 1)
    windowGlow.position.set(wr.x, wr.y, 0)
    spill.scale.set(shopWidth * 2.1, shopHeight * 0.32, 1)
    spill.position.set(x, groundY - shopHeight * 0.06, 0)
    ground.scale.set(width * 1.2, 1.5, 1)
    ground.position.set(0, groundY, 0)

    if (backdropMesh) {
      const map = (backdropMesh.material as THREE.MeshBasicMaterial).map!
      const image = map.image as { width: number; height: number }
      // Wide enough that its edges never show, even with parallax.
      let bh = height * (small ? 0.5 : 0.78)
      let bw = (bh * image.width) / image.height
      if (bw < width * 1.25) {
        bw = width * 1.25
        bh = (bw * image.height) / image.width
      }
      backdropMesh.scale.set(bw, bh, 1)
      backdropMesh.position.set(x * 0.4, groundY + bh / 2 - bh * 0.02, 0)
    }
    return layout
  }

  /** Per frame: the build value (0..5), the outline draw-in (0..1) and the scene tilt. */
  const update = (build: number, draw: number, time: number, animateScreen: boolean) => {
    const u = material.uniforms
    u.uBuild.value = build
    u.uDraw.value = Math.max(draw, Math.min(1, build))
    const voice = Math.min(1, Math.max(0, (build - 1.8) / 0.9))
    setLetters(Math.round(voice * [...signText].length))
    const lit = smooth(4.4, 5, build)
    ;(signGlow.material as THREE.MeshBasicMaterial).opacity = 0.42 * lit
    ;(windowGlow.material as THREE.MeshBasicMaterial).opacity = 0.32 * lit
    ;(spill.material as THREE.MeshBasicMaterial).opacity = 0.38 * lit
    ;(ground.material as THREE.MeshBasicMaterial).opacity = 0.5 * Math.min(1, draw * 2)
    if (backdropMesh) (backdropMesh.material as THREE.MeshBasicMaterial).opacity = 0.06 + 0.3 * smooth(0.8, 2.6, build) + 0.12 * lit

    if (build > 3.4 && animateScreen) {
      screen.play()
      screen.draw(time)
    } else if (build <= 3.4) {
      screen.pause()
    }

    // Parallax: nearer layers follow the pointer tilt further.
    const t = engine.tilt
    const k = viewport.width * 0.04
    group.position.set(t.x * k * 0.6, -t.y * k * 0.4, 0)
    if (backdropMesh) backdropMesh.position.x = layout.x * 0.4 - t.x * k * 0.9
  }

  const dispose = () => {
    engine.remove(group)
    screen.dispose()
    for (const t of [tex, sign, win, back, letterTexture, glowMap]) t?.dispose()
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        ;(object.material as THREE.Material).dispose()
      }
    })
  }

  return { resize, update, dispose }
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
