import * as THREE from "three";
import { SCALE } from "../core/constants";

export function generateOrbitPoints(elements, segments = 256) {
	const { a, e, omega } = elements;
	const points = [];

	for (let i = 0; i <= segments; i++) {
		const nu = (i / segments) * 2 * Math.PI;

		const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));

		const xo = r * Math.cos(nu);
		const zo = r * Math.sin(nu);
		let x = xo * Math.cos(omega) - zo * Math.sin(omega);
		let z = xo * Math.sin(omega) + zo * Math.cos(omega);

		x *= SCALE;
		z *= SCALE;

		points.push({ x, z, nu });
	}



	return points;
}

export function createOrbitLine(scene) {
	const geometry = new THREE.BufferGeometry();

	const positions = new Float32Array(257 * 3);
	const positionAttr = new THREE.BufferAttribute(positions, 3);

	positionAttr.setUsage(THREE.DynamicDrawUsage);

	geometry.setAttribute("position", positionAttr);
	geometry.setDrawRange(0, 257);

	const material = new THREE.LineBasicMaterial({
		color: 0x4B5563,
		transparent: true,
		opacity: 0.5,
	});
	const line = new THREE.Line(geometry, material);
	scene.add(line);

	return {
		line,
		geometry,
		positionAttr,
		positions,
	};
}
export function updateOrbitLine(orbitLine, elements) {
	const points = generateOrbitPoints(elements);

	const attr = orbitLine.geometry.attributes.position;

	for (let i = 0; i < points.length; i++) {
		attr.array[i * 3] = points[i].x;
		attr.array[i * 3 + 1] = 0;
		attr.array[i * 3 + 2] = points[i].z;
	}

	attr.needsUpdate = true;

	orbitLine.geometry.setDrawRange(0, points.length);
	orbitLine.geometry.computeBoundingSphere();

	orbitLine.line.material.depthTest= true
    orbitLine.line.material.depthWrite= false
}
