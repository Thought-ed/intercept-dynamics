import * as THREE from "three";

const maxParticles = 60;

export function createThrustTrail(scene) {
	const trail = [];
	const geometry = new THREE.SphereGeometry(0.35, 8, 8);
	const material = new THREE.MeshBasicMaterial({
		color: 0xff7733,
		transparent: true,
		opacity: 0.9,
		depthTest: false,
		depthWrite: false,
	});

	const mesh = new THREE.InstancedMesh(geometry, material, maxParticles);
	mesh.renderOrder = 4;
	mesh.count = 0;
	scene.add(mesh);

	return { trail: [], mesh };
}

const dummy = new THREE.Object3D();

export function updateThrustTrail(
	trailState,
	nozzleX,
	nozzleZ,
	isThrusting,
	scale,
	maxTrail,
) {
	if (isThrusting) {
		trailState.trail.push({ x: nozzleX, z: nozzleZ });
	}
	if (!isThrusting || trailState.trail.length > maxTrail) {
		trailState.trail.shift();
	}

	const count = trailState.trail.length;

	for (let i = 0; i < count; i++) {
		const p = trailState.trail[i];
		const t = count > 1 ? i / (count - 1) : 1;
		const s = 0.3 + t * 0.7;

		dummy.position.set(p.x * scale, 0, p.z * scale);
		dummy.scale.setScalar(s);
		dummy.updateMatrix();
		trailState.mesh.setMatrixAt(i, dummy.matrix);
	}
	trailState.mesh.count = count;

	trailState.mesh.instanceMatrix.needsUpdate = true;
	if (trailState.mesh.instanceColor) {
		trailState.mesh.instanceColor.needsUpdate = true;
	}
}
