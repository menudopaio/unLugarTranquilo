/* script.js - versión completa con canvas oval (ratio 2:1) y perímetro ovalado */
let canvas;
let ctx;
let second;
let minute;
let hour;
let clock;

/* Ajusta el canvas al viewport manteniendo 2:1
   y sincroniza tamaño CSS (layout) con tamaño interno (buffer) */
function resizeCanvas() {
    const ratio = 2 / 1;
    const maxW = window.innerWidth;
    const maxH = window.innerHeight;

    // Calcula dimensiones que quepan en pantalla manteniendo 2:1
    let width = maxW;
    let height = width / ratio;
    if (height > maxH) {
        height = maxH;
        width = height * ratio;
    }

    // Tamaño CSS (lo que se ve)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Tamaño del buffer interno a resolución de pantalla
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Escala el contexto para dibujar en "px CSS"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Perímetro ovalado visible
    canvas.style.borderRadius = "50%";

    if (clock) {
        clock.resize(width, height);
    }
}

window.onload = function () {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    clock = new Clock(ctx, canvas.clientWidth, canvas.clientHeight);
    clock.start();
};

window.onresize = () => {
    resizeCanvas();
};

class Clock {
    #ctx;
    #width;   // en px CSS
    #height;  // en px CSS
    #alpha;
    #padding;
    #hourCircleRadius;
    #minuteCircleRadius;
    #maxClockRadius;

    #secondTrail = [];

    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#alpha = 1;
        this.#padding = 10;
        this.#hourCircleRadius = 30;
        this.#minuteCircleRadius = 15;

