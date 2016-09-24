// var room_no=document.getElementById("room_no").value;
// alert(room_no);

var room = location.search && location.search.split('?')[1];
document.write(room);
var webrtc = new SimpleWebRTC({
	// the id/element dom element that will hold "our" video			  
	localVideoEl: 'localVideo',
	// the id/element dom element that will hold remote videos
	remoteVideosEl: '',
	// immediately ask for camera access
        autoRequestMedia: true,
       	debug: false,
        detectSpeakingEvents: true,
 		autoAdjustMic: false
	// url: '127.0.0.1:8000?room_no=123'
	});

	webrtc.on('readyToCall', function () {
        // you can name it anything
        if (room) 
        {
        	webrtc.joinRoom(room);
        }
    });

    webrtc.on('localStream', function (stream) {
        var button = document.querySelector('form>button');
        if (button) 
        {
       		button.removeAttribute('disabled');
        }		
        $('#localVolume').show();
    });

    function showVolume(el, volume) 
    {
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
    }

    webrtc.on('localMediaError', function (err) {
        });

            // a peer video has been added
            webrtc.on('videoAdded', function (video, peer) {
                console.log('video added', peer);
                var remotes = document.getElementById('remotes');
                if (remotes) {
                    var container = document.createElement('div');
                    container.className = 'videoContainer';
                    container.id = 'container_' + webrtc.getDomId(peer);
                    container.appendChild(video);

                    // suppress contextmenu
                    video.oncontextmenu = function () { return false; };

                    // resize the video on click
                    video.onclick = function () {
                        container.style.width = video.videoWidth + 'px';
                        container.style.height = video.videoHeight + 'px';
                    };

                    // show the remote volume
                    var vol = document.createElement('meter');
                    vol.id = 'volume_' + peer.id;
                    vol.className = 'volume';
                    vol.min = -45;
                    vol.max = -20;
                    vol.low = -40;
                    vol.high = -25;
                    container.appendChild(vol);

                    // show the ice connection state
                    if (peer && peer.pc) {
                        var connstate = document.createElement('div');
                        connstate.className = 'connectionstate';
                        container.appendChild(connstate);
                        peer.pc.on('iceConnectionStateChange', function (event) {
                            switch (peer.pc.iceConnectionState) {
                            case 'checking':
                                connstate.innerText = 'Connecting to peer...';
                                break;
                            case 'connected':
                            case 'completed': // on caller side
                                $(vol).show();
                                connstate.innerText = 'Connection established.';
                                break;
                            case 'disconnected':
                                connstate.innerText = 'Disconnected.';
                                break;
                            case 'failed':
                                connstate.innerText = 'Connection failed.';
                                break;
                            case 'closed':
                                connstate.innerText = 'Connection closed.';
                                break;
                            }
                        });
                    }
                    remotes.appendChild(container);
                }
            });

	webrtc.on('videoRemoved', function (video, peer) 
	{
    	console.log('video removed ', peer);
    	var remotes = document.getElementById('remotes');
    	var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    	if (remotes && el)
    	{
        		remotes.removeChild(el);
    	}
	});	


            function setRoom(name) {
                document.querySelector('form').remove();
                document.getElementById('title').innerText = 'Room: ' + name;
                document.getElementById('subTitle').innerText =  'Link to join: ' + location.href;
                $('body').addClass('active');
            }


            if (room) {
                setRoom(room);
            } else {
                $('form').submit(function () {
                    var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                    webrtc.createRoom(val, function (err, name) {
                        console.log(' create room cb', arguments);

                        var newUrl = location.pathname + '?' + name;
                        if (!err) {
                            history.replaceState({foo: 'bar'}, null, newUrl);
                            setRoom(name);
                        } else {
                            console.log(err);
                        }
                    });
                    return false;
                });
            }



            var button = document.getElementById('screenShareButton'),
                setButton = function (bool) {
                    button.innerText = bool ? 'share screen' : 'stop sharing';
                };
            if (!webrtc.capabilities.screenSharing) {
                button.disabled = 'disabled';
            }
            webrtc.on('localScreenRemoved', function () {
                setButton(true);
            });

            setButton(true);

            button.onclick = function () {
                if (webrtc.getLocalScreen()) {
                    webrtc.stopScreenShare();
                    setButton(true);
                } else {
                    webrtc.shareScreen(function (err) {
                        if (err) {
                            setButton(true);
                        } else {
                            setButton(false);
                        }
                    });

                }
            };








// window.onload=function()
// {
// 	// var signalingChannel = createSignalingChannel();
// 	socket=io.connect("localhost:8000");
// 	ask_room_no();
// 	rtc1 = new RTCPeerConnection();  // for caller
// 	rtc2 = new RTCPeerConnection();	 // for reciever	

// 	if(rtc1) 
// 	{
// 		start();
// 	}
// 	else
// 	 {
// 		alert("This Browser is not supporting the app");
// 	}
// }


// var candidate_availibility=true;

// function start(){

// 	caller_video =document.getElementById("sender");
// 	reciever_video=document.getElementById("reciever")
// 	connect_button=document.getElementById("connect");
// 	disconnect_button=document.getElementById("disconnect");
// 	connect_button.addEventListener("click",connect_peers,false);
// 	disconnect_button.addEventListener("click",disconnect_peers,false);
// 	live_stream();
// }
// function connect_peers()
// {
// 	// send_channel= rtc1.createDataChannel("sendChannel");
// 	// the onicecandidate handler is called whenever a ice candidate is available at remote side
// 	rtc1.onicecandidate=function(e)
// 	{
// 		if(e.candidate)
// 		{

// 				rtc2.addIceCandidate(e.candidate);
// 				console.log(e.candidate);
// 		}
// 		else 
// 		{
// 			candidate_availibility=true;
// 		}	
// 	}

// 	// rtc1.onnegotiationneeded=function()	// when there is SignallingChannel is available  
// 	rtc1.createOffer(localdescription,logerror);


// 	rtc2.onaddstream=function(evt)
// 	{ // when the reciever recieve the video stream
//     	reciever_video.src = URL.createObjectURL(evt.stream);
//     	reciever_video.play();
//     }

// }


// function localdescription(desc)
// {
// 	rtc1.setLocalDescription(desc).then(function()
// 	{
// 		rtc2.setRemoteDescription(rtc1.localDescription).then(function()
// 		{
// 			rtc2.createAnswer(remotedescription,logerror);
// 		})
// 	})
// }

// function remotedescription(desc)
// {
// 	rtc2.setLocalDescription(desc).then(function()
// 	{
// 		rtc1.setRemoteDescription(rtc2.localDescription)
// 	})
// }

// function logerror()
// {
// 	console.log("yes there is an error by logerror function")
// }

// function disconnect_peers()
// {
// 	// will later define the function properly
// 	console.log("will disconnect later");
// 	// rtc2=false;
// }


// function live_stream() 
// {
// 	navigator.getUserMedia = navigator.getUserMedia || 
// 			navigator.webkitGetUserMedia || navigator.mozGetUserMedia; // getting the webcam video
// 	if(navigator.getUserMedia)
// 	{
// 		navigator.getUserMedia(
// 		{
// 			video:
// 			{
// 				width:400, // width of screen
// 				height:300 // height of screen
// 			},
// 			audio:false // you can set it true
// 		},
// 		function(stream)
// 		{
// 			if(candidate_availibility)
// 			{		
// 				rtc1.addStream(stream); // send the stream to reciever
//  			}	 
// 			caller_video.src= URL.createObjectURL(stream);
// 			caller_video.play();
// 		},
// 		function(error)
// 		{

// 		});
// 	}
// 	else
// 	{
// 		console.log("getUserMedia is not working");
// 	}
// }
