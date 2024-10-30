let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
let angle;
let counter = 0;

window.onload = function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate();
    
}

window.addEventListener("resize", resizeAndAnimate);
window.addEventListener("mousedown", resizeAndAnimate);
window.addEventListener("mouseup", changeColor);

function changeColor () {
    flowField.changeColor();
}
function resizeAndAnimate() {
        cancelAnimationFrame(flowFieldAnimation);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
        flowField.animate();
};


class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    #r;
    #g;
    #b;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#r = 0;
        this.#g = 255;
        this.#b = 0;
        this.#ctx.strokeStyle = `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
        this.#width = width;
        this.#height = height;
        this.angle = 0;
        this.v = 0;
    }
    #draw(x, y) {
        const length = 300;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + length * Math.sin(this.angle), y + length * Math.cos(this.angle));
        this.#ctx.stroke();
    }
    animate() {
        this.v += 0.35;
        this.angle += 0.2;
        // Cambia los valores RGB para crear el efecto arcoíris.
        if (counter % 3 === 0) {
            this.#g = (this.#g + 1) % 256;
        } else if (counter % 5 === 0) {
            this.#r = (this.#r + 1) % 256;
        } else {
            this.#b = (this.#b + 1) % 256;
        }
        
        
        // Update strokeStyle with the current color values
        this.#ctx.strokeStyle = `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
        
        this.#draw(this.#width/2, this.#height/2);
        counter++;
        console.log("animating");
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
    changeColor() {
        this.#g += 20;
        this.#r -= 20;
        this.#b -= 10;
        this.#ctx.strokeStyle = `rgb(${this.#r}, ${this.#g}, ${this.#b})`;
    }
}