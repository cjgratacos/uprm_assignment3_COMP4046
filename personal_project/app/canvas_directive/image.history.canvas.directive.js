"use strict";

(function(){

	var CanvasHistory = angular.module('directive.canvas.history',[]);

	var canvasSize = {
		height:100,
		width:100
	};
	var canvasContextArray =[];
	function canvasHistory(){
		var template ="<span class='fs-subhead display-block'>{{message}}</span><canvas height='"+canvasSize.height+"' width='"+canvasSize.width+"' class='m++ card' ng-repeat='p in repeatArray' ng-click='onCanvasClick($index)' id='{{p}}'></canvas>";

		var link = function(scope,element,attr){
			scope.message = 'Image History: (can use to reload by clicking on the desired image)';
			scope.repeatArray = (function(){
				var counts = [];
				for (var i = 0; i < scope.repeats; i++) {
					counts.push("canvashistory"+i);
				}
				return counts;
			})();
			(function(){
				for (var i = 0; i < scope.repeats; i++) {
					console.log(angular.element("#canvashistory"+i));
					//canvasContextArray[i] = angular.element("#canvashistory"+i)[0].getContext('2d');
				}
				console.log(canvasContextArray);	
			})();
			
			var uploaderService = scope.uploaderFunc();
			uploaderService.registerCallback({
				type:"canvashistory",
				callback:function(element){
					var currentHistoryCount = uploaderService.getImageHistoryCount();
					var canvasImageHistory = uploaderService.getImages();
					for (var i = 0; i < currentHistoryCount; i++) {
						if(i < currentHistoryCount){
							
						}else{
							
						}
						
					}
				}
			});
			//On Canvas Click
			scope.onCanvasClick = function(index){
				var currentHistoryCount = uploaderService.getImageHistoryCount();
				if(currentHistoryCount > 0 && currentHistoryCount>=index+1){
					uploaderService.reUploadFromHistory(index);
					console.log(index);
				}
			}


		}

		return {
			template:template,
			restrict:'E',
			scope:{
				repeats:'@',
				uploaderFunc:'&'
			},
			link:link
		};
	}

	CanvasHistory.directive('historyCanvas',canvasHistory);
})();