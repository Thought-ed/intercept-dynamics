import * as THREE from "three";
import { Text } from "troika-three-text";

// functions import
import { createScene } from "./core/scene.js";
import { physicsStep } from "./simulation/physics.js";
import { Satellite } from "./simulation/satellite.js";
import { updateTelemetryUI } from "./ui/ui.js";
import { computeTelemetry } from "./simulation/telemetry.js";
import { TechnicolorShader } from "three/examples/jsm/Addons.js";
import { createTrail, updateTrail } from "./simulation/trail.js";
import { initializeControls, applyControls } from "./controls/controls.js";
import { updateSatelliteVisuals } from "./core/renderer.js";
import { initializeCameraControls } from "./controls/cameracontrols.js";
import { computeOrbitalElements } from "./simulation/orbitalElements.js";
import { viewConfig } from "./core/viewConfig.js";
import {
	updateOrbitLine,
	createOrbitLine,
	generateOrbitPoints,
} from "./simulation/orbitLine.js";
import { createOrbitPatches } from "./graphics/orbitPatches.js";
import { updatePatch } from "./graphics/orbitPatches.js";
import { extractPatch, getApsisPoints } from "./simulation/orbitPatchesUtil.js";
import { createThrustTrail, updateThrustTrail } from "./simulation/thrustTrail.js";
import {
	dt,
	steps,
	timescale,
	SCALE,
	input,
	rotspeed,
	thrust,
	MU,
	EARTH_RADIUS,
	MAX_TRAIL,
	nozzleOffset,
} from "./core/constants.js";

const state = {
	satellite: null,
	mesh: null,
	text: null,
	trailState: null,
	thrustTrailState: null,
};

const { renderer, camera, scene, earth } = createScene(SCALE);
initializeControls();
initializeCameraControls(camera, renderer);
state.orbitLine = createOrbitLine(scene);
state.orbitPatches = createOrbitPatches(scene);
state.thrustTrailState = createThrustTrail(scene);


// Sputnik Physics and Mesh join
function createSatellite() {
	state.satellite = new Satellite(EARTH_RADIUS + 500, 0, 0, 0, 0, -8.15);

	state.mesh = new THREE.Mesh(
		new THREE.ConeGeometry(2, 5, 8),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
		}),
	);
	state.mesh.geometry.rotateX(Math.PI / 2);
	state.mesh.geometry.rotateY(Math.PI / 1);

	scene.add(state.mesh);
}
// Add Sputnik Label
function addText() {
	const text = new Text();

	text.text = "";
	text.fontSize = 4;

	text.font = "./fonts/Roboto_Mono/RobotoMono-Regular.ttf";

	text.material.depthTest = false;
	text.material.depthWrite = false;

	text.rotation.x = -Math.PI / 2;

	text.sync();

	text.renderOrder = 0;

	state.text = text;
	scene.add(state.text);
}

function computeTrail() {
	const angle = state.satellite.angle;
	const fx = Math.sin(angle);
	const fz = Math.cos(angle);
	
	const isThrusting = input.w;
	const exhaustSign = input.s ? -1 : input.w ? 1 : 0; // Opposite of applied DeltaV
	
	const nozzleX = state.satellite.x + fx * exhaustSign * nozzleOffset;
	const nozzleZ = state.satellite.z + fz * exhaustSign * nozzleOffset;

	updateThrustTrail(state.thrustTrailState, nozzleX, nozzleZ, isThrusting, SCALE, 40)
}

//Woah, are you actually reading all this?
//Nice, consider yourself based

//Actually move everything around
function animate() {
	requestAnimationFrame(animate);

	const subDt = dt * timescale;

	for (let i = 0; i < steps; i++) {
		applyControls(state, subDt / steps);

		physicsStep(state.satellite, dt * timescale, input);
	}

	state.satellite.orbit = computeOrbitalElements(state.satellite);

	const points = generateOrbitPoints(state.satellite.orbit);

	updateSatelliteVisuals(state, SCALE, camera);

	updateTrail(
		state.trailState,
		state.satellite.x,
		state.satellite.z,
		SCALE,
		MAX_TRAIL,
	);

	computeTrail()

	state.trailState.line.visible = viewConfig.showTrail;
	updateOrbitLine(state.orbitLine, state.satellite.orbit);
	state.orbitLine.line.visible = viewConfig.showOrbit;

	updatePatch(state.orbitPatches.peri, extractPatch(points, 0));

	updatePatch(state.orbitPatches.apo, extractPatch(points, Math.PI));

	const apsis = getApsisPoints(state.satellite.orbit);

	state.orbitPatches.periMarker.position.set(
		apsis.periapsis.x,
		0,
		apsis.periapsis.z,
	);
	state.orbitPatches.apoMarker.position.set(
		apsis.apoapsis.x,
		0,
		apsis.apoapsis.z,
	);

	updateTelemetryUI(state.satellite);
	renderer.render(scene, camera);

	earth.rotation.y += 0.001;
}

createSatellite();
addText();
state.trailState = createTrail(scene);
animate();
