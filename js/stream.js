window.onload=function()
{
	rtc1 = new RTCPeerConnection();  // for caller
	rtc2 = new RTCPeerConnection();	 // for reciever
	if(rtc1)
	{
		start();
	}
	else
	{
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
	console.log("yes connect peer function has been called");

	send_channel= rtc1.createDataChannel("sendChannel");
	// rtc1.createOffer(description,handleCreateDescriptionError);
	
	rtc1.onicecandidate=function(e){
		rtc2.addIceCandidate(e.candidate);
	}

	rtc2.onicecandidate=function(e){
		rtc1.addIceCandidate(e.candidate);
	}

	rtc1.createOffer()
	    .then(offer => rtc1.setLocalDescription(offer))
	    .then(() => rtc2.setRemoteDescription(rtc1.localDescription))
	    .then(() => rtc2.createAnswer())
	    .then(answer => rtc2.setLocalDescription(answer))
	    .then(() => rtc1.setRemoteDescription(rtc2.localDescription))
	    .catch(function(err){console.log("error in answer")});
	rtc2.onaddstream=function(evt){
		console.log("yes something is happenning")
    	reciever_video.src = URL.createObjectURL(evt.stream);
    	reciever_video.play();
    }
}



function disconnect_peers()
{
	console.log("will disconnect later");
}


function live_stream() {
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	if(navigator.getUserMedia)
	{
		navigator.getUserMedia({
			video:{
				width:400,
				height:300
			},
			audio:false
		},function(stream){
			rtc1.addStream(stream);	
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
