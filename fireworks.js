const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Firework {
    constructor(x, y, targetX, targetY, color, trailLength) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        this.trail = [];
        this.trailLength = trailLength;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.speed = random(5, 10);
        this.distanceToTarget = this.calculateDistance(x, y, targetX, targetY);
        this.trail.push({ x, y });
    }

    calculateDistance(x1, y1, x2, y2) {
        const xDistance = x2 - x1;
        const yDistance = y2 - y1;
        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    update() {
        this.trail.push({ x: this.x, y: this.y });

        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        this.distanceToTarget = this.calculateDistance(this.x, this.y, this.targetX, this.targetY);

        if (this.distanceToTarget < this.speed) {
            this.createParticles();
            return true;
        }

        return false;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.trail[0].x, this.trail[0].y);
        this.trail.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            fireworks.push(new Particle(this.targetX, this.targetY, this.color));
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = random(0, Math.PI * 2);
        this.speed = random(1, 5);
        this.friction = 0.95;
        this.gravity = 1;
        this.alpha = 1;
        this.decay = random(0.015, 0.03);
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.speed *= this.friction;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            return true;
        }

        return false;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];

        if (firework.update()) {
            fireworks.splice(i, 1);
        } else {
            firework.draw();
        }
    }

    if (Math.random() < 0.05) {
        const startX = random(0, canvas.width);
        const startY = canvas.height;
        const targetX = random(0, canvas.width);
        const targetY = random(0, canvas.height / 2);
        const color = `hsl(${random(0, 360)}, 100%, 50%)`;
        const trailLength = random(10, 20);
        fireworks.push(new Firework(startX, startY, targetX, targetY, color, trailLength));
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
