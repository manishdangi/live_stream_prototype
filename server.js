var http = require("http");
var socket= require("socket.io");
var express = require("express");
var app = express();

var server=http.createServer(app);
server.listen(8000,function(){console.log("app is running at 8000")});

app.use(express.static("./public"));

app.get("/",function(req,res){
	res.sendFile("index.html");
})