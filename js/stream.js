function streamLoadData(duration, callback) {
  var data = [];
  // var source = new EventSource("http://lichess.org/network/stream");
  var source = new EventSource("http://127.0.0.1:9876");
  source.addEventListener('message', function(e) {
    var raw = e.data.split('|');
    if (raw[7]) data.push({
      i: raw[0],
      e: raw[7],
      white: raw[6] === raw[6].toUpperCase()
    });
  });
  setTimeout(function() {
    source.close();
    callback(data);
  }, duration);
}
