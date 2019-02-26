const canvas = document.getElementById('model-001')
const engine = new BABYLON.Engine(canvas, true)
const scene = new BABYLON.Scene(engine)

const colorMat = new BABYLON.StandardMaterial('color', scene)
colorMat.diffuseColor = new BABYLON.Color3(1, 1, 1)

const groundMat = new BABYLON.StandardMaterial('color', scene)
groundMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8)

scene.createDefaultCameraOrLight(true, true, true)

const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3.Zero(), scene)
camera.setTarget(BABYLON.Vector3.Zero())
camera.rotation.x = Math.PI / 2
camera.attachControl(canvas, false)

const light = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 0.25, 0), scene)
light.diffuse = new BABYLON.Color3(1, 0.75, 0)

BABYLON.SceneLoader.ImportMesh(null, './assets/models/', '001.stl', scene, function (mesh) {
  window.mesh = mesh
  mesh.forEach(mesh => {
    mesh.material = colorMat
    mesh.position = new BABYLON.Vector3(0, -0.25, 0)
    mesh.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0)
    mesh.scaling = new BABYLON.Vector3(3e-3, 3e-3, 3e-3)
  })
  
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light)
  shadowGenerator.addShadowCaster(mesh[0])

  const plane = BABYLON.MeshBuilder.CreatePlane('plane', {
    height: 5,
    width: 5,
    sourcePlane: (new BABYLON.Plane(0, 1, 0, -0.3)).normalize(),
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  }, scene)
  plane.receiveShadows = true
  plane.material = groundMat

  engine.resize()
})

engine.runRenderLoop(function () {
  scene.render()
})

window.addEventListener('resize', function () {
  engine.resize()
})

function setColor (hex) {
  colorMat.diffuseColor = new BABYLON.Color3(...hex.match(/[0-9a-f]{2}/g).map(num => parseInt(num, 16) / 255))
}
