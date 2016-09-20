var http = require("http");
var io = require("socket.io");
var express = require("express");
var app = express();

var server=http.createServer(app);
server.listen(8000);
console.log("app is running at 8000");

app.use(express.static("./public"));

app.use(function(req,res,next){
	console.log("Request For " + req.url);
	next();
});

app.get("/",function(req,res){
	res.sendFile("index.html");
});

io=io.listen(server);

io.on("connection",function(socket){
	socket.on("room_redirection",function(room){
 	 	console.log("you have joined a " + room + "room"); 
	})
});
