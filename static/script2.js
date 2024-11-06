let canvas;
let ctx;
let second;
let minute;
let hour;
let day;
let month;
let year;
let secondInRads;
let secondsArray = [];

let clock;

let meetingPoint = {
    x: 0,
    y: 0
};

window.onload = function() {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clock = new Clock(ctx, canvas.width, canvas.height);    
    clock.start();        
}

class Clock {
    #ctx;
    #width;
    #height;
    #color;
    #alpha;

    constructor (ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#color = 0;
        this.#alpha = 1;
        this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
        this.#ctx.lineWidth = 3;

        this.meetingPoint = {
            x: (this.#width / 2 + Math.sin(-60) * 300) + 100,
            y: (this.#height / 2 + 250)
        };
    }

    start() {
        let currentTime;
        let length; 
        setInterval(() => {
            // if (minute % 5 === 0 && second === 0) {}
            if ( second === 0 && minute % 2 === 0) {
                this.gather();
            }
            currentTime = new Date();
            hour = currentTime.getHours();
            minute = currentTime.getMinutes();
            second = currentTime.getSeconds();
            secondInRads = second * (-Math.PI) / 180;
            day = currentTime.getDay();
            month = currentTime.getMonth();
            year = currentTime.getFullYear();

            length = (minute % 5) * 60 + second + Math.random() * 15;
            if (length < 25) { length = 25 };

            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#width / 2, this.#height / 2);
            this.#color = second * 6;
            this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
            this.#ctx.lineTo(this.#width / 2 + length * Math.sin(secondInRads * 6 + Math.PI), this.#height / 2 + length * Math.cos(secondInRads * 6 + Math.PI));
            this.#ctx.stroke();
            console.log(hour + ":" + minute + ":" + second);

            let endX = this.#width / 2 + length * Math.sin(secondInRads * 6 + Math.PI);
            let endY = this.#height / 2 + length * Math.cos(secondInRads * 6 + Math.PI);

            secondsArray.push({ startX: this.#width / 2, startY: this.#height / 2, endX: endX, endY: endY})

            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#width / 2 - 200 * Math.sin(-5.7595), this.#height / 2 - 200 * Math.cos(-5.7595));
            
            this.#ctx.strokeStyle = `rgb(255, 255, 255)`;
            this.#ctx.lineTo(this.#width / 2 + 200 * Math.sin(-5.7595), this.#height / 2 + 200 * Math.cos(-5.7595));
            this.#ctx.stroke();

            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#width / 2 - 200 * Math.sin(-4.1887), this.#height / 2 - 200 * Math.cos(-4.1887));
            
            this.#ctx.strokeStyle = `rgb(255, 255, 255)`;
            this.#ctx.lineTo(this.#width / 2 + 200 * Math.sin(-4.1887), this.#height / 2 + 200 * Math.cos(-4.1887));
            this.#ctx.stroke();
        }, 1000);
    }

    gather() {
        let minuteInRads = (minute * Math.PI / 180) - Math.PI;
        this.meetingPoint = {
            x: this.#width / 2 + Math.sin(minuteInRads) * 200,
            y: this.#height / 2 + Math.cos(minuteInRads) * 200
        };
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        setInterval(() => {
            secondsArray.forEach((line) => {
    
                // Calcular la dirección hacia el punto de reunión
                const deltaEndX = (this.meetingPoint.x - line.endX) * 0.25; // Movimiento hacia el punto de reunión
                const deltaEndY = (this.meetingPoint.y - line.endY) * 0.25; // Movimiento hacia el punto de reunión
                
                // Actualizar las coordenadas finales
                line.endX += deltaEndX;
                line.endY += deltaEndY;
    
                // Actualizar color segun destino
                this.#color = minute * 6;
    
                // Dibujar la línea en su nueva posición
                this.#ctx.beginPath();
                this.#ctx.lineWidth = minute % 5 + 2;
                this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
                this.#ctx.moveTo(line.startX, line.startY);
                this.#ctx.lineTo(line.endX, line.endY);
                this.#ctx.stroke();
            });
        }, 1000);

        // Verificar si todas las líneas han llegado al punto de reunión
        const allGathered = secondsArray.every((line) => {
            return Math.abs(line.endX - this.meetingPoint.x) < 1 && Math.abs(line.endY - this.meetingPoint.y) < 1;
        });

        if (allGathered) {
            secondsArray = [];
        }
        /* secondsArray.forEach((line) => {
            // Calcular la dirección hacia el punto de reunión
            const deltaStartX = (this.meetingPoint.x - line.startX) * 0.05; // Movimiento hacia el punto de reunión
            const deltaStartY = (this.meetingPoint.y - line.startY) * 0.05; // Movimiento hacia el punto de reunión
            
            // Actualizar las coordenadas finales
            line.startX += deltaStartX;
            line.startY += deltaStartY;

            // Calcular la dirección hacia el punto de reunión
            const deltaEndX = (this.meetingPoint.x - line.endX) * 0.05; // Movimiento hacia el punto de reunión
            const deltaEndY = (this.meetingPoint.y - line.endY) * 0.05; // Movimiento hacia el punto de reunión
            
            // Actualizar las coordenadas finales
            line.endX += deltaEndX;
            line.endY += deltaEndY;

            // Actualizar color segun destino
            this.#color = minute * 6;

            // Dibujar la línea en su nueva posición
            this.#ctx.beginPath();
            this.#ctx.lineWidth = minute % 5 + 2;
            this.#ctx.strokeStyle = `hsla(${this.#color}, 100%, 50%, ${this.#alpha})`;
            this.#ctx.moveTo(line.startX, line.startY);
            this.#ctx.lineTo(line.endX, line.endY);
            this.#ctx.stroke();
        }); */
    }
}