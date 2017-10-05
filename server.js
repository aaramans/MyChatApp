var express = require('express'),
	app = express(),
	jade = require('jade'),
	bodyParser = require('body-parser'),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

	var clients = 0;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home.jade');
});

io.sockets.on('connection', function (socket) {
	clients++;
	io.sockets.emit('noOfUsers',{ description: clients + ' user(s) online!'});

	socket.on('disconnect', function(){
		clients--;
		io.sockets.emit('noOfUsers',{ description: clients + ' user(s) online!'});
	});

	socket.on('message', function(msg){
		console.log('message: ' + msg);
		socket.broadcast.emit('message', msg);
	});



    /*socket.on('setPseudo', function (data) {
		console.log("data::---::",data);
		socket.set('pseudo', data);
	});

	socket.on('message', function (message) {
		console.log("message::---::",message);
		socket.get('pseudo', function (error, name) {
			console.log("error::---::",error);
			console.log("name::---::",name);
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});*/
});

server.listen(3000, function() {
    console.log('Environment = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
    console.log('Express server listening on port ' + 3000);
});
