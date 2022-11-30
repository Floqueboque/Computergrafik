const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const canvas_offset = canvas.getBoundingClientRect();

let startPoint;
let endPoint;

let points = [];

const colorInput = document.getElementById("color");
let lineColor = "black";
let lineWidth = 1;

init();

function generateLine(){
    var lines = [];
    for (var i = 1; i < points.length; i++) {
        lines.push(new Line(points[i-1], points[i]));
    }
    return lines;
}

function findMinMax(minY, maxY){
    for (var i = 0; i < points.length; i++) {
        var temp = points[i].y;
        if (temp < minY){
            minY = temp;
        }
        else if (temp > maxY){
            maxY = temp;
        }
    }
    return {minY: minY, maxY: maxY};
}

function fill(){
    let lines = generateLine();
    let minY = points[0].y;
    let maxY = points[0].y;
    let minMax = findMinMax(minY, maxY);
    minY = minMax.minY;
    maxY = minMax.maxY;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    for (var y = minY; y < maxY; y++) {
        var meetPoint = getMeetPoint(y, lines);
        for (var i = 1; i < meetPoint.length; i += 2) {
            ctx.moveTo(meetPoint[i - 1], y);
            ctx.lineTo(meetPoint[i], y);
        }
    }
    ctx.stroke();
}

function getMeetPoint(y, lines) {
    var meet = [];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l.isValidY(y)) {
            meet.push(l.getX(y));
        }
    }

    //sort
    for (var i = 0; i < meet.length; i++)
        for (var j = i; j < meet.length; j++) {
            if (meet[i]>meet[j]) {
                var temp =meet[i];
                meet[i]=meet[j];
                meet[j]=temp;
            }
        }

    return  meet;
}

function Point(x,y){
    this.x = x;
    this.y = y;
}

function Line(start, end) {
    this.x0 = start.x;
    this.x1 = end.x;
    this.y0 = start.y;
    this.y1 = end.y;
    this.m = (this.y1 - this.y0) / (this.x1 - this.x0);

    this.getX = function (y) {
        if (!this.isValidY(y))
            throw new RangeError();

        return 1 / this.m * (y - this.y0) + this.x0;
    }

    this.isValidY = function (y) {
        if (y >= this.y0 && y < this.y1) {
            return true;
        }
        if (y >= this.y1 && y < this.y0) {
            return true;
        }

        return false;
    }
}

function init() {
    canvas.addEventListener("mousedown", mouseDown, false);

    document.getElementById("color").addEventListener("change", updateLineColor, false);
	document.getElementById("fill").addEventListener("click", () => {
        fill()
    }, false);
    canvas.width = 400;
    canvas.height = 400;
}

function mouseDown(event) {
    switch (event.button){
        case 0:
            points.push(new Point(event.offsetX, event.offsetY));
            ctx.fillStyle = lineColor;
            for (var i = 0; i < points.length; i++) {
                ctx.fillRect(points[i].x, points[i].y, 3, 3);
            }
            break;
        case 2:
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (var j = 1; j < points.length; j++) {
                p = points[j];
                ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
        default:
            break;

    }
    
    
    isMouseDown = true;
}

function updateLineColor() {
    lineColor = colorInput.value
}

function updateLineWidth() {
    lineWidth = width_input.value
}