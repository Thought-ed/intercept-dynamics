import { panSpeed } from "./constants";
export function initializeCameraControls(camera, renderer) {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const canvas = renderer.domElement;

    canvas.addEventListener("mousedown", (e) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
        dragging = false
    });

    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        
        camera.position.x -= dx * panSpeed / camera.zoom;
        camera.position.y += dy * panSpeed / camera.zoom;

        lastX = e.clientX;
        lastY = e.clientY;
    });

    canvas.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                camera.zoom *= 1.1;}
            else {
                camera.zoom /= 1.1;
            
            }

            camera.zoom = Math.max(
                0.1,
                Math.min(camera.zoom, 50),
            );

            camera.updateProjectionMatrix();
            },
            { passive: false },
    );
}