        this.#recalcMaxRadius();
    }

    resize(width, height) {
        this.#width = width;
        this.#height = height;
        this.#recalcMaxRadius();
    }

    #recalcMaxRadius() {
        // El límite vertical es el más restrictivo en un óvalo 2:1
        this.#maxClockRadius = Math.max(
            0,
            this.#height / 2 - this.#hourCircleRadius - this.#padding
        );
    }

    start() {
        setInterval(() => {
            // Clipping ovalado para que nada se pinte fuera del óvalo
            this.#ctx.save();
            this.#ctx.beginPath();
            this.#ctx.ellipse(
                this.#width / 2,         // cx
                this.#height / 2,        // cy
                this.#width / 2,         // rx
                this.#height / 2,        // ry
                0, 0, Math.PI * 2
            );
            this.#ctx.clip();

            // Fondo negro dentro del óvalo
            this.#ctx.fillStyle = "black";
            this.#ctx.fillRect(0, 0, this.#width, this.#height);

            // Hora actual
            const currentTime = new Date();
            hour = currentTime.getHours() % 12;
            minute = currentTime.getMinutes();
            second = currentTime.getSeconds();

            const hourAngle = ((hour % 12) + minute / 60) * 30 * (Math.PI / 180);
            const minuteAngle = (minute + second / 60) * 6 * (Math.PI / 180);
            const secondAngle = second * 6 * (Math.PI / 180);

            this.drawCircleOfFifths();

            // Hora (manecilla + círculo)
            const hourRadius = this.#maxClockRadius / 2;
            this.drawHand(
                hourAngle,
                hourRadius,
                Math.max(6, Math.round(this.#height * 0.012)),
                `hsla(${(hourAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );
            const hourPos = this.polarToCartesian(hourRadius, hourAngle);
            this.drawCircle(
                hourPos.x, hourPos.y,
                this.#hourCircleRadius,
                `hsla(${(hourAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );

            // Minuto (manecilla + círculo)
            const minuteRadius = this.#maxClockRadius - (this.#hourCircleRadius - this.#minuteCircleRadius);
            this.drawHand(
                minuteAngle,
                minuteRadius,
                Math.max(3, Math.round(this.#height * 0.006)),
                `hsla(${(minuteAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );
            const minutePos = this.polarToCartesian(minuteRadius, minuteAngle);
            this.drawCircle(
                minutePos.x, minutePos.y,
                this.#minuteCircleRadius,
                `hsla(${(minuteAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );

            // Segundero con rastro
            this.updateSecondTrail(minute, second, secondAngle);
            this.drawSecondTrail();

            this.#ctx.restore();
        }, 1000);
    }

    polarToCartesian(radius, angle) {
        const centerX = this.#width / 2;
        const centerY = this.#height / 2;
        return {
            x: centerX + Math.sin(angle) * radius,
            y: centerY - Math.cos(angle) * radius,
        };
    }

    drawCircle(x, y, size, color) {
        this.#ctx.beginPath();
        this.#ctx.arc(x, y, size, 0, Math.PI * 2);
        this.#ctx.fillStyle = color;
        this.#ctx.fill();
    }

    drawHand(angle, length, width, color) {
        const centerX = this.#width / 2;
        const centerY = this.#height / 2;
        this.#ctx.beginPath();
        this.#ctx.moveTo(centerX, centerY);
        this.#ctx.lineTo(
            centerX + Math.sin(angle) * length,
            centerY - Math.cos(angle) * length
        );
        this.#ctx.strokeStyle = color;
        this.#ctx.lineWidth = width;
        this.#ctx.stroke();
    }

    updateSecondTrail(minute, _second, angle) {
        const minLength = 20;
        const maxLength = Math.max(20, this.#maxClockRadius - 20);
        let minuteNorm = minute / 59;
        minuteNorm = Math.min(Math.max(minuteNorm, 0), 1);
        const length = minLength + minuteNorm * (maxLength - minLength);
        const hue = (angle * 180) / Math.PI;
        this.#secondTrail.push({ angle, length, hue });
        if (this.#secondTrail.length > 60) {
            this.#secondTrail.shift();
        }
    }

    drawSecondTrail() {
        const centerX = this.#width / 2;
        const centerY = this.#height / 2;
        this.#ctx.lineWidth = 2;
        for (const sec of this.#secondTrail) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(centerX, centerY);
            this.#ctx.lineTo(
                centerX + Math.sin(sec.angle) * sec.length,
                centerY - Math.cos(sec.angle) * sec.length
            );
            this.#ctx.strokeStyle = `hsla(${sec.hue}, 100%, 50%, ${this.#alpha})`;
            this.#ctx.stroke();
        }
    }

    drawCircleOfFifths() {
        const majors = ["C", "G", "D", "A", "E", "B", "F♯", "C♯", "A♭", "E♭", "B♭", "F"];
        const minors = ["Am", "Em", "Bm", "F♯m", "C♯m", "G♯m", "D♯m", "A♯m", "Fm", "Cm", "Gm", "Dm"];

        const outerRadius = this.#maxClockRadius;
        const innerRadius = Math.max(30, this.#maxClockRadius - 130);

        // Tipografías adaptativas para que no se salgan en móvil
        const majorFont = Math.max(14, Math.round(this.#height * 0.06));
        const minorFont = Math.max(10, Math.round(this.#height * 0.035));

        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * (Math.PI / 180);
            const hue = (angle * 180) / Math.PI;

            const posMajor = this.polarToCartesian(outerRadius, angle);
            this.drawText(majors[i], posMajor.x, posMajor.y, `hsla(${hue}, 100%, 60%, ${this.#alpha})`, true, majorFont);

            const posMinor = this.polarToCartesian(innerRadius, angle);
            this.drawText(minors[i], posMinor.x, posMinor.y, `hsla(${hue}, 60%, 50%, ${this.#alpha})`, false, minorFont);
        }
    }

    drawText(text, x, y, color, isMajor = false, px = 24) {
        this.#ctx.font = `${isMajor ? "bold " : ""}${px}px sans-serif`;
        this.#ctx.fillStyle = color;
        this.#ctx.textAlign = "center";
        this.#ctx.textBaseline = "middle";
        this.#ctx.fillText(text, x, y);
    }
}
