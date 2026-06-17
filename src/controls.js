import { input, rotspeed, thrust } from "./constants";

export function initializeControls() {
	window.addEventListener("keydown", (e) => {
		if (e.key == "w") input.w = true;
		if (e.key == "a") input.a = true;
		if (e.key == "s") input.s = true;
		if (e.key == "d") input.d = true;
	});

	window.addEventListener("keyup", (e) => {
		if (e.key == "w") input.w = false;
		if (e.key == "a") input.a = false;
		if (e.key == "s") input.s = false;
		if (e.key == "d") input.d = false;
	});
}
export function applyControls(state, dt) {
	const sat = state.satellite;

	const torque = rotspeed * dt;

	if (input.a) sat.omega += torque;
	if (input.d) sat.omega -= torque;

	const dampingRate = 0.8;
	sat.omega *= Math.exp(-dampingRate * dt);

	const maxOmega = 2.5;
	sat.omega = Math.max(-maxOmega, Math.min(maxOmega, sat.omega));

	sat.angle += sat.omega * dt;

	if (input.w) {
		sat.vx += Math.cos(sat.angle) * thrust;
		sat.vy += Math.sin(sat.angle) * thrust;
	}

	if (input.s) {
		sat.vx -= Math.cos(sat.angle) * thrust;
		sat.vy -= Math.sin(sat.angle) * thrust;
	}
}
