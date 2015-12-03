"use strict";

(function(){
	var Canvas = angular.module('directive.scene',[]);
	
	
	Canvas.run(function(UploaderService,HistogramFactory,SceneFactory){
		uploaderService = UploaderService;
		histogramFactory = HistogramFactory;
		sceneService = SceneFactory;
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
	
	function initScene(){
		sceneGlob.renderer = new THREE.WebGLRenderer({
				'canvas': canvas, 
				maxLights: 6, 
				preserveDrawingBuffer: true
				//shadowMapEnabled: true 
		});
		sceneGlob.camera = new THREE.PerspectiveCamera(35,canvas.width/canvas.height,0.01,1000);
		sceneGlob.camera.position.z = 10;
		sceneGlob.camera.position.y = 0;
		sceneGlob.camera.rotation.x = 0;
		sceneGlob.renderer.setClearColor(0x8f8f8f);
		sceneGlob.scene = new THREE.Scene();
		histogramFactory.createBox({
			showBox:true,
			cornerShape:"sphere"
		},sceneGlob.scene);
		sceneGlob.scene.add( new THREE.AmbientLight( 0x808080 ) );
		var light = new THREE.SpotLight( 0xffffff, 1.5 );
		light.position.set( 0, 500, 2000 );
		sceneGlob.scene.add( light );
		sceneGlob.renderer.render(sceneGlob.scene,sceneGlob.camera);
		tick();
	}
	function tick() {
		requestAnimationFrame(tick);
		//handleKeys();
		sceneRenderer();
		sceneGlob.renderer.render(sceneGlob.scene, sceneGlob.camera);
	}
	function sceneRenderer(){
		if(sceneService.global().render){
			histogramFactory
			.createObjects({
				style:"ball",
				wireframe:true,
				selectColor:false
			},sceneGlob.scene)
			sceneService.global().render = false;
		}
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
					imagePreviewContext = imagePreviewCanvas.getContext("2d");
					var imageData = imagePreviewContext.getImageData(0,0,imagePreviewCanvas.width,imagePreviewCanvas.height);
					histogramFactory.init(imagePreviewCanvas.width,imagePreviewCanvas.height,imageData);
					sceneService.global().render =true;
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