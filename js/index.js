$(document).ready(function(){

	/* loading */
	
	
	
	 queue.installPlugin(createjs.Sound);
	 queue.on("complete", handleComplete, this);
	 queue.loadManifest(PRELOAD_MANIFEST.homepage);
	 //queue.loadFile({id:"music", src:"video/bg.mp3"});
	 
	 
	 /*queue.loadManifest([
		 {id: "myImage", src:'img/loading-bg.jpg'}
	 ]);*/
	 queue.on("progress", handleOverallProgress);
	 
	 
	 function handleComplete() {
		 //createjs.Sound.play("music");
		 //$("#music")[0].play();
		 //var image = queue.getResult("myImage");
		 //document.body.appendChild(image);
		 //
		/* $("#video1").css({"left":0});
		 $("#video1")[0].play();*/
		 /*
		 $("#video1").css({"left":0});
		 $("#video1")[0].play();*/
		 $(".loading").fadeOut();
		 
	 }
	
	
	/*window.queue = new createjs.LoadQueue();
	window.queue.on('progress', function() {
	    var per = Math.ceil(window.queue.progress * 100);
	    $("#rate").text(per + '%');
		$(".loading-bar").width(per*4.2);
		if(per > 24){
			$(".loading .lp1").hide();
			$(".loading .lp2").show();
		}else if(per > 49){
			$(".loading .lp2").hide();
			$(".loading .lp3").show();
		}else if(per > 74){
			$(".loading .lp3").hide();
			$(".loading .lp4").show();
		}
	});
	
	
	
	window.queue.on('complete', function() {
		
		
		
		
		
    });
	window.queue.loadManifest(PRELOAD_MANIFEST.homepage);
	window.queue.loadFile({src:"../video/bg.mp3", type:createjs.Types.SOUND});
	window.queue.loadFile({src:"../video/v1.mp4", type:createjs.Types.VIDEO});
	window.queue.loadFile({src:"../video/v2.mp4", type:createjs.Types.VIDEO});
	window.queue.loadFile({src:"../video/v3.mp4", type:createjs.Types.VIDEO});
	window.queue.loadFile({src:"../video/v4.mp4", type:createjs.Types.VIDEO});*/
	/* loading */
    

})
var queue = new createjs.LoadQueue();
function handleOverallProgress(){
	var per = Math.ceil(queue.progress * 100);
	//$(".loading-process").css("width",per);
	$("#rate").text(per + '%');
}