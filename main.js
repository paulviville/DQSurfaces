import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import {DualQuaternion} from './DualQuaternion.js';

import CMap2 from './CMapJS/CMap/CMap2.js';
import catmullClark from './CMapJS/Modeling/Subdivision/Surface/CatmullClark.js';
import {catmullClark_inter} from './CMapJS/Modeling/Subdivision/Surface/CatmullClark.js';
import Butterfly from './CMapJS/Modeling/Subdivision/Surface/Butterfly.js';
import { cutAllEdges, quadrangulateAllFaces, quadrangulateFace } from './CMapJS/Utils/Subdivision.js';
import { loadCMap2 } from './CMapJS/IO/SurfaceFormats/CMap2IO.js';
import { cube_off, icosahedron_off, octahedron_off, dodecahedron_off, grid2x2_off } from './off_files.js';
import butterfly from './CMapJS/Modeling/Subdivision/Surface/Butterfly.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 1000.0);
// camera.position.set(0.35, 0.5, 1.1);
// camera.position.set(0.52, 0.37, 1.1);
camera.position.set(0.15, 0.27, 1.22);
camera.position.set(0.11, 0.57, 1.22);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 1);
pointLight0.position.set(0,4,2.5);
scene.add(pointLight0);

const orbit_controls = new OrbitControls(camera, renderer.domElement)


window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


window.camPos = function() {
	console.log(camera.position)
}

const red = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
const red2 = new THREE.MeshLambertMaterial({color: 0x900000, wireframe: false});
const green = new THREE.MeshLambertMaterial({color: 0x00ff00, wireframe: true});
const blue = new THREE.MeshLambertMaterial({color: 0x4444AA, wireframe: false});
const yellow = new THREE.MeshLambertMaterial({color: 0xffff00, wireframe: true});
const cyan = new THREE.MeshLambertMaterial({color: 0x00FFFF, wireframe: true});
const magenta = new THREE.MeshLambertMaterial({color: 0xFF00FF, wireframe: true});
const white = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
const black = new THREE.MeshLambertMaterial({color: 0x000000, wireframe: false});



const world0 = new THREE.Vector3(0, 0, 0);
const worldX = new THREE.Vector3(1, 0, 0);
const worldY = new THREE.Vector3(0, 1, 0);
const worldZ = new THREE.Vector3(0, 0, 1);

// const geometryOrigin = new THREE.SphereGeometry(0.01, 32, 32);
const geometryOrigin = new THREE.SphereGeometry(0.4, 32, 32);
const origin = new THREE.Mesh(geometryOrigin, white)
// scene.add(origin)


const map = loadCMap2("off", icosahedron_off);
const pos = map.getAttribute(map.vertex, "position");

let d;

const mapDQ = loadCMap2("off", icosahedron_off);
mapDQ.setEmbeddings(mapDQ.edge);
mapDQ.setEmbeddings(mapDQ.face);
const DQpos = mapDQ.getAttribute(mapDQ.vertex, "position");
const DQs = mapDQ.addAttribute(mapDQ.vertex, "dq");


mapDQ.foreach(mapDQ.vertex, vd => {
	const vid = mapDQ.cell(mapDQ.vertex, vd);
	// DQpos[vid].multiplyScalar(0.5);
	const t = DQpos[vid].clone()
	// pos[vid].multiplyScalar(0.5);
	const trans = new THREE.Quaternion(t.x, t.y, t.z);
	const unitT = trans.clone().normalize();
	// const rot = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(trans.x, trans.y, trans.z).normalize());
	let rot = new THREE.Quaternion()

	// // if(vid == 0) {
	// if(vid == 0 || vid == 1 || vid == 5) {

	// 	rot = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(trans.x, trans.y, trans.z).normalize());
	// 	if(vid == 0) 
	// 		rot = new THREE.Quaternion().setFromAxisAngle(worldY, 2.2*Math.PI / 2)
	// 	if(vid == 5) 
	// 		rot.multiply(new THREE.Quaternion().setFromAxisAngle(worldZ, 5*Math.PI / 2))
	// 	if(vid == 1) 
	// 		rot.multiply(new THREE.Quaternion().setFromAxisAngle(worldY, 6.5*Math.PI / 2))
	// 	DQs[vid] = new DualQuaternion(rot, trans.clone().multiply(rot).multiplyScalar(0.5));

	// }
	// else
		DQs[vid] = new DualQuaternion(rot, trans.clone().multiplyScalar(0.5));


});








