const path = require("path");
var http = require("http");
var express = require("express");
let app = express();
var socketIO = require("socket.io");
var bodyParser = require("body-parser");
let server = http.createServer(app);
var formidable = require('formidable');
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user.js");

//APP CONFIG
app.use(require("express-session")({
	secret: "Rusty is the best and cutest dog in the world",
	resave:false,
	saveUninitialized: false
}))

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.connect("mongodb://localhost/Collaborative_text_editor_App");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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
	res.redirect("/login");
})

//show signup form
app.get('/login', function(req,res) {
	res.render("login.ejs");
});

//login POST route
app.post("/login", passport.authenticate("local",{
	successRedirect: "/open",
	failureRedirect: "/login"
}),function(req,res){
	
})

//show signup form
app.get('/register', function(req,res) {
	res.render("register.ejs");
});

//handling user sign up
app.post("/register", function(req,res) {
	User.register(new User({username:req.body.username}), req.body.password, function(err,user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}		
		passport.authenticate("local")(req,res,function(){
			res.redirect("/open");
		});
	})
})

app.get("/open",isLoggedIn,function(req,res) {
	res.render("index.ejs");
})

app.get('/share', function(req,res) {
	res.render("share.ejs");
})

app.get('/upload', function(req,res) {
	res.render("upload.ejs");
})

app.post('/fileupload', function(req,res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, field) {
     	console.log(fields);
     	console.log(files);
   })
})


app.get('/new', function(req,res) {
	res.render("new.ejs");
})

app.get("/logout",function(req,res) {
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

server.listen(3000, function() {
	console.log('Server is up on port 3000');
})
