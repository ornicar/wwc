if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
} else {

  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();
  document.body.style.backgroundImage = 'none'; // remove loading

  addPoint(globe, 48.8567, 2.3508);
  // addPoint(globe, 51.5062, 0.1275);
  globe.createPoints();
}

function addPoint(globe, lat, lon) {
  globe.is_animated = false;
  var subgeo = new THREE.Geometry();
  var color = { r: 1, g: 1, b: 0 };
  var size = 200;
  globe.addPoint(lat, lon, size, color, subgeo);
  globe._baseGeometry = subgeo;
}
