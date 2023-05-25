
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

var path = [];
var pathIndex = 0;

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


class Node {
    constructor()
    {
        this.parent = null;
        this.position = null;


        this.g = 0;
        this.h = 0;
        this.f = 0;

        this.visited = false;
    }

    setParent(p){
        this.parent = p;
    }
    setPosition(p){
        this.position = p;
    }

}


function init() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    score = 0;
    getHighscore();
    document.getElementById('num').value = new Number(score);
    document.getElementById('highscore').value = new Number(highscore);
    loadImages();
    createSnake();
    locateApple();
    path = findPath();
    pathIndex = 0;
    setTimeout("gameCycle()", DELAY);
}    

function restart() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    score = 0;
    getHighscore();
    document.getElementById('num').value = new Number(score);
    document.getElementById('highscore').value = new Number(highscore);
    loadImages();
    createSnake();
    locateApple();
    path = findPath();
    pathIndex = 0;
    setTimeout("gameCycle()", DELAY);
}

function getHighscore() {
    if (localStorage.getItem("highscore") != null) {
        highscore = parseInt(localStorage.getItem("highscore"));
    }
    if(score > highscore){
        highscore = score;
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
    var avg_score = score_sum / runs;
    console.log("avg_score:", avg_score);
    localStorage.removeItem('avg_score');
    localStorage.setItem("avg_score", avg_score);
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    ctx.fillText('Game over', C_WIDTH/2, C_HEIGHT/2);
    // location.reload();
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
        shiftPiece();
        path = findPath();
        pathIndex = 0;
        
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

function getNewPositions(current_node, end_node){
    var x_delta = end_node.position[0] - current_node.position[0];
    // console.log("x_delta:", x_delta);
    var y_delta = end_node.position[1] - current_node.position[1];
    // console.log("y_delta:", y_delta);
    var new_positions = [];
    if(x_delta > 0){
        new_positions.push([1, 0]);
    }
    if(x_delta < 0){
        new_positions.push([-1, 0]);
    }
    if((y_delta > 0)){
        new_positions.push([0, 1]);
    }
    if((y_delta < 0)){
        new_positions.push([0, -1]);
    }
    return new_positions;
}


function findAndRemoveNode(node_list, node) {
    for(var j = 0; j < node_list.length; j++){
        if((node_list[j].position[0] == node.position[0]) && (node_list[j].position[1] == node.position[1])){
            node_list.pop(j);
            return node_list;
        }
    }
    return node_list;
}


function aStar(start, end) {

    var start_node = new Node();
    start_node.position = start;
    start_node.g = start_node.h = start_node.f = 0;
    end_node = new Node();
    end_node.position = end;
    end_node.g = end_node.h = end_node.f = 0;


    var open_str = ""
    let open_list = [];
    var closed_str = ""
    let closed_list = [];

    open_list.push(start_node);
    var current_node = start_node;


    while (open_list.length > 0){
        if(open_list.length > 1000){
            exit(0);
        }

        open_list.sort((a, b) => (a.f < b.f) ? 1 : -1);
        current_node = open_list[0];
        current_index = 0;
        for(var i = 0; i < open_list.length; i++){
            if(open_list[i].g < current_node.g){
                current_node = open_list[i];
                current_index = i;
            }
        }
        current_node.visited = true;
        open_list.pop(current_index);
        closed_list.push(current_node);


        if ((current_node.position[0] == end_node.position[0]) && (current_node.position[1] == end_node.position[1])){
            path = []
            current = current_node;
            while (current != null){
                path.push(current.position);
                current = current.parent;
            }
            return path;
        }

        var children = []
        var new_positions = getNewPositions(current_node, end_node); 
        // var new_positions = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for(var i = 0; i < new_positions.length; i++){
            new_positions = getNewPositions(current_node, end_node); 

            var new_position = new_positions[i];

            let node_position = [current_node.position[0] + new_position[0], current_node.position[1] + new_position[1]];

            // Off the board
            let onBoard = true;
            if( (node_position[0] >= C_WIDTH) || (node_position[0] <= 0) || (node_position[1] >= C_WIDTH) || (node_position[1] <= 0)) {
                onBoard = false;
            }

            if(onBoard){

                // Create the new node
                var new_node = new Node();
                new_node.position = node_position;
                new_node.parent = current_node;
                // Push the node
                children.push(new_node);
            }
        }
        findAndRemoveNode(open_list, current_node);
        //console.log("children.length:", children.length);
        //console.log("children:", children);
        for(var m = 0; m < children.length; m++){
            var child = children[m];

            /*
            var pos_str_1 = "["+child.position[0]+","+child.position[1]+"]";
            if(!(closed_str.includes(pos_str_1))){
                closed_str += pos_str_1;
                continue;
            }
            */

            child.g = current_node.g + 1;
            var p1 = Math.pow(child.position[0] - end_node.position[0], 2);
            var p2 = Math.pow(child.position[1] - end_node.position[1], 2);
            child.h = p1 + p2;
            child.f = child.g + child.h;
            var pos_str = "["+child.position[0]+","+child.position[1]+"]";
            if(!(open_str.includes(pos_str))){
                open_list.push(child);
                open_str += pos_str;
            }
        }

    }
    if ((current_node.position[0] == end_node.position[0]) && (current_node.position[1] == end_node.position[1])){
        path = []
        current = current_node;
        while (current != null){
            path.push(current.position);
            current = current.parent;
        }
        return path;
    }
}

function findPath() {
    var start = [x[0], y[0]];
    var end = [apple_x, apple_y];
    var path = aStar(start, end);
    pathIndex = 0;
    path = path.reverse();
    console.log("path:");
    console.log(path);
    console.log("start:");
    console.log(start);
    console.log("end:");
    console.log(end);
    return path;
}

function move() {
    var dir = computeDirection();
    var safe = checkSafe(x, y, dir);
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

function shiftPiece() {
    var shift_x = false;
    var shift_y = false;
    if(x[0]-x[1] == 0){
        shift_x = true;
    }
    if(y[0]-y[1] == 0){
        shift_y = true;
    }
    shift_elements_in_array(x);
    shift_elements_in_array(y);
    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }
    if(shift_x){
        x[0] += DOT_SIZE;
    }
    if(shift_y){
        y[0] += DOT_SIZE;
    }
}


function movePiece() {
    console.log("function movePiece() {");
    console.log("path.length:", path.length);
    console.log("pathIndex:", pathIndex);
    if(path.length-1 < pathIndex){
        return;
    }
    shift_elements_in_array(x);
    shift_elements_in_array(y);
    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    x[0] = path[pathIndex][0];
    y[0] = path[pathIndex][1];
    pathIndex += DOT_SIZE;

}    

function checkCollision() {

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
            exit(0);
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
        exit(0);
    }

    if (y[0] < 0) {
       inGame = false;
       exit(0);
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
      exit(0);
    }

    if (x[0] < 0) {
      inGame = false;
      exit(0);
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
        movePiece();
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
