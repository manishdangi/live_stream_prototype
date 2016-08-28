window.onload=function()
{
	rtc1 = new RTCPeerConnection();  // for caller
	rtc2 = new RTCPeerConnection();	 // for reciever
	if(rtc1) {
		start();
	}
	else {
		alert("This Browser is not supporting the app");
	}
}

function start(){

	caller_video =document.getElementById("sender");
	reciever_video=document.getElementById("reciever")
	connect_button=document.getElementById("connect");
	disconnect_button=document.getElementById("disconnect");
	connect_button.addEventListener("click",connect_peers,false);
	disconnect_button.addEventListener("click",disconnect_peers,false);
	live_stream();
}
function connect_peers(){
	// send_channel= rtc1.createDataChannel("sendChannel");
	
	rtc1.onicecandidate=function(e){ // to add the reciever
		rtc2.addIceCandidate(e.candidate);
		console.log(e.candidate);
	}

	rtc2.onicecandidate=function(e){ // to add the caller
		rtc1.addIceCandidate(e.candidate);
	}

	rtc1.createOffer()
	    .then(offer => rtc1.setLocalDescription(offer))
	    .then(() => rtc2.setRemoteDescription(rtc1.localDescription))
	    .then(() => rtc2.createAnswer())
	    .then(answer => rtc2.setLocalDescription(answer))
	    .then(() => rtc1.setRemoteDescription(rtc2.localDescription))
	    .catch(function(err){console.log("error in answer")});
	rtc2.onaddstream=function(evt){ // when the reciever recieve the video stream
    	reciever_video.src = URL.createObjectURL(evt.stream);
    	reciever_video.play();
    }
}



function disconnect_peers()
{
	// will later define the function properly
	console.log("will disconnect later");
}


function live_stream() {
	navigator.getUserMedia = navigator.getUserMedia || 
			navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // getting the webcam video
	if(navigator.getUserMedia)
	{
		navigator.getUserMedia({
			video:{
				width:400, // width of screen
				height:300 // height of screen
			},
			audio:false // you can set it true
		},function(stream){
			rtc1.addStream(stream);	 // send the stream to reciever
			caller_video.src= URL.createObjectURL(stream);
			caller_video.play();
		},function(error){

		});
	}
	else
	{
		console.log("getUserMedia is not working");
	}
}
