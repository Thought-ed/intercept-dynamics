import * as THREE from "three";

export function createEarthMaterial() {
	const earthMaterial = new THREE.ShaderMaterial({
		uniforms: {
			sunDirection: {
				value: new THREE.Vector3(1, 0, 0).normalize(),
			},
			dayColor: {
				value: new THREE.Color(0x80bcff),
			},
			nightColor: {
				value: new THREE.Color(0x4f78a8),
			},
            terminatorWidth: {
                value: 0.15,
            }
		},

		vertexShader: `
    varying vec3 vWorldNormal;
    attribute float faceRandom;
    varying float vFaceRandom;

    void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vFaceRandom = faceRandom;

        gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
    }
`,

		fragmentShader: `
    uniform vec3 sunDirection;
    uniform vec3 dayColor;
    uniform vec3 nightColor;
    uniform float terminatorWidth;

    varying vec3 vWorldNormal;
    varying float vFaceRandom;

    void main() {
        float NdotL = dot(
            normalize(vWorldNormal),
            normalize(sunDirection)
        );

        float t = smoothstep(-terminatorWidth, terminatorWidth, NdotL);

        vec3 base = mix(nightColor, dayColor, t);
        vec3 color = base * (0.85 + vFaceRandom * 0.3);

        gl_FragColor = vec4(color, 1.0);
    }
`,
	});

	return earthMaterial;
}