const geometrySampleCone = new THREE.ConeGeometry(0.005, 0.025, 16, 1);
geometrySampleCone.translate(0, 0.0125, 0);

function verticesDQ() {
	const vertex = mapDQ.vertex;
	const scale = new THREE.Vector3(1.5, 1.5, 1.5);
	const conesVertices = new THREE.InstancedMesh(geometrySampleCone, red, mapDQ.nbCells(vertex));
	scene.add(conesVertices);

	let vid, dq;
	const matrix = new THREE.Matrix4
	mapDQ.foreach(vertex, vd => {
		vid = mapDQ.cell(vertex, vd);
		dq = DQs[vid].clone();
		if(vid == 0 || vid == 1 || vid == 5)
			matrix.compose(dq.getTranslation(), dq.getRotation(), scale);
		else
			matrix.compose(dq.getTranslation(), dq.getRotation(), new THREE.Vector3(0, 0, 0));
			// matrix.compose(dq.getTranslation(), dq.getRotation(), scale);

		conesVertices.setMatrixAt(vid, matrix);
	});
}


function edgesDQ() {
	const vertex = mapDQ.vertex;
	const edge = mapDQ.edge;

	const nbEdges = mapDQ.nbCells(edge);

	const nbDivs = 10;
	const scale = new THREE.Vector3(0.5, 0.5, 0.5);
	const conesEdges = new THREE.InstancedMesh(geometrySampleCone, red2, (nbDivs+1) * nbEdges);
	scene.add(conesEdges);

	let eid, dq0, dq1;
	const matrix = new THREE.Matrix4
	const dq = new DualQuaternion;
	mapDQ.foreach(edge, ed => {
		eid = mapDQ.cell(edge, ed);
		dq0 = DQs[mapDQ.cell(vertex, ed)].clone();
		dq1 = DQs[mapDQ.cell(vertex, mapDQ.phi2[ed])].clone();

		for(let i = 0; i < nbDivs + 1; ++i) {
			dq.slerpDualQuaternions(dq0, dq1, i / nbDivs)
			matrix.compose(dq.getTranslation(), dq.getRotation(), scale);
			conesEdges.setMatrixAt(eid * (nbDivs+1) + i, matrix);

		}
	});
}

function facesDQ() {
	const vertex = mapDQ.vertex;
	const face = mapDQ.face;

	const nbFaces = mapDQ.nbCells(face);
	const nbDivs = 10;
	const scale = new THREE.Vector3(0.5, 0.5, 0.5);

	const conesFaces = new THREE.InstancedMesh(geometrySampleCone, black, (nbDivs+1)*(nbDivs+1)*100 * nbFaces);
	scene.add(conesFaces);

	let fid, vid0, vid1, vid2, vid3, dq0, dq1, dq2, dq3;
	const matrix = new THREE.Matrix4;
	const dq01 = new DualQuaternion;
	const dq32 = new DualQuaternion;
	const dq = new DualQuaternion;
	mapDQ.foreach(face, fd => {
		fid = mapDQ.cell(face, fd);
		let d = fd;
		dq0 = DQs[mapDQ.cell(vertex, d)];
		d = mapDQ.phi1[d];
		dq1 = DQs[mapDQ.cell(vertex, d)];
		d = mapDQ.phi1[d];
		dq2 = DQs[mapDQ.cell(vertex, d)];
		d = mapDQ.phi1[d];
		dq3 = DQs[mapDQ.cell(vertex, d)];

		for(let i = 0; i < nbDivs + 1; ++i) {
			dq01.lerpDualQuaternions(dq0, dq1, i / nbDivs).normalize();
			dq32.lerpDualQuaternions(dq3, dq2, i / nbDivs).normalize();
			for(let j = 0; j < nbDivs + 1; ++j) {
				dq.lerpDualQuaternions(dq01, dq32, j / nbDivs).normalize();

				matrix.compose(dq.getTranslation(), dq.getRotation(), scale);
				conesFaces.setMatrixAt(fid *(nbDivs+1)*(nbDivs+1) + ((nbDivs+1) * i + j), matrix);
			}	
		}
	});
}


