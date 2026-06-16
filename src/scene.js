import * as THREE from 'three';

export function createScene(scale) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    camera.position.z = 20000 * scale
    
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
    
    return{
        renderer,
        camera,
        scene,
    };
}
