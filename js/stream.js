window.onload=function()
{
	// var signalingChannel = new createSignalingChannel();
	rtc1 = new RTCPeerConnection();  // for caller
	rtc2 = new RTCPeerConnection();	 // for reciever
	if(rtc1) {
		start();
	}
	else {
		alert("This Browser is not supporting the app");
	}
}

var candidate_availibility=true;

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
	// the onicecandidate handler is called whenever a ice candidate is available at remote side
	rtc1.onicecandidate=function(e){
		if(e.candidate)
			{

				rtc2.addIceCandidate(e.candidate);
				console.log(e.candidate);
			}
		else {
			candidate_availibility=true;
		}	
	}

	// rtc1.onnegotiationneeded=function()	// when there is SignallingChannel is available  
	rtc1.createOffer(localdescription,logerror);


	rtc2.onaddstream=function(evt){ // when the reciever recieve the video stream
    	reciever_video.src = URL.createObjectURL(evt.stream);
    	reciever_video.play();
    }

}


function localdescription(desc)
{
	rtc1.setLocalDescription(desc).then(function(){
		rtc2.setRemoteDescription(rtc1.localDescription).then(function(){
			rtc2.createAnswer(remotedescription,logerror);
		})
	})
}

function remotedescription(desc){
	rtc2.setLocalDescription(desc).then(function(){
		rtc1.setRemoteDescription(rtc2.localDescription)
	})
}

function logerror()
{
	console.log("yes there is an error by logerror function")
}

function disconnect_peers()
{
	// will later define the function properly
	console.log("will disconnect later");
	// rtc2=false;
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
			if(candidate_availibility==true)
			{		
				rtc1.addStream(stream); // send the stream to reciever
 			}	 
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
