const xUnit = 8 * Math.sqrt(3);
const yUnit = 8;
const brightenAmount = 0.1;

class City { 
  
  constructor(centerX, centerY, two, sky, light) {

    this.two = two;
    this.sky = sky;
    this.light = light;
    this.hasEnded = false;
    this.time = 0;
    const color = {
      top: 'rgb(100, 100, 120)',
      right: 'rgb(70, 70, 90)',
      left: 'rgb(40, 40, 60)',
      rungRight: 'rgb(10, 10, 0)',
      rungLeft: 'rgb(40, 40, 30)',
      windowRight: 'rgb(40, 40, 40)',
      windowLeft: 'rgb(10, 10, 10)',
      skyUpper: calcColor(sky.s1, sky.s2, 0.4),
      skyLower: calcColor(sky.s1, sky.s2, 0.6)
    }
    const opac = 0.9;
    const maxHeight = 8;
    
    const xUnit = 8 * Math.sqrt(3);
    const yUnit = 8;
    const x = [ -16,-15, 0,-1, 15, 16, 1, 16, 15, 0,
               -15,-16,-16,-16,-2, 2, 16, 16, 16, 15,
               0,-15,-16,-9,-7,-9, 9, 7, 9,-8,
               -8, 8, 8, 7, 8,-7,-8 ]
    .map(function(x) { return x * xUnit });
    const y = [ -16,-17,-2,-1,-17,-16,-1, 14, 15, 0,
               15, 14,-16,-14, 0, 0,-14,-16, 16, 17, 
               2, 17, 16,-7,-7,-5,-7,-7,-5,-8,
               -6,-8,-6,-5,-4,-5,-4 ]
    .map(function(y) { return y * yUnit });
    
    
      
      
    this.allShapes = two.makeGroup();

    var top = two.makeGroup();
    var t1 = rect([0, 1, 2, 3]);
        t1.fill = two.makeLinearGradient(
          8 * xUnit, 8 * yUnit, -8 * xUnit, -8 * yUnit,
          new Two.Stop(0.5, color.top, 1),
          new Two.Stop(1, color.skyUpper, 0)
        );
    var t2 = rect([2, 4, 5, 6]);
    t2.fill = two.makeLinearGradient(
          -8 * xUnit, 8 * yUnit, 8 * xUnit, -8 * yUnit,
          new Two.Stop(0.5, color.top, 1),
          new Two.Stop(1, color.skyUpper, 0)
        );
    var t3 = rect([6, 7, 8, 9]);
    t3.fill = two.makeLinearGradient(
          -8 * xUnit, -8 * yUnit, 8 * xUnit, 8 * yUnit,
          new Two.Stop(0.5, color.top, 1),
          new Two.Stop(1, color.skyLower, 0)
        );
    var t4 = rect([9, 10, 11, 3]);
    t4.fill = two.makeLinearGradient(
          8 * xUnit, -8 * yUnit, -8 * xUnit, 8 * yUnit,
          new Two.Stop(0.5, color.top, 1),
          new Two.Stop(1, color.skyLower, 0)
        );
    var t5 = rect([2, 3, 9, 6]);
    t5.fill = color.top;
    top.add(t1, t2, t3, t4, t5);
    top.noStroke();

    var right = two.makeGroup();
    var r1 = rect([15, 16, 17, 6]);
    r1.fill = two.makeLinearGradient(
          -8 * xUnit, 8 * yUnit, 8 * xUnit, -8 * yUnit,
          new Two.Stop(0.5, color.right, 1),
          new Two.Stop(1, color.skyUpper, 0)
        );
    var r2 = rect([20, 21, 10, 9]);
    r2.fill = two.makeLinearGradient(
          8 * xUnit, -8 * yUnit, -8 * xUnit, 8 * yUnit,
          new Two.Stop(0.5, color.right, 1),
          new Two.Stop(1, color.skyLower, 0)
        );
    var r3 = rect([18, 19, 8, 7]);
    r3.fill = color.right;
    r3.opacity = 0.05;
    right.add(r1, r2, r3);
    right.noStroke();

    var left = two.makeGroup();
    var l1 = rect([12, 13, 14, 3]);
    l1.fill = two.makeLinearGradient(
          8 * xUnit, 8 * yUnit, -8 * xUnit, -8 * yUnit,
          new Two.Stop(0.5, color.left, 1),
          new Two.Stop(1, color.skyUpper, 0)
        );
    var l2 = rect([19, 20, 9, 8]);
    l2.fill = two.makeLinearGradient(
          -8 * xUnit, -8 * yUnit, 8 * xUnit, 8 * yUnit,
          new Two.Stop(0.5, color.left, 1),
          new Two.Stop(1, color.skyLower, 0)
        );
    var l3 = rect([11, 10, 21, 22]);
    l3.fill = color.left
    l3.opacity = 0.05;
    left.add(l1, l2, l3);
    left.noStroke();
    
    // to create depth
    this.back = two.makeGroup();
    this.back.add(t1, t2, r1, l1);
    this.front = two.makeGroup();
    this.front.add(t3, t4, t5, r2, l2, r3, l3);
    this.back.opacity = this.front.opacity = 0;

    this.partyWindows = [];
    this.tower = {
      containerGroup : two.makeGroup(),
      right: {
        moving: false,
        startFrame: 0,
        topGroup: two.makeGroup(),
        max: maxHeight,
        ladder: {
          arr: [],
          index: 0,
          height: maxHeight
        }
      },
      left: { 
        moving: false,
        startFrame: 0,
        topGroup: two.makeGroup(),
        max: maxHeight,
        ladder: {
          arr: [],
          index: 0,
          height: maxHeight
        }
      }
    };
    this.tower.right.topGroup.addTo(this.tower.containerGroup);
    this.tower.left.topGroup.addTo(this.tower.containerGroup);
        
    this.rungsToUpdate = [];
    function rung(line) {
      return {
        start1: line.vertices[1].y,
        start2: line.vertices[2].y,
        anchor1: line.vertices[1],
        anchor2: line.vertices[2],
        startFrame: 0
      }
    }
    
    var partyWindows = this.partyWindows;
    var ladderRight = this.tower.right.ladder;
    var ladderLeft = this.tower.left.ladder;
    
    this.tower.right.createBlock = function() {
        var group = two.makeGroup();
        var t = rect([31, 27, 32, 26]);
        t.fill = color.top;
        var r = rect([32, 26, 28, 34]);
        r.fill = color.right;
        var l = rect([27, 32, 34, 33]);
        l.fill = color.left;
        group.add(t, r, l);
        group.noStroke().opacity = opac;
        var x1 = x[26] - 0.2 * xUnit;
        var x2 = x[26] - 0.8 * xUnit;
        var window = two.makePath( x1, y[26] + 0.5 * yUnit,
                                   x1, y[26] + 1.9 * yUnit,
                                   x2, y[26] + 2.5 * yUnit,
                                   x2, y[26] + 1.1 * yUnit, false);
        makeWindowLight(window, partyWindows);
        window.stroke = color.windowRight;
        group.add(window);
        for (var i = 2; i > 0; i--) {
          var line = two.makeCurve(x[27] + 0.25 * xUnit, y[27] + 0.85 * i * yUnit,
                                   x[27] + 0.45 * xUnit, y[27] + (0.85 * i + 0.2) * yUnit,
                                   x[27] + 0.55 * xUnit, y[27] + (0.85 * i + 0.3) * yUnit,
                                   x[27] + 0.75 * xUnit, y[27] + (0.85 * i + 0.5) * yUnit, true);
          line.noFill().stroke = color.rungRight;
          ladderRight.arr.push(rung(line));
          group.add(line);
        }
        return group;
      };
      this.tower.left.createBlock = function() {
        var group = two.makeGroup();
        var t = rect([29, 24, 30, 23]);
        t.fill = color.top;
        var r = rect([24, 30, 36, 35]);
        r.fill = color.right;
        var l = rect([23, 30, 36, 25]);
        l.fill = color.left;
        group.add(t, r, l);
        group.noStroke().opacity = opac;
        var x1 = x[23] + 0.2 * xUnit;
        var x2 = x[23] + 0.8 * xUnit;
        var window = two.makePath( x1, y[23] + 0.5 * yUnit,
                                   x1, y[23] + 1.9 * yUnit,
                                   x2, y[23] + 2.5 * yUnit,
                                   x2, y[23] + 1.1 * yUnit, false);
        makeWindowLight(window, partyWindows);
        window.stroke = color.windowLeft;
        group.add(window);
        for (var i = 2; i > 0; i--) {
          var line = two.makeCurve(x[24] - 0.25 * xUnit, y[24] + 0.85 * i * yUnit,
                                   x[24] - 0.45 * xUnit, y[24] + (0.85 * i + 0.2) * yUnit,
                                   x[24] - 0.55 * xUnit, y[24] + (0.85 * i + 0.3) * yUnit,
                                   x[24] - 0.75 * xUnit, y[24] + (0.85 * i + 0.5) * yUnit, true);
          line.noFill().stroke = color.rungRight;
          ladderLeft.arr.push(rung(line));
          group.add(line);
        }
        return group;
      };
    
    this.footPrints = [];
    this.turnSteps = 0;
    this.onRight = true;
    this.toAdd = false;
    this.feet = {
      pos: 'right path',
      right: { 
        shape: footStep('right', -14.7 * xUnit, -15.3 * yUnit, 0.7 * Math.PI, two),
        x: -14.7, y: -15.3
      },
      left: { 
        shape: footStep('left', -15 * xUnit, -16.4 *yUnit, 0.7 * Math.PI, two),
        x: -15, y: -16.4
        }
      }
    var feet = this.feet;
    this.feet.right.step = function(direction) {
          return footStep('right', feet.right.x * xUnit, feet.right.y * yUnit, direction, two);
        }
    this.feet.left.step = function(direction) {
          return footStep('left', feet.left.x * xUnit, feet.left.y * yUnit, direction, two);
    }
    
    this.allShapes.add(this.back);
    this.allShapes.add(this.tower.containerGroup);
    this.allShapes.add(this.front);
    this.allShapes.add(this.feet.right.shape, this.feet.left.shape);
    this.cy = centerY;
    this.allShapes.translation.set(centerX, centerY);
    
    function rect(arr) {
       return two.makePath(x[arr[0]], y[arr[0]], x[arr[1]], y[arr[1]], x[arr[2]], y[arr[2]], x[arr[3]], y[arr[3]], false);
    }
    
    function makeWindowLight(window, arr) {
      var r = Math.random();
      if (r < 0.75) {
        window.fill = two.makeRadialGradient(
          0, 0, xUnit * (0.6 + 1.5 * r),
          new Two.Stop(0, 'rgb(255, 255, 200)', 1),
          new Two.Stop(1, 'rgb(0, 0, 0)', 1)
         );
        return;
      }
      if (r < 0.95) {
        window.fill = two.makeRadialGradient(
          0, 0, xUnit * 2,
          new Two.Stop(0, 'rgb(100, 100, 100)', 1),
          new Two.Stop(1, 'rgb(0, 0, 0)', 1)
         );
        return;
      }
      window.fill = two.makeRadialGradient(
          0, 0, xUnit * 2,
          new Two.Stop(0.1, City.pickColor(), 1),
          new Two.Stop(1, 'rgb(0, 0, 0)', 1)
         );
      arr.push(window);
    }
  }
  
   static pickColor() {
      var r = Math.round(Math.random() * 155);
      return 'rgb(' + (100 + r) + ', ' + (100) + ', ' + (255 - r) + ')';
    }
  
  update(realFrameCount, paused) {
      if (!paused)
        this.pausableUpdate(realFrameCount);
      this.continuousUpdate(realFrameCount);
  }
  
  pausableUpdate(realFrameCount) {
    var frameCount = this.time;
    this.allShapes.translation.y = this.cy + 3 * Math.sin(frameCount * Math.PI / 100);
    this.partyWindows.forEach( function(window) {
       if (frameCount % 30 == 0) {
          window.fill.stops[0].color = City.pickColor();
        }
    });
    this.updateWalker(frameCount, realFrameCount);
    this.updateRungs(frameCount);
    this.time++;
  }
  
  continuousUpdate(realFrameCount) {
    this.updateLadder('right', realFrameCount);
    this.updateLadder('left', realFrameCount);
    this.updateFootPrints();
  }
  
  updateWalker(frameCount, realFrameCount) {
    if (frameCount % 10 == 0) {
      if (this.feet.pos == 'right path') {
        var foot;
        if (this.toAdd) {
          this.addBlock('left', realFrameCount);
          this.toAdd = false;
        }
        if (this.onRight)
          foot = this.feet.left;
        else 
          foot = this.feet.right;
        this.onRight = !this.onRight;
        
        this.footPrints.push(foot.shape);
        foot.x += 1.2, foot.y += 1.2;
        if (foot.x > this.tower.right.ladder.height) {
          this.feet.pos = 'right ladder';
          foot.shape = foot.step(0.5 * Math.PI);
        }
        else {
          foot.shape = foot.step(0.7 * Math.PI);
        }
        this.allShapes.add(foot.shape);
      }
      else if (this.feet.pos == 'left path') {
        var foot;
        if (this.toAdd) {
          this.addBlock('right', realFrameCount);
          this.toAdd = false;
        }
        if (this.onRight)
          foot = this.feet.left;
        else 
          foot = this.feet.right;
        this.onRight = !this.onRight;
        
        this.footPrints.push(foot.shape);
        foot.x -= 1.2, foot.y += 1.2;
        if (-foot.x > this.tower.left.ladder.height) {
          this.feet.pos = 'left ladder';
          foot.shape = foot.step(1.5 * Math.PI);
        }
        else {
          foot.shape = foot.step(1.3 * Math.PI);
        }
        this.allShapes.add(foot.shape);
      }
      else if (this.feet.pos == 'top right') {
        var foot;
        var offset = this.tower.right.ladder.height - 7;
        if (this.turnSteps == 3) {
          foot = this.feet.left;
          this.footPrints.push(foot.shape);
          foot.x = 6.7 + offset, foot.y = -7.3 - offset;
          foot.shape = foot.step(1.3 * Math.PI);
          this.feet.pos = 'left path';
          this.turnSteps = 0;
          this.onRight = false;
          this.toAdd = true;
        }
        else {
          if (this.turnSteps == 0) {
             foot = this.feet.right;
             foot.x = 8 + offset, foot.y = -6.8 - offset;
             foot.shape = foot.step(0);
          }
          else if (this.turnSteps == 1) {
            foot = this.feet.left;
            foot.x = 7.5 + offset, foot.y = -7.4 - offset;
            foot.shape = foot.step(1.6 * Math.PI);
          }
          else if (this.turnSteps == 2) {
            foot = this.feet.right;
            this.footPrints.push(foot.shape);
            foot.x = 7 + offset, foot.y = -8.4 - offset;
            foot.shape = foot.step(1.4 * Math.PI);
          }
          this.turnSteps++;
        }
        this.allShapes.add(foot.shape);
      }
      else if (this.feet.pos == 'top left') {
        var foot;
        var offset = this.tower.left.ladder.height - 7;
        if (this.turnSteps == 3) {
          foot = this.feet.right;
          this.footPrints.push(foot.shape);
          foot.x = -6.7 - offset, foot.y = -7.3 - offset;
          foot.shape = foot.step(0.7 * Math.PI);
          this.feet.pos = 'right path';
          this.turnSteps = 0;
          this.onRight = true;
          this.toAdd = true;
        }
        else {
          if (this.turnSteps == 0) {
             foot = this.feet.left;
             foot.x = -8 - offset, foot.y = -6.8 - offset;
             foot.shape = foot.step(0);
          }
          else if (this.turnSteps == 1) {
            foot = this.feet.right;
            foot.x = -7.5 - offset, foot.y = -7.4 - offset;
            foot.shape = foot.step(0.4 * Math.PI);
          }
          else if (this.turnSteps == 2) {
            foot = this.feet.left;
            this.footPrints.push(foot.shape);
            foot.x = -7 - offset, foot.y = -8.4 - offset;
            foot.shape = foot.step(0.6 * Math.PI);
          }
          this.turnSteps++;
        }
        this.allShapes.add(foot.shape);
      }
      else {
        var ladder;
        if (this.feet.pos == 'right ladder') {
          ladder = this.tower.right.ladder;
          if (ladder.index == 0) {
            this.footPrints.push(this.feet.left.shape);
            this.footPrints.push(this.feet.right.shape);
          }
          if (ladder.height == 1) {
            this.feet.pos = 'top right';
            ladder.index = -1;
          }
          else if (ladder.index == 4 * ladder.height - 8) {
            this.jiggle(ladder.arr[2 * ladder.height - 4], frameCount);
            this.feet.pos = 'top right';
            ladder.index = -1;
          }
        }
        
        if (this.feet.pos == 'left ladder') {
          ladder = this.tower.left.ladder;
          if (ladder.index == 0) {
            this.footPrints.push(this.feet.right.shape);
            this.footPrints.push(this.feet.left.shape);
          }
          if (ladder.height == 1) {
            this.feet.pos = 'top left';
            ladder.index = -1;
          }
          else if (ladder.index == 4 * ladder.height - 8) {
            this.jiggle(ladder.arr[2 * ladder.height - 4], frameCount);
            this.feet.pos = 'top left';
            ladder.index = -1;
          }
        }
        
        if (ladder.index >= 0)  { 
          if (ladder.index % 2 == 0)
            this.jiggle(ladder.arr[ladder.index / 2 + 2], frameCount);
          else 
            this.jiggle(ladder.arr[(ladder.index - 1) / 2], frameCount);
        }
        ladder.index++;
      }
    } 
  }
  updateFootPrints() {
    var i = 0;
    while (i < this.footPrints.length) {
      var foot = this.footPrints[i];
      foot.opacity -= 0.01;
      if (foot.opacity <= 0) {
        this.two.remove(foot);
        this.footPrints.splice(i, 1);
      }
      else i++;
    }  
  }
  
