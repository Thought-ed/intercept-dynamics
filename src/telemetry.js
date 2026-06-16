import { MU, EARTH_RADIUS } from './constants.js';

export function computeTelemetry(state) {
    const x = state.x;
    const y = state.y;
    const vx = state.vx;
    const vy = state.vy;

    const r = Math.sqrt(x*x + y*y);
    const v2 = vx*vx + vy*vy;

    const energy = (v2 / 2) - (MU / r);
    const h = x * vy - y * vx;

    const a = -MU / (2 * energy);

    const e = Math.sqrt(
        1 + (2 * energy * h * h) / (MU * MU)
    );

    const rp = a * (1 - e);
    const ra = a * (1 + e);

    const T = 2 * Math.PI * Math.sqrt((a * a * a) / MU);

    const vr = (x*vx + y*vy) / r;

    return {
        altitude: r - EARTH_RADIUS,
        speed: Math.sqrt(v2),
        energy,
        momentum: h,
        periapsis: rp - EARTH_RADIUS,
        apoapsis: ra - EARTH_RADIUS,
        period: T,
        vspeed: vr
    };
}