let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
let angle;
let secondsPast = 0;
let minute = 0;
let fiveMinutes = 0;
let fiveMinutesAngle = 0;
let meetingPoint = {
    x: 0,
    y: 0
}; // Punto de reunión
let lines = []; // Array para almacenar las líneas dibujadas
let length = 0;

window.onload = function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);    
}

window.addEventListener("resize", resizeAndAnimate);

function resizeAndAnimate() {
    cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
};

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    #color;
    #alpha;
    
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.angle = Math.PI;
        this.#color = 0;
        this.#alpha = 1;
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
        this.#width = width;
        this.#height = height;

        this.fpsInterval = 1000 / 20; // 20 FPS
        this.lastTime = 0;
        this.segundos = this.angle;

        this.strokeWidth = 2; 
        this.#ctx.lineWidth = this.strokeWidth;

        // Definir el punto de reunión
        this.meetingPoint = {
            x: this.#width / 2 + Math.sin(-60) * 150,
            y: this.#height / 2 + Math.cos(-60) * 150
        };
    }
    
    #draw(x, y, secs) {
        if (secs % 60 === 0) {
            minute++;
            console.log("Minutos: " + minute);
        }

        // Lógica para reunir líneas cada 5 minutos
        if (minute > 0 && minute % 5 === 0 && (secs % 60 === 0)) {
            fiveMinutes++;
            fiveMinutesAngle = (fiveMinutesAngle - 60) % 360;
            console.log("5 minutos: " + fiveMinutes, "fiveMinutesAngle: " + fiveMinutesAngle);
        }
        if (minute > 0 && minute % 5 === 0) {
            this.animateGathering(fiveMinutesAngle);
        }

        length = secs % 300; // Ajusta el tamaño de las líneas según el tiempo
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        
        const endX = x + length * Math.sin(this.angle);
        const endY = y + length * Math.cos(this.angle);
        
        // Guardar línea dibujada
        lines.push({ startX: x, startY: y, endX: endX, endY: endY }); 
        
        this.#ctx.lineTo(endX, endY);
        this.#ctx.stroke();
    }

    animateGathering(fiveMinutesAngle) {
        // Calcular el nuevo punto de reunión basado en el número de reuniones
        const fmaRad = fiveMinutesAngle * Math.PI / 180;
        this.meetingPoint = {
            x: this.#width / 2 + Math.sin(fmaRad) * 100,
            y: this.#height / 2 + Math.cos(fmaRad) * 100
        };

        // Limpiar el canvas donde se dibujan las agujas
        this.#ctx.clearRect(this.#width / 2 - 300, this.#height / 2 - 300, 600, 600,); // Cambia el área según tu diseño

        // Animar las líneas hacia el punto de reunión
        lines.forEach((line) => {
            // Calcular la dirección hacia el punto de reunión
            const deltaX = (this.meetingPoint.x - line.endX) * 0.05; // Movimiento hacia el punto de reunión
            const deltaY = (this.meetingPoint.y - line.endY) * 0.05; // Movimiento hacia el punto de reunión

            // Actualizar las coordenadas finales
            line.endX += deltaX;
            line.endY += deltaY;

            // Dibujar la línea en su nueva posición
            this.#ctx.beginPath();
            this.#ctx.moveTo(line.startX, line.startY);
            this.#ctx.lineTo(line.endX, line.endY);
            this.#ctx.stroke();
        });

        // Verificar si todas las líneas han llegado al punto de reunión
        const allGathered = lines.every((line) => {
            return Math.abs(line.endX - this.meetingPoint.x) < 1 && Math.abs(line.endY - this.meetingPoint.y) < 1;
        });

        if (allGathered) {
            console.log("Todas las líneas han llegado al punto de reunión."); // Debugging
            this.resetGathering();
        }
    }

    resetGathering() {
        // Reiniciar el array de líneas
        lines = []; // Limpiar el array de líneas
        this.angle = Math.PI; // Reiniciar el ángulo para el siguiente ciclo
        minute = 0; // Reiniciar el contador de minutos
    }

    animate(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        
        const elapsed = timestamp - this.lastTime;

        if (elapsed > this.fpsInterval) {
            this.lastTime = timestamp - (elapsed % this.fpsInterval);
            this.angle = this.angle - (Math.PI * 2 / 60);
            console.log("angle: " + this.angle);
            this.segundos = (Math.abs(this.angle) * 180 / Math.PI);
            this.#color = this.angle * 180 / Math.PI;
            secondsPast = this.segundos;
            
            // Actualizar el estilo de trazo
            this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
            
            // Dibujar líneas
            this.#draw(this.#width / 2, this.#height / 2, secondsPast);
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}
