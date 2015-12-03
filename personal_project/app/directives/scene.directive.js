"use strict";

(function(){
	var Canvas = angular.module('directive.scene',[]);
	
	
	Canvas.run(function(UploaderService,HistogramFactory){
		uploaderService = UploaderService;
		histogramFactory = HistogramFactory;
	});
	
	var canvasSize = {
		height:550,
		width:790
	};
	
	var idGenerator = function(){
		return Math.random().toString(36).slice(2);
	}
	
	var uid = "canvas"+idGenerator();
	var uploaderService,sceneService,histogramFactory;
	var canvas;
	var imagePreviewCanvas,imagePreviewContext;
	
	
	var sceneGlob = {
		camera: undefined,
		scene: undefined,
		renderer:undefined,
		control:undefined
	};
	
	function init(){
		imagePreviewContext = imagePreviewCanvas.getContext("2d");
		var imageData = imagePreviewContext.getImageData(0,0,imagePreviewCanvas.width,imagePreviewCanvas.height);
		console.log(imageData);
		histogramFactory.init(imagePreviewCanvas.width,imagePreviewCanvas.height,imageData);
	}
	
	function initScene(){
		sceneGlob.renderer = new THREE.WebGLRenderer({
				'canvas': canvas, 
				maxLights: 6, 
				preserveDrawingBuffer: true,
				//shadowMapEnabled: true 
		});
		sceneGlob.camera = new THREE.PerspectiveCamera(75,canvas.width/canvas.height,0.01,1000);
		sceneGlob.camera.position.z = 500;
		sceneGlob.camera.position.y = -500;
		sceneGlob.camera.rotation.x = .75;
		sceneGlob.renderer.setClearColor(0x8f8f8f);
		sceneGlob.scene = new THREE.Scene();
		//sceneGlob.controls = new THREE.TrackballControls( sceneGlob.camera );
		//sceneGlob.controls.rotateSpeed = 1.0;
		//sceneGlob.controls.zoomSpeed = 1.2;
		//sceneGlob.controls.panSpeed = 0.8;
		//sceneGlob.controls.noZoom = false;
		//sceneGlob.controls.noPan = false;
		//sceneGlob.controls.staticMoving = true;
		// dsceneGlob.controls.dynamicDampingFactor = 0.3;
		sceneGlob.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(300,300),new THREE.MeshNormalMaterial()));
		sceneGlob.scene.add( new THREE.AmbientLight( 0x808080 ) );
		var light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		sceneGlob.scene.add( light );
		sceneGlob.renderer.render(sceneGlob.scene,sceneGlob.camera);
	}
	
	
	var canvasModule = function(){
		var template = "<div flex-container='column'>"
						+"<div><span class='fs-display-1 display-block mb'>{{title}}</span></div>"
						+"<div>" 
						+"	<canvas id='"+uid+"' height='"+canvasSize.height+"' width='"+canvasSize.width+"' class='card'></canvas>"
						+"</div>"
						+"</div>";
		
		var link = function(scope,elements,attributes){
			scope.title = "Histogram";
			
			canvas= angular.element("#"+uid)[0];
			imagePreviewCanvas= angular.element("#imagePreview")[0];
			initScene();
			uploaderService.registerCallback({
				category:'canvasscene',
				callback:function(image){
					setTimeout(function() {
						init();
					}, 10);
					//canvasContext.clearRect(0,0,canvasSize.width,canvasSize.height);
					//canvasContext.drawImage(image,0,0,canvasSize.width,canvasSize.height);
				}
			});
		
		};
		
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