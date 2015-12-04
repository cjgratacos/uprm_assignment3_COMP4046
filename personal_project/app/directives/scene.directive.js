/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

//Scene Directive This is where one of the biggest magic appears
//In this Directive is where Angular and ThreeJS Main components combine
"use strict";

(function(){
	//Creating Directive Module
	var Canvas = angular.module('directive.scene',[]);
	
	//Run Before Loading the Scope, getting external Depenencies
	Canvas.run(function(UploaderService,HistogramFactory,SceneFactory){
		uploaderService = UploaderService;
		histogramFactory = HistogramFactory;
		sceneService = SceneFactory;
	});
	//Canvas Dimensin
	var canvasSize = {
		height:550,
		width:790
	};
	//Function that generates a random id
	var idGenerator = function(){
		return Math.random().toString(36).slice(2);
	}
	//Default IIF variables for use in this Directive
	var uid = "canvas"+idGenerator();//canvas id
	var uploaderService,sceneService,histogramFactory;//Link to external Dependencies
	var canvas; // canvas link
	var imagePreviewCanvas,imagePreviewContext; 
	//Scene Objs for referencing
	var sceneGlob = {
		camera: undefined,
		scene: undefined,
		renderer:undefined,
		control:undefined
	};
	
	//Function that initiates the scene
	function initScene(image){
		imagePreviewContext = imagePreviewCanvas.getContext("2d");
		var imageData = imagePreviewContext.getImageData(0,0,imagePreviewCanvas.width,imagePreviewCanvas.height);
		histogramFactory.init(imagePreviewCanvas.width,imagePreviewCanvas.height,imageData);
		sceneService.global().render =true;
		sceneGlob.renderer = new THREE.WebGLRenderer({
				'canvas': canvas, 
				maxLights: 6, 
				preserveDrawingBuffer: true,
				shadowMapEnabled: true 
		});
		//Setting the Camera
		sceneGlob.camera = new THREE.PerspectiveCamera(35,canvas.width/canvas.height,0.01,1000);
		sceneGlob.camera.position.z = 10;
		sceneGlob.camera.position.y = 0;
		sceneGlob.camera.rotation.x = 0;
		sceneGlob.renderer.setClearColor(sceneService.global().backgroundColor);//Giving it a color, it will change when the toolbar color changes
		sceneGlob.scene = new THREE.Scene(); //Creating a scene
		histogramFactory.createBox({
			showBox:true,
			cornerShape:"sphere"
		},sceneGlob.scene);
		
		//Creating an Orbit Control
		sceneGlob.control = new THREE.OrbitControls( sceneGlob.camera );
  		sceneGlob.control.addEventListener( 'change', sceneRenderer );//Giving the Orbit Controller a callback
		
		//Adding a little Ligth to the Scene
		sceneGlob.scene.add( new THREE.AmbientLight( 0x808080 ) );
		var light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		sceneGlob.scene.add( light );
		sceneGlob.control.enabled = false;
		sceneGlob.renderer.render(sceneGlob.scene,sceneGlob.camera);
		
	}
	//Function That renders the scene
	function sceneRenderer(){
		if(sceneService.global().render){
			histogramFactory
			.createObjects({//creating the particle or pixel in the scene
				style:sceneService.global().meshType,//Block or Ball type
				wireframe:sceneService.global().wireframe,//If wireframe, removed because of bug and causing performances issue
				selectColor:false// Tooltip selector
			},sceneGlob.scene)
			sceneService.global().render = false;
		}
		sceneGlob.renderer.render(sceneGlob.scene, sceneGlob.camera);
	}
	
	
	//Directive Function Constructor
	var canvasModule = function(){
		var template = "<div flex-container='column'>"//Directive Template
						+"<div><span class='fs-display-1 display-block mb'>{{title}}</span></div>"
						+"<div>" 
						+"	<canvas ng-mouseover='activateControllers()' ng-mouseleave='deactivateControllers()' id='"+uid+"' height='"+canvasSize.height+"' width='"+canvasSize.width+"' class='card'></canvas>"
						+"</div>"
						+"</div>";
		
		var link = function(scope,elements,attributes){//Directive Link Function, where the scope variable resides, and the directive has control
			//Basic variables
			scope.title = "Histogram";
			canvas= angular.element("#"+uid)[0];
			imagePreviewCanvas= angular.element("#imagePreview")[0];
			//Initiating Scene and callbacks
			initScene();
			scope.activateControllers = function(){
				sceneGlob.control.enabled = true;
			}
			scope.deactivateControllers = function(){
				sceneGlob.control.enabled = false;
			}
			sceneService.eventRegister(function(){
				initScene();
				sceneRenderer();
			});
			
			uploaderService.registerCallback({
				category:'canvasscene',
				callback:function(image){
					initScene(image);
					sceneRenderer();
				}
			});
		
		};
		//returning an Angular ODM
		return {
			restrict:"E",
			scope:{
			},
			template:template,
			link:link,
		};
	}
	
	
	
	Canvas.directive("sceneCanvas",canvasModule);
})();