  addBlock(parity, frameCount) {
    this.sky.brighten(brightenAmount);
    this.light.brightness += 0.002;
     var tower;
     if (parity == 'right') {
      tower = this.tower.right;
     }
     else if (parity == 'left') {
      tower = this.tower.left;
     }
     var block = tower.createBlock();
     block.opacity = 0.01;
     tower.topBlock = block;
     tower.moving = true;
     tower.startFrame = frameCount;
     if (tower.max == tower.ladder.height) {
       if (tower.max == 1) {
         this.end();
       }
       tower.max--;
       tower.ladder.height = 1;
       tower.ladder.arr = [];
       tower.currentGroup = this.two.makeGroup();
       tower.currentGroup.addTo(this.tower.containerGroup);
       tower.topGroup = this.two.makeGroup();
       tower.topGroup.addTo(tower.currentGroup);
     }
     else {
       tower.ladder.height++;
     }
     tower.currentGroup.add(block);
  }
  
  updateLadder(parity, frameCount) {
    var tower;
    var xDir;
    if (parity == 'right') {
      tower = this.tower.right;
      xDir = 1;
    }
    else if (parity == 'left') {
      tower = this.tower.left;
      xDir = -1;
    }
    if (tower.moving) {
      var t = 0.04 * (frameCount - tower.startFrame);
      var offset = tower.ladder.height - 8;
      if (t > 1) {
        tower.currentGroup.translation.set(xUnit * xDir * (1 + offset), yUnit * (-1 - offset));
        tower.topGroup.translation.y = 16;
        tower.topBlock.opacity = 1;
        var nextGroup = this.two.makeGroup();
        nextGroup.addTo(tower.currentGroup);
        tower.topGroup.addTo(nextGroup);
        nextGroup.add(tower.topBlock);
        tower.topGroup = nextGroup;
        tower.moving = false;
      }
      else {
        tower.currentGroup.translation.set(xUnit * xDir * (t + offset), yUnit * (-t - offset));
        tower.topGroup.translation.y = -16 * Math.pow(Math.E, -t) * Math.cos(1.5 * Math.PI * t) + 16;
        tower.topBlock.opacity = t;
      }
    }
    
  }
  
  updateRungs(frameCount) {
    var i = 0;
    while (i < this.rungsToUpdate.length) {
      var rung = this.rungsToUpdate[i];
      var t = 0.05 * (frameCount - rung.startFrame);
      if (t > 1)
        this.rungsToUpdate.splice(i, 1);
      else {
        var oscil = 3 * Math.pow(Math.E, -t) * Math.sin(4 * Math.PI * t);
        rung.anchor1.y = rung.start1 + oscil;
        rung.anchor2.y = rung.start2 + oscil;
        i++;
      }
    }
  }
  
  jiggle(rung, frameCount) {
    rung.startFrame = frameCount;
    this.rungsToUpdate.push(rung);
  }
  
  end() {
    var that = this;
    that.two.bind('update', function() {
      that.allShapes.opacity -= 0.005;
      that.light.brightness -= 0.002;
      if (that.allShapes.opacity <= 0) {
        that.hasEnded = true;
        that.two.remove(that.allShapes);
      }
    });
  }
}  
