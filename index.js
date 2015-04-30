if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
} else {

  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();
  document.body.style.backgroundImage = 'none'; // remove loading

  var subgeo = new THREE.Geometry();
  var subgeo1 = addPoint(globe, 48.8567, 2.3508, subgeo);
  var subgeo2 = addPoint(globe, 51.5062, 0.1275, subgeo1);
  globe._baseGeometry = subgeo2;
  globe.createPoints();
}

function addPoint(globe, lat, lon, subgeo) {
  var size = 100;
  var color = { r: 1, g: 1, b: 0 };
  globe.addPoint(lat, lon, size, color, subgeo);
  return subgeo;
}
