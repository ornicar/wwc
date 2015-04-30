var subgeo = new THREE.Geometry();
var col = { r: 1, g: 1, b: 0 };
var oCol = { r: 0.5, g: 0.5, b: 0.8 };

if(!Detector.webgl) {
  Detector.addGetWebGLMessage();
} else if(!window.EventSource) {
  console.log('Event source is not available.');
} else {
  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  globe.animate();

  var source = new EventSource("http://en.lichess.org/network/stream");

  source.addEventListener('message', function(e) {
    var lichessEvent = parseLichessEvent(e.data);
    console.log(lichessEvent);
    addPoint(globe, lichessEvent.lat, lichessEvent.lon, col);
    addPoint(globe, lichessEvent.oLat, lichessEvent.oLon, oCol);
  });
}

function addPoint(globe, lat, lon, color) {
  var size = 20;
  globe.addPoint(lat, lon, size, color, subgeo);
  globe._baseGeometry = subgeo;
  globe.createPoints();
}

function parseLichessEvent(data) {
  var raw = data.split('|');
  var result = {
    country: raw[0],
    lat: parseFloat(raw[1]),
    lon: parseFloat(raw[2]),
    oLat: parseFloat(raw[3]),
    oLon: parseFloat(raw[4])
  };
  result.lat += Math.random() - 0.5;
  result.lon += Math.random() - 0.5;
  return result;
}
