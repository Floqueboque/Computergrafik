const canvas = document.getElementById('myCanvas');
const anzeige = document.getElementById('day');
const ctx = canvas.getContext('2d');
const maxWidth = canvas.width;
const maxHeight = canvas.height;

const SUN_RADIUS_PROPORTION = 0.2;
const EARTH_RADIUS_PROPORTION = 0.25 * SUN_RADIUS_PROPORTION;
const MOON_RADIUS_PROPORTION = 0.25 * EARTH_RADIUS_PROPORTION;
const EARTH_SUN_DISTANCE_PROPORTION_SCREEN = 0.4;
const MOON_EARTH_DISTANCE_PROPORTION_SCREEN = 0.1;

let myTimer;
let anzeigeTimer;
let stars;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = 'white';
        ctx.closePath();
        ctx.fill();
    }
}

function init() {
    stars = [];
    initStars();
    drawStars();
    drawSun();
    initEarth();
    initMoon();
}

function initStars() {
    for (let i = 0; i < 400; i++) {
        stars.push(new Star());
    }
}

function initEarth() {
    let radius = canvas.width / 2 * EARTH_RADIUS_PROPORTION;
    xEarth = canvas.width / 2 + (canvas.width / 2 * EARTH_SUN_DISTANCE_PROPORTION_SCREEN) + (canvas.width / 2 * SUN_RADIUS_PROPORTION);
    yEarth = canvas.width / 2;
    const gradient = ctx.createLinearGradient(xEarth, yEarth, xEarth + 0.1, yEarth);
    gradient.addColorStop(1, "orange");
    gradient.addColorStop(1, "blue");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(xEarth, yEarth, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

function initMoon() {
    let radius = canvas.width / 2 * MOON_RADIUS_PROPORTION;
    let x = xEarth + canvas.width / 2 * MOON_EARTH_DISTANCE_PROPORTION_SCREEN;
    let y = yEarth;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

function drawStars() {
    let radius = 1;
    ctx.fillStyle = 'white';
    for (let i = 0; i < 400; i++) {
        stars[i].draw();
    }
}

function drawSun() {
    let radius = canvas.width / 2 * SUN_RADIUS_PROPORTION;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const gradient = ctx.createRadialGradient(x, y, canvas.width / 2 * SUN_RADIUS_PROPORTION - 35, x, y, canvas.width / 2 * SUN_RADIUS_PROPORTION);
    gradient.addColorStop(0, "yellow");
    gradient.addColorStop(1, "orange");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

let xEarth;
let yEarth;

function drawEarth(radX, radY) {
    let radius = canvas.width / 2 * EARTH_RADIUS_PROPORTION;
    xEarth = canvas.width / 2 + radX * ((canvas.width / 2 * EARTH_SUN_DISTANCE_PROPORTION_SCREEN) + canvas.width / 2 * SUN_RADIUS_PROPORTION);
    yEarth = canvas.width / 2 + radY * ((canvas.width / 2 * EARTH_SUN_DISTANCE_PROPORTION_SCREEN) + canvas.width / 2 * SUN_RADIUS_PROPORTION);
    const gradient = ctx.createLinearGradient(xEarth - radX * canvas.width / 2 * EARTH_RADIUS_PROPORTION, yEarth - radY * canvas.width / 2 * EARTH_RADIUS_PROPORTION, xEarth + radX * canvas.width / 2 * EARTH_RADIUS_PROPORTION, yEarth + radY * canvas.width / 2 * EARTH_RADIUS_PROPORTION);
    console.log(radX, radY)
    gradient.addColorStop(0.3, "orange");
    gradient.addColorStop(0.6, "blue");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(xEarth, yEarth, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

function drawMoon(rad) {
    let radius = canvas.width / 2 * MOON_RADIUS_PROPORTION;
    let x = xEarth + Math.cos(rad) * (canvas.width / 2 * MOON_EARTH_DISTANCE_PROPORTION_SCREEN);
    let y = yEarth + Math.sin(rad) * (canvas.width / 2 * MOON_EARTH_DISTANCE_PROPORTION_SCREEN);;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

function startAnimate() {
    myTimer = setInterval(drawAnimation, 1000 / 22);
    anzeigeTimer = setInterval(updateAnzeige, 60 / 365 * 1000);
    ctx.save();
}

function stopAnimate() {
    clearInterval(myTimer);
    clearInterval(anzeigeTimer);
}

let degEarth = 0;
let degMoon = 0;

function drawAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSun();
    drawStars();
    degEarth = degEarth + (360 / 60) / 22;
    degMoon = degMoon + (360 / 60) / 22 * 365 / 27;
    let rad = degEarth * Math.PI / 180;
    let radMoon = degMoon * Math.PI / 180;
    let sin = Math.sin(rad);
    let cos = Math.cos(rad);
    drawEarth(cos, sin);
    drawMoon(radMoon);
}

let tag = 1;
let jahr = 1;
let mondumlauf = 1;

function updateAnzeige() {
    tag = tag + 1;
    if (tag % 365 == 0) {
        jahr = jahr + 1;
    }
    if (tag % 27 == 0) {
        mondumlauf = mondumlauf + 1;
    }
    anzeige.innerHTML = "Jahr " + jahr + " Mondumlauf " + mondumlauf + " Tag " + tag;
}