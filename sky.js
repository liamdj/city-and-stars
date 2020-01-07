class Sky {
  
  constructor(two) {
        this.background = two.makeRectangle(two.width / 2, two.height / 2, two.width, two.height);
        this.topColor = { r: 1, g: 2, b: 3 };
        this.bottomColor = { r: 20, g: 40, b: 60 };
        this.s1 = new Two.Stop(0, Sky.colorToString(this.topColor), 1);
        this.s2 = new Two.Stop(1, Sky.colorToString(this.bottomColor), 1);
        this.background.noStroke().fill = two.makeLinearGradient(
          two.width / 2, - two.height / 2,
          two.width / 2, two.height / 2,
          this.s1, this.s2
        );
    
        this.stars = [];
        this.deletedStars = [];
        this.flickeringStars = new Set();
        this.starGroup = two.makeGroup();
        var random = [];
        for (var i = 0; i < two.width * two.height / 600; i++) {
          random[i] = Math.random();
        }
        random.sort();
        for (var i = random.length - 1; i >= 0; i--) {
          var r = random[i];
          this.stars.push(new Star(Math.random() * two.width, 
                              Math.random() * two.height,
                              2 + r * r * r * 3, 0.8 + r * 0.2,
                              this.s1, this.s2, two, this.starGroup));
        }  
      }
  
      update() {
        for (var k = 0; k < 3; k++) {
          var i = Math.floor(Math.random() * this.stars.length);
          this.stars[i].flicker();
          this.flickeringStars.add(this.stars[i]);
        }
        for ( var star of this.flickeringStars ) {
            if ( star.update() ) {
              this.flickeringStars.delete(star);
            }
        }
      }
  
      brighten(amount) {
        
        Sky.yellow(this.topColor, amount);
        Sky.yellow(this.bottomColor, amount);
        this.s1.color = Sky.colorToString(this.topColor);
        this.s2.color = Sky.colorToString(this.bottomColor);
        
        this.starGroup.opacity -= amount / 7;
        var threshold = (1 - this.starGroup.opacity) * 0.15;
        while (this.stars.length > 0 && this.stars[this.stars.length - 1].brightness - 0.8 < threshold) {
          var star = this.stars.pop();
          star.shape.remove();
          // this.deletedStars.push(star);
        }
      }
  
      restore() {
        this.s1.color = 'rgb(1, 2, 3)';
        this.s2.color = 'rgb(20, 40, 60)';
        var stars = this.stars;
        var group = this.starGroup;
        this.deletedStars.forEach( function(star) {
          stars.push(star);
          group.add(star.shape);
        });
        this.starGroup.opacity = 1;
      }
  
      static yellow(color, amount) {  
        color.r += 4 * amount;
        color.g += 4 * amount;
        color.b += amount;
      }
  
      static colorToString(color) {
        return 'rgb(' + Math.round(color.r) + ', '
        + Math.round(color.g) + ', ' + Math.round(color.b) + ')';
      }
}