import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * The MAST compass as a soft, polished brass object: the logo SVG extruded
 * with a deep bevel, lit by a procedural studio environment, floating and
 * turning toward the cursor. No model files, just the mark we already have.
 */
export class CompassGL {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  private group = new THREE.Group()
  private mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial> | null = null
  private env: THREE.Texture
  private rotation = { x: 0, y: 0 }

  constructor(canvas: HTMLCanvasElement, dpr: number, antialias = true) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(dpr)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    this.renderer.setClearColor(0x000000, 0)
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.scene.environment = this.env
    const key = new THREE.DirectionalLight(0xfff1d6, 2.2)
    key.position.set(-3, 4, 5)
    const rim = new THREE.DirectionalLight(0x9fb4ff, 1.2)
    rim.position.set(4, -2, -3)
    this.scene.add(key, rim, this.group)
    this.camera.position.set(0, 0, 7.5)
  }

  async load(url: string) {
    const text = await fetch(url).then((response) => response.text())
    const data = new SVGLoader().parse(text)
    const geometries: THREE.BufferGeometry[] = []
    for (const path of data.paths) {
      for (const shape of SVGLoader.createShapes(path)) {
        geometries.push(
          new THREE.ExtrudeGeometry(shape, {
            depth: 34,
            bevelEnabled: true,
            bevelThickness: 22,
            bevelSize: 7,
            bevelSegments: 10,
            curveSegments: 18,
          }),
        )
      }
    }
    const merged = mergeGeometries(geometries)
    geometries.forEach((geometry) => geometry.dispose())
    if (!merged) return
    merged.computeBoundingBox()
    const box = merged.boundingBox!
    const size = new THREE.Vector3()
    box.getSize(size)
    const centre = new THREE.Vector3()
    box.getCenter(centre)
    merged.translate(-centre.x, -centre.y, -centre.z)
    const scale = 3.4 / Math.max(size.x, size.y)
    merged.scale(scale, -scale, scale)
    merged.computeVertexNormals()
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xd2ad5e,
      metalness: 1,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.15,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(merged, material)
    this.group.add(this.mesh)
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / Math.max(1, height)
    this.camera.updateProjectionMatrix()
  }

  /** pointer in -1..1, scroll 0..1, night 0..1 (slightly warmer, dimmer env at night). */
  render(time: number, pointer: [number, number], scroll: number, night: number) {
    const targetY = pointer[0] * 0.5 + Math.sin(time * 0.35) * 0.25 + scroll * 1.6
    const targetX = -pointer[1] * 0.35 + Math.sin(time * 0.5) * 0.08
    this.rotation.y += (targetY - this.rotation.y) * 0.05
    this.rotation.x += (targetX - this.rotation.x) * 0.05
    this.group.rotation.set(this.rotation.x, this.rotation.y, Math.sin(time * 0.27) * 0.06 - scroll * 0.4)
    this.group.position.y = Math.sin(time * 0.8) * 0.08 + scroll * 1.2
    this.renderer.toneMappingExposure = 1.05 - night * 0.2
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.mesh?.geometry.dispose()
    this.mesh?.material.dispose()
    this.env.dispose()
    this.renderer.dispose()
  }
}
