import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import {DualQuaternion} from './DualQuaternion.js';

import CMap2 from './CMapJS/CMap/CMap2.js';
import catmullClark from './CMapJS/Modeling/Subdivision/Surface/CatmullClark.js';
import { cutAllEdges, quadrangulateAllFaces, quadrangulateFace } from './CMapJS/Utils/Subdivision.js';
import { loadCMap2 } from './CMapJS/IO/SurfaceFormats/CMap2IO.js';
import { cube_off, icosahedron_off } from './off_files.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 1000.0);
camera.position.set(0, 0.5, 1.5);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 1.5);
pointLight0.position.set(10,8,5);
scene.add(pointLight0);

const orbit_controls = new OrbitControls(camera, renderer.domElement)


window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


const red = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true});
const green = new THREE.MeshLambertMaterial({color: 0x00ff00, wireframe: true});
const blue = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: true});
const yellow = new THREE.MeshLambertMaterial({color: 0xffff00, wireframe: true});
const cyan = new THREE.MeshLambertMaterial({color: 0x00FFFF, wireframe: true});
const magenta = new THREE.MeshLambertMaterial({color: 0xFF00FF, wireframe: true});
const white = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false});
const black = new THREE.MeshLambertMaterial({color: 0x000000, wireframe: false});
const grey = new THREE.MeshLambertMaterial({color: 0x777777, wireframe: false});



const world0 = new THREE.Vector3(0, 0, 0);
const worldX = new THREE.Vector3(1, 0, 0);
const worldY = new THREE.Vector3(0, 1, 0);
const worldZ = new THREE.Vector3(0, 0, 1);

// const geometryOrigin = new THREE.SphereGeometry(0.01, 32, 32);
const geometryOrigin = new THREE.SphereGeometry(0.01, 32, 32);
const origin = new THREE.Mesh(geometryOrigin, white)
scene.add(origin)



const t0 = new THREE.Quaternion(0.25, 0.25, -0.25, 0)
const t1 = new THREE.Quaternion(0.25, -0.25, -0.25, 0)
const t2 = new THREE.Quaternion(-0.25, -0.25, -0.25, 0)
const t3 = new THREE.Quaternion(-0.25, 0.25, -0.25, 0)
const t4 = new THREE.Quaternion(0.25, 0.25, 0.25, 0)
const t5 = new THREE.Quaternion(-0.25, 0.25, 0.25, 0)
const t6 = new THREE.Quaternion(-0.25, -0.25, 0.25, 0)
const t7 = new THREE.Quaternion(0.25, -0.25, 0.25, 0)

// const r0 = new THREE.Quaternion().setFromAxisAngle(worldX, Math.PI / 4)
const r0 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t0.x, t0.y, t0.z).normalize());
const r1 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t1.x, t1.y, t1.z).normalize());
const r2 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t2.x, t2.y, t2.z).normalize());
const r3 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t3.x, t3.y, t3.z).normalize());
const r4 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t4.x, t4.y, t4.z).normalize());
const r5 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t5.x, t5.y, t5.z).normalize());
const r6 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t6.x, t6.y, t6.z).normalize());
const r7 = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(t7.x, t7.y, t7.z).normalize());




function randomize(quat) {
	const u1 = Math.random();
	const sqrt1u1 = Math.sqrt( 1 - u1 );
	const sqrtu1 = Math.sqrt( u1 );

	const u2 =  1*Math.PI * Math.random();

	const u3 =  1*Math.PI * Math.random();

	return quat.set(
		sqrt1u1 * Math.cos( u2 ),
		sqrtu1 * Math.sin( u3 ),
		sqrtu1 * Math.cos( u3 ),
		sqrt1u1 * Math.sin( u2 ),
	);
	
}



const dq0 = new DualQuaternion(r0, t0.clone().multiply(r0).multiplyScalar(0.5));
const dq1 = new DualQuaternion(r1, t1.clone().multiply(r1).multiplyScalar(0.5));
const dq2 = new DualQuaternion(r2, t2.clone().multiply(r2).multiplyScalar(0.5));
const dq3 = new DualQuaternion(r3, t3.clone().multiply(r3).multiplyScalar(0.5));
const dq4 = new DualQuaternion(r4, t4.clone().multiply(r4).multiplyScalar(0.5));
const dq5 = new DualQuaternion(r5, t5.clone().multiply(r5).multiplyScalar(0.5));
const dq6 = new DualQuaternion(r6, t6.clone().multiply(r6).multiplyScalar(0.5));
const dq7 = new DualQuaternion(r7, t7.clone().multiply(r7).multiplyScalar(0.5));

const T = []
const R = []
const W = []

const DQ = []

for(let i = 0; i < 4; ++i) {
	for(let j = 0; j < 4; ++j) {
		const id = 4*i+j;
		T[id] = new THREE.Quaternion(i*0.25 - 0.375, 0.*Math.random(), j*0.25 - 0.375, 0);
		R[id] = new THREE.Quaternion();
		W[id] = 1;
		// if(!(i == 0 || i == 3 || j == 0 || j == 3))
		// 	R[id] = randomize(R[id])
		DQ[id] = new DualQuaternion(R[id], T[id].clone().multiply(R[id]).multiplyScalar(0.5));
	}	
}



const samples = [];
const nbSamples = 250;



