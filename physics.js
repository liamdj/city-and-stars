class Vector {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
   add(v) {
    this.x += v.x;
    this.y += v.y;
  }
  
   sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }
  
   set(x, y) {
    this.x = x;
    this.y = y;
  }
  
  scale(c) {
    this.x *= c;
    this.y *= c;
  }
  
  lengthSquared() {
    return (this.x * this.x) + (this.y * this.y)
  }
  
  static sub(v, w) {
    return new Vector(v.x - w.x, v.y - w.y);
  }
  
  static scale(v, c) {
    return new Vector(v.x * c, v.y * c);
  }
}

class Point {
  
  constructor(px, py, vx, vy, m, c) {
    this.pos = new Vector(px, py);
    this.vel = new Vector(vx, vy);
    this.acc = new Vector(0, 0);
    this.mass = m;
    this.charge = c;
  }
  
  update(dt) {
    this.vel.add(Vector.scale(this.acc, dt));
    this.pos.add(Vector.scale(this.vel, dt));
    this.acc.set(0, 0);
  }
  
  applyForce(f) {
    f.scale(1 / this.mass);
    this.acc.add(f);
  }
  
  static force(p1, p2) {
    var v = Vector.sub(p1.pos, p2.pos);
    v.scale(1000 * p1.charge * p2.charge / Math.pow(v.lengthSquared(), 1.5));
    return v;
  }
}
