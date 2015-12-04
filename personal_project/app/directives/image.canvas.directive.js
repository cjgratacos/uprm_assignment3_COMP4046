/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";


//This Directive is in charge of  managing the view of the main uploaded picture

(function(){
	var Canvas = angular.module('directive.canvas',[]);
	
	
	//Run before setting scope, getting external dependecies
	Canvas.run(function(UploaderService,ToolbarFactory){
		uploaderService=UploaderService;
		toolbarFactory =ToolbarFactory;
	});
	//Default Variables
	var context = null;
	var canvasSize = {
		height:370,
		width:360
	};
	var uploaderService, toolbarFactory;
	//Getting Mouse Position
	function getMousePos(context, evt) {
		var rect = context.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	  }
	
	//Canvas Module Function Constructor
	var canvasModule = function(){
		//Template
		var template = "<div flex-container='column'><div class='ml+ mb'><span class='fs-display-1 display-block'>{{title}}</span></div><div flex-container='row' class='ml'><canvas class='card' id='imagePreview' ng-mousemove='updateTooltip($event)' height='"+canvasSize.height+"' width='"+canvasSize.width+"'></canvas></div></div>";
		//Function linker
		var link = function(scope,elements,attributes){
			scope.title= "Image View";
			context = angular.element("#imagePreview")[0].getContext("2d");
			scope.updateTooltip = function(event){//setting up event emmiter
				var position = getMousePos(angular.element("#imagePreview")[0],event);
				var pixel = context.getImageData(position.x,position.y,1,1).data;
				toolbarFactory.callbackEmmiter('toolbar.tooltip',{
					r:pixel[0],g:pixel[1],b:pixel[2],x:position.x,y:position.y
				});
			}
			//Uploading Register Callback
			uploaderService.registerCallback({
				category:'imagecanvas',
				callback:function(image){
					context.clearRect(0,0,canvasSize.width,canvasSize.height);
					context.drawImage(image,0,0,canvasSize.width,canvasSize.height);
				}
			});
			scope.imageWidth = 0, scope.imageHeight = 0;
			
		};
		//Angular ODM
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