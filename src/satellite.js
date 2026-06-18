export class Satellite {
	constructor(x, y, z, vx, vy, vz) {
		this.x = x;
		this.z = z;
        this.y = y;

		this.vx = vx;
		this.vz = vz;
        this.vy = vy;

		this.angle = 0;
		this.omega = 0;
	}
}
