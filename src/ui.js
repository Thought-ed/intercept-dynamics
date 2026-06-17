import { computeTelemetry } from "./telemetry.js";

// telemetry box
const altitudeEl = document.getElementById("altitude");
const velocityEl = document.getElementById("velocity");
const energyEl = document.getElementById("energy");
const momentumEl = document.getElementById("momentum");
const periapsisEl = document.getElementById("periapsis");
const apoapsisEl = document.getElementById("apoapsis");
const periodEl = document.getElementById("period");
const vspeedEl = document.getElementById("vspeed");


export function updateTelemetryUI(satellite) {
	const t = computeTelemetry(satellite);

	altitudeEl.textContent = `${t.altitude.toFixed(2)}km`;
	velocityEl.textContent = `${t.speed.toFixed(4)}km/s`;
	energyEl.textContent = `${t.energy.toFixed(3)} km²/s²`;
	momentumEl.textContent = `${t.momentum.toExponential(3)} km²/s`;
	periapsisEl.textContent = `${t.periapsis.toFixed(3)} km`;
	apoapsisEl.textContent = `${t.apoapsis.toFixed(3)} km`;
	periodEl.textContent = `${t.period.toFixed(3)} units (dt)`;
	vspeedEl.textContent = `${t.vspeed.toFixed(3)} km/s`;
}
