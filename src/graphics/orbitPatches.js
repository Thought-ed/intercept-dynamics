import * as THREE from "three";

export function createOrbitPatches(scene) {
	const peri = createPatchLine(0xffcc66);
	const apo = createPatchLine(0x66aaff);

	scene.add(peri.line);
	scene.add(apo.line);

	const periMarker = createMarker(0xffcc66);
	const apoMarker = createMarker(0x66aaff);

	scene.add(periMarker);
	scene.add(apoMarker);
	peri.line.renderOrder = 10;
	apo.line.renderOrder = 10;

	periMarker.renderOrder = 11;
	apoMarker.renderOrder = 11;

	return { peri, apo, periMarker, apoMarker };
}

function createPatchLine(color) {
	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(1024 * 3);

	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

	const material = new THREE.LineBasicMaterial({
		color,
		transparent: true,
		opacity: 0.85,
	});

	const line = new THREE.Line(geometry, material);
	return { line, geometry, positions };
}

function createMarker(color) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 12, 12),
		new THREE.MeshBasicMaterial({ color }),
	);
}

export function updatePatch(patch, points) {
	const attr = patch.geometry.attributes.position;

	let j = 0;

	for (let i = 0; i < points.length; i++) {
		// detect angular jump (wrap around 0)
		if (i > 0) {
			const prev = points[i - 1].nu;
			const curr = points[i].nu;

			if (Math.abs(curr - prev) > Math.PI) {
				// THIS BREAKS THE LINE
				attr.array[j * 3] = NaN;
				attr.array[j * 3 + 1] = NaN;
				attr.array[j * 3 + 2] = NaN;
				j++;
			}
		}

		attr.array[j * 3] = points[i].x;
		attr.array[j * 3 + 1] = 0;
		attr.array[j * 3 + 2] = points[i].z;

		j++;
	}

	patch.geometry.setDrawRange(0, j);
	attr.needsUpdate = true;
}
