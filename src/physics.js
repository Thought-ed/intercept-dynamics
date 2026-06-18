import { MU, EARTH_RADIUS, SCALE } from "./constants.js";
const thrust = 0.0008;

export function physicsStep(sat, dt) {
	const r = Math.sqrt(sat.x * sat.x + sat.z * sat.z);

	const ax = (-MU * sat.x) / (r * r * r);
	const az = (-MU * sat.z) / (r * r * r);

	sat.vx += 0.5 * ax * dt;
	sat.vz += 0.5 * az * dt;

	sat.x += sat.vx * dt;
	sat.z += sat.vz * dt;

	const r2 = Math.sqrt(sat.x * sat.x + sat.z * sat.z);

	const ax2 = (-MU * sat.x) / (r2 * r2 * r2);
	const az2 = (-MU * sat.z) / (r2 * r2 * r2);

	sat.vx += 0.5 * ax2 * dt;
	sat.vz += 0.5 * az2 * dt;
}