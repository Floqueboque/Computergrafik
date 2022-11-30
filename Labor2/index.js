let canvas = document.getElementById('myCanvas');
let img;


function dateiauswahl(evt) {
    // FileList-Objekt des input-Elements auslesen, auf dem 
    // das change-Event ausgelöst wurde (event.target)
    let files = evt.target.files;
    img = new Image();
    img.onerror = failed;
    img.src = URL.createObjectURL(this.files[0]);

    img.onload = draw;
}

function draw() {
    let ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;

    ctx.filter = 'none';
    ctx.drawImage(this, 0, 0);
}

function handleSepia() {
    let ctx = canvas.getContext('2d');
    ctx.filter = 'sepia(1)';
    ctx.drawImage(img, 0, 0);
}

function handleGray() {
    let ctx = canvas.getContext('2d');
    ctx.filter = 'grayscale(1)';
    ctx.drawImage(img, 0, 0);
}

function handleOriginal() {
    let ctx = canvas.getContext('2d');
    ctx.filter = 'none';
    ctx.drawImage(img, 0, 0);
}

function handleInverted() {
    let ctx = canvas.getContext('2d');
    ctx.filter = 'invert(1)';
    ctx.drawImage(img, 0, 0);
}

function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}

// UI-Events erst registrieren wenn das DOM bereit ist!
document.addEventListener("DOMContentLoaded", function() {
    // Falls neue Eingabe, neuer Aufruf der Auswahlfunktion
    document.getElementById('formFileLg').addEventListener('change', dateiauswahl, false);
});