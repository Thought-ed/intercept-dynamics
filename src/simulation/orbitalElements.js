import { MU } from "../core/constants.js";

export function computeOrbitalElements(state) {
	const x = state.x;
	const z = state.z;
	const vx = state.vx;
	const vz = state.vz;

	const r = Math.sqrt(x * x + z * z);
	const v2 = vx * vx + vz * vz;

	const vr = (x * vx + z * vz) / r;

	const h = x * vz - z * vx;

	const energy = v2 / 2 - MU / r;

	const a = -MU / (2 * energy);

	// eccentricity vector
	const ex = ((v2 - MU / r) * x - (x * vx + z * vz) * vx) / MU;
	const ez = ((v2 - MU / r) * z - (x * vx + z * vz) * vz) / MU;
	const e = Math.sqrt(ex * ex + ez * ez);
	const omega = Math.atan2(ez, ex); // direction of periapsis

	const rp = a * (1 - e);
	const ra = a * (1 + e);

	const T = 2 * Math.PI * Math.sqrt((a * a * a) / MU);

	return {
		a,
        e,
        omega,
        h,
        energy,
        rp,
        ra,
        period: T
	};
}
