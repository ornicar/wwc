var subgeo = new THREE.Geometry();

if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
} else {

  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();
  document.body.style.backgroundImage = 'none'; // remove loading

  addPoint(globe, 48.8567, 2.3508);
  addPoint(globe, 51.5062, 0.1275);
}

function addPoint(globe, lat, lon) {
  var size = 20;
  var color = { r: 1, g: 1, b: 0 };
  globe.addPoint(lat, lon, size, color, subgeo);
  globe._baseGeometry = subgeo;
  globe.createPoints();
}
