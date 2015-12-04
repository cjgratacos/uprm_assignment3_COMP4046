/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";
//This Module is in charge of managing and processing the images history
(function(){

	var CanvasHistory = angular.module('directive.canvas.history',[]);

	CanvasHistory.run(function(UploaderService){
		uploaderService = UploaderService;
	});
	var canvasSize = {
		height:100,
		width:100
	};
	var uploaderService;
	var canvasContextArray =[];
	function canvasHistory(){
		var template ="<span class='fs-display-1 display-block'>{{title}}</span><span class='fs-subhead display-block'>{{message}}</span><canvas height='"+canvasSize.height+"' width='"+canvasSize.width+"' class='m++ card' ng-repeat='p in repeatArray' ng-click='onCanvasClick($index)' id='{{p}}'></canvas>	<button class='btn btn--m btn--blue btn--flat' lx-ripple ng-click='clearHistory()'>Clear History</button>";

		var link = function(scope,element,attr){
			scope.title = 'Image History';
			scope.message = "(can use to reload by clicking on the desired image)";
			scope.repeatArray = (function(){
				var counts = [];
				for (var i = 0; i < scope.repeats; i++) {
					counts.push("canvashistory"+i);
				}
				return counts;
			})();
			
			(function(){
				setTimeout(function(){
					for (var i = 0; i < scope.repeats; i++) {
						canvasContextArray[i] = angular.element("#canvashistory"+i)[0].getContext('2d');
					}
				});	
			})();
			
			uploaderService.registerCallback({
				type:"canvashistory",
				callback:function(element){
					var currentHistoryCount = uploaderService.getImageHistoryCount();
					if(currentHistoryCount > 0){
						var canvasImageHistory = uploaderService.getImages();
						for (var i = 0; i < currentHistoryCount; i++) {
							canvasContextArray[i].clearRect(0,0,canvasSize.width,canvasSize.height);
							if(i < currentHistoryCount){
								canvasContextArray[i].clearRect(0,0,canvasSize.width,canvasSize.height);
								canvasContextArray[i].drawImage(canvasImageHistory[i+1],0,0,canvasSize.width,canvasSize.height);
							}
						}
					}
				}
			});
			//On Canvas Click
			scope.onCanvasClick = function(index){
				var currentHistoryCount = uploaderService.getImageHistoryCount();
				if(currentHistoryCount > 0 && currentHistoryCount>=index+1){
					uploaderService.reUploadFromHistory(index+1);
				}
			}
			scope.clearHistory =function(){
				var currentHistoryCount = uploaderService.getImageHistoryCount();
				for (var i = 0; i < currentHistoryCount; i++) {
					canvasContextArray[i].clearRect(0,0,canvasSize.width,canvasSize.height);
				}
				uploaderService.clearHistory();
			}

		}

		return {
			template:template,
			restrict:'E',
			scope:{
				repeats:'@'
			},
			link:link
		};
	}

	CanvasHistory.directive('historyCanvas',canvasHistory);
})();