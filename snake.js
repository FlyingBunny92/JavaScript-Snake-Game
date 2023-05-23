
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

var score_sum = 0;
var runs = 0;
var score = 0;
var highscore = 0;

var newApple = false;
var path = [];

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
    score = 0;
    getHighscore();
    getAvgscore();
    document.getElementById('num').value = new Number(score);
    document.getElementById('highscore').value = new Number(highscore);
    document.getElementById('avgscore').value = new Number(avgscore);
    loadImages();
    createSnake();
    locateApple();
    findPath();
    setTimeout("gameCycle()", DELAY);
}    

function restart() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    score = 0;
    getHighscore();
    getAvgscore();
    document.getElementById('num').value = new Number(score);
    document.getElementById('highscore').value = new Number(highscore);
    document.getElementById('avgscore').value = new Number(avgscore);
    loadImages();
    createSnake();
    locateApple();
    findPath();
    setTimeout("gameCycle()", DELAY);
}

function clear() {
    console.log("function clear()")
    // localStorage.removeItem('score_sum');
    // localStorage.removeItem('runs');
    // localStorage.removeItem('highscore');
    // localStorage.removeItem('avgscore');
    document.getElementById('num').value = new Number(0);
    document.getElementById('highscore').value = new Number(0);
    document.getElementById('avgscore').value = new Number(0);
}

function getHighscore() {
    if (localStorage.getItem("highscore") != null) {
        highscore = parseInt(localStorage.getItem("highscore"));
    }
    if(score > highscore){
        highscore = score;
    }
}

function getAvgscore() {
    // localStorage.setItem("avgscore", 0);
    if (localStorage.getItem("avgscore") != null) {
        avgscore = parseInt(localStorage.getItem("avgscore"));
    }else{
        localStorage.setItem("avgscore", 0);
    }
    if(score > avgscore){
        avgscore = score;
    }
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
    // localStorage.removeItem('score_sum');
    // localStorage.removeItem('runs');
    // localStorage.removeItem('highscore');
    // localStorage.removeItem('avgscore');
    if (localStorage.getItem("highscore") != null) {
        highscore = parseInt(localStorage.getItem("highscore"));
    }
    if(score > highscore){
        highscore = score;
    }
    console.log("highscore:", highscore)
    localStorage.setItem("highscore", highscore);
    var score_sum = 0;
    if (localStorage.getItem("score_sum") != null) {
        score_sum = parseInt(localStorage.getItem("score_sum"));
    }
    score_sum += score;
    console.log("score_sum:", score_sum)
    localStorage.setItem("score_sum", score_sum);
    var runs = 0;
    if (localStorage.getItem("runs") != null) {
        runs = parseInt(localStorage.getItem("runs"));
    }
    runs += 1;
    localStorage.setItem("runs", runs);
    console.log("runs:", runs);
    avgscore = score_sum / runs;
    console.log("avgscore:", avgscore);
    localStorage.removeItem('avgscore');
    localStorage.setItem("avgscore", avgscore);
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
    // location.reload();
}

