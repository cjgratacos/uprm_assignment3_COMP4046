/*
The MIT License (MIT)
copyright © 2015 <copyright holders>
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the “Software”), to deal in the Software without restriction, including without 
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT 
SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
OR OTHER DEALINGS IN THE SOFTWARE.
*/



"use strict";

(function(){
	var App = angular.module('histogram-app',[
	/*Dependencies*/	'lumx',
	/*Services*/		'service.uploader',
	/*Directives*/		'directive.canvas','directive.canvas.history'
		]);
	
	App.constant('INFORMATION',{
		author:'Carlos Gratacos',
		appName:'3D Histogram App',
		version:"1.0.0"
	});
	App.constant('SETTING',{
		debugMode:false,
		maxHistory:5,
	});
	
	App.controller('mainController',function($scope, $document,LxNotificationService,UploaderService,SETTING){
		//console.log($document.find("#canvas").append());
		$scope.settings = SETTING;
		$scope.components ={
			img: new Image()
		};
		$scope.UploaderServiceGetter = function(){
			return UploaderService;
		}
		
		$scope.uploadImg = function(img){
			console.log(img);
			UploaderService.upload(img,null,function(result){
				if(!!result){
					$scope.components.img = result;
				}else{
					LxNotificationService.info("File is not image Type");
				}
			});
		}
	});
})();