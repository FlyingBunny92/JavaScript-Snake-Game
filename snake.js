
// JavaScript Snake example
// Author Jan Bodnar
// http://zetcode.com/javascript/snake/

var canvas;
var ctx;

var head;
var apple;
var ball;

var dots;
var apple_x;
var apple_y;

var score = 0;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;    

const DOT_SIZE = 10;
const ALL_DOTS = 900;
const HISTORY = 900*2;
const MAX_RAND = 29;
const DELAY = 140;
const C_HEIGHT = 300;
const C_WIDTH = 300;    

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);   


var x_history = new Array(HISTORY);
var y_history = new Array(HISTORY);

function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');

    loadImages();
    createSnake();
    locateApple();
    setTimeout("gameCycle()", DELAY);
}    

function restart() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    score = 0;
    document.getElementById('num').value = new Number(score);
    loadImages();
    createSnake();
    locateApple();
    setTimeout("gameCycle()", DELAY);
}    


function loadImages() {
    
    head = new Image();
    head.src = 'head.png';    
    
    ball = new Image();
    ball.src = 'dot.png'; 
    
    apple = new Image();
    apple.src = 'candy_piece.png'; 
}

function createSnake() {
    dots = 3;
    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * 10;
        y[z] = 50;
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  
  function setRandomColor() {
    $("#colorpad").css("background-color", getRandomColor());
  }

function doDrawing() {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.fillStyle = getRandomColor();
                ctx.fillRect(x[z], y[z], 10, 10);
                //ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();
    }        
}

function gameOver() {
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
}

function checkApple() {
    if ((x[0] == apple_x) && (y[0] == apple_y)) {
        score++;
        document.getElementById('num').value = new Number(score);
        highscore = document.getElementById('highscore').value;
        if(score > highscore){
            highscore = score;
            document.getElementById('highscore').value = new Number(highscore);
        }
        dots++;
        locateApple();
    }
}


function computeDirection() {
    dir_x = apple_x - x[0];
    dir_y = apple_y - y[0];
    return [dir_x, dir_y];
}

function checkSafe(x, y, x_history, y_histoy) {
    var dir = computeDirection();
    var x_dir = DOT_SIZE;
    var y_dir = DOT_SIZE;
    if(dir[0] > 0){
        x_dir = DOT_SIZE;
    }else if(dir[0] < 0){
        x_dir = -DOT_SIZE;
    }else if(dir[1] > 0){
        y_dir = DOT_SIZE;
    }else if(dir[1] < 0){
        y_dir = -DOT_SIZE;
    }
    for (var z = 0; z > x_history.length; z++) {
        if((x_history[z] == x[0]+x_dir) && (y_histoy[z] == y[0]+y_dir)){
            return false;
        }
    }
    return true;
}

function changeDirection() {
    var dir = computeDirection();
    if(dir[0] > 0){
        dir[0] *= -1;
    }else if(dir[0] < 0){
        dir[0] *= -1;
    }else if(dir[1] > 0){
        dir[1] *= -1;
    }else if(dir[1] < 0){
        dir[1] *= -1;
    }
    return true;
}

function shift_elements_in_array(arr) {
    for (var z = 0; z > arr.length-1; z++) {
        arr[z+1] = arr[z];
    }
}

function move() {
    var dir = computeDirection();
    var safe = checkSafe(x, y, dir);
    console.log("safe:", safe);
    var dir = computeDirection();
    if(safe==false){
        var result = changeDirection();
        console.log("result:", result);
    }
    shift_elements_in_array(x_history);
    shift_elements_in_array(y_history);
    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }
    if(dir[0] > 0){
        x[0] += DOT_SIZE;
        x_history[0] += DOT_SIZE;
    }else if(dir[0] < 0){
        x[0] -= DOT_SIZE;
        x_history[0] -= DOT_SIZE;
    }else if(dir[1] > 0){
        y[0] += DOT_SIZE;
        y_history[0] += DOT_SIZE;
    }else if(dir[1] < 0){
        y[0] -= DOT_SIZE;
        y_history[0] -= DOT_SIZE;
    }
    var dir = computeDirection();
}    

function checkCollision() {

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}

function locateApple() {

    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    

function gameCycle() {
    
    if (inGame) {

        checkApple();
        checkCollision();
        move();
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}

onkeydown = function(e) {
    
    var key = e.keyCode;

    
    if ((key == LEFT_KEY) && (!rightDirection)) {
        
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == RIGHT_KEY) && (!leftDirection)) {
        
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == UP_KEY) && (!downDirection)) {
        
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }

    if ((key == DOWN_KEY) && (!upDirection)) {
        
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }        
};    
