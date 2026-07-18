import { viewConfig } from "../core/viewConfig";
import { EARTH_RADIUS } from "../core/constants";

const viewBox = 160;
const center = viewBox / 2;
const maxRadius = 65; // leave margin inside panel

let els = null;

export function createOrbitSchematic(containerSelector = "body") {
	const container = document.querySelector(containerSelector);
	const panel = document.createElement("div");
	panel.className = "panel schematic-panel";
	panel.innerHTML = `
    <div class="header">Orbit</div>
    <div class="sub">Top-down projection</div>
    <div class="divider"></div>
    <svg viewBox="0 0 ${viewBox} ${viewBox}" class="schematic-svg">
        <ellipse id="schematic-orbit" fill="none" stroke="var(--telemetry-dim)" stroke-width="1"/>
        <circle id = "schematic-earth" r="4" fill="var(--telemetry)"/>
        <circle id = "schematic-peri" r="1.5" fill="var(--slate)"/>
        <circle id = "schematic-apo" r="1.5" fill="var(--slate)"/>
        <circle id = "schematic-craft" r="2.5" fill="var(--telemetry)"/>
    </svg>
    `;
	container.appendChild(panel);
	els = {
		panel,
		orbitEllipse: panel.querySelector("#schematic-orbit"),
		earthDot: panel.querySelector("#schematic-earth"),
		periDot: panel.querySelector("#schematic-peri"),
		apoDot: panel.querySelector("#schematic-apo"),
		craftDot: panel.querySelector("#schematic-craft"),
	};

	els.earthDot.setAttribute("cx", center);
	els.earthDot.setAttribute("cy", center);

	return els;
}

// point on the orbit at true anomaly nu, in orbital plane
// literally the math in orbitPatchesUtil.getApsisPoints, but there's no SCALE factor

function orbitPoint(orbit, nu) {
	const { a, e, omega } = orbit;

	const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));

	const xo = r * Math.cos(nu);
	const zo = r * Math.sin(nu);

	return {
		x: xo * Math.cos(omega) - zo * Math.sin(omega),
		z: xo * Math.sin(omega) + zo * Math.cos(omega),
	};
}

function toScreen(x, z, scale) {
	return {
		sx: center + x * scale,
		sy: center - z * scale,
	};
}

export function updateOrbitSchematic(satellite, isThrusting = false) {
	if (!els) return;
	const orbit = satellite.orbit;
	const scale = maxRadius / orbit.ra;

	// ellipse own center is offset from the earth's focus
	// towards apoapsis by a*e, along the paeriapsis direction
	// draw unrotated then let SVG transform rotate the whole shape
	const { sx: cx, sy: cy } = toScreen(-orbit.a * orbit.e, 0, scale);
	const rx = orbit.a * scale;
	const ry = orbit.a * Math.sqrt(1 - orbit.e * orbit.e) * scale;

	els.orbitEllipse.setAttribute("cx", cx);
	els.orbitEllipse.setAttribute("cy", cy);
	els.orbitEllipse.setAttribute("rx", rx);
	els.orbitEllipse.setAttribute("ry", ry);

	const degrees = (orbit.omega * 180) / Math.PI;
	els.orbitEllipse.setAttribute(
		"transform",
		`rotate(${degrees} ${center} ${center})`,
	);

	const periLocal = orbitPoint(orbit, 0);
	const apoLocal = orbitPoint(orbit, Math.PI);
	const peri = toScreen(periLocal.x, -periLocal.z, scale);
	const apo = toScreen(apoLocal.x, -apoLocal.z, scale);

	els.periDot.setAttribute("cx", peri.sx);
	els.periDot.setAttribute("cy", peri.sy);
	els.apoDot.setAttribute("cx", apo.sx);
	els.apoDot.setAttribute("cy", apo.sy);

    const earthRadius = Math.max(1.5, EARTH_RADIUS * scale);
    els.earthDot.setAttribute("r", earthRadius);

    const craft = toScreen(satellite.x, -satellite.z, scale);
    els.craftDot.setAttribute("cx", craft.sx);
    els.craftDot.setAttribute("cy", craft.sy);
    els.craftDot.setAttribute(
        "fill",
        isThrusting ? "var(--amber)" : "var(--telemetry)"
    );
}
