let canvas, context, canvaso, contexto;
canvaso = document.getElementById('imageView');
canvaso.height = 350;
canvaso.width = 500;
context = canvaso.getContext('2d');
let factor = 2;
//render heading
context.font = "20px Roboto";
context.fillStyle = "green";
context.fillText("My first Canvas 2D Drawing", 70 * factor, 10 * factor);

//render house
context.lineWidth = 4;
context.strokeStyle = '#000000';
context.strokeRect(30 * factor, 50 * factor, 100 * factor, 50 * factor);
context.moveTo(20 * factor, 50 * factor);
context.lineTo(80 * factor, 20 * factor);
context.lineTo(140 * factor, 50 * factor);
context.lineTo(20 * factor, 50 * factor);
context.stroke();

//render door
context.lineWidth = 4;
context.strokeRect(70 * factor, 70 * factor, 20 * factor, 30 * factor);
context.fillStyle = "red";
context.fillRect(71 * factor, 71 * factor, 18 * factor, 28 * factor);
context.fillStyle = "white";
context.fillRect((71 + 18 / 2 - 3) * factor, (71 + 28 / 2 - 5) * factor, 6 * factor, 10 * factor);

//render window
context.lineWidth = 2;
context.strokeRect((70 + 20 + 10) * factor, (50 + 10 - 5) * factor, 20 * factor, 10 * factor);

//render tree
context.fillStyle = "brown";
context.fillRect((30 + 100 + 50) * factor, (50 + 25 - 5) * factor, 5 * factor, 30 * factor);
context.fillStyle = "green";
context.beginPath();
context.strokeStyle = "green";
context.arc((180 + 2.5) * factor, (70 - 15) * factor, 15 * factor, 0, 2 * Math.PI, false);
context.arc((170 + 2.5) * factor, (70 - 25) * factor, 15 * factor, 0, 2 * Math.PI, false);
context.arc((180 + 2.5) * factor, (70 - 35) * factor, 15 * factor, 0, 2 * Math.PI, false);
context.arc((190 + 2.5) * factor, (70 - 25) * factor, 15 * factor, 0, 2 * Math.PI, false);
context.fill();
context.stroke();
context.closePath();

//render car
context.fillStyle = "lightblue";
context.lineWidth = 4;
context.strokeStyle = "blue";
context.beginPath();
context.moveTo((71 + 9 - 3) * factor, (71 + 28 / 2 + 40) * factor);
context.lineTo((71 + 9 - 3 + 20) * factor, (71 + 28 / 2 + 40) * factor);
context.lineTo((71 + 9 - 3 + 40) * factor, (71 + 28 / 2 + 25) * factor);
context.lineTo((71 + 9 - 3 + 100) * factor, (71 + 28 / 2 + 27) * factor);
context.arc((71 + 9 - 3 + 100) * factor, (71 + 28 / 2 + 27 + 20) * factor, 40, 1.5 * Math.PI, 0, false);
context.lineTo((71 + 9 - 3 + 100 + 20) * factor, (71 + 28 / 2 + 60) * factor);
context.lineTo((71 + 9 - 3 + 100) * factor, (71 + 28 / 2 + 60) * factor);
context.quadraticCurveTo((71 + 9 - 3 + 90) * factor, (71 + 28 / 2 + 80) * factor, (71 + 9 - 3 + 80) * factor, (71 + 28 / 2 + 60) * factor);
context.lineTo((71 + 9 - 3 + 40) * factor, (71 + 28 / 2 + 60) * factor);
context.quadraticCurveTo((71 + 9 - 3 + 30) * factor, (71 + 28 / 2 + 80) * factor, (71 + 9 - 3 + 20) * factor, (71 + 28 / 2 + 60) * factor);
context.lineTo((71 + 9 - 3) * factor, (71 + 28 / 2 + 60) * factor);
context.lineTo((71 + 9 - 3) * factor, (71 + 28 / 2 + 40) * factor);
context.closePath();
context.stroke();
context.fill();