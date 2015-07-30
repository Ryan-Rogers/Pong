
// Variable declarations
var userPaddle;
var cpuPaddle;
var mouseX;
var mouseY;
var logoObject;
var gameBackground;
var scoreText;
var canvasDisplay;
var pongCanvas;
var pongContext;

// Variable definitions
var pongPaused = true;
var logoImage = new Image();
var bluePaddle = new Image();
var redPaddle = new Image();
var ballImage = new Image();
var bgImage = new Image();
var frame = 0;

// Image paths
bgImage.src = "images/0320x180.jpg";
logoImage.src = "images/0logo.png";
bluePaddle.src = "images/0bluePaddle.png";
redPaddle.src = "images/0redPaddle.png";
ballImage.src = "images/0ball.png";

// Objects to update
var mapObjects = [];

// Creating canvas and context
var pongCanvas = document.createElement("canvas");
pongContext = pongCanvas.getContext("2d");
document.body.appendChild(pongCanvas);
// pongCanvas = document.getElementById("pongCanvas");

// Play button
var togglePongCanvas = function() {
    // Enabling canvas
    if(pongCanvas.style.display === "none") {
        pongCanvas.style.display = canvasDisplay;
        document.getElementById("pongButton").value="Close";
        pongPaused = false;
    // Disabling canvas 
    } else {
        canvasDisplay = pongCanvas.style.display;
        pongCanvas.style.display = "none";
        document.getElementById("pongButton").value="Play";
        pongPaused = true;
    }
};

// Sets canvas size to largest avaible 16:9 space
var drawCanvas = function() {
    if((window.innerWidth / 16) * 9 <= window.innerHeight) {
        pongCanvas.width = window.innerWidth;
        pongCanvas.height = (pongCanvas.width / 16) * 9;
    } else {
        pongCanvas.width = (window.innerHeight / 9) * 16;
        pongCanvas.height = window.innerHeight;
    }
};

// Redrawing canvas on window resize
window.onresize = function() {
    drawCanvas();
};

// Touch
document.addEventListener("touchstart",
    function(event){
        updateMouse(event);
    }
);

// Increments the current ball image
var updateBallFrame = function(){
    var newSrc;
    newSrc = ballImage.src.replace("images/0ball.png", "images/1ball.png");
    if(newSrc === ballImage.src){
        newSrc = ballImage.src.replace("images/1ball.png", "images/2ball.png");
        if(newSrc === ballImage.src){
            newSrc = ballImage.src.replace("images/2ball.png",
                    "images/3ball.png");
            if(newSrc === ballImage.src){
                newSrc = ballImage.src.replace("images/3ball.png",
                        "images/0ball.png");
            }
        }
    }
    ballImage.src = newSrc;
};

// Moves the input paddle to the input Y
var movePaddle = function(paddle, newY){
    if(paddle.y !== newY) {
        paddle.y = newY;
    }
};

// Updates the balls location
var moveBall = function(inputBall) {
    paddleCollisionCheck(inputBall);
    inputBall.x = inputBall.x - (inputBall.left * inputBall.speed);
    inputBall.y = inputBall.y - (inputBall.up * inputBall.speed);
};

// Removes the input object from mapObjects
var removeMapObject = function(mapObject){
    var index = mapObjects.indexOf(mapObject);
    if(index > -1){
        mapObjects.splice(index, 1);
    }
};

// Checks if the ball has collided with any walls or paddles
var paddleCollisionCheck = function(inputBall){
    // Ball cpuPaddle collision
    if(collision(inputBall, cpuPaddle)){
        ballPaddleCollision(inputBall);
    // Ball userPaddle collision
    }else if(collision(userPaddle, inputBall)){
        scoreText.score += Math.abs(inputBall.up) * 100;
        scoreText.score += Math.abs(inputBall.left) * 100;
        scoreText.score = Math.round(scoreText.score);
        ballPaddleCollision(inputBall);
    // Ball North wall collision
    } else if(inputBall.y - (inputBall.height / 2) < 0){
        ballWallCollision(inputBall);
    // Ball South wall collision
    } else if(inputBall.y + (inputBall.height / 2)
            > pongCanvas.height){
        ballWallCollision(inputBall);
    // Ball West wall collison
    } else if(inputBall.x - (inputBall.width / 2) < 0){
        removeMapObject(inputBall);
        mapObjects.push(new newBall());
        scoreText.score -=
                Math.abs(inputBall.up * inputBall.left * 150);
        scoreText.score = Math.round(scoreText.score);
        pause();
    // Ball East wall collison
    } else if(inputBall.x + (inputBall.width / 2) > pongCanvas.width){
        removeMapObject(inputBall);
        mapObjects.push(new newBall());
        scoreText.score +=
                Math.abs(inputBall.up * inputBall.left * 200);
        scoreText.score = Math.round(scoreText.score);
        pause();
    }
};

// Checks if the two objects have collided along their sides
var collision = function(left, right){
    if(left !== undefined && right !== undefined){
        if(right.y + (right.height / 2)
                >= left.y - (left.height / 2)
                && right.y - (right.width / 2)
                <= left.y + (left.height / 2)){
            if(right.x - (right.width / 2)
                    <= left.x + (left.width / 2)){
                return true;
            }
            return false;
        }
    }
};

// Returns a static ball in the middle of the window
var newBall = function(){
    var tempBall = new canvasObject("#66FFCC", // Blue
            pongCanvas.width / 35, pongCanvas.width / 35,
            pongCanvas.width / 2, pongCanvas.height / 2, 5, ballImage);
    tempBall.left = -2;
    tempBall.up = 1;
    tempBall.previousLeft = 0;
    tempBall.previousUp = 0;
    return tempBall;
};

// Updates the balls horizontal speed
var ballPaddleCollision = function(inputBall){
    inputBall.left *= -1.1;
};

// Updates the balls vertical speed
var ballWallCollision = function(inputBall){
    inputBall.up *= -1.1;
};

// Mouse move
/*
// Mouse Move
document.onmousemove = function(event) {
    mouseY = event.pageY;
    mouseX = event.pageX;

    // Updating userPaddle position
    undraw(userPaddle);
    userPaddle.y = mouseY - (userPaddle.height / 2);
    draw(userPaddle);

    // DEBUG
    console.log("Mouse (" + mouseX + ", " + mouseY + ")");
};
*/

// Mouse click
document.addEventListener("mousedown",
    function(event) {
        updateMouse(event);
    }
);

// Keyboard press
/*
// Keyboard Click
var currentKey;
var keyPressed;
document.addEventListener("keydown",
    function(evt) {
        keyPressed = true;
        currentKey = evt.keyCode;
        console.log("Pressed " + currentKey); // DEBUG
    }
);
document.addEventListener("keyup",
    function(evt) {
        keyPressed = false;
    }
);
*/

// Game Objects
// Canvas object constructor
var canvasObject = function(newColor, newHeight, newWidth, newX, 
        newY, newSpeed, newImage){
    this.color = newColor;
    this.height = newHeight;
    this.width = newWidth;
    this.x = newX;
    this.y = newY;
    this.speed = newSpeed;
    this.image = newImage;
    this.frame = 0;
};

// Text object consutrctor
var textObject = function(newFont, newFillStyle, newAlignment, newText,
        newX, newY){
    this.font = newFont;
    this.fillStyle = newFillStyle;
    this.alignment = newAlignment;
    this.text = newText;
    this.x = newX;
    this.y = newY;
    this.score = 0;
};

// Draws the input object
var draw = function(input) {
    if(input !== undefined){
        // Imageless, textless object
        if(input.image === undefined && input.text === undefined){
            pongContext.fillStyle = input.color;
            pongContext.fillRect(input.x - (input.width / 2),
                input.y - (input.height / 2),
                input.width, input.height
            );
        // Image object
        } else if(input.text === undefined){
            pongContext.drawImage(input.image,
                input.x - (input.width / 2),
                input.y - (input.height / 2),
                input.width, input.height
            );
        // Text object
        } else {
            pongContext.font = input.font;
            pongContext.fillStyle = input.fillStyle;
            pongContext.textAlign = input.alignment;
            pongContext.fillText(input.text + input.score, input.x,
                    input.y);
        }
    }
};

// Executes on mouseX or mouseY change
var updateMouse = function(event) {
    // Click outside of canvas
    if(event.pageX < 0 || event.pageX > pongCanvas.width
            || event.pageY < pongCanvas.offsetTop 
            || event.pageY > pongCanvas.height + pongCanvas.offsetTop){
        // Pausing the game is not already paused
        if(!paused){
            pause();
        }
    // Click is within canvas
    } else {
        // Game is paused
        if(paused) {
            unpause();
        // Game NOT paused
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY - pongCanvas.offsetTop;
        }
    }
};

