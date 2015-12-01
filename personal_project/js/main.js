// GUI
    
    var params = {
        'az0': -20.0,
        'el0': 30.0,
        'd0' : 8.0
    }
    var gui;
    function initGUI() {
        gui = new dat.GUI({ autoPlace: true })

        gui.add(params, 'az0').min(-180).max(+180).listen();
        gui.add(params, 'el0').min(-90).max(+90).listen();
        gui.add(params, 'd0').min(+1).max(+100).listen();
    }


    // Mouse controls
    
    var mouseState = 0
    var mouse = new THREE.Vector2()
    
    function initMouse(canvas) {
        canvas.onmousemove = handleMouseMove;
        canvas.onmousedown = handleMouseDown;
        canvas.onmouseleave = function() {mouseState = 0; mouse.x=0; mouse.y=0};
    }
    function handleMouseDown(event) {
        // Get mouse position in normalized coordinates [-1, +1]
        var rect = event.target.getBoundingClientRect()
        mouse.x = (event.clientX - rect.left) / (rect.right-rect.left) * 2 - 1
        mouse.y = -(event.clientY - rect.top) / (rect.bottom-rect.top) * 2 + 1
        console.log(mouse)
    }
    function handleMouseMove(event) {
    }


    // Keyboard controls
    
    var currentlyPressedKeys = {};
    
    function initKeyboard(canvas, onKeyDown, onKeyUp) {
        // add tabindex attribute to canvas to allow it getting keyboard focus
        // Same as declaring <canvas tag='webgl-canvas' tabindex='1'></canvas> in HTML
        canvas.setAttribute('tabindex',1);
        // Give focus to canvas by default and each time mouse enters 
        // to improve user experience by handling keyboard out of the box
        canvas.focus();
        canvas.onmouseenter = (function () {canvas.focus()});
        //canvas.onmouseleave = (function () {canvas.blur()});
        
        canvas.onkeydown = handleKeyDown;
        canvas.onkeyup = handleKeyUp;
    }
    function handleKeyDown(event) {
        var keyCode = event.keyCode;
        currentlyPressedKeys[keyCode] = true;
        
        // Display pressed keys for debugging. Comment if too verbose
        console.log('KeyDown: keycode = '+keyCode.toString());
        
        if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40) {
            // Arrow keys: prevent default handling (i.e. avoid scrolling)
            event.preventDefault();
            // Arrows are handled using polling in handleKeys
        } else if (event.key == 'v') {
            // Change current camera
            cameraId = (cameraId+1)%3
            camera = cameras[cameraId]
            console.log('cameraId = '+cameraId.toString()+", camera = ",cameras[cameraId])
            //var messagebox = document.getElementById("messagebox");
            messagebox.innerHTML = 'Camera '+cameraId
        }
        if (event.key == 'c') {
            // Check victory
        }
    }
    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }
    
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
        daz = 0  // Rotation control
        if (currentlyPressedKeys[37] /* Left */) { daz = 1 }
        if (currentlyPressedKeys[39] /* Right */) { daz = -1 }
        dx = 0; dy = 0;  // Position control
        if (currentlyPressedKeys[38] /* Up */) {
            dx = -Math.sin(degToRad(az))
            dy = Math.cos(degToRad(az))
        }
        if (currentlyPressedKeys[40] /* Down */) {
            dx = Math.sin(degToRad(az))
            dy = -Math.cos(degToRad(az))
        }
        
        /* WARNING: Setting cameras and hero new position is done in animate() */
    }


    // Animation

    var lastTime = 0, elapsed = 0
    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) { elapsed = (timeNow - lastTime)/1000; }
        lastTime = timeNow;
        
        /* Hero collision detection */
        var d2 = dx*dx + dy*dy
        if (d2>0) {
            // If we are moving, check for collisions
            // TODO
        }
        
        /* Update Hero Position */
        var velocity = 1/0.4      // Move 1 unit in 0.4s
        var anglevelocity = 360/2 // Turn 360 deg in 2s
        posx += dx * elapsed * velocity
        posy += dy * elapsed * velocity
        az   += daz * elapsed * anglevelocity

        hero.position.set(posx,posy, 0)
        hero.rotation.set(0,0,degToRad(az),"ZXY")
       
        /* Cameras update */
            
        var az0 = params.az0, el0 = params.el0, d0 = params.d0
        
        // Uncomment to look at maze center instead of origin
        //var target = new THREE.Vector3(maze.w/2,maze.h/2,0)
        var target = new THREE.Vector3(0,0,0)
        cameras[0].position.set(
                target.x-d0*Math.cos(degToRad(el0))*Math.sin(degToRad(az0)),
                target.y-d0*Math.cos(degToRad(el0))*Math.cos(degToRad(az0)),
                target.z+d0*Math.sin(degToRad(el0)))
        cameras[0].up.set(0,0,1)
        cameras[0].lookAt(target)
        cameras[0].updateMatrixWorld()
        camerasHelpers[0].update()
            
        cameras[1].position.set(posx,posy, 0.85)
        // Euler angles in ZXY order:
        // First rotate az degrees around Z for the direction, then
        // rotate 90 deg around X to get the direction Z_camera pointing backward
        cameras[1].rotation.set(degToRad(90),0,degToRad(az),"ZXY") 
        cameras[1].updateMatrixWorld()
        camerasHelpers[1].update()
    }

    function tick() {
        requestAnimationFrame(tick);
        handleKeys();
        animate();
        renderer.render(scene, camera);
    }


    // Global variables for the Model
    
    /* Plane dimensions */
    var w = 5, h = 6
    /* Hero position */
    var posx = 0, posy = 0, az = 0
    /* Hero motion */
    var dx=0,dy=0,daz=0


    createXYTile = function(x,y,z,materialIndex) {
        var geometry = new THREE.Geometry()
        
        var nvertices = geometry.vertices.length
        geometry.vertices.push( 
            new THREE.Vector3( x  , y  , z ),
            new THREE.Vector3( x+1, y  , z ), 
            new THREE.Vector3( x+1, y+1, z ),
            new THREE.Vector3( x  , y+1, z ) 
        );
        
        var nfaces = geometry.faces.length
        geometry.faces.push( 
            new THREE.Face3( nvertices, nvertices+1, nvertices+2, null, null, materialIndex),
            new THREE.Face3( nvertices, nvertices+2, nvertices+3, null, null, materialIndex)
        )
        
        // TODO: append UV coordinates to each vertex in each face
        //geometry.faceVertexUvs[0]
        
        return geometry
    }
    createXZTile = function(x,y,z,materialIndex) {
        var geometry 
        // TODO
        return geometry
    }
    createYZTile = function(x,y,z,materialIndex) {
        var geometry         
        // TODO
        return geometry
    }
    
    createFloorGeometry = function() {
        geometry = new THREE.Geometry();

        // TODO
        
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        return geometry;
    }
    createWallGeometry = function() {
        geometry = new THREE.Geometry();

        // TODO
        
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        return geometry;
    }


    // Global variables for the View

    var renderer;
    var scene, camera
    var cameraId
    
    var cameras = []
    var camerasHelpers = []
    var axisHelper, plane
    
    var planeMesh, tileMesh, floorMesh, wallMesh
    
    
    function webGLStart() {
    
        /* Initialize WebGL renderer and create scene */
    
        var canvas = document.getElementById("canvas");
        renderer = new THREE.WebGLRenderer({
            'canvas': canvas, 
            maxLights: 6, 
            preserveDrawingBuffer: true,
            shadowMapEnabled: true  // Remove if performance issues
            }); 
        renderer.setClearColor(0xffffff)
        //renderer.setClearColor(0x000000)
        
        scene = new THREE.Scene(); 
        
        /* Create cameras */
        // Note: look in animate() for the setting of cameras position and orientation
        cameras[0] = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.005, 100);
        cameras[1] = new THREE.PerspectiveCamera( 100, canvas.width / canvas.height, 0.005, 100);        
        var W = Math.max(w, h)
        cameras[2] = new THREE.OrthographicCamera( -1, W+1, W+1, -1, -10, 10);        
        
        // Define current camera
        cameraId = 0
        camera = cameras[cameraId]
        
        /* Helpers: additional objects in the scene useful for debugging */
        // Invisible by default
        
        for (var i=0; i<cameras.length; i++) {
            camerasHelpers[i] = new THREE.CameraHelper(cameras[i])
            camerasHelpers[i].visible = false // Set to true to show cameras positions
            scene.add( camerasHelpers[i] )
        }
        
        axisHelper = new THREE.AxisHelper( 1 ); // Axis length = 2
        axisHelper.material.linewidth = 7
        axisHelper.position.set(0,0,0)
        scene.add( axisHelper );
        

        var geometry, material // Tmp variables
        
        // Remove this plane once floor tiles are ok
        geometry = new THREE.PlaneGeometry( w,h, w,h ); 
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(w/2,h/2,0) );
        material = new THREE.MeshBasicMaterial( {color: 0x606060, wireframe: true, linewidth: 1} ); 
        planeMesh = new THREE.Mesh( geometry, material ); 
        scene.add( planeMesh )
    
        
        /* Load textures and create materials */
        
        var tex, tex_n, materials = []
        
        // TODO: Define materials[i] for i=0..3

        // TODO: Define multimaterial
        
                
        /* Create maze mesh */
        
        // TODO: replace uniform color by crateUV texture
        
        material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
        geometry = createXYTile(0,0,0, 0)
        tileMesh = new THREE.Mesh( geometry, material ); 
        scene.add(tileMesh)
        
        // TODO: add XZ and YZ tiles

        // TODO: complete createFloorGeometry function
        // geometry = createFloorGeometry()
        // mesh = new THREE.Mesh( geometry, material );
        // scene.add( mesh );
        
        // TODO: complete createWallGeometry function    
        // geometry = createWallGeometry()
        // wallMesh = new THREE.Mesh( geometry, material );
        // scene.add( wallMesh );
        
        // Helper to see the walls from cameras[2] top view
        //wire = new THREE.WireframeHelper( wallMesh, 0x0000ff );
        //wire.material.linewidth = 3
        //scene.add( wire );
        
        
        /* Create hero mesh */

        posx = 0
        posy = 0
        
        geometry = new THREE.BoxGeometry(0.5,0.3,0.6)
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,0.3))
        geometry.merge( new THREE.SphereGeometry(0.2,20,20), new THREE.Matrix4().makeTranslation(0,0,0.8), 0 )
        material = new THREE.MeshPhongMaterial( {color: 0xff0000} ); 
        hero = new THREE.Mesh( geometry, material ); 
        scene.add( hero );

        // TODO: replace box and sphere hero with mesh loaded from JSON file
        //THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        //var loader = new THREE.JSONLoader();
        //var onJSONLoaded = function ( geometry, materials ) {
        //    hero = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        //    hero.geometry.applyMatrix( XXX TODO XXX );
        //    scene.add( hero );
		//}
        //loader.load( 'obj/male02/Male02_dds.js', onJSONLoaded);



        
            
        /* Create lights */
           
        var light = new THREE.AmbientLight( 0x808080 ); // soft white light 
        scene.add( light );
        
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        directionalLight.position.set( 2,2, 5 );
        scene.add( directionalLight );
        
        

        
        /* Create Controllers */
        
        initMouse(canvas);
        initKeyboard(canvas);
        initGUI()

        // Start rendering loop
        tick();
    }
