class Star {
         
       constructor(x, y, r, b, s1, s2, two, group) {
         this.shape = two.makeEllipse(x, y, r, r);
         this.brightness = b;
         this.height = y / two.height;
         this.shape.noStroke().fill = two.makeRadialGradient(
          0, 0, r,
          new Two.Stop(0.05, 'rgb(230, 255, 255)', this.brightness),
          new Two.Stop(1, calcColor(s1, s2, this.height), 0)
         );
         group.add(this.shape);
         this.center = this.shape.fill.stops[0];
         this.edge = this.shape.fill.stops[1];
       }
  
    flicker() {
      this.center.opacity = this.brightness * 0.5;
    }
         
     update() {
       if (this.center.opacity < this.brightness) {
         this.center.opacity += this.brightness * 0.03;
         return false;
       }
       return true;
    }
}

function calcColor(stop1, stop2, offset) {
        var col1 = tinycolor(stop1.color).toRgb(), col2 = tinycolor(stop2.color).toRgb();
        var diff = stop2.offset - stop1.offset;
        var weight1 = (stop2.offset - offset) / diff, weight2 = (offset - stop1.offset) / diff;
        return 'rgb(' + avg(weight1, col1.r, weight2, col2.r) + ', ' 
                      + avg(weight1, col1.g, weight2, col2.g) + ', '
                      + avg(weight1, col1.b, weight2, col2.b) + ')';
          
        function avg(w1, c1, w2, c2) {
          return Math.round(w1 * c1 + w2 * c2);
        }
}