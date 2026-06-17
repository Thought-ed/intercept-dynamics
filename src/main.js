import * as THREE from "three";
import { Text } from "troika-three-text";

// functions import
import { createScene } from "./scene.js";
import { physicsStep } from "./physics.js";
import { Satellite } from "./satellite.js";
import { updateTelemetryUI } from "./ui.js";
import { computeTelemetry } from "./telemetry.js";
import { TechnicolorShader } from "three/examples/jsm/Addons.js";
import { createTrail, updateTrail } from "./trail.js";
import { initializeControls, applyControls } from "./controls.js";
import { updateSatelliteVisuals } from "./renderer.js";
import { initializeCameraControls } from "./cameracontrols.js";
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
	MAX_TRAIL
} from "./constants.js";

const state = {
	satellite: null,
	mesh: null,
	text: null,
	trailState: null,
};



const { renderer, camera, scene } = createScene(SCALE);
initializeControls();
initializeCameraControls(camera, renderer);

// Sputnik Physics and Mesh join
function createSatellite() {
	state.satellite = new Satellite(
		EARTH_RADIUS + 500, // x
		0, // y
		0, // vx
		8.15, // vy
	);

	state.mesh = new THREE.Mesh(
		new THREE.ConeGeometry(2, 5, 8),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
		}),
	);

	scene.add(state.mesh);
}
// Add Sputnik Label
function addText() {
	const text = new Text();

	text.text = "Lil' Sputnik :D";
	text.fontSize = 8;

	text.font = "./fonts/Roboto_Mono/RobotoMono-Regular.ttf";

	text.material.depthTest = false;
	text.material.depthWrite = false;

	text.sync();

	state.text = text;
	scene.add(state.text);
}

// Add orbital trail

//
//Actually move everything around

//Woah, are you actually reading all this?
//Nice, consider yourself based

function animate() {
	requestAnimationFrame(animate);

	const subDt = dt * timescale;

	for (let i = 0; i < steps; i++) {
		physicsStep(state.satellite, dt * timescale, input);
		applyControls(state, subDt / steps);
	}

	updateTrail(
		state.trailState,
		state.satellite.x,
		state.satellite.y,
		SCALE,
		MAX_TRAIL,
	);

	updateSatelliteVisuals(state, SCALE);

	updateTelemetryUI(state.satellite);
	renderer.render(scene, camera);
}

createSatellite();
addText();
state.trailState = createTrail(scene);
animate();
