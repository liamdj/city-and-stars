class Light {
  constructor(two) {
    var radius = Math.max(two.width, two.height);
    this.aura = two.makeEllipse(two.width / 2, two.height / 2, radius);
    this.intensity = 0.2;
    this.s1 = new Two.Stop(0, 'rgb(255, 255, 230)', this.intensity);
    this.s2 = new Two.Stop(this.intensity, 'rgb(0, 0, 0)', 0);
    this.glow = two.makeRadialGradient(
          0, 0, radius,
          this.s1,
          this.s2
         );
    this.aura.noStroke().fill = this.glow;
    this.destination = new Two.Vector();
    this.mouse = new Two.Vector(two.width / 2, two.height / 2);
  }
  update(mouseX, mouseY, two) {
    this.destination.set(mouseX - two.width / 2, mouseY - two.height / 2);
        this.glow.center.addSelf(
              this.destination
                .subSelf(this.glow.center)
                .multiplyScalar(0.1)
            );
        this.aura.translation.addSelf(this.destination.multiplyScalar(0.1));
  }
  set brightness(intensity) {
    this.s1.opacity = intensity;
    this.s2.offset = intensity;
    this.intensity = intensity;
  }
  get brightness() {
    return this.intensity;
  }
}