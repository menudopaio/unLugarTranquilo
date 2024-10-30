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
    #color;
    #alpha;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#color = 0;
        this.#alpha = 1;
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
        this.#width = width;
        this.#height = height;
        this.angle = 0;
    }
    #draw(x, y) {
        const length = Math.random() * 100 + 50;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo((x + length * Math.sin(this.angle)), (y + length * Math.cos(this.angle)));
        /* this.#ctx.lineTo(x + length * Math.sin(this.angle), y + length * Math.cos(this.angle)); */
        this.#ctx.stroke();
    }
    animate() {
        this.angle = ((Math.random() * 1000) % 120) +60;
        this.#color = this.angle;
        if (this.angle >= 360) {
            this.angle = 0;
        }
        
        // Update strokeStyle with the current color values
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
        
        for (let i = 0; i < 5; i++) {
            let rx = Math.random();
            let ry = Math.random();
            this.#draw(rx * this.#width, ry * this.#height);
        }
        
        
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
    
}