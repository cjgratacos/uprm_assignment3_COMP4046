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
/*
Carlos Gratacos
COMP4046 UPRM15S1
3D Histogram Wen App
The purpose of this proyect is to bring two complex library (AngularJS and ThreeJS) and create a user friendly,
modern looking Web Application, that follows modern styles of developments.
External Sources:
Angular JS, Lumx, MomentJS, OrbitControls,rzslider,Threejs,velocityjs

This application uses Modules,Directives and Factories based on Angular Standards

Github: Soon
*/
"use strict";
//Initiator Function This is the Main Module
(function(){
	var App = angular.module('histogram-app',[//Loading all modules dependencies
	/*Dependencies*/	'lumx','rzModule',
	/*Services*/		'service.uploader','service.histogram','service.scene','service.toolbar',
	/*Directives*/		'directive.canvas','directive.canvas.history','directive.toolbar','directive.scene'
		]);
	//Default Constans shared around the App
	App.constant('INFORMATION',{
		author:'Carlos Gratacos',
		appName:'3D Histogram App',
		version:"1.0.0"
	});
	App.constant('SETTING',{
		debugMode:false,//Debug mode
		maxHistory:5,//Image History max range
	});
	
	//Main Controller Initializes the main components
	App.controller('mainController',function($scope, $document,LxNotificationService,UploaderService,SETTING){//Dependecy Injection on providers 
		//console.log($document.find("#canvas").append());
		//Basic $scope variables
		$scope.settings = SETTING;
		$scope.uploadTitle = "Image Uploader";
		$scope.uploadLabel = "Just Click Here to Browse Pictures... ";
		$scope.components ={
			img: new Image()
		};
		//Function to pass around the Uploader Service between Directives
		$scope.UploaderServiceGetter = function(){
			return UploaderService;
		}
		
		//ImageUploader Sanitizer result, it tells the user that the file trying to be used is not an image 
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