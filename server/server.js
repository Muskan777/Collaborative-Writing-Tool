const path = require("path");
var http = require("http");
var express = require("express");
let app = express();
var socketIO = require("socket.io");
var ipfsClient = require("ipfs-http-client");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var fs = require('fs');


const ipfs = new ipfsClient({host: 'localhost', port: '5001', protocol: 'http'});


app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// app.get("/", function(req,res) {
// 	res.render("home.ejs");
// });

// app.post('/upload', function(req,res) {
// 	const file = req.files.file;
// 	const fileName = req.body.fileName;
// 	const filePath = 'files/' + fileName; 
 
// 	file.mv(filePath, async(err) =>{
// 		if(err) {
// 			console.log("Error: Failed to download the file");
// 			return res.status(500).send(err);
// 		}
// 		const fileHash = await addFile(fileName, filePath);
// 		fs.unlink(filePath,(err) => {
// 			if(err) {
// 				console.log(err);
// 			}
// 		})
// 		res.render('upload', {fileName, fileHash});
// 	});
// })

// const addFile = async(fileName, filePath) => {
// 	const file = fs.readFileSync(filePath);
// 	const fileAdded = await ipfs.add({path:fileName, content:file});
// 	const fileHash = fileAdded[0].hash;

// 	return fileHash;
// }

const {generateMessage, generateLocationMessage} = require("./utils/message");

let server = http.createServer(app);

const port = process.env.PORT || 3000;

var publicPath = (path.join(__dirname, "../public"));
let io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", function(socket) {
	console.log("a new user connected");

	socket.emit("newMessage", generateMessage('Admin', "Welcome To The Collaborative Text Editor"));

	socket.broadcast.emit("newMessage",generateMessage('Admin', "New User Joined"));

	socket.on('createMessage', function(message, callback) {
		console.log('Created Message', message);
		io.emit("newMessage", generateMessage(message.from, message.text));
		callback("This is server");
	})

	socket.on('createLocationMessage', function(coords) {
		io.emit("newLocationMessage", generateLocationMessage("Admin", coords.lat, coords.lng));
	});

	socket.on("disconnect", function() {
		console.log("disconnected from user");
	})
})

server.listen(port, function() {
	console.log('Server is up on port ' + port);
})