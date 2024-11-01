let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
let angle;
let secondsPast = 0;
let minute = 0;
let hour = 0;
let hourAngle = 180;
let fiveMinutes = 0;
let fiveMinutesAngle = 180;
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
/* window.addEventListener("click", stopAnimation);
function stopAnimation() {
    this.fpsInterval = 0;
}; */
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
        this.strokeWidth = 3; 
        this.#ctx.lineWidth = this.strokeWidth;

        // Definir el punto de reunión
        this.meetingPoint = {
            x: (this.#width / 2 + Math.sin(-60) * 300) + 100,
            y: (this.#height / 2 + Math.cos(-60) * 300) + 100
        };
    }
    
    #draw(x, y, secs) {
        if (secondsPast % 60 === 0) {
            minute++;
            console.log("Minutos: " + minute);
        }

        // Lógica para reunir líneas cada 5 minutos
        /* if (minute > 0 && minute % 5 === 0 && (secs % 60 === 0)) { */
        if (secondsPast % 300 === 0) {
            fiveMinutes++;
            fiveMinutesAngle = (fiveMinutesAngle - 30) % 360;
            console.log("5 minutos: " + fiveMinutes, "fiveMinutesAngle: " + fiveMinutesAngle);
        }
        if (secondsPast % 120 === 0) {
            hour++;
            hourAngle = (hourAngle - 30) % 360;
            console.log("Hora: " + hour);
            this.showHour(hour);
        }
        if (minute > 0 && minute % 5 === 0) {
            /* const gatheringInterval = setInterval(this.animateGathering(fiveMinutesAngle), 1000 * 60 * 5); */
            this.animateGathering(fiveMinutesAngle, secondsPast);
        }
        

        length = secs % 300 + Math.random() * 25; // Ajusta el tamaño de las líneas según el tiempo
        if (length < 30) { length = 30 + Math.random() * 15; }
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#color = this.angle * 180 / Math.PI;
        this.#ctx.strokeWidth = minute % 5 + 2;
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;

        const endX = x + length * Math.sin(this.angle);
        const endY = y + length * Math.cos(this.angle);
        
        // Guardar línea dibujada
        lines.push({ startX: x, startY: y, endX: endX, endY: endY }); 
        
        this.#ctx.lineTo(endX, endY);
        this.#ctx.stroke();
    }

    showHour(hour) {
        const horaActual = hour;
        const horaActualAngle = ((hour * 5) + 180) * Math.PI / 180;
        console.log("hora: " + hour, "horaAngle: " + horaActualAngle);
        

        this.#ctx.beginPath();
        this.#ctx.moveTo(this.#width / 2, this.#height / 2);
        this.#color = horaActual * 180 / Math.PI;
        
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;

        const len = 100;
        const endX = len * Math.sin(horaActualAngle);
        const endY = len * Math.cos(horaActualAngle);
        
        // Guardar línea dibujada
        lines.push({ startX: this.#width / 2, startY: this.#height / 2, endX: endX, endY: endY }); 
        
        this.#ctx.lineTo(endX, endY);
        this.#ctx.stroke();

    }

    animateGathering(fiveMinutesAngle, secs) {
        /* cancelAnimationFrame(flowFieldAnimation); */
        
        // Calcular el nuevo punto de reunión basado en el número de reuniones
        const fmaRad = fiveMinutesAngle * Math.PI / 180;
        this.meetingPoint = {
            x: this.#width / 2 + Math.sin(fmaRad) * 200,
            y: this.#height / 2 + Math.cos(fmaRad) * 200
        };

        // Limpiar el canvas donde se dibujan las agujas
        this.#ctx.clearRect(0, 0, this.#width, this.#height); // Cambia el área según tu diseño

        // Animar las líneas hacia el punto de reunión
        lines.forEach((line) => {
            
            // Calcular la dirección hacia el punto de reunión
            const deltaX = (this.meetingPoint.x - line.endX) * 0.05; // Movimiento hacia el punto de reunión
            const deltaY = (this.meetingPoint.y - line.endY) * 0.05; // Movimiento hacia el punto de reunión
            
            

            // Actualizar las coordenadas finales
            line.endX += deltaX;
            line.endY += deltaY;

            // Actualizar color segun destino
            this.#color = fiveMinutesAngle;

            // Dibujar la línea en su nueva posición
            this.#ctx.beginPath();
            this.#ctx.strokeWidth = minute % 5 + 2;
            this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
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
            
            
            this.#color = this.angle * 180 / Math.PI;
            secondsPast = Math.floor(timestamp / this.fpsInterval) - 1;
            console.log("secondsPast: " + secondsPast);
            
            // Actualizar el estilo de trazo
            this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
            
            // Dibujar líneas
            this.#ctx.strokeWidth = minute % 5 + 2;
            this.#draw(this.#width / 2, this.#height / 2, secondsPast);
            this.angle = this.angle - (Math.PI * 2 / 60);
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}
