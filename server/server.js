const path = require("path");
var express = require("express");
var app = express();

const port = process.env.PORT || 3000;

var publicPath = (path.join(__dirname, "../public"));

app.use(express.static(publicPath));

app.listen(port, function() {
	console.log('Server is up on port ' + port);
})