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
        },

        vertexShader: `
            varying vec3 vNormal;

            void main() {
                vNormal = normalize(normalMatrix * normal);

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

            varying vec3 vNormal;

            void main() {

                float NdotL = dot(
                    normalize(vNormal),
                    normalize(sunDirection)
                );

                vec3 color = (NdotL > 0.0) ? dayColor : nightColor;

                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });

    return earthMaterial;
}