// Pauses the game
var pause = function(){
    paused = true;
    for(index = 0; index < mapObjects.length; index++){
        if(mapObjects[index].left !== undefined){
            mapObjects[index].previousLeft = mapObjects[index].left;
            mapObjects[index].left = 0;
            mapObjects[index].previousUp = mapObjects[index].up;
            mapObjects[index].up = 0;
        }
    }
    mapObjects.push(logoObject);
};

// Unpauses the game
var unpause = function(){
    paused = false;
    for(index = 0; index < mapObjects.length; index++){
        if(mapObjects[index].left !== undefined){
            mapObjects[index].left = mapObjects[index].previousLeft;
            mapObjects[index].up = mapObjects[index].previousUp;
        }
    }
    removeMapObject(logoObject);
};

// Object move to object
var moveTo = function(predator, preyY){
    if(predator === undefined
            || preyY === undefined){
        // Undefined input --  Do nothing
    } else if(predator.y === preyY){
        // At location -- Do nothing
    } else if(predator.y - predator.speed > preyY){
        movePaddle(predator, predator.y - predator.speed);
    } else if(predator.y + predator.speed < preyY){
        movePaddle(predator, predator.y + predator.speed);
    } else {
        movePaddle(predator, preyY);
    }
};

// Draws all objects in mapObjects
var updateMap = function(){
    if(userPaddle.y !== mouseY){
        if(userPaddle.y > mouseY){
            bluePaddle.src = "images/1bluePaddle.png";
        } else {
            bluePaddle.src = "images/2bluePaddle.png";
        }
    } else {
        bluePaddle.src = "images/0bluePaddle.png";
    }
    moveTo(userPaddle, mouseY);
    for(index = 0; index < mapObjects.length; index++){
        if(mapObjects[index].left !== undefined){
            // moveTo(cpuPaddle, mapObjects[index].y);
            if(cpuPaddle.y !== mapObjects[index].y){
                if(cpuPaddle.y > mapObjects[index].y){
                    redPaddle.src = "images/1redPaddle.png";
                } else {
                    redPaddle.src = "images/2redPaddle.png";
                }
            } else {
                redPaddle.src = "images/0redPaddle.png";
            }
            moveTo(cpuPaddle, mapObjects[index].y);
            index = mapObjects.length;
        }
    }
    for(index = 0; index < mapObjects.length; index++){
        if(mapObjects[index].left !== undefined){
            moveBall(mapObjects[index]);
        }
    }
    pongContext.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
    for(index = 0; index < mapObjects.length; index++){
        draw(mapObjects[index]);
    }
    if(!paused){
        frame += 1;
        if(frame > 60){
            frame = 0;
        }
        if(frame % 2 === 0){
            updateBallFrame();
        }
    }
};

// Window loadtime executed function
window.onload = function() {
    // Canvas
    // togglePongCanvas();
    drawCanvas();
    mouseY = pongCanvas.height / 2; // Moving userPaddle to center

    // Map objects
    // color, height, width, x, y, speed, image
    gameBackground = new canvasObject("#000",
            pongCanvas.height, pongCanvas.width,
            pongCanvas.width / 2, pongCanvas.height / 2, 0, bgImage);
    cpuPaddle = new canvasObject("#FF0066",
            pongCanvas.width / 8, pongCanvas.width / 50,
            pongCanvas.width - (pongCanvas.width / 50), pongCanvas.height,
            10, redPaddle);
    userPaddle = new canvasObject("#66FF66",
            pongCanvas.width / 8, pongCanvas.width / 50,
            pongCanvas.width / 50, 0, 20, bluePaddle);
    logoObject = new canvasObject("#FFF", pongCanvas.width / 4,
            pongCanvas.width / 4, pongCanvas.width / 1.6,
            pongCanvas.height / 1.5, 0, logoImage);

    // Text objects
    // font, fillStyle, alignment, text, x, y
    scoreText = new textObject("30px Agency FB", "#FF0066", "left",
            "Score  ", pongCanvas.width / 80,
            pongCanvas.height / 15);
    mapObjects = [gameBackground, userPaddle, cpuPaddle, newBall(),
            scoreText];

    pause();
    // Game
    var test;
    function updateMapLoop() {
        test = setInterval(updateMap, 1000/30);
    }
    updateMapLoop();
};