"use strict";

(function(){
	var Canvas = angular.module('directive.canvas',[]);
	
	var idGenerator = function(){
		return Math.random().toString(36).slice(2);
	}
	
	var uid = "canvas"+idGenerator();
	var context = null;
	var canvasSize = {
		height:370,
		width:360
	};
	

	var canvasModule = function(){
		var template = "<canvas class='card' id='"+uid+"' height='"+canvasSize.height+"' width='"+canvasSize.width+"'></canvas>";
		
		var link = function(scope,elements,attributes){
			context = angular.element("#"+uid)[0].getContext("2d");
			var uploader = scope.uploaderFunc();
			uploader.registerCallback({
				category:'imagecanvas',
				callback:function(image){
					context.clearRect(0,0,canvasSize.width,canvasSize.height);
					context.drawImage(image,0,0,canvasSize.width,canvasSize.height);
				}
			});
			
			
		};
		return {
			restrict:"E",
			scope:{
				uploaderFunc:"&",
				tooltipFunc:"&"
			},
			link:link,
			template:template
		};
	}
	Canvas.directive("imageCanvas",canvasModule);
})();