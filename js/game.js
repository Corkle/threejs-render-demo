// *********** GLOBALS ***********
// scene variables
var renderer, scene, camera, pointLight;

// field variables
var fieldWidth = 400,
    fieldHeight = 200;
    
// game object variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;


function setup() {
    // set the scene size
    var WIDTH = 640,
        HEIGHT = 360;
    
    // set camera attributes
    var VIEW_ANGLE = 50,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
        
    // create a WebGL renderer, camera and a scene
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene = new THREE.Scene();
    
    // add the camera to the scene
    scene.add(camera);
    
    // set a default position for the camera
    camera.position.z = 320;
    
    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);
    
    // attach the render-supplied DOM element (the gameCanvas)
    var c = document.getElementById("gameCanvas");
    c.appendChild(renderer.domElement);
    
    // add sphere to the scene
    ball = create_sphere(5, 10, 16);
    scene.add(ball);
    
    // create the plane's material
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0x4BD121});
    
    var planeWidth = fieldWidth,
        planeHeight = fieldHeight,
        planeQuality = 10;
    
    // create the playing surface plane
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planeWidth * 0.95, // 95% of table width to show where ball goes out of bounds.
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial);
            
    scene.add(plane);
    
    var paddle1Material = new THREE.MeshLambertMaterial({color: 0x1B32C0}),
        paddle2Material = new THREE.MeshLambertMaterial({color: 0xFF4045});
    
    // set up the paddle vars
    var paddleWidth = 10,
        paddleHeight = 30,
        paddleDepth = 10,
        paddleQuality = 1;
        
    // set up paddle 1
    paddle1 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle1Material);
    
    scene.add(paddle1);
    
    // set up paddle 2
    paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle2Material);
    
    scene.add(paddle2);
    
    // set paddles on each side of the table
    paddle1.position.x = -fieldWidth/2 + paddleWidth;
    paddle2.position.x = fieldWidth/2 - paddleWidth;
    
    // lift paddles over playing surface
    paddle1.position.z = paddleDepth;
    paddle2.position.z = paddleDepth;
    
    // create a point light
    pointLight = new THREE.PointLight(0xF8D898);
    
    // set its position
    pointLight.position.x = 500;
    pointLight.position.y = 600;
    pointLight.position.z = 900;
    pointLight.intensity = 2.5;
    pointLight.distance = 10000;
    
    // add to the scene
    scene.add(pointLight);

    draw();
}

function draw() {
    // draw THREE.JS scene
    renderer.render(scene, camera);
    
    // loop the draw() function    
    requestAnimationFrame(draw);
    
    ballPhysics();
    playerPaddleMovement();
    
    camera.position.x = paddle1.position.x - 100;
    camera.position.z = paddle1.position.z + 100;
    camera.rotation.z = -90 * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;
}

function ballPhysics() {
    // if the ball goes off the top side (side of table)
    if (ball.position.y <= -fieldHeight/2) {
        ballDirY = -ballDirY;
    }
    
    //if the ball goes off the bottom side (side of table)
    if (ball.position.y >= fieldHeight/2) {
        ballDirY = -ballDirY;
    }
    
    //update ball position over time
    ball.position.x += ballDirX * ballSpeed;
    ball.position.y += ballDirY * ballSpeed;
}

function playerPaddleMovement() {
    // move left
    if (Key.isDown(Key.A)) {
        // if paddle is not touching the side of table we move
        if (paddle1.position.y < fieldHeight * 0.45) {
            paddle1DirY = paddleSpeed * 0.5;
        }
        // else we don't move and stretch the paddle to indicate we can't move
        else {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    // move right
    else if (Key.isDown(Key.D)) {
        if (paddle1.position.y > -fieldHeight * 0.45) {
            paddle1DirY = -paddleSpeed * 0.5;
        }
        else {
            paddle1DirY = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    // else don't move
    else {
        paddle1DirY = 0;
    }
    
    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1DirY;
}

function create_sphere(radius, segments, rings) {
    // create the sphere's material
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xD43001});
    
    // create a ball with sphere geometry
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, rings),
        sphereMaterial);
    
    return sphere;
}