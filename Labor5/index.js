const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const canvas_offset = canvas.getBoundingClientRect();

let startCoords = [];
let endCoords = [];

const minX = 100;
const maxX = 300;
const minY = 100;
const maxY = 300;

const TOP = 0b0001
const RIGHT = 0b0010
const BOTTOM = 0b0100
const LEFT = 0b1000

let isMouseDown = false;

const colorInput = document.getElementById("color");
let lineColor = "black";
const width_input = document.getElementById("width");
let lineWidth = 1;

init();

function init() {
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("mouseup", mouseUp, false);

    document.getElementById("color").addEventListener("change", updateLineColor, false)
    document.getElementById("width").addEventListener("change", updateLineWidth, false)

	document.getElementById("clipLine").addEventListener("click", () => {
        clipLine(startCoords[0], startCoords[1], endCoords[0], endCoords[1])
    }, false);

	drawCanvas();
}

function determineK1(x, y){
    let coordFlag = 0;

    if(y < minY){
        coordFlag = BOTTOM;
    }
    if(y > maxY){
        coordFlag = TOP;
    }
    if(x < minX){
        coordFlag |= LEFT;
    }
    if(x > maxY){
        coordFlag |= RIGHT
    }

    return coordFlag;
}

function determineK2(x, y){
    let coordFlag = 0;

    if(y < minY){
        coordFlag = BOTTOM;
    }
    if(y > maxY){
        coordFlag = TOP;
    }
    if(x < minX){
        coordFlag |= LEFT;
    }
    if(x > maxY){
        coordFlag |= RIGHT
    }

    return coordFlag;
}

function mouseDown(event) {
    startCoords = [convertCoordsX(event.clientX), convertCoordsY(event.clientY)];
    isMouseDown = true;
}

function mouseMove(event) {
    if(isMouseDown) {
        drawNewLine(
            startCoords, 
            [convertCoordsX(event.clientX), convertCoordsY(event.clientY)]
        );
    }
}

function mouseUp(event) {
    endCoords = [convertCoordsX(event.clientX), convertCoordsY(event.clientY)];
    isMouseDown = false;
}

function updateLineColor() {
    lineColor = colorInput.value
}

function updateLineWidth() {
    lineWidth = width_input.value
}

const convertCoordsX = (coord_x) => {
    return (coord_x - canvas_offset.left)
}

const convertCoordsY = (coord_y) => {
    return (coord_y - canvas_offset.top)
}

function drawCanvas() {
    ctx.clearRect(0, 0, 400, 400);

    canvas.width = 400;
    canvas.height = 400;
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 100, 200, 200);
}

function drawNewLine(new_startCoords, new_endCoords) {
    drawCanvas();
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(new_startCoords[0], new_startCoords[1]);
    ctx.lineTo(new_endCoords[0], new_endCoords[1]);
    ctx.stroke();
}

//Cohen-Sutherland Algorithm
function clipLine(x1, y1, x2, y2) {

    let deltaX = (x2 - x1);
    let deltaY = (y2 - y1);
    let K1 = 0;
    let K2 = 0;

    K1 = determineK1(x1, y1)
    K2 = determineK2(x2, y2)

    //algorithm
    while(K1 || K2) {

        if(K1 & K2){
            return false;
        }

        if(K1) {
            if(K1 & LEFT) {
                y1 += ((minX - x1) * (deltaY / deltaX))
                x1 = minX
            } else if(K1 & RIGHT) {
                y1 += ((maxX - x1) * (deltaY / deltaX))
                x1 = maxX
            }
            if(K1 & BOTTOM) {
                x1 += ((minY - y1) * (deltaX / deltaY))
                y1 = minY
            } else if(K1 & TOP) {
                x1 += ((maxY - y1) * (deltaX / deltaY))
                y1 = maxY
            }
            K1 = 0

            if(y1 < minY) K1 = BOTTOM
            if(y1 > maxY) K1 = TOP
            if(x1 < minX) K1 |= LEFT
            if(x1 > maxX) K1 |= RIGHT
        }

        if(K2) {
            if(K2 & LEFT) {
                y2 += ((minX - x2) * (deltaY / deltaX))
                x2 = minX
            } else if(K2 & RIGHT) {
                y2 += ((maxX - x2) * (deltaY / deltaX))
                x2 = maxX
            }
            if(K2 & BOTTOM) {
                x2 += ((minY - y2) * (deltaX / deltaY))
                y2 = minY
            } else if(K2 & TOP) {
                x2 += ((maxY - y2) * (deltaX / deltaY))
                y2 = maxY
            }
            K2 = 0

            if(y2 < minY) K2 = BOTTOM
            if(y2 > maxY) K2 = TOP
            if(x2 < minX) K2 |= LEFT
            if(x2 > maxX) K2 |= RIGHT
        }
    }
    startCoords[0] = x1
    startCoords[1] = y1
    endCoords[0] = x2
    endCoords[1] = y2
    drawNewLine(startCoords, endCoords);

    return true
}