import * as THREE from 'three'
import type { Face } from './book-pages'

/** Page size in world units (width : height matches the page canvases). */
export const PAGE_W = 0.78
export const PAGE_H = 1
const BLOCK = 0.03
const LEAF = 0.0016

const pageVertex = /* glsl */ `
  uniform float uTurn;
  uniform float uBend;
  uniform float uZ;
  uniform float uW;
  uniform float uH;
  uniform float uGutter;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vS;
  const float PI = 3.14159265;
  void main() {
    vUv = uv;
    float s = position.x;
    float theta = uTurn * PI;
    // The free edge trails the spine, and the top corner leads a little.
    float b = uBend * sin(uTurn * PI) * (1.0 + 0.35 * (position.y / uH));
    float a = theta - b * (s / uW);
    vec2 xz;
    if (abs(b) < 0.001) {
      xz = vec2(cos(theta), sin(theta)) * s;
    } else {
      float k = uW / b;
      xz = vec2(k * (sin(theta) - sin(a)), k * (cos(a) - cos(theta)));
    }
    // Paper rises a touch toward the gutter.
    float gutter = uGutter * 0.022 * exp(-s / 0.07) * (1.0 - sin(uTurn * PI));
    vec3 p = vec3(xz.x, position.y, xz.y + uZ + gutter);
    vNormal = normalize(normalMatrix * vec3(-sin(a), 0.0, cos(a)));
    vS = s / uW;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const lighting = /* glsl */ `
  uniform vec3 uLight;
  uniform float uPower;
  uniform float uDay;
  uniform float uTime;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 shade(vec3 albedo, vec3 N, vec3 P, float specular, float shininess, vec3 specTint) {
    vec3 Lv = uLight - P;
    float d = length(Lv);
    vec3 L = Lv / d;
    float atten = uPower / (1.0 + d * d / 0.55);
    vec3 V = normalize(cameraPosition - P);
    vec3 H = normalize(L + V);
    // Wrapped diffuse: paper scatters light softly.
    float diff = max((dot(N, L) + 0.25) / 1.25, 0.0);
    float spec = pow(max(dot(N, H), 0.0), shininess) * specular;
    vec3 warm = vec3(1.0, 0.82, 0.6);
    vec3 ambient = vec3(0.07, 0.08, 0.11);
    vec3 night = albedo * (ambient + warm * diff * atten) + specTint * spec * atten;
    vec3 day = albedo * (0.82 + 0.18 * max(dot(N, normalize(vec3(-0.3, 0.4, 1.0))), 0.0)) + specTint * spec * 0.3;
    return mix(night, day, uDay);
  }
`

const pageFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uFront;
  uniform sampler2D uBack;
  uniform sampler2D uFoil;
  uniform float uHasFoil;
  uniform float uShadow;
  uniform float uSide;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  varying float vS;
  ${lighting}
  void main() {
    bool front = gl_FrontFacing;
    vec2 uv = front ? vUv : vec2(1.0 - vUv.x, vUv.y);
    vec3 albedo = front ? texture2D(uFront, uv).rgb : texture2D(uBack, uv).rgb;
    float foil = front ? texture2D(uFoil, uv).r * uHasFoil : 0.0;
    vec3 N = normalize(front ? vNormal : -vNormal);
    float spec = mix(0.06, 1.6, foil);
    float shin = mix(18.0, 60.0, foil);
    vec3 tint = mix(vec3(1.0, 0.9, 0.75), vec3(1.0, 0.78, 0.4), foil);
    vec3 col = shade(albedo, N, vWorld, spec, shin, tint);
    // Gutter shadow and the shadow of a page passing overhead.
    float gutter = mix(0.5, 1.0, smoothstep(0.0, 0.16, vS));
    col *= gutter;
    col *= 1.0 - uShadow * (0.55 - 0.3 * vS);
    // Thin edge so stacked leaves read as paper.
    float edge = smoothstep(0.0, 0.004, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
    col *= mix(0.8, 1.0, edge);
    gl_FragColor = vec4(col, 1.0);
  }
`

const tableVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const tableFragment = /* glsl */ `
  precision highp float;
  uniform vec4 uBook;
  varying vec3 vWorld;
  varying vec2 vUv;
  ${lighting}
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    vec2 p = vWorld.xy;
    // Dark walnut: long grain along x.
    float grainLines = noise(vec2(p.x * 2.0, p.y * 38.0)) * 0.6 + noise(vec2(p.x * 9.0, p.y * 120.0)) * 0.4;
    vec3 wood = mix(vec3(0.05, 0.035, 0.028), vec3(0.11, 0.075, 0.05), grainLines);
    vec3 dayWood = mix(vec3(0.86, 0.8, 0.72), vec3(0.78, 0.7, 0.6), grainLines);
    vec3 albedo = mix(wood, dayWood, uDay);
    vec3 col = shade(albedo, vec3(0.0, 0.0, 1.0), vWorld, 0.25, 30.0, vec3(1.0, 0.85, 0.65));
    // Soft contact shadow around the book.
    vec2 q = abs(p - uBook.xy) - uBook.zw;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    col *= mix(0.35, 1.0, smoothstep(-0.02, 0.14, dist));
    // Fade into the room.
    float far = smoothstep(0.9, 2.6, length(p - uBook.xy));
    col = mix(col, mix(vec3(0.02, 0.025, 0.035), vec3(0.95, 0.93, 0.9), uDay), far);
    col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * mix(0.03, 0.012, uDay);
    gl_FragColor = vec4(col, 1.0);
  }
`

const blockFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  varying vec3 vWorld;
  varying vec2 vUv;
  ${lighting}
  void main() {
    // Page edges: fine horizontal lines on cream.
    float lines = 0.92 + 0.08 * sin(vWorld.z * 4000.0);
    vec3 col = shade(uColor * lines, vec3(0.0, -0.6, 0.8), vWorld, 0.05, 10.0, vec3(1.0));
    gl_FragColor = vec4(col, 1.0);
  }
`

type Sheet = { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>; hard: boolean }

export type BookState = {
  /** Turn of each sheet, 0 (right) to 1 (left). */
  turns: number[]
  light: [number, number]
  power: number
  day: number
  time: number
  /** 0 = whole spread in view, otherwise the camera pans (-1 left page, 1 right page). */
  pan: number
  /** 0..1 dolly toward the right page when opening a project. */
  zoom: number
}

export class BookGL {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20)
  private book = new THREE.Group()
  private sheets: Sheet[] = []
  private textures: THREE.Texture[] = []
  private shared: Record<string, THREE.IUniform> = {
    uLight: { value: new THREE.Vector3(0, 0, 0.8) },
    uPower: { value: 1 },
    uDay: { value: 0 },
    uTime: { value: 0 },
  }
  private table: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private leftBlock: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>
  private rightBlock: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>
  private boards: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>[] = []
  private aspect = 1
  private narrow = false
  private raycaster = new THREE.Raycaster()
  private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.06)
  private blank: THREE.Texture

  constructor(canvas: HTMLCanvasElement, dpr: number) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(dpr)
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace
    this.renderer.setClearColor(0x05070a, 1)

    const black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
    black.needsUpdate = true
    this.blank = black

    this.table = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.ShaderMaterial({
        vertexShader: tableVertex,
        fragmentShader: tableFragment,
        uniforms: { ...this.shared, uBook: { value: new THREE.Vector4(0, 0, PAGE_W, PAGE_H / 2) } },
      }),
    )
    this.scene.add(this.table)
    this.scene.add(this.book)

    const blockMaterial = (color: THREE.Color) =>
      new THREE.ShaderMaterial({
        vertexShader: tableVertex,
        fragmentShader: blockFragment,
        uniforms: { ...this.shared, uColor: { value: color } },
      })
    const cream = new THREE.Color(0.86, 0.82, 0.74)
    const navy = new THREE.Color(0.075, 0.13, 0.23)
    const blockGeo = (side: 1 | -1) => {
      const g = new THREE.BoxGeometry(PAGE_W - 0.01, PAGE_H - 0.012, BLOCK)
      g.translate((side * (PAGE_W - 0.01)) / 2, 0, BLOCK / 2 + 0.008)
      return g
    }
    this.rightBlock = new THREE.Mesh(blockGeo(1), blockMaterial(cream))
    this.leftBlock = new THREE.Mesh(blockGeo(-1), blockMaterial(cream))
    this.book.add(this.rightBlock, this.leftBlock)
    for (const side of [1, -1] as const) {
      const g = new THREE.BoxGeometry(PAGE_W + 0.012, PAGE_H + 0.03, 0.008)
      g.translate((side * (PAGE_W + 0.012)) / 2, 0, 0.004)
      const board = new THREE.Mesh(g, blockMaterial(navy))
      this.boards.push(board)
      this.book.add(board)
    }
  }

  private texture(source: HTMLCanvasElement) {
    const texture = new THREE.CanvasTexture(source)
    texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    this.textures.push(texture)
    return texture
  }

  /** One sheet per pair of faces: [front, back]. The first sheet is the hard cover. */
  setSheets(faces: [Face, Face][]) {
    for (const sheet of this.sheets) {
      this.book.remove(sheet.mesh)
      sheet.mesh.geometry.dispose()
      sheet.mesh.material.dispose()
    }
    this.textures.forEach((texture) => texture.dispose())
    this.textures = []
    this.sheets = faces.map(([front, back], index) => {
      const geometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 48, 6)
      geometry.translate(PAGE_W / 2, 0, 0)
      const material = new THREE.ShaderMaterial({
        vertexShader: pageVertex,
        fragmentShader: pageFragment,
        side: THREE.DoubleSide,
        uniforms: {
          ...this.shared,
          uFront: { value: this.texture(front.canvas) },
          uBack: { value: this.texture(back.canvas) },
          uFoil: { value: front.foil ? this.texture(front.foil) : this.blank },
          uHasFoil: { value: front.foil ? 1 : 0 },
          uTurn: { value: 0 },
          uBend: { value: index === 0 ? 0 : 0.9 },
          uZ: { value: 0 },
          uW: { value: PAGE_W },
          uH: { value: PAGE_H },
          uGutter: { value: index === 0 ? 0 : 1 },
          uShadow: { value: 0 },
          uSide: { value: 1 },
        },
      })
      const mesh = new THREE.Mesh(geometry, material)
      this.book.add(mesh)
      return { mesh, hard: index === 0 }
    })
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false)
    this.aspect = width / Math.max(1, height)
    this.narrow = this.aspect < 0.9
    this.camera.aspect = this.aspect
    this.camera.updateProjectionMatrix()
  }

  /** Where the cursor points on the table, in world units. */
  pick(ndcX: number, ndcY: number): [number, number] {
    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera)
    const hit = new THREE.Vector3()
    if (!this.raycaster.ray.intersectPlane(this.plane, hit)) return [0, 0]
    return [hit.x, hit.y]
  }

  render(state: BookState) {
    const n = this.sheets.length
    const open = state.turns[0] ?? 0
    // Closed, the book sits centred on its right half; open, on its spine.
    this.book.position.x = -(PAGE_W / 2) * (1 - open)

    this.sheets.forEach((sheet, index) => {
      const t = state.turns[index] ?? 0
      const u = sheet.mesh.material.uniforms
      u.uTurn.value = t
      const rightZ = BLOCK + 0.008 + (n - index) * LEAF
      const leftZ = BLOCK + 0.008 + index * LEAF
      u.uZ.value = rightZ + (leftZ - rightZ) * t + Math.sin(t * Math.PI) * 0.01
      // A leaf passing overhead shades the page it is leaving or landing on.
      u.uShadow.value = 0
      if (t <= 0.001 && index > 0) {
        const prev = state.turns[index - 1] ?? 1
        if (prev > 0 && prev < 1) u.uShadow.value = Math.sin(prev * Math.PI) * 0.8 * (1 - prev)
      }
      if (t >= 0.999) {
        const next = state.turns[index + 1] ?? 0
        if (next > 0 && next < 1) u.uShadow.value = Math.sin(next * Math.PI) * 0.8 * next
      }
    })
    this.leftBlock.scale.x = Math.max(0.001, open)
    this.boards[1].scale.x = Math.max(0.001, open)
    this.leftBlock.visible = this.boards[1].visible = open > 0.01

    // Camera: fit the open spread, or one page at a time on narrow screens.
    const fov = (this.camera.fov * Math.PI) / 180
    const spanW = this.narrow ? PAGE_W * 1.12 : PAGE_W * 2 * 1.18
    const spanH = PAGE_H * 1.32
    const fitH = Math.max(spanH, spanW / this.aspect)
    let distance = fitH / (2 * Math.tan(fov / 2))
    distance *= 1 - state.zoom * 0.55
    const tilt = 0.32
    const base = this.narrow ? state.pan * (PAGE_W / 2) : 0
    const centre = new THREE.Vector3(base + (PAGE_W / 2 - base) * state.zoom, -0.02, 0)
    this.camera.position.set(centre.x, centre.y - Math.sin(tilt) * distance, Math.cos(tilt) * distance)
    this.camera.lookAt(centre)

    const u = this.shared
    ;(u.uLight.value as THREE.Vector3).set(state.light[0], state.light[1], 0.7)
    u.uPower.value = state.power
    u.uDay.value = state.day
    u.uTime.value = state.time
    ;(this.table.material.uniforms.uBook.value as THREE.Vector4).set(
      this.book.position.x + (PAGE_W / 2) * (1 - open),
      0,
      PAGE_W * (0.5 + open * 0.5) + 0.01,
      PAGE_H / 2 + 0.015,
    )
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    for (const sheet of this.sheets) {
      sheet.mesh.geometry.dispose()
      sheet.mesh.material.dispose()
    }
    this.textures.forEach((texture) => texture.dispose())
    this.blank.dispose()
    this.table.geometry.dispose()
    this.table.material.dispose()
    for (const mesh of [this.leftBlock, this.rightBlock, ...this.boards]) {
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
    this.renderer.dispose()
  }
}
