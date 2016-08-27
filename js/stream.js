window.onload=live_stream();
function live_stream() {
	console.log("function has been called");
	var video =document.getElementById("webcam");
	var vendorUrl=window.URL;
	var getUserMedia= navigator.webkitGetUserMedia ;
	if(getUserMedia)
	{
		navigator.webkitGetUserMedia({
			video:true,
			audio:false
		},function(stream){
			video.src=vendorUrl.createObjectURL(stream);
			video.play();
		},function(error){

		});
		console.log("yes there is a navigator this time");
	}
	else
	{
		console.log("getUserMedia is not working");
	}
}
