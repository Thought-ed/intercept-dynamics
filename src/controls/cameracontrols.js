import { panSpeed } from "../core/constants";
import * as THREE from "three";

export function initializeCameraControls(camera, renderer) {
	let dragging = false;
	let lastX = 0;
	let lastY = 0;

	const canvas = renderer.domElement;

	canvas.addEventListener("mousedown", (e) => {
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
	});

	window.addEventListener("mouseup", () => {
		dragging = false;
	});

	canvas.addEventListener("mousemove", (e) => {
		if (!dragging) return;

		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;

		// scale factor
		const scale = panSpeed / camera.zoom;

		// camera basis vectors
		const right = new THREE.Vector3();
		const up = new THREE.Vector3();

		camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());

		// move in camera space
		right.multiplyScalar(-dx * scale);
		up.multiplyScalar(dy * scale);

		camera.position.add(right);
		camera.position.add(up);

		lastX = e.clientX;
		lastY = e.clientY;
	});

	canvas.addEventListener(
		"wheel",
		(e) => {
			e.preventDefault();
			if (e.deltaY < 0) {
				camera.zoom *= 1.1;
			} else {
				camera.zoom /= 1.1;
			}

			camera.zoom = Math.max(0.1, Math.min(camera.zoom, 50));

			camera.updateProjectionMatrix();
		},
		{ passive: false },
	);
}
