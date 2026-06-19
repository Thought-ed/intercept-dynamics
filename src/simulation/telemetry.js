import { MU, EARTH_RADIUS } from "../core/constants.js";

export function computeTelemetry(state) {
	const x = state.x;
	const z = state.z;
	const vx = state.vx;
	const vz = state.vz;

	const r = Math.sqrt(x * x + z * z);
	const v2 = vx * vx + vz * vz;

	const energy = v2 / 2 - MU / r;
	const h = x * vz - z * vx;

	const a = -MU / (2 * energy);

	const e = Math.sqrt(1 + (2 * energy * h * h) / (MU * MU));

	const rp = a * (1 - e);
	const ra = a * (1 + e);

	const T = 2 * Math.PI * Math.sqrt((a * a * a) / MU);

	const vr = (x * vx + z * vz) / r;

	return {
		altitude: r - EARTH_RADIUS,
		speed: Math.sqrt(v2),
		energy,
		momentum: h,
		periapsis: rp - EARTH_RADIUS,
		apoapsis: ra - EARTH_RADIUS,
		period: T,
		vspeed: vr,
	};
}
