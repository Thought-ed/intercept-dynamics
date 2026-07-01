const patchWidth = 0.25

export function extractPatch(points, centerNu) {
    const patch = [];

    for (let i = 0; i < points.length; i++) {
        let d = Math.abs(points[i].nu - centerNu);
        d = Math.min(d, 2 * Math.PI - d);

        if (d < patchWidth) {
            patch.push(points[i]);
        }
    }

    return patch;
}

export function updateApsisMarkers(state, elements) {
	const apsis = getApsisPoints(elements);

	state.periapsisMarker.position.set(apsis.periapsis.x, 0, apsis.periapsis.z);
	state.apoapsisMarker.position.set(apsis.apoapsis.x, 0, apsis.apoapsis.z);
}

import { SCALE } from "../core/constants";

export function getApsisPoints(elements) {
	const { a, e, omega } = elements;

	function compute(nu) {
		const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));

		const xo = r * Math.cos(nu);
		const zo = r * Math.sin(nu);

		let x = xo * Math.cos(omega) - zo * Math.sin(omega);
		let z = xo * Math.sin(omega) + zo * Math.cos(omega);

		return { x: x * SCALE, z: z * SCALE };
	}

	return {
		periapsis: compute(0),
		apoapsis: compute(Math.PI),
	};
}