function polyInter() {

	const U = [0, 0.33, 0.66, 1];
	const V = [0, 0.33, 0.66, 1];

	const step = 1 / (nbSamples - 1);
	const curves = [];
	
	for(let line = 0; line < 4; ++line) {
		curves[line] = [];
		let id = 4*line;
		const dqs = [DQ[id].clone(), DQ[id+1].clone(), DQ[id+2].clone(), DQ[id+3].clone()];

		for(let r = 0; r < nbSamples; ++r) {
			const t = r*step;
			const dqs2 = dqs.map(dq => dq.clone())
			for(let i = 0; i < dqs.length - 1; ++i) {
				for(let j = 0; j < dqs.length - i - 1; ++j) {
					let t0 = j;
					let t1 = i + j + 1;

					// console.log(t0, t1)

					let c0 = (U[t1]-t) / (U[t1]-U[t0]);
					let c1 = (t-U[t0]) / (U[t1]-U[t0]);

					dqs2[j].multiplyScalar(c0);
					dqs2[j].addScaledDualQuaternion(dqs2[j+1], c1);
				}
			}
			curves[line].push(dqs2[0])
		}
	}

	for(let s = 0; s < nbSamples; ++s) {
		const dqs = [curves[0][s].clone(), curves[1][s].clone(), curves[2][s].clone(), curves[3][s].clone()];
		let p0 = curves[0][s].clone();
		let p1 = curves[1][s].clone();
		let p2 = curves[2][s].clone();
		let p3 = curves[3][s].clone();
		let p0_ = new DualQuaternion();
		let p1_ = new DualQuaternion();
		let p2_ = new DualQuaternion();
		for(let r = 0; r < nbSamples; ++r) {
			const t = r*step;
			const dqs2 = dqs.map(dq => dq.clone())
			for(let i = 0; i < dqs.length - 1; ++i) {
				for(let j = 0; j < dqs.length - i - 1; ++j) {
					let t0 = j;
					let t1 = i + j + 1;

					let c0 = (U[t1]-t) / (U[t1]-U[t0]);
					let c1 = (t-U[t0]) / (U[t1]-U[t0]);

					dqs2[j].multiplyScalar(c0);
					dqs2[j].addScaledDualQuaternion(dqs2[j+1], c1);
				}
			}
			samples[s * nbSamples + r] = dqs2[0].clone()
		}

	}
}

polyInter()






const geometryControlCone = new THREE.ConeGeometry(0.005, 0.025, 16, 1);
geometryControlCone.translate(0, 0.0125, 0);
const conesDQ = new THREE.InstancedMesh(geometryControlCone, red, 16);
scene.add(conesDQ)

function setCones() {
	const scale = new THREE.Vector3(1, 1, 1);
	const matrix = new THREE.Matrix4
	for(let i = 0; i < 16; ++i) {
		matrix.compose(DQ[i].getTranslation(), DQ[i].getRotation(), scale);
		// let dir = new THREE.Vector3(0, 1, 0).applyQuaternion(DQ[i].getRotation());
		conesDQ.setMatrixAt(i, matrix);
		// conesDQ.setColorAt(i, new THREE.Color(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z)))
	}
	conesDQ.instanceMatrix.needsUpdate = true
	// conesDQ.instanceColor.needsUpdate = true
}
setCones();

const geometrySample = new THREE.BoxGeometry(0.012, 0.00003125, 0.012, 16, 1);
// const geometrySample = new THREE.ConeGeometry(0.005, 0.025, 16, 1);

const samplesDQ = new THREE.InstancedMesh(geometrySample, grey, nbSamples*nbSamples);
scene.add(samplesDQ)

function setSamples() {
	const scale = new THREE.Vector3(0.5, 0.5, 0.5);
	const matrix = new THREE.Matrix4
	for(let s = 0; s < samples.length; ++s) {
		matrix.compose(samples[s].getTranslation(), samples[s].getRotation(), scale);
		samplesDQ.setMatrixAt(s, matrix);
		let dir = new THREE.Vector3(0, 1, 0).applyQuaternion(samples[s].getRotation());
		samplesDQ.setColorAt(s, new THREE.Color(Math.abs(dir.x), Math.abs(dir.y), Math.abs(dir.z)))
	}
	samplesDQ.instanceMatrix.needsUpdate = true
	samplesDQ.instanceColor.needsUpdate = true
}
setSamples()


window.randRotate = function(i)  {
	R[i] = randomize(R[i]);
	DQ[i] = new DualQuaternion(R[i], T[i].clone().multiply(R[i]).multiplyScalar(0.5));

	polyInter()
	setCones();
	setSamples();
}

window.randTrans = function(i) {
	T[i].y = Math.random()-0.5;
	// R[i] = randomize(R[i]);
	DQ[i] = new DualQuaternion(R[i], T[i].clone().multiply(R[i]).multiplyScalar(0.5));

	polyInter()
	setCones();
	setSamples();
}

window.setWeight = function(i, w) {
	W[i] = w;
	polyInter()
	setCones();
	setSamples();
}

const grid = new THREE.GridHelper(1, 10)
scene.add(grid)

let frameCount = 0;
function update (t)
{
}

function render()
{
	renderer.render(scene, camera);
}

function mainloop(t)
{
    update(t);
    render();
	requestAnimationFrame(mainloop);
}

mainloop(0);