const canvas = document.getElementById('myCanvas');
const x1 = document.getElementById('startX');
const y1 = document.getElementById('startY');
const x2 = document.getElementById('endX');
const y2 = document.getElementById('endY');
const ctx = canvas.getContext('2d');
const maxWidth = canvas.width;
const maxHeight = canvas.height;

ctx.font = "16px Arial";
ctx.fillText("y", canvas.width / 2 + 10, 15);
ctx.fillText("x", canvas.width - 15, canvas.height / 2 - 10);


ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.stroke();

ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();

function startDrawing() {
    drawLine(parseInt(x1.value), parseInt(y1.value), parseInt(x2.value), parseInt(y2.value));
}


function drawLine(x1, y1, x2, y2) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.strokeStyle = 'black';
    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i; // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1; // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy); // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1; // The line is X-axis dominant
    if (dy1 <= dx1) { // Line is drawn left to right
        if (dx >= 0) {
            x = x1;
            y = y1;
            xe = x2;
        } else { // Line is drawn right to left (swap ends)
            x = x2;
            y = y2;
            xe = x1;
        }
        ctx.fillRect(x, -y, 1, 1); // Draw first pixel        
        // Rasterize the line
        for (i = 0; x < xe; i++) {
            x = x + 1; // Deal with octants...
            if (px < 0) {
                px = px + 2 * dy1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    y = y + 1;
                } else {
                    y = y - 1;
                }
                px = px + 2 * (dy1 - dx1);
            } // Draw pixel from line span at
            // currently rasterized position
            ctx.fillRect(x, -y, 1, 1);
        }
    } else { // The line is Y-axis dominant        // Line is drawn bottom to top
        if (dy >= 0) {
            x = x1;
            y = y1;
            ye = y2;
        } else { // Line is drawn top to bottom
            x = x2;
            y = y2;
            ye = y1;
        }
        ctx.fillRect(x, -y, 1, 1); // Draw first pixel        
        // Rasterize the line
        for (i = 0; y < ye; i++) {
            y = y + 1; // Deal with octants...
            if (py <= 0) {
                py = py + 2 * dx1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    x = x + 1;
                } else {
                    x = x - 1;
                }
                py = py + 2 * (dx1 - dy1);
            } // Draw pixel from line span at
            // currently rasterized position
            ctx.fillRect(x, -y, 1, 1);
        }
    }
}