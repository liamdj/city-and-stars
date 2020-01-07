function footStep(parity, x, y, rotation, two) {
      var foot = two.makeGroup();
      var heel = two.makeCurve(8, 0, 3, -2, -3, -2, -8, 0, -6, 12, -3, 15, 0, 16, 3, 15, 6, 12, false);
      var top;
      if (parity == 'left') {
        top = two.makeCurve(0, -8, -8, -10, -10, -20, -10, -25, -8, -32, -2, -39, 8, -42, 13, -38, 15, -30, 15, -24, 13, -16, 9, -10, false);
      }
      else if (parity == 'right') {
         top = two.makeCurve(0, -8, 8, -10, 10, -20, 10, -25, 8, -32, 2, -39, -8, -42, -13, -38, -15, -30, -15, -24, -13, -16, -9, -10, false);
      }
      foot.add(heel, top);
      foot.scale = 0.15;
      foot.fill = 'black';
      foot.rotation = rotation;
      foot.translation.set(x, y);
      return foot;
} 