function butterflyDQ() {
	const vertex = mapDQ.vertex;
	const edge = mapDQ.edge;
	const face = mapDQ.face;


	const faceCache = mapDQ.cache(face);
	const edgeMidCache = [];

	cutAllEdges(mapDQ, vd => {
		edgeMidCache.push(vd);
		DQs[mapDQ.cell(vertex, vd)] = new DualQuaternion(
			new THREE.Quaternion(0, 0, 0, 0),
			new THREE.Quaternion(0, 0, 0, 0)
		);
	})

	let d;
	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(vertex, vd);
		d = mapDQ.phi2[vd];
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], 0.5);
		d = mapDQ.phi([1, 1], d);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], 0.5);
		d = mapDQ.phi([1, 1], d);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], 0.125);
		d = mapDQ.phi([1, 1, 2], vd);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], 0.125);
		d = mapDQ.phi([-1, -1], d);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], -0.0625);
		d = mapDQ.phi([2, -1, 2, -1, -1], vd);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], -0.0625);
		d = mapDQ.phi([2, 1, 1, 2, 1, 1, 1], vd);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], -0.0625);
		d = mapDQ.phi([1, 1, 1, 2, 1, 1, 1], vd);
		DQs[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, d)], -0.0625);

	}, {cache: edgeMidCache});

	let d0, d1;
	mapDQ.foreach(face, fd => {
		d0 = mapDQ.phi1[fd];
		d1 = mapDQ.phi([1, 1], d0);
		mapDQ.cutFace(d0, d1);

		d0 = d1;
		d1 = mapDQ.phi([1, 1], d0);
		mapDQ.cutFace(d0, d1);
		
		d0 = d1;
		d1 = mapDQ.phi([1, 1], d0);
		mapDQ.cutFace(d0, d1);
	}, {cache: faceCache});

	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(mapDQ.vertex, vd);
		const dq = DQs[vid];
		const pos = dq.transform(new THREE.Vector3());

		DQpos[vid] = pos;
	});
}






verticesDQ()
// edgesDQ()
// facesDQ();


butterfly(map)
butterfly(map)
butterfly(map) 
butterflyDQ()



const mapRenderer = new Renderer(map);
// mapRenderer.vertices.create()
// mapRenderer.vertices.addTo(scene)
// mapRenderer.edges.create({color: 0x2020A0, size: 0.1})
// mapRenderer.edges.addTo(scene)
mapRenderer.faces.create({color: new THREE.Color(0xff5555), wireframe:false, transparent: true, opacity: 0.5})
mapRenderer.faces.addTo(scene)


const mapDQRenderer = new Renderer(mapDQ);
// mapDQRenderer.vertices.create()
// mapDQRenderer.vertices.addTo(scene)
// mapDQRenderer.edges.create()
// mapDQRenderer.edges.addTo(scene)
mapDQRenderer.faces.create({wireframe: false, color: new THREE.Color(0xbbbbff), transparent: false, opacity: 0.5, side: THREE.DoubleSide})
mapDQRenderer.faces.addTo(scene)


const keyHeld = {};
const defaultKeyDown = function(event){
	keyHeld[event.code] = true;
};

const defaultKeyUp = function(event){
	console.log(event.which, event.code, event.charCode);
	switch(event.code) {
		case "Escape": 
			break;
		case "Space":
			break;
		case "Delete":
			break;
		case "KeyA":
			break;
		case "KeyC":
			break;
		case "KeyE":
			break;
		case "KeyF":
			break
		case "KeyL":
			break;
		case "Numpad0":
			break;
		case "ArrowRight":
			break;
	};

	keyHeld[event.code] = false;

}

window.addEventListener("keydown", defaultKeyDown);
window.addEventListener("keyup", defaultKeyUp);


const grid = new THREE.GridHelper(1, 10)
// scene.add(grid)

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