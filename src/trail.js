import * as THREE from "three";

export function createTrail(scene) {
	const trail = [];
	const geometry = new THREE.BufferGeometry();
	const material = new THREE.LineBasicMaterial({
		color: 0x0073eb,
	});
	const line = new THREE.Line(geometry, material);
	scene.add(line);

	return {
		trail,
		geometry,
		line,
	};
}

export function updateTrail(trailState, x, y, scale, maxTrail) {
	trailState.trail.push({ x, y });

	if (trailState.trail.length > maxTrail) {
		trailState.trail.shift();
	}

	const positions = new Float32Array(trailState.trail.length * 3);

	for (let i = 0; i < trailState.trail.length; i++) {
		positions[i * 3] = trailState.trail[i].x * scale;
		positions[i * 3 + 1] = trailState.trail[i].y * scale;
		positions[i * 3 + 2] = 0;
	}

	trailState.geometry.setAttribute(
		"position",
		new THREE.BufferAttribute(positions, 3),
	);
	trailState.geometry.computeBoundingSphere();
}
