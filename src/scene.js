import * as THREE from 'three';

export function createScene(scale) {
    const scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 22000 * scale;

    const camera = new THREE.OrthographicCamera(
        (frustumSize * aspect) / -2, // left
        (frustumSize * aspect) / 2,  // right
        frustumSize / 2,             // top
        frustumSize / -2,            // bottom
        -100000,                     // near
        100000                      // far
    );

    camera.position.z = 10000 * scale
    camera.lookAt(0, 0, 0);
    camera.position.x -= 65;
    camera.position.y -= -10;
 
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    document.body.appendChild(
        renderer.domElement
    );

    const earthGeometry =
        new THREE.SphereGeometry(
            6378 * scale,
            16,
            16
        );

    const earthMaterial = new THREE.MeshBasicMaterial({
        color: 0x80BCFF
    });

    const earth =
        new THREE.Mesh(
            earthGeometry,
            earthMaterial
        )

    scene.add(earth)

    return {
        renderer,
        camera,
        scene,
    };
}
