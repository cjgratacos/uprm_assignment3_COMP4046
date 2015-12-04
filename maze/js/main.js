/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

"use strict";
/*
	Carlos Gratacos
	COMP4046
	UPRM2015S1
	Prof. Remi Megret
	Assignment #3 :3D Graphics Project
	Part 1 : Setting a basic template
*/

/* global doubleTimesSum */
/* global hero */
/* global degToRad */
/* global messagebox */
/* global THREE */
/* global dat */
//Imediately invoke function (IIF) for modularization and Global populating conflict prevention

(function(window){

	//Global Variables
	var gui;
	var glob_scene = {
		renderer: undefined,
		scene:undefined,
		camera:undefined,
		cameraId:undefined,
		cameras:[],
		camerasHelpers:[],
		axisHelper:undefined,
		planeMesh:undefined,
		titleMesh:undefined,
		floorMesh:undefined,
		wallMesh:undefined
	};
	var glob_mouse ={
		mouseState:0,
		mouse:new THREE.Vector2() 
	};
	var currentlyPressedKeys = {};
	
	var glob_animate={
		lastTime:0,
		elapsed:0
	};
	var plane_dimension = {
		w:5,
		h:6
	};
	var hero={
	   position:{
		   x:0,
		   y:0,
		   az:0
	   },
	   motion:{
		   dx:0,
		   dy:0,
		   daz:0
	   },
	   mesh:undefined
	};
 //GUI
	var params= {
		'az0': -20.0,
		'el0': 30.0,
		'd0' : 8.0
	};
 //Function that initiates the GUI
	function initGUI() {
		gui = new dat.GUI({ autoPlace: true })

		gui.add(params, 'az0').min(-180).max(+180).listen();
		gui.add(params, 'el0').min(-90).max(+90).listen();
		gui.add(params, 'd0').min(+1).max(+100).listen();
	}
//Mouse Event Handler Function initiator
	function initMouse(canvas) {
		canvas.onmousemove = handleMouseMove;
		canvas.onmousedown = handleMouseDown;
		canvas.onmouseleave = function() {glob_mouse.mouseState = 0; glob_mouse.mouse.x=0; glob_mouse.mouse.y=0};
	}
//Mouse Down event handler: Transform cordinate to canvas coordinate	
	function handleMouseDown(event) {
		// Get mouse position in normalized coordinates [-1, +1]
		var rect = event.target.getBoundingClientRect()
		glob_mouse.mouse.x = (event.clientX - rect.left) / (rect.right-rect.left) * 2 - 1;
		glob_mouse.mouse.y = -(event.clientY - rect.top) / (rect.bottom-rect.top) * 2 + 1;
	}
//Mouse Move handler function: Empty due that I choose the route to make personal project
	function handleMouseMove(event) {
	}
	
// Keyboard Event Initiator Handler
	function initKeyboard(canvas, onKeyDown, onKeyUp) {
		// add tabindex attribute to canvas to allow it getting keyboard focus
		// Same as declaring <canvas tag='webgl-canvas' tabindex='1'></canvas> in HTML
		canvas.setAttribute('tabindex',1);
		// Give focus to canvas by default and each time mouse enters 
		// to improve user experience by handling keyboard out of the box
		canvas.focus();
		canvas.onmouseenter = (function () {canvas.focus()});
		
		canvas.onkeydown = handleKeyDown;
		canvas.onkeyup = handleKeyUp;
	}
	
	//Function that handlers the keydown event
	function handleKeyDown(event) {
		var keyCode = event.keyCode;
		currentlyPressedKeys[keyCode] = true;
		
		// Display pressed keys for debugging. Comment if too verbose
		//console.log('KeyDown: keycode = '+keyCode.toString());
		
		if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
			// Arrow keys: prevent default handling (i.e. avoid scrolling)
			event.preventDefault();
			// Arrows are handled using polling in handleKeys
		} else if (event.key == 'v') {
			// Change current camera
			glob_scene.cameraId = (glob_scene.cameraId+1)%3;
			glob_scene.camera = glob_scene.cameras[glob_scene.cameraId];
			console.log('cameraId = '+glob_scene.cameraId.toString()+", camera = ",glob_scene.cameras[glob_scene.cameraId]);
			//var messagebox = document.getElementById("messagebox");
			messagebox.innerHTML = 'Camera '+glob_scene.cameraId;
		}
		if (event.key == 'c') {
			// Check victory
		}
	}
	//function that handlers the keyup event
	function handleKeyUp(event) {
		currentlyPressedKeys[event.keyCode] = false;
	}
	//function that handlers key events
	function handleKeys() {
		/* Camera 0 controls */
		if (currentlyPressedKeys[73] /* I */) { params.el0 += 2 }
		if (currentlyPressedKeys[75] /* K */) { params.el0 -= 2 }
		if (currentlyPressedKeys[74] /* J */) { params.az0 -= 2 }
		if (currentlyPressedKeys[76] /* L */) { params.az0 += 2 }
		if (currentlyPressedKeys[85] /* U */) { params.d0 *= 1.05 }
		if (currentlyPressedKeys[79] /* O */) { params.d0 /= 1.05 }
		if (params.el0>90) params.el0=90;	
		else if (params.el0<-90) params.el0=-90;
		if (params.az0>180) params.az0-=360; 
		else if (params.az0<-180) params.az0+=360;
		
		/* Hero control */
		hero.motion.daz = 0;  // Rotation control
		if (currentlyPressedKeys[37] /* Left */) { hero.motion.daz = 1 }
		if (currentlyPressedKeys[39] /* Right */) { hero.motion.daz = -1 }
		hero.motion.dx = 0; 
		hero.motion.dy = 0;  // Position control
		if (currentlyPressedKeys[38] /* Up */) {
			 hero.motion.dx = -Math.sin(degToRad( hero.position.az));
			 hero.motion.dy = Math.cos(degToRad( hero.position.az));
		}
		if (currentlyPressedKeys[40] /* Down */) {
			 hero.motion.dx = Math.sin(degToRad( hero.position.az))
			 hero.motion.dy = -Math.cos(degToRad( hero.position.az))
		}
		
		/* WARNING: Setting cameras and hero new position is done in animate() */
	}
		
// Animation
	//Function that process the animation
	function animate() {
		var timeNow = new Date().getTime();
		if (glob_animate.lastTime != 0) { glob_animate.elapsed = (timeNow - glob_animate.lastTime)/1000; }
		glob_animate.lastTime = timeNow;
		
		/* Hero collision detection */
		var d2 = doubleTimesSum(hero.motion.dx,hero.motion.dy);
		//Detection Collision
		if (d2>0) {
			// If we are moving, check for collisions
			var position = new THREE.Vector3(hero.position.x,hero.position.y,0.5);
			var direction = new THREE.Vector3(hero.motion.dx,hero.motion.dy,0);
			var raycaster = new THREE.Raycaster(position, direction, 0, 1);
			var intersects = raycaster.intersectObject( glob_scene.wallMesh,true );
			//console.log(intersects.length);
			if (intersects.length > 0 && intersects[0].distance < 10) {
				//Intersection with wall, stop movement completely
				console.log(intersects.length);
				hero.motion.dx = hero.motion.dy = 0;
			}
			
		}
		
		/* Update Hero Position */
		var velocity = 1/0.4 ;	 // Move 1 unit in 0.4s
		var anglevelocity = 360/2 ;// Turn 360 deg in 2s
		hero.position.x += hero.motion.dx * glob_animate.elapsed * velocity;
		hero.position.y += hero.motion.dy * glob_animate.elapsed * velocity;
		hero.position.az   += hero.motion.daz * glob_animate.elapsed * anglevelocity;

		hero.mesh.position.set(hero.position.x,hero.position.y, 0);
		hero.mesh.rotation.set(0,0,degToRad(hero.position.az),"ZXY");
	   
		/* Cameras update */
			
		var az0 = params.az0, el0 = params.el0, d0 = params.d0
		
		// Uncomment to look at maze center instead of origin
		var target = new THREE.Vector3(plane_dimension.w/2,plane_dimension.h/2,0)
		//var target = new THREE.Vector3(0,0,0)
		glob_scene.cameras[0].position.set(
				target.x-d0*Math.cos(degToRad(el0))*Math.sin(degToRad(az0)),
				target.y-d0*Math.cos(degToRad(el0))*Math.cos(degToRad(az0)),
				target.z+d0*Math.sin(degToRad(el0)));
		glob_scene.cameras[0].up.set(0,0,1);
		glob_scene.cameras[0].lookAt(target);
		glob_scene.cameras[0].updateMatrixWorld();
		glob_scene.camerasHelpers[0].update();
			
		glob_scene.cameras[1].position.set(hero.position.x,hero.position.y, 0.85);
		// Euler angles in ZXY order:
		// First rotate az degrees around Z for the direction, then
		// rotate 90 deg around X to get the direction Z_camera pointing backward
		glob_scene.cameras[1].rotation.set(degToRad(90),0,degToRad(hero.position.az),"ZXY");
		glob_scene.cameras[1].updateMatrixWorld();
		glob_scene.camerasHelpers[1].update();
	}
	//function that is called asynchronously in an interval of time to create the ilusion of animation
	function tick() {
		requestAnimationFrame(tick);
		handleKeys();
		animate();
		glob_scene.renderer.render(glob_scene.scene, glob_scene.camera);
	}
	//creating the XY tiles, the floor
	var createXYTile = function(x,y,z,materialIndex) {
		var geometry =  new THREE.Geometry();
		
		var nvertices = geometry.vertices.length;
		geometry.vertices.push( 
			new THREE.Vector3( x  , y  , z ),
			new THREE.Vector3( x+1, y  , z ), 
			new THREE.Vector3( x+1, y+1, z ),
			new THREE.Vector3( x  , y+1, z ) 
		);
		
		var nfaces = geometry.faces.length;
		geometry.faces.push( 
			new THREE.Face3( nvertices, nvertices+1, nvertices+2, null, null, materialIndex),
			new THREE.Face3( nvertices, nvertices+2, nvertices+3, null, null, materialIndex)
		)
		
		// TODO: append UV coordinates to each vertex in each face
		//geometry.faceVertexUvs[0]
		geometry.faceVertexUvs[0].push(
				[
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,0 ),
				new THREE.Vector2( 1,1 )
				], [
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,1 ),
				new THREE.Vector2( 0,1 )
				]
			);
		return geometry;
	}
	//Creating the XZ tiles, the horizontal walls
	var createXZTile = function(x,y,z,materialIndex) {
		var geometry =  new THREE.Geometry();
		
		var nvertices = geometry.vertices.length;
		geometry.vertices.push( 
			new THREE.Vector3( x  , y  , z ),
			new THREE.Vector3( x+1, y  , z ), 
			new THREE.Vector3( x+1, y  , z+1 ),
			new THREE.Vector3( x  , y  , z+1 ) 
		);
		
		var nfaces = geometry.faces.length;
		geometry.faces.push( 
			new THREE.Face3( nvertices, nvertices+1, nvertices+2, null, null, materialIndex),
			new THREE.Face3( nvertices, nvertices+2, nvertices+3, null, null, materialIndex)
		)
		
		// TODO: append UV coordinates to each vertex in each face
		//geometry.faceVertexUvs[0]
		geometry.faceVertexUvs[0].push(
				[
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,0 ),
				new THREE.Vector2( 1,1 )
				], [
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,1 ),
				new THREE.Vector2( 0,1 )
				]
			);
		return geometry;
	}
	//Creating the YZ tiles, the horizontal walls
	var createYZTile = function(x,y,z,materialIndex) {
		var geometry =  new THREE.Geometry();
		
		var nvertices = geometry.vertices.length;
		geometry.vertices.push( 
			new THREE.Vector3( x  , y	, z ),
			new THREE.Vector3( x  , y+1  , z ), 
			new THREE.Vector3( x  , y+1  , z+1 ),
			new THREE.Vector3( x  , y	, z+1 ) 
		);
		
		var nfaces = geometry.faces.length;
		geometry.faces.push( 
			new THREE.Face3( nvertices, nvertices+1, nvertices+2, null, null, materialIndex),
			new THREE.Face3( nvertices, nvertices+2, nvertices+3, null, null, materialIndex)
		)
		
		// TODO: append UV coordinates to each vertex in each face
		//geometry.faceVertexUvs[0]
		geometry.faceVertexUvs[0].push(
				[
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,0 ),
				new THREE.Vector2( 1,1 )
				], [
				new THREE.Vector2( 0,0 ),
				new THREE.Vector2( 1,1 ),
				new THREE.Vector2( 0,1 )
				]
			);
		return geometry;
	}
	
	//Function for creating the floor
	var createFloorGeometry = function(maze,materialCount) {//maze: Geometry Object representing the maze, materialCount: value of the max range of the list of material array that can access
		var geometry = maze;//new THREE.Geometry();
		
		for (var i = 0; i < plane_dimension.w; i++) {
			for (var j = 0; j < plane_dimension.h; j++) {
			   geometry.merge(createXYTile(i,j,0,0),new THREE.Matrix4(),getRandomInt(0,materialCount));
			}
			
		}
		return geometry;
	}
	//Function for creating the wall
	var createWallGeometry = function(maze,wallMaterialPosition) {//maze: Geometry Object representing the maze, wallMaterialPosition:  position of the wall image or material in the material array
		var geometry = maze;
		
		//iterate to create  vertical wall
		for (var i = 0; i < plane_dimension.w; i++) {
			geometry.merge(createXZTile(i,0,0,0),new THREE.Matrix4(),wallMaterialPosition);
			geometry.merge(createXZTile(i,plane_dimension.h,0,0),new THREE.Matrix4(),wallMaterialPosition);
		}
		//iterate to create horizontal wall
		for (var i = 0; i < plane_dimension.h; i++) {
			geometry.merge(createYZTile(0,i,0,0),new THREE.Matrix4(),wallMaterialPosition);
			geometry.merge(createYZTile(plane_dimension.w,i,0,0),new THREE.Matrix4(),wallMaterialPosition);
		}
		return geometry;
	}

 function webGLStart() {
	
		/* Initialize WebGL renderer and create scene */
	
		var canvas = document.getElementById("canvas");
		glob_scene.renderer = new THREE.WebGLRenderer({
			'canvas': canvas, 
			maxLights: 6, 
			preserveDrawingBuffer: true,
			shadowMapEnabled: true  // Remove if performance issues
			}); 
		glob_scene.renderer.setClearColor(0xffffff);
		//renderer.setClearColor(0x000000)
		
		glob_scene.scene = new THREE.Scene(); 
		
		/* Create cameras */
		// Note: look in animate() for the setting of cameras position and orientation
		glob_scene.cameras[0] = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.005, 100);
		glob_scene.cameras[1] = new THREE.PerspectiveCamera( 100, canvas.width / canvas.height, 0.005, 100);		
		var W = Math.max(plane_dimension.w, plane_dimension.h);
		glob_scene.cameras[2] = new THREE.OrthographicCamera( -1, W+1, W+1, -1, -10, 10);		
		
		// Define current camera
		glob_scene.cameraId = 0;
		glob_scene.camera = glob_scene.cameras[glob_scene.cameraId];
		
		/* Helpers: additional objects in the scene useful for debugging */
		// Invisible by default
		
		for (var i=0; i<glob_scene.cameras.length; i++) {
			glob_scene.camerasHelpers[i] = new THREE.CameraHelper(glob_scene.cameras[i]);
			glob_scene.camerasHelpers[i].visible = false; // Set to true to show cameras positions
			glob_scene.scene.add( glob_scene.camerasHelpers[i] );
		}
		
		glob_scene.axisHelper = new THREE.AxisHelper( 1 ); // Axis length = 2
		glob_scene.axisHelper.material.linewidth = 7;
		glob_scene. axisHelper.position.set(0,0,0);
		glob_scene.scene.add( glob_scene.axisHelper );
		

		var geometry, material; // Tmp variables
		
		// Remove this plane once floor tiles are ok
		//var w = plane_dimension.w, h = plane_dimension.h;
		//geometry = new THREE.PlaneGeometry( w,h, w,h ); 
		//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(w/2,h/2,0) );
		//material = new THREE.MeshBasicMaterial( {color: 0x606060, wireframe: true, linewidth: 1} ); 
		//glob_scene.planeMesh = new THREE.Mesh( geometry, material ); 
		//glob_scene.scene.add( glob_scene.planeMesh )
	
		
		/* Load textures and create materials */
		//PART 1- H5
		var texs = [], materials = [],multimaterial;
		texs.push(THREE.ImageUtils.loadTexture("textures/crate.jpg"));
		texs.push(THREE.ImageUtils.loadTexture( "textures/crateUV.jpg" ));
		texs.push(THREE.ImageUtils.loadTexture( "textures/floor1.png" ));
		texs.push(THREE.ImageUtils.loadTexture( "textures/brick-c.jpg " ));
		
		for (var k = 0; k < texs.length; k++) {
			materials.push(new THREE.MeshPhongMaterial({map:texs[k],side:THREE.DoubleSide}));
		}
		multimaterial = new THREE.MeshFaceMaterial(materials);
		
		// TODO: Define materials[i] for i=0..3

		// TODO: Define multimaterial
		
				
		/* Create maze mesh */
		
		// TODO: replace uniform color by crateUV texture
		
		
		//Commented due to unnecesary features
		//PART 1- H1-H2
		//material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
		//
		//
		//Removed single tiles creation
		//geometry = createXYTile(0,0,0,0);
		//glob_scene.tileMesh = new THREE.Mesh( geometry, material ); 
		//glob_scene.scene.add(glob_scene.tileMesh);
		// TODO: add XZ and YZ tiles
		//XZ tiles
	   // geometry = createXZTile(0,0,0,0);
		//glob_scene.tileMesh = new THREE.Mesh( geometry, material ); 
		//glob_scene.scene.add(glob_scene.tileMesh);
		//YZ tiles
		//geometry = createYZTile(0,0,0,geometry);
		//glob_scene.tileMesh = new THREE.Mesh( geometry, material ); 
		//glob_scene.scene.add(glob_scene.tileMesh)
		
		
		//PART 1- H3-H4
		 material = new THREE.MeshPhongMaterial( {map: texs[0], side:THREE.DoubleSide } );
		// TODO: complete createFloorGeometry function
		 geometry = createFloorGeometry(new THREE.Geometry(),texs.length-1);
		 glob_scene.floorMeshmesh = new THREE.Mesh( geometry, multimaterial );
		 glob_scene.scene.add( glob_scene.floorMeshmesh );
		
		// TODO: complete createWallGeometry function	
		geometry = createWallGeometry(geometry,texs.length-1);
		glob_scene.wallMesh = new THREE.Mesh( geometry, multimaterial );
		glob_scene.scene.add( glob_scene.wallMesh );
		
		
		
		//Commented due to unnecesary features
		// Helper to see the walls from cameras[2] top view
		//wire = new THREE.WireframeHelper( wallMesh, 0x0000ff );
		//wire.material.linewidth = 3
		//scene.add( wire );
		
		
		/* Create hero mesh */
		 //Commented due to unnecesary features
		//geometry = new THREE.BoxGeometry(0.5,0.3,0.6);
		//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,0.3));
		//geometry.merge( new THREE.SphereGeometry(0.2,20,20), new THREE.Matrix4().makeTranslation(0,0,0.8), 0 );
		//material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
		//hero.mesh = new THREE.Mesh( geometry, material ); 
		//glob_scene.scene.add( hero.mesh );
		//PART 1- H6
		 hero.position.x = hero.position.y = 0.5;
		// TODO: replace box and sphere hero with mesh loaded from JSON file
		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
		var loader = new THREE.JSONLoader();
		var onJSONLoaded = function ( geometry, materials ) {
			//Assigning to the hero (character object) the mesh from the loaded dds
			hero.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			//initializing matrixes
			//var mat = new THREE.Matrix4(), mat0= new THREE.Matrix4(),mat1=new THREE.Matrix4();
			//Steps for making the object appear in the right position
			hero.mesh.geometry.applyMatrix((new THREE.Matrix4()).makeTranslation(0,0,0));
			hero.mesh.geometry.applyMatrix((new THREE.Matrix4()).scale(new THREE.Vector3(0.01,0.01,0.01)));
			hero.mesh.geometry.applyMatrix((new THREE.Matrix4()).makeRotationY(degToRad(180)));
			hero.mesh.geometry.applyMatrix((new THREE.Matrix4()).makeRotationX(degToRad(90)));		   
			//mat0.makeRotationZ(degToRad(180));
			//mat1.makeRotationX(degToRad(90));
			//mat.multiplyMatrices(mat0,mat1);  
			//mat.scale(new THREE.Vector3(0.01,0.01,0.01));
			//mat.setPosition(new THREE.Vector3(0.5,0.5,0));
			//applying the matrix object
			//hero.mesh.geometry.applyMatrix(mat);
			hero.mesh.position.set(hero.position.x, hero.position.y, 0);
			hero.mesh.rotation.set(0,0,degToRad(hero.position.az),"ZXY");
			glob_scene.scene.add( hero.mesh );
		}
		loader.load( 'obj/male02/Male02_dds.js', onJSONLoaded);



		
			
		/* Create lights */
		   
		var light = new THREE.AmbientLight( 0x808080 ); // soft white light 
		glob_scene.scene.add( light );
		
		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set( 2,2, 5 );
		glob_scene.scene.add( directionalLight );
		
		

		
		/* Create Controllers */
		//Initiate Handlers & Controllers
		initMouse(canvas);
		initKeyboard(canvas);
		initGUI();

		// Start rendering loop
		tick();
	}

	//Only exposing the function webGLStart to the outer world, everything else will be unaccesable by the outer world;
	window.webGLStart = webGLStart;
	
})(window); //Passing the window object 