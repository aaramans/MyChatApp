var express = require('express'),
	app = express(),
	jade = require('jade'),
	bodyParser = require('body-parser'),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	jsonParser = bodyParser.json(),
	clients = 0;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(jsonParser);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home.jade');
});

app.post('/login', function(req, res){
	console.log("login:::req.body:::", req.body);
	if(req.body && req.body.uName && req.body.pwd){
		res.send({status:true, response:"Login successfull"});
	}else{
		res.send({status:false, response:"Please send a valid detail"});
	}
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
});

server.listen(3000, function() {
    console.log('Environment = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
    console.log('Express server listening on port ' + 3000);
});