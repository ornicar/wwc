var parisPoint =
  [
    48.8567,
    2.3508,
    0,
    0
  ];

if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
} else {

  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();
  document.body.style.backgroundImage = 'none'; // remove loading

  setTimeout(function() {
    addPoint(globe, parisPoint);
  }, 3000);
}

function addPoint(globe, point) {
  globe.addData(
    point,
    {
      format: 'magnitude',
      name: 'name',
      animated: true
    }
  );
  globe.createPoints();
}
