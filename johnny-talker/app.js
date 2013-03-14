
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express()
	, server = http.createServer(app)
	, io = io.listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {

	socket.on('sdpChannel',function(_data){
		var data = JSON.parse(_data);

		io.sockets.clients().forEach(function (sockete) {
			if (sockete != socket)
			{
				sockete.emit('sdpChannel', _data);
			}
		});
	});


	socket.on('iceChannel',function(_data){
		var data = JSON.parse(_data);

		io.sockets.clients().forEach(function (sockete) {
			if (sockete != socket)
			{
				sockete.emit('iceChannel', _data);
			}
		});
	});
});