function doDrawingWithPath(path) {
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    if (inGame) {
        ctx.drawImage(apple, apple_x, apple_y);
        var x_delta = x[0];
        var y_delta = y[0];
        var path_arr = path.split(",");
        console.log(path_arr);
        for(var i = 0; i < path_arr.length; i+=2){
            x_delta += path_arr[i]; 
            y_delta += path_arr[i+1]; 
            ctx.fillStyle = "#FFC0CB";
            ctx.fillRect(x_delta, y_delta, 2, 2);
        }
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

function drawPath(path) {
    console.log("function drawPath(path)");
    var x_delta = x[0];
    var y_delta = y[0];
    for(var i = 0; i < path.length; i++){
        x_delta += path[i]; 
        y_delta += path[i+1]; 
        ctx.fillStyle = "#FFC0CB";
        ctx.fillRect(x_delta, y_delta, 10, 10);
    }
}



class Node {
    constructor(parent, position)
    {
        this.parent = parent;
        this.position = position;


        this.g = 0;
        this.h = 0;
        this.f = 0;
    }

    setParent(p){
        this.parent = p;
    }
    setPosition(p){
        this.position = p;
    }

}





function aStar(start, end) {

    var start_node = new Node(null, start);
    start_node.position = start;
    console.log("start_node.position:");
    console.log(start_node.position);
    start_node.g = start_node.h = start_node.f = 0;
    var end_node = new Node(null, end);
    end_node.position = end;
    end_node.g = end_node.h = end_node.f = 0;


    let open_list = []
    let closed_list = []

    open_list.push(start_node);


    while (open_list.length > 0){
        console.log("open_list.length:");
        console.log(open_list.length);

        current_node = open_list[0]
        current_index = 0
        for(var i = 0; i < open_list.length; i++){
            if(open_list[i] < current_node){
                current_node = open_list[i];
                current_index = i;
            }
        }
        open_list.pop(current_index);
        closed_list.push(current_node);
        console.log("closed_list.push(current_node);");
        console.log(current_node.position);
        console.log(end_node.position);
        if (current_node.position == end_node.position){
            path = []
            current = current_node;
            while (current != null){
                path.push(current.position);
                current = current.parent;
                console.log("return path;");
                return path;
            }
        }

        var children = []
        console.log("children:");
        var new_positions = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for(var i = 0; i < new_positions.length; i++){
            var new_position = new_positions[i];
            console.log("new_position:");
            console.log(new_position);

            let node_position = [current_node.position[0] + new_position[0], current_node.position[1] + new_position[1]];
            console.log("node_position:");
            console.log(node_position);

            // Off the board
            let onBoard = true;
            if( (node_position[0] >= C_WIDTH) || (node_position[0] <= 0) || (node_position[1] >= C_WIDTH) || (node_position[1] <= 0)) {
                console.log("offBoard = false;");
                onBoard = false;
            }

            // Hit its own tail
            let noCollision = true;
            for (var z = dots; z > 0; z--) {
                if ((x[0] == node_position[0]) && (y[0] == node_position[0])) {
                    console.log("noCollision = false;");
                    noCollision = false;
                }
            }
            console.log("noCollision:", noCollision);
            console.log("onBoard:", onBoard);
            if(noCollision && onBoard){
                console.log("if(noCollision && onBoard)");
                // Create the new node
                console.log("node_position:");
                console.log(node_position);
                console.log("current_node:");
                console.log(current_node);
                var new_node = new Node(current_node, node_position);
                new_node.position = node_position;
                new_node.parent = current_node;
                console.log("new_node:");
                console.log(new_node);
                // new_node.setParent(current_node);
                // new_node.setPosition(node_position);
                console.log("new_node.parent:", new_node.parent);
                console.log("new_node.position:", new_node.position);
                if(new_node.position == undefined){
                    exit(0);
                }

                // Push the node
                children.push(new_node);
                console.log("children.length:", children.length);
            }
        }

        for(var m = 0; m < children.length; m++){
            var child = children[m];
            console.log("child:");
            console.log(child);

            var alreadyInClosedList = false;
            for(closed_child in closed_list){
                if(child == closed_child){
                    alreadyInClosedList = true;
                    break;
                }
            }
            if(alreadyInClosedList){
                continue;
            }

            child.g = current_node.g + 1;
            console.log("child.position:", child.position);
            console.log("end_node.position:", end_node.position);
            var p1 = Math.pow(child.position[0] - end_node.position[0], 2);
            var p2 = Math.pow(child.position[1] - end_node.position[1], 2);
            child.h = p1 + p2;
            child.f = child.g + child.h;

            var alreadyInOpenList = false;
            for(open_node in open_list){
                if( (child == open_node) && (child.g > open_node.g) ){
                    alreadyInOpenList = true;
                }
            }

            if(!alreadyInOpenList){
                open_list.push(child);
            }
            
        }

        // var g = abs(x[0]-x_delta);
        // var h = Math.pow((apple_x-x_delta), 2) + Math.pow((apple_y-y_delta), 2);
        // var f = g + h;
    }

}

function findPath() {
    var path = aStar([x[0], y[0]], [apple_x, apple_y]);
    console.log("path:");
    console.log(path);
    exit(0);
    return path;
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
        newApple = true;
        locateApple();
        findPath();
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


function searchUp() {
    var xpos = x[0];
    var ypos = y[0];
    while(ypos < C_HEIGHT){
        ypos += DOT_SIZE;
        for(var i = 0; i < y.length; i++){
            for(var j = 0; j < x.length; j++){
                if((y[i]==ypos) && (x[j]==xpos)){
                    return true;
                }
            }
        }
    }
    return false;
}

function searchDown() {
    var xpos = x[0];
    var ypos = y[0];
    while(ypos > 0){
        ypos -= DOT_SIZE;
        for(var i = 0; i < y.length; i++){
            for(var j = 0; j < x.length; j++){
                if((y[i]==ypos) && (x[j]==xpos)){
                    return true;
                }
            }
        }
    }
    return false;
}

function searchLeft() {
    var xpos = x[0];
    var ypos = y[0];
    while(xpos > 0){
        xpos -= DOT_SIZE;
        for(var i = 0; i < y.legnth; i++){
            for(var j = 0; j < x.length; j++){
                if((y[i]==ypos) && (x[j]==xpos)){
                    return true;
                }
            }
        }
    }
    return false;
}

function searchRight() {
    var xpos = x[0];
    var ypos = y[0];
    while(xpos < C_WIDTH){
        xpos += DOT_SIZE;
        for(var i = 0; i < y.length; i++){
            for(var j = 0; j < x.length; j++){
                if((y[i]==ypos) && (x[j]==xpos)){
                    return true;
                }
            }
        }
    }
    return false;
}


function changeDirectionWithSearch(dir) {
    if((dir[0] < 0) && searchLeft()){
        dir[0] *= -1;
        dir[1] *= -1;
    }else if((dir[0] > 0) && searchRight()){
        dir[0] *= -1;
        dir[1] *= -1;
    }
    if((dir[1] > 0) && searchUp()){
        dir[0] *= -1;
        dir[1] *= -1;
    }else if((dir[1] < 0) && searchDown()){
        dir[0] *= -1;
        dir[1] *= -1;
    }
    return dir;
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


function slide() {
    var dir = computeDirection();
    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }
    var x_sign = 1;
    var y_sign = 1;
    if(x[0] < 5){
        x_sign = 1
    }
    if(x[0] > C_WIDTH-10){
        x_sign = -1
    }
    if(y[0] < 5){
        y_sign = 1
    }
    if(x[0] > C_WIDTH-10){
        y_sign = -1
    }
    if(dir[0] == 0){
        x[0] += DOT_SIZE*x_sign;
        x_history[0] += DOT_SIZE*x_sign;
    }
    if(dir[1] == 0){
        y[0] += DOT_SIZE*y_sign;
        y_history[0] += DOT_SIZE*y_sign;
    }

}

function slither(dir) {
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
}

function traverse(path) {
    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }
    x[0] += path[0][0];
    y[0] += path[0][1];
    path.shift();
}

function move() {
    var dir = computeDirection();
    if(newApple){
        slide(dir);
        newApple = false;
    }
    shift_elements_in_array(x_history);
    shift_elements_in_array(y_history);
    traverse(path);
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
