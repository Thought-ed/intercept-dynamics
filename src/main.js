import * as THREE from 'three';
import { Text } from 'troika-three-text'

// functions import
import { createScene } from './scene.js';
import { physicsStep } from './physics.js';
import { Satellite } from './satellite.js';
import { MU, EARTH_RADIUS, SCALE, keys } from './constants.js';
import { computeTelemetry } from './telemetry.js';
import { TechnicolorShader } from 'three/examples/jsm/Addons.js';

const state = {
    satellite: null,
    mesh: null,
    trail: [],
    trailGeometry: null,
    trailLine: null

};
const MAX_TRAIL = 2500

const altitudeEl = document.getElementById("altitude")
const velocityEl = document.getElementById("velocity")
const energyEl = document.getElementById("energy")
const momentumEl = document.getElementById("momentum")
const periapsisEl = document.getElementById("periapsis")
const apoapsisEl = document.getElementById("apoapsis")
const periodEl = document.getElementById("period")
const vspeedEl = document.getElementById("vspeed")


const {
    renderer,
    camera,
    scene,

} = createScene(SCALE);

// Sputnik Physics and Mesh join
function createSatellite() {
    state.satellite =
        new Satellite(
            EARTH_RADIUS + 500, // x
            0, // y
            0, // vx
            8.15 // vy
        );

    state.mesh =
        new THREE.Mesh(
            new THREE.ConeGeometry(2, 4, 8),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    scene.add(state.mesh)

}
// Add Sputnik Label
function addText() {
    const text = new Text()
    text.text = "Lil' Sputnik :D"
    text.fontSize = 8

    text.font = './fonts/Roboto_Mono/RobotoMono-Regular.ttf';
    text.position.set(5, 5.2, 0)
    text.renderOrder = 999;
    text.material.depthTest = false;
    text.material.depthWrite = false;

    text.sync();
    state.mesh.add(text)
}
// Add orbital trail
function createOrbitalTrail() {
    state.trail = []
    state.trailGeometry = new THREE.BufferGeometry()
    const trailMaterial = new THREE.LineBasicMaterial({ color: 0x0073EB })
    state.trailLine = new THREE.Line(state.trailGeometry, trailMaterial);
    scene.add(state.trailLine);
}

//Actually move everything around
function animate() {
    requestAnimationFrame(animate);

    const dt = 0.1;      // smaller timestep
    const steps = 10;    // 10 substeps per frame
    const timescale = 3

    for (let i = 0; i < steps; i++) {
        physicsStep(state.satellite, dt * timescale);
    }

    state.trail.push({ x: state.satellite.x, y: state.satellite.y });

    if (state.trail.length > MAX_TRAIL) {
        state.trail.shift();
    }

    state.mesh.position.set(
        state.satellite.x * SCALE,
        state.satellite.y * SCALE,
        0
    );

    const positions = new Float32Array(state.trail.length * 3);

    for (let i = 0; i < state.trail.length; i++) {
        positions[i * 3] = state.trail[i].x * SCALE;
        positions[i * 3 + 1] = state.trail[i].y * SCALE;
        positions[i * 3 + 2] = 0;
    }

    state.trailGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    state.trailGeometry.computeBoundingSphere();

    const t = computeTelemetry(state.satellite);

    altitudeEl.textContent = `${t.altitude.toFixed(2)}km`;
    velocityEl.textContent = `${t.speed.toFixed(4)}km/s`;
    energyEl.textContent = `${t.energy.toFixed(3)} km²/s²`;
    momentumEl.textContent = `${t.momentum.toExponential(3)} km²/s`;
    periapsisEl.textContent = `${t.periapsis.toFixed(3)} km`;
    apoapsisEl.textContent = `${t.apoapsis.toFixed(3)} km`;
    periodEl.textContent = `${t.period.toFixed(3)} units (dt)`;
    vspeedEl.textContent = `${t.vspeed.toFixed(3)} km/s`;



    renderer.render(
        scene,
        camera
    );

}

createSatellite()
addText()
createOrbitalTrail()
animate()