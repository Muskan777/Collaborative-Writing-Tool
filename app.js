const path = require("path");
var http = require("http");
var express = require("express");
let app = express();
var socketIO = require("socket.io");
var bodyParser = require("body-parser");
let server = http.createServer(app);

app.use(bodyParser.urlencoded({extended:true}));

var publicPath = (path.join(__dirname, "/views"));
const {generateMessage, generateLocationMessage} = require("./utils/message");
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", function(socket) {
	console.log("a new user connected");

	socket.on('createMessage', function(message) {
		socket.broadcast.emit("newMessage", message);
	})

	socket.emit("NMessage", generateMessage('Admin', "Welcome To The Collaborative Text Editor"));

	socket.broadcast.emit("NMessage",generateMessage('Admin', "New User Joined"));

	socket.on('CMessage', function(message, callback) {
		console.log('Created Message', message);
		io.emit("NMessage", generateMessage(message.from, message.text));
		callback("This is server");
	})

	socket.on('createLocationMessage', function(coords) {
		io.emit("newLocationMessage", generateLocationMessage("Admin", coords.lat, coords.lng));
	});

	socket.on("disconnect", function() {
		console.log("disconnected from user");
	})
})


app.get('/', function(req,res) {
	res.render("index.ejs");
})

app.get("/login", function(req,res) {
	res.render("login.ejs");
})

server.listen(3000, function() {
	console.log('Server is up on port 3000');
})
