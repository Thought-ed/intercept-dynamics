export function updateSatelliteVisuals(state, scale) {
	state.mesh.position.set(
		state.satellite.x * scale,
		state.satellite.y * scale,
		0,
	);

	state.mesh.rotation.z = state.satellite.angle - Math.PI / 2;

	state.text.position.set(
		state.mesh.position.x + 5,
		state.mesh.position.y + 5.2,
		0,
	);
}
