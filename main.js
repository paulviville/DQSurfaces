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

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 1);
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
const white = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: true});
const black = new THREE.MeshLambertMaterial({color: 0x000000, wireframe: false});



const world0 = new THREE.Vector3(0, 0, 0);
const worldX = new THREE.Vector3(1, 0, 0);
const worldY = new THREE.Vector3(0, 1, 0);
const worldZ = new THREE.Vector3(0, 0, 1);

// const geometryOrigin = new THREE.SphereGeometry(0.01, 32, 32);
const geometryOrigin = new THREE.SphereGeometry(0.43301, 32, 32);
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

	const u2 = 2 * Math.PI * Math.random();

	const u3 = 2 * Math.PI * Math.random();

	return quat.set(
		sqrt1u1 * Math.cos( u2 ),
		sqrtu1 * Math.sin( u3 ),
		sqrtu1 * Math.cos( u3 ),
		sqrt1u1 * Math.sin( u2 ),
	);
	
	return quadrangulateFace
}

// const r0 = randomize(new THREE.Quaternion())
// const r1 = randomize(new THREE.Quaternion())
// const r2 = randomize(new THREE.Quaternion())
// const r3 = randomize(new THREE.Quaternion())
// const r4 = randomize(new THREE.Quaternion())
// const r5 = randomize(new THREE.Quaternion())
// const r6 = randomize(new THREE.Quaternion())
// const r7 = randomize(new THREE.Quaternion())


const dq0 = new DualQuaternion(r0, t0.clone().multiply(r0).multiplyScalar(0.5));
const dq1 = new DualQuaternion(r1, t1.clone().multiply(r1).multiplyScalar(0.5));
const dq2 = new DualQuaternion(r2, t2.clone().multiply(r2).multiplyScalar(0.5));
const dq3 = new DualQuaternion(r3, t3.clone().multiply(r3).multiplyScalar(0.5));
const dq4 = new DualQuaternion(r4, t4.clone().multiply(r4).multiplyScalar(0.5));
const dq5 = new DualQuaternion(r5, t5.clone().multiply(r5).multiplyScalar(0.5));
const dq6 = new DualQuaternion(r6, t6.clone().multiply(r6).multiplyScalar(0.5));
const dq7 = new DualQuaternion(r7, t7.clone().multiply(r7).multiplyScalar(0.5));


// const dq0 = new DualQuaternion(r0, t0.clone().multiply(r0).multiplyScalar(0.5));
// const dq1 = new DualQuaternion(r0, t1.clone().multiply(r0).multiplyScalar(0.5));
// const dq2 = new DualQuaternion(r3, t2.clone().multiply(r3).multiplyScalar(0.5));
// const dq3 = new DualQuaternion(r3, t3.clone().multiply(r3).multiplyScalar(0.5));
// const dq4 = new DualQuaternion(r4, t4.clone().multiply(r4).multiplyScalar(0.5));
// const dq5 = new DualQuaternion(r5, t5.clone().multiply(r5).multiplyScalar(0.5));
// const dq6 = new DualQuaternion(r5, t6.clone().multiply(r5).multiplyScalar(0.5));
// const dq7 = new DualQuaternion(r4, t7.clone().multiply(r4).multiplyScalar(0.5));


// const map = new CMap2();
// let d = map.addPrism(4);
// map.setEmbeddings(map.vertex);
// const pos = map.addAttribute(map.vertex, "position");

// let vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t0.x, t0.y, t0.z);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t1.x, t1.y, t1.z);
// d = map.phi1[d];  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t2.x, t2.y, t2.z);
// d = map.phi1[d];  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t3.x, t3.y, t3.z);
// d = map.phi([2, 1, 1, 2], d);  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t4.x, t4.y, t4.z);
// d = map.phi1[d];  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t5.x, t5.y, t5.z);
// d = map.phi1[d];  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t6.x, t6.y, t6.z);
// d = map.phi1[d];  vid = map.cell(map.vertex, d);
// pos[vid] = new THREE.Vector3(t7.x, t7.y, t7.z);

const map = loadCMap2("off", icosahedron_off);

let d;

const mapDQ = loadCMap2("off", icosahedron_off);
mapDQ.setEmbeddings(mapDQ.edge);
mapDQ.setEmbeddings(mapDQ.face);
const DQpos = mapDQ.getAttribute(mapDQ.vertex, "position");
const DQs = mapDQ.addAttribute(mapDQ.vertex, "dq");


mapDQ.foreach(mapDQ.vertex, vd => {
	const vid = mapDQ.cell(mapDQ.vertex, vd);
	const t = DQpos[vid].clone();
	const trans = new THREE.Quaternion(t.x, t.y, t.z);
	const unitT = trans.clone().normalize();
	const rot = new THREE.Quaternion().setFromUnitVectors(worldY, new THREE.Vector3(trans.x, trans.y, trans.z).normalize());

	DQs[vid] = new DualQuaternion(rot, trans.clone().multiply(rot).multiplyScalar(0.5));


});

// const mapDQ = new CMap2();
// d = mapDQ.addPrism(4);
// mapDQ.setEmbeddings(mapDQ.vertex);
// mapDQ.setEmbeddings(mapDQ.edge);
// mapDQ.setEmbeddings(mapDQ.face);
// const DQpos = mapDQ.addAttribute(mapDQ.vertex, "position");
// const DQs = mapDQ.addAttribute(mapDQ.vertex, "dq");

// let vid = map.cell(map.vertex, d);

// DQs[vid] = dq0;
// DQpos[vid] = dq0.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq1;
// DQpos[vid] = dq1.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq2;
// DQpos[vid] = dq2.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq3;
// DQpos[vid] = dq3.transform(world0);
// d = map.phi([2, 1, 1, 2], d); vid = map.cell(map.vertex, d);
// DQs[vid] = dq4;
// DQpos[vid] = dq4.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq5;
// DQpos[vid] = dq5.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq6;
// DQpos[vid] = dq6.transform(world0);
// d = map.phi1[d]; vid = map.cell(map.vertex, d);
// DQs[vid] = dq7;
// DQpos[vid] = dq7.transform(world0);






















const geometrySampleCone = new THREE.ConeGeometry(0.005, 0.025, 16, 1);
geometrySampleCone.translate(0, 0.0125, 0);

function verticesDQ() {
	const vertex = mapDQ.vertex;
	const scale = new THREE.Vector3(2, 2, 2);
	const conesVertices = new THREE.InstancedMesh(geometrySampleCone, red, mapDQ.nbCells(vertex));
	scene.add(conesVertices);

	let vid, dq;
	const matrix = new THREE.Matrix4
	mapDQ.foreach(vertex, vd => {
		vid = mapDQ.cell(vertex, vd);
		dq = DQs[vid];

		matrix.compose(dq.getTranslation(), dq.getRotation(), scale);
		conesVertices.setMatrixAt(vid, matrix);
	});
}


function edgesDQ() {
	const vertex = mapDQ.vertex;
	const edge = mapDQ.edge;

	const nbEdges = mapDQ.nbCells(edge);

	const nbDivs = 20;
	const scale = new THREE.Vector3(1, 1, 1);
	const conesEdges = new THREE.InstancedMesh(geometrySampleCone, black, (nbDivs+1) * nbEdges);
	scene.add(conesEdges);

	let eid, dq0, dq1;
	const matrix = new THREE.Matrix4
	const dq = new DualQuaternion;
	mapDQ.foreach(edge, ed => {
		eid = mapDQ.cell(edge, ed);
		dq0 = DQs[mapDQ.cell(vertex, ed)];
		dq1 = DQs[mapDQ.cell(vertex, mapDQ.phi2[ed])];

		for(let i = 0; i < nbDivs + 1; ++i) {
			dq.slerpDualQuaternions(dq0, dq1, i / nbDivs).normalize()
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










function catmullClarkDQ() {
	const vertex = mapDQ.vertex;
	const edge = mapDQ.edge;
	const face = mapDQ.face;

	const DQs2 = mapDQ.addAttribute(vertex, "dq2");
	// const centers = mapDQ.addAttribute(face, "centers");

	// let eid;
	// mapDQ.foreach(edge, ed => {
	// 	eid = mapDQ.cell(edge, ed);
	// 	mids = new DualQuaternion;
	// });

	// let fid;
	// mapDQ.foreach(face, fd => {
	// 	fid = mapDQ.cell(face, ed);
	// 	centers[fid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
	// 	mapDQ.foreachDartOf()
	// });

	const initVerticesCache = mapDQ.cache(vertex);
	const faceVerticesCache = [];
	const edgeVerticesCache = [];



	quadrangulateAllFaces(mapDQ,
		vd => {
			edgeVerticesCache.push(vd);

			const vid = mapDQ.cell(vertex, vd);
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			mapDQ.foreachDartOf(vertex, vd, d => {
				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi2[d])])
			});
			DQs[vid].multiplyScalar(0.5).normalize();
		},
		vd => {
			faceVerticesCache.push(vd);

			const vid = mapDQ.cell(vertex, vd);
			let nbFaces = 0;
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			mapDQ.foreachDartOf(vertex, vd, d => {
				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi([1, 1], d))]);
				++nbFaces;
			});
			DQs[vid].multiplyScalar(1 / nbFaces).normalize();
		}
	);

	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(vertex, vd);
		DQs2[vid] = DQs[vid];
		DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));

		mapDQ.foreachDartOf(vertex, vd, d => {
			DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi1[d])]);
		});

		DQs[vid].multiplyScalar(0.25).normalize()

	}, {cache: edgeVerticesCache});

	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(vertex, vd);

		let n = 0;
		const F = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
		const E = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
		const P = DQs[vid];
		mapDQ.foreachDartOf(vertex, vd, d => {
			F.add(DQs[mapDQ.cell(vertex, mapDQ.phi([1, 1, 2], d))]);
			E.add(DQs[mapDQ.cell(vertex, mapDQ.phi1[d])]);
			++n;
		});

		F.multiplyScalar(1/n);
		E.multiplyScalar(2/n);
		P.multiplyScalar(n - 3);
		P.add(F).add(E).multiplyScalar(1/n).normalize();

	}, {cache: initVerticesCache});



	mapDQ.foreach(vertex, vd => {
		
	});

	mapDQ.removeAttribute(vertex, DQs2);
}



