  var socket = io.connect('http://localhost:3000');
  socket.on('newsChannel', function (data) {
    console.log(data);
  });
