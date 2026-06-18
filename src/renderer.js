export function updateSatelliteVisuals(state, scale) {
	state.mesh.position.set(
		state.satellite.x * scale,
		state.satellite.y * scale,
		state.satellite.z * scale,
	);

state.mesh.rotation.y = state.satellite.angle; 
	state.text.position.set(
		state.mesh.position.x + 5,
		state.mesh.position.y + 5.2,
		0,
	);
}
