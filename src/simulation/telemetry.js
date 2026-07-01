import { EARTH_RADIUS } from "../core/constants.js";
import { computeOrbitalElements } from "./orbitalElements.js";

export function computeTelemetry(state) {
	const x = state.x;
	const z = state.z;
	const vx = state.vx;
	const vz = state.vz;

	const r = Math.sqrt(x * x + z * z);
	const v2 = vx * vx + vz * vz;

	const vr = (x * vx + z * vz) / r;

	const elements = computeOrbitalElements(state);

	return {
		altitude: r - EARTH_RADIUS,
		speed: Math.sqrt(v2),
		energy: elements.energy,
		momentum: elements.h,
		periapsis: elements.rp - EARTH_RADIUS,
		apoapsis: elements.ra - EARTH_RADIUS,
		period: elements.period,
		vspeed: vr,
		
		// will implement in UI eventually
		eccentricity: elements.e,
		argumentOfPeriapsis: elements.omega,
	};
}
