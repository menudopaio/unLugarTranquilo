let canvas;
let ctx;
let second;
let minute;
let hour;
let clock;

window.onload = function () {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    clock = new Clock(ctx, canvas.width, canvas.height);
    clock.start();
};

class Clock {
    #ctx;
    #width;
    #height;
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

        this.#maxClockRadius =
            this.#height / 2 - this.#hourCircleRadius - this.#padding;
    }

    start() {
        setInterval(() => {
            this.#ctx.fillStyle = "black";
            this.#ctx.fillRect(0, 0, this.#width, this.#height);

            let currentTime = new Date();
            hour = currentTime.getHours() % 12;
            minute = currentTime.getMinutes();
            second = currentTime.getSeconds();

            let hourAngle =
                ((hour % 12) + minute / 60) * 30 * (Math.PI / 180);
            let minuteAngle =
                (minute + second / 60) * 6 * (Math.PI / 180);
            let secondAngle = second * 6 * (Math.PI / 180);

            this.drawCircleOfFifths();

            let hourPos = this.polarToCartesian(
                this.#maxClockRadius,
                hourAngle
            );
            this.drawCircle(
                hourPos.x,
                hourPos.y,
                this.#hourCircleRadius,
                `hsla(${(hourAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );

            let minuteRadius =
                this.#maxClockRadius -
                (this.#hourCircleRadius - this.#minuteCircleRadius);
            let minutePos = this.polarToCartesian(
                minuteRadius,
                minuteAngle
            );
            this.drawCircle(
                minutePos.x,
                minutePos.y,
                this.#minuteCircleRadius,
                `hsla(${(minuteAngle * 180) / Math.PI}, 100%, 50%, ${this.#alpha})`
            );

            this.updateSecondTrail(minute, second, secondAngle);

            this.drawSecondTrail();

        }, 1000);
    }

    polarToCartesian(radius, angle) {
        let centerX = this.#width / 2;
        let centerY = this.#height / 2;
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

    updateSecondTrail(minute, second, angle) {
        // Longitud depende del minuto actual: de mínimo visible a máximo en minuto 59
        const minLength = 20;
        const maxLength = this.#maxClockRadius - 20;

        let minuteNorm = minute / 59;
        if (minuteNorm < 0) minuteNorm = 0;
        if (minuteNorm > 1) minuteNorm = 1;

        let length = minLength + minuteNorm * (maxLength - minLength);

        // Color según el ángulo del segundo
        let hue = (angle * 180) / Math.PI;

        // Guardamos segundo, ángulo, longitud y color para rastro
        this.#secondTrail.push({ angle, length, hue });

        // Máximo 60 segundos guardados para rastro
        if (this.#secondTrail.length > 60) {
            this.#secondTrail.shift();
        }
    }

    drawSecondTrail() {
        let centerX = this.#width / 2;
        let centerY = this.#height / 2;

        for (let sec of this.#secondTrail) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(centerX, centerY);
            this.#ctx.lineTo(
                centerX + Math.sin(sec.angle) * sec.length,
                centerY - Math.cos(sec.angle) * sec.length
            );
            this.#ctx.strokeStyle = `hsla(${sec.hue}, 100%, 50%, ${this.#alpha})`;
            this.#ctx.lineWidth = 5;
            this.#ctx.stroke();
        }
    }

    drawCircleOfFifths() {
        const majors = [
            "C",
            "G",
            "D",
            "A",
            "E",
            "B",
            "F♯",
            "C♯",
            "A♭",
            "E♭",
            "B♭",
            "F",
        ];
        const minors = [
            "Am",
            "Em",
            "Bm",
            "F♯m",
            "C♯m",
            "G♯m",
            "D♯m",
            "A♯m",
            "Fm",
            "Cm",
            "Gm",
            "Dm",
        ];

        let outerRadius = this.#maxClockRadius;
        let innerRadius = this.#maxClockRadius - 60;

        for (let i = 0; i < 12; i++) {
            let angle = (i * 30) * (Math.PI / 180);
            let hue = (angle * 180) / Math.PI;

            let posMajor = this.polarToCartesian(outerRadius, angle);
            this.drawText(
                majors[i],
                posMajor.x,
                posMajor.y,
                `hsla(${hue}, 100%, 60%, ${this.#alpha})`,
                true
            );

            let posMinor = this.polarToCartesian(innerRadius, angle);
            this.drawText(
                minors[i],
                posMinor.x,
                posMinor.y,
                `hsla(${hue}, 60%, 50%, ${this.#alpha})`,
                false
            );
        }
    }

    drawText(text, x, y, color, isMajor = false) {
        if (isMajor) {
            this.#ctx.font = "bold 28px sans-serif";
        } else {
            this.#ctx.font = "16px sans-serif";
        }
        this.#ctx.fillStyle = color;
        this.#ctx.textAlign = "center";
        this.#ctx.textBaseline = "middle";
        this.#ctx.fillText(text, x, y);
    }
}
