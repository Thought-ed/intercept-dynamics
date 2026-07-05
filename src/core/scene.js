import * as THREE from "three";
import { createEarthMaterial } from "../graphics/meshshader";

export function createScene(scale) {
	const scene = new THREE.Scene();
	const aspect = window.innerWidth / window.innerHeight;
	const frustumSize = 22000 * scale;

	const camera = new THREE.OrthographicCamera(
		(frustumSize * aspect) / -2, // left
		(frustumSize * aspect) / 2, // right
		frustumSize / 2, // top
		frustumSize / -2, // bottom
		-100000, // near
		100000, // far
	);

	camera.position.y = 10000 * scale;
	camera.lookAt(0, 0, 0);
	camera.position.x -= 50;
	camera.position.z += -10;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	let earthGeometry = new THREE.SphereGeometry(6378 * scale, 16, 16);

	earthGeometry = earthGeometry.toNonIndexed();

	earthGeometry.computeVertexNormals();

	const earthMaterial = createEarthMaterial();

	const earth = new THREE.Mesh(earthGeometry, earthMaterial);

	const count = earthGeometry.attributes.position.count;
	const faceCount = count / 3;
	const rand = new Float32Array(count);
	for (let i = 0; i < faceCount; i++) {
		const r = Math.random();
		rand[i * 3] = r;
		rand[i * 3 + 1] = r;
		rand[i * 3 + 2] = r;
	}
	earthGeometry.setAttribute("faceRandom", new THREE.BufferAttribute(rand, 1));

	scene.add(earth);

	/* const gridGeometry = new THREE.SphereGeometry(6378 * scale * 1.01, 20, 12);

	const gridMaterial = new THREE.MeshBasicMaterial({
		color: 0x9ecbff,
		wireframe: true,
		transparent: true,
		opacity: 0.05,
		depthWrite: false,
	});

	const earthGrid = new THREE.Mesh(gridGeometry, gridMaterial);

	earth.add(earthGrid);
	*/
	const atmosphereGeometry = new THREE.SphereGeometry(
		6378 * scale * 1.015,
		64,
		64,
	);

	const atmosphereMaterial = new THREE.ShaderMaterial({
		transparent: true,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		depthWrite: false,

		uniforms: {
			glowColor: { value: new THREE.Color(0x6fb6ff) },
		},

		vertexShader: `
        varying vec3 vNormal;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

		fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;

        void main() {

            // camera-facing falloff (Fresnel-style)
            float intensity = pow(
                1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))),
                2.2
            );

            // clamp so it stays subtle and "designed"
            intensity = clamp(intensity, 0.0, 1.0);

            gl_FragColor = vec4(glowColor, intensity * 0.35);
        }
    `,
	});

	const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

	scene.add(atmosphere);

	window.addEventListener("resize", () => {
		const aspect = window.innerWidth / window.innerHeight;
		camera.left = (frustumSize * aspect) / -2;
		camera.right = (frustumSize * aspect) / 2;
		camera.top = frustumSize / 2;
		camera.bottom = frustumSize / -2;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	return {
		renderer,
		camera,
		scene,
		earth,
	};
}