function CCDelta(approx = true) {
	const vertex = mapDQ.vertex;
	const edge = mapDQ.edge;
	const face = mapDQ.face;

	const DQs2 = mapDQ.addAttribute(vertex, "dq2");
	const delta = mapDQ.addAttribute(vertex, "delta");
	// const centers = mapDQ.addAttribute(face, "centers");

	// let eid;
	// mapDQ.foreach(edge, ed => {
	// 	eid = mapDQ.cell(edge, ed);
	// 	mids = new DualQuaternion;
	// });

	// let fid;
	// mapDQ.foreach(face, fd => {
	// 	fid = mapDQ.cell(face, ed);
	// 	centers[fid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
	// 	mapDQ.foreachDartOf()
	// });

	const initVerticesCache = mapDQ.cache(vertex);
	const faceVerticesCache = [];
	const edgeVerticesCache = [];



	quadrangulateAllFaces(mapDQ,
		vd => {
			edgeVerticesCache.push(vd);

			const vid = mapDQ.cell(vertex, vd);
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			mapDQ.foreachDartOf(vertex, vd, d => {
				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi2[d])])
			});
			DQs[vid].multiplyScalar(0.5).normalize();
		},
		vd => {
			faceVerticesCache.push(vd);

			const vid = mapDQ.cell(vertex, vd);
			let nbFaces = 0;
			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
			mapDQ.foreachDartOf(vertex, vd, d => {
				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi([1, 1], d))]);
				++nbFaces;
			});
			DQs[vid].multiplyScalar(1 / nbFaces).normalize();
		}
	);

	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(vertex, vd);
		DQs2[vid] = DQs[vid];
		DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));

		mapDQ.foreachDartOf(vertex, vd, d => {
			DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi1[d])]);
		});

		DQs[vid].multiplyScalar(0.25).normalize()

	}, {cache: edgeVerticesCache});

	mapDQ.foreach(vertex, vd => {
		const vid = mapDQ.cell(vertex, vd);

		let n = 0;
		const F = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
		const E = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
		const P = DQs[vid].clone();
		mapDQ.foreachDartOf(vertex, vd, d => {
			F.add(DQs[mapDQ.cell(vertex, mapDQ.phi([1, 1, 2], d))]);
			E.add(DQs[mapDQ.cell(vertex, mapDQ.phi1[d])]);
			++n;
		});

		F.multiplyScalar(1/n);
		E.multiplyScalar(2/n);
		P.multiplyScalar(n - 3);
		P.add(F).add(E).multiplyScalar(1/n).normalize();

		DQs2[vid] = P;
		delta[vid] = DQs2[vid].clone().multiply(DQs[vid].clone().invert())

	}, {cache: initVerticesCache});


	if(approx)
		mapDQ.foreach(vertex, vd => {
			const vid = mapDQ.cell(vertex, vd);
			DQs[vid].copy(DQs2[vid])
		}, {cache: initVerticesCache});
	else {
		let path = [1, 2];
		mapDQ.foreach(vertex, vd => {
			const vid = mapDQ.cell(vertex, vd);
			delta[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));

			let nbVerts = 0;
			mapDQ.foreachDartOf(vertex, vd, d => {
				delta[vid].add(delta[mapDQ.cell(vertex, mapDQ.phi(path, d))]);
				++nbVerts;
			});

			DQs[vid].premultiply(delta[vid]).normalize()

		}, {cache: faceVerticesCache});
	}

	mapDQ.removeAttribute(vertex, DQs2);
	mapDQ.removeAttribute(vertex, delta);
}



// function CCDeltaApprox(mapDQ) {
// 	const vertex = mapDQ.vertex;
// 	const edge = mapDQ.edge;
// 	const face = mapDQ.face;

// 	const DQs = mapDQ.getAttribute(vertex, "dq");
// 	const delta = mapDQ.addAttribute(vertex, "delta");
// 	const incident_f = mapDQ.addAttribute(vertex, "incident_f");

// 	const initVerticesCache = mapDQ.cache(vertex);
// 	const faceVerticesCache = [];
// 	const edgeVerticesCache = [];

// 	quadrangulateAllFaces(mapDQ, 
// 		vd => {
// 			edgeVerticesCache.push(vd);
// 			let vid = mapDQ.cell(vertex, vd);

// 			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 			delta[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 			incident_f[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));

// 			mapDQ.foreachDartOf(vertex, vd, d => {
// 				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi2[d])]);
// 				delta[vid].addScaledDualQuaternion(DQs[mapDQ.cell(vertex, mapDQ.phi2[d])], -1);
// 			})
// 			DQs[vid].multiplyScalar(0.5);
// 			delta[vid].multiplyScalar(0.25);
// 		},
// 		vd => {
// 			faceVerticesCache.push(vd);
// 			let vid = mapDQ.cell(vertex, vd);
// 			let nbEdges = 0;
// 			DQs[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 			delta[vid] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 			mapDQ.foreachDartOf(vertex, vd, d => {
// 				DQs[vid].add(DQs[mapDQ.cell(vertex, mapDQ.phi2[d])]);
// 				++nbEdges;
// 			});
// 			DQs[vid].multiplyScalar(1 / nbEdges);

// 			mapDQ.foreachDartOf(vertex, vd, d => {
// 				delta[mapDQ.cell(vertex, mapDQ.phi2[d])].addScaledDualQuaternion(DQs[vid], 0.25);
// 				incident_f[mapDQ.cell(vertex, mapDQ.phi2[d])].addScaledDualQuaternion(DQs[vid], 0.5);
// 			});
// 		});
	

// 	let vid2 = 0;
// 	mapDQ.foreach(vertex, vd => {
// 		delta[mapDQ.cell(vertex, vd)] = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));;
// 		let F = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 		let R = new DualQuaternion(new THREE.Quaternion(0, 0, 0, 0), new THREE.Quaternion(0, 0, 0, 0));
// 		let n = 0;

// 		mapDQ.foreachDartOf(vertex, vd, d => {
// 			vid2 = mapDQ.cell(vertex, mapDQ.phi2[d]);
// 			F.add(incident_f[vid2]);
// 			R.add(DQs[vid2]);
// 			++n;
// 		});

// 		delta[mapDQ.cell(vertex, vd)]
// 			.addScaledDualQuaternion(DQs[mapDQ.cell(vertex, vd)], -3 * n)
// 			.add(F)
// 			.addScaledDualQuaternion(R, 2)
// 			.multiplyScalar(1/(n*n));

// 	}, {cache: initVerticesCache});

// 	mapDQ.foreach(vertex, vd => {
// 		// DQs[mapDQ.cell(vertex, vd)].add(delta[mapDQ.cell(vertex, vd)]).normalize();
// 	});

// 	delta.delete();
// 	incident_f.delete();
// }



// catmullClarkDQ()
// catmullClarkDQ()
// catmullClarkDQ()
// catmullClarkDQ()
// catmullClarkDQ()

// console.log(mapDQ.nbCells(mapDQ.face))
// CCDelta(false);
CCDelta(false);
// CCDeltaApprox(mapDQ);

catmullClark(map)

verticesDQ()
edgesDQ()
// facesDQ();







const mapRenderer = new Renderer(map);
mapRenderer.vertices.create()
// mapRenderer.vertices.addTo(scene)
mapRenderer.edges.create()
mapRenderer.edges.addTo(scene)


// const mapDQRenderer = new Renderer(mapDQ);
// mapDQRenderer.vertices.create()
// mapDQRenderer.vertices.addTo(scene)
// mapDQRenderer.edges.create()
// mapDQRenderer.edges.addTo(scene)





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