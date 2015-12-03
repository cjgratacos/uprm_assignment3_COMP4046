"use strict";

(function(){
	var Canvas = angular.module('directive.canvas',[]);
	
	
	Canvas.run(function(UploaderService){
		uploaderService=UploaderService;
	});
	var context = null;
	var canvasSize = {
		height:370,
		width:360
	};
	var uploaderService;
	
	var canvasModule = function(){
		var template = "<div flex-container='column'><div class='ml+ mb'><span class='fs-display-1 display-block'>{{title}}</span></div><div flex-container='row' class='ml'><canvas class='card' id='imagePreview' height='"+canvasSize.height+"' width='"+canvasSize.width+"'></canvas></div></div>";
		
		var link = function(scope,elements,attributes){
			scope.title= "Image View";
			context = angular.element("#imagePreview")[0].getContext("2d");
			
			uploaderService.registerCallback({
				category:'imagecanvas',
				callback:function(image){
					context.clearRect(0,0,canvasSize.width,canvasSize.height);
					context.drawImage(image,0,0,canvasSize.width,canvasSize.height);
				}
			});
			scope.imageWidth = 0, scope.imageHeight = 0;
			
		};
		return {
			restrict:"E",
			scope:{
			},
			link:link,
			template:template
		};
	}
	Canvas.directive("imageCanvas",canvasModule);
})();