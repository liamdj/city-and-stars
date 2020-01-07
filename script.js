var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	canvas.width = document.body.width;
	canvas.height = document.body.height;


var two = new Two({
          fullscreen: true
        }).appendTo(document.body);
      
      var electrons = [];
      var eCircs = [];
      
      var nucleous = new Point(width/2, height/2, 0, 0, 2000, 10);
      var cir = two.makeCircle(nucleous.pos.x, nucleous.pos.y, 10);
      cir.noStroke().fill = '#ff8000';
      
      for (var i = 0; i < 10; i++) {
        var px = (Math.random() + 4.5) * width / 10;
        var py = (Math.random() + 4.5) * height / 10;
        var vx = (Math.random() - 0.5) * width / 20;
        var vy = (Math.random() - 0.5) * height / 20;
        electrons[i] = new Point(px, py, vx, vy, 1, -1);
        var c = two.makeCircle(electrons[i].pos.x, electrons[i].pos.y, 5);
        c.noStroke().fill = '#ff0000';
        eCircs[i] = c;
      }

two.bind('update', function() {
            for (var i = 0; i < electrons.length; i++) {
              for (var j = i + 1; j < electrons.length; j++) {
                var force = Point.force(electrons[i], electrons[j]);
                electrons[i].applyForce(force);
                force.scale(-1);
                electrons[j].applyForce(force);
              }
              var force = Point.force(electrons[i], nucleous);
              console.log(electrons[i]);
              electrons[i].applyForce(force);
              force.scale(-1);
              nucleous.applyForce(force);
            }
            for (var i = 0; i < electrons.length; i++) {
              electrons[i].update(0.05);
              eCircs[i].translation.set(electrons[i].pos.x, electrons[i].pos.y);
            }
              nucleous.update(0.05);
              cir.translation.set(nucleous.pos.x, nucleous.pos.y);
          }).play() 