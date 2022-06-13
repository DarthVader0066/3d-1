//Variables

var object = null;
var object2 = null;
let a=0;
var selectedObjects = [];
const loader = new THREE.GLTFLoader()
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xe1e1e1);

//Lights


const light = [];
light[0]  = new THREE.DirectionalLight(0xffffff, 2)
light[1] = new THREE.DirectionalLight(0xffffff, 2)
light[0].position.set(-4,4,-4)
light[1].position.set(4,4,4)
scene.add(light[0])
scene.add(light[1])

//Model

const canvas1 = document.querySelector('.webgl')
function first(){
loader.load('Bridge.gltf', function(gltf){
    const root = gltf.scene;
    root.scale.set(0.1,0.1,0.1);
    scene.add(root);
})
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
camera.position.set(1,0.8,1.4)
camera.lookAt(new THREE.Vector3(0,0,0));
scene.add(camera)


const raycaster = new THREE.Raycaster();


//Rendering

const renderer = new THREE.WebGL1Renderer({
    antialiasing : true,
    canvas : canvas1
})

//Grid

const helper = new THREE.GridHelper( 10, 100 );
				helper.position.y = 0;
				helper.material.opacity = 0.25;
				helper.material.transparent = false;
				scene.add(helper);

//Resizing

window.addEventListener("resize", function()
{
    var width = this.window.innerWidth;
    var height = this.window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
})

const controls =  new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);

document.body.appendChild (renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio*2)
renderer.shadowMap.enabled = true
renderer.outputEncoding

let composer = new THREE.EffectComposer( renderer );
let renderPass = new THREE.RenderPass( scene, camera );
let outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );

composer.addPass( renderPass );
composer.addPass( outlinePass );

outlinePass.edgeStrength = 5;
outlinePass.edgeGlow = 0;
outlinePass.visibleEdgeColor.set(0xffffff);
outlinePass.hiddenEdgeColor.set(0xffffff);

//Raycaster

document.addEventListener("mousemove",onMousetop);
function onMousetop(event) {
    event.preventDefault();
    const mouse2D = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse2D, camera);

    const intersects2 = raycaster.intersectObjects(scene.children[4].children);
    if ( intersects2.length>0 )
    {
        const selectedObject = intersects2[ 0 ].object;
        selectedObjects[0] = selectedObject;
        outlinePass.selectedObjects = selectedObjects;
    }
    else
    {
        // console.log("no data")
    }
}



composer.setSize(window.innerWidth, window.innerHeight);

var value=[];
var data = null

async function dataMesh()
{
    document.addEventListener('click', event=>
    {
        const mouse2D = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
            );
        raycaster.setFromCamera(mouse2D, camera);

        const intersects = raycaster.intersectObjects(scene.children[4].children);
        
        if (intersects.length > 0) 
        {

            if(event.ctrlKey)
            {
                object = scene.getObjectByName('DEFAULT');
                object2 = scene.getObjectByName(intersects[0].object.name);
                object2.material = object.material;
                data = intersects[0].object.name;
                
                for(let i=0; i<value.length;i++)
                {
                    if(value[i]==data)
                    {
                        value.splice(i,1)
                    }
                }
                // console.log("pop")
                // console.log(value)
            }
            else
            {
                object = scene.getObjectByName('GREEN');
                object2 = scene.getObjectByName(intersects[0].object.name);
                object2.material = object.material;
                data = intersects[0].object.name;
                
                value.push(data)

                // console.log(value)
                // console.log("push")
            }
            
        }

        // console.log(value)
    })
}

async function resetMeshColor(){

    for( let j=0; j<value.length;j++)
    {
        object = scene.getObjectByName('DEFAULT');
        object2 = scene.getObjectByName(value[j]);
        object2.material = object.material;
    }
    

}

async function addMeshes(){
    await dataMesh();
}

async function getData(){
    proces = value
    await resetMeshColor()
    value = []
    return proces
}

async function clearAll(){
    await resetMeshColor()
    value = []
}
//Animate

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    composer.render();
}

first()
animate()