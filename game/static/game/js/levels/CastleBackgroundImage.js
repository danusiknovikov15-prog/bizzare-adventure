/**
 * Castle Background Image Generator
 * Generates ruined castle as a canvas image background
 */

export class CastleBackgroundImage {
    constructor(levelNumber, width = 3000, height = 600) {
        this.levelNumber = levelNumber;
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');

        // Seed for pseudo-random generation
        this.seed = levelNumber * 123;
        this.randomIndex = 0;

        this.generate();
    }

    random(min, max) {
        const x = Math.sin(this.seed + this.randomIndex++) * 10000;
        return min + (x - Math.floor(x)) * (max - min);
    }

    generate() {
        // Dark night sky background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a0a1a');
        gradient.addColorStop(0.7, '#1a1a2e');
        gradient.addColorStop(1, '#2a2a3e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Add stars
        this.drawStars();

        // Moon
        this.drawMoon();

        // Distant mountains/hills
        this.drawMountains();

        // Main castle silhouette
        this.drawCastleSilhouette();

        // Foreground ruins
        this.drawForegroundRuins();

        // Add atmospheric fog
        this.drawFog();
    }

    drawStars() {
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
            const x = this.random(0, this.width);
            const y = this.random(0, this.height * 0.5);
            const size = this.random(1, 3);
            const opacity = this.random(0.3, 1);

            this.ctx.globalAlpha = opacity;
            this.ctx.fillRect(x, y, size, size);
        }
        this.ctx.globalAlpha = 1;
    }

    drawMoon() {
        const moonX = this.width * 0.8;
        const moonY = this.height * 0.15;
        const moonRadius = 40;

        // Moon glow
        const moonGlow = this.ctx.createRadialGradient(moonX, moonY, moonRadius, moonX, moonY, moonRadius * 2);
        moonGlow.addColorStop(0, 'rgba(200, 200, 220, 0.3)');
        moonGlow.addColorStop(1, 'rgba(200, 200, 220, 0)');
        this.ctx.fillStyle = moonGlow;
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Moon body
        this.ctx.fillStyle = '#E0E0E8';
        this.ctx.beginPath();
        this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Moon craters
        this.ctx.fillStyle = '#C0C0C8';
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(moonX - 10, moonY - 8, 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(moonX + 12, moonY + 5, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawMountains() {
        // Dark silhouette of distant mountains
        this.ctx.fillStyle = '#1a1a2a';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height * 0.6);

        for (let x = 0; x < this.width; x += 100) {
            const y = this.height * 0.5 + this.random(-50, 50);
            this.ctx.lineTo(x, y);
        }

        this.ctx.lineTo(this.width, this.height * 0.6);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawCastleSilhouette() {
        const castleX = this.width * 0.5;
        const castleY = this.height * 0.3;
        const castleWidth = 400;
        const castleHeight = 200;

        this.ctx.fillStyle = '#0a0a15';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;

        // Main castle body
        this.ctx.fillRect(castleX, castleY, castleWidth, castleHeight);
        this.ctx.strokeRect(castleX, castleY, castleWidth, castleHeight);

        // Left tower
        const leftTowerX = castleX - 60;
        const leftTowerY = castleY - 80;
        const leftTowerWidth = 80;
        const leftTowerHeight = castleHeight + 80;

        this.ctx.fillRect(leftTowerX, leftTowerY, leftTowerWidth, leftTowerHeight);
        this.ctx.strokeRect(leftTowerX, leftTowerY, leftTowerWidth, leftTowerHeight);

        // Left tower top (crenellations)
        this.drawCrenellations(leftTowerX, leftTowerY, leftTowerWidth, 20);

        // Right tower
        const rightTowerX = castleX + castleWidth - 20;
        const rightTowerY = castleY - 60;
        const rightTowerWidth = 90;
        const rightTowerHeight = castleHeight + 60;

        this.ctx.fillRect(rightTowerX, rightTowerY, rightTowerWidth, rightTowerHeight);
        this.ctx.strokeRect(rightTowerX, rightTowerY, rightTowerWidth, rightTowerHeight);

        // Right tower top
        this.drawCrenellations(rightTowerX, rightTowerY, rightTowerWidth, 20);

        // Central tall tower
        const centerTowerX = castleX + castleWidth / 2 - 30;
        const centerTowerY = castleY - 120;
        const centerTowerWidth = 60;
        const centerTowerHeight = castleHeight + 120;

        this.ctx.fillRect(centerTowerX, centerTowerY, centerTowerWidth, centerTowerHeight);
        this.ctx.strokeRect(centerTowerX, centerTowerY, centerTowerWidth, centerTowerHeight);

        // Central tower top (pointed roof)
        this.ctx.beginPath();
        this.ctx.moveTo(centerTowerX, centerTowerY);
        this.ctx.lineTo(centerTowerX + centerTowerWidth / 2, centerTowerY - 40);
        this.ctx.lineTo(centerTowerX + centerTowerWidth, centerTowerY);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Windows with light
        this.drawCastleWindows(castleX, castleY, castleWidth, castleHeight);
    }

    drawCrenellations(x, y, width, height) {
        const crenelWidth = 20;
        const numCrenels = Math.floor(width / (crenelWidth * 2));

        this.ctx.fillStyle = '#0a0a15';
        for (let i = 0; i < numCrenels; i++) {
            const crenelX = x + i * (crenelWidth * 2);
            this.ctx.fillRect(crenelX, y, crenelWidth, height);
            this.ctx.strokeRect(crenelX, y, crenelWidth, height);
        }
    }

    drawCastleWindows(castleX, castleY, castleWidth, castleHeight) {
        const numWindows = 6;
        const windowWidth = 20;
        const windowHeight = 30;

        for (let i = 0; i < numWindows; i++) {
            const wx = castleX + (i + 1) * (castleWidth / (numWindows + 1)) - windowWidth / 2;
            const wy = castleY + castleHeight / 2 - windowHeight / 2;

            // Random chance for lit window
            const isLit = this.random(0, 1) > 0.6;

            if (isLit) {
                // Glowing window
                const glow = this.ctx.createRadialGradient(
                    wx + windowWidth / 2, wy + windowHeight / 2, 0,
                    wx + windowWidth / 2, wy + windowHeight / 2, windowWidth
                );
                glow.addColorStop(0, '#FFD700');
                glow.addColorStop(0.5, '#FFA500');
                glow.addColorStop(1, 'rgba(255, 165, 0, 0)');

                this.ctx.fillStyle = glow;
                this.ctx.fillRect(wx - 10, wy - 10, windowWidth + 20, windowHeight + 20);
            }

            // Window frame
            this.ctx.fillStyle = isLit ? '#FFD700' : '#1a1a2a';
            this.ctx.fillRect(wx, wy, windowWidth, windowHeight);
            this.ctx.strokeStyle = '#000000';
            this.ctx.strokeRect(wx, wy, windowWidth, windowHeight);

            // Cross divider
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(wx + windowWidth / 2, wy);
            this.ctx.lineTo(wx + windowWidth / 2, wy + windowHeight);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(wx, wy + windowHeight / 2);
            this.ctx.lineTo(wx + windowWidth, wy + windowHeight / 2);
            this.ctx.stroke();
        }
        this.ctx.lineWidth = 2;
    }

    drawForegroundRuins() {
        // Draw ruined structures in foreground (larger, darker)
        const numRuins = 5;

        this.ctx.fillStyle = '#0a0a12';
        this.ctx.strokeStyle = '#000000';

        for (let i = 0; i < numRuins; i++) {
            const ruinX = this.random(50, this.width - 150);
            const ruinY = this.height - this.random(100, 250);
            const ruinWidth = this.random(60, 120);
            const ruinHeight = this.random(80, 200);

            // Ruined wall
            this.ctx.fillRect(ruinX, ruinY, ruinWidth, ruinHeight);
            this.ctx.strokeRect(ruinX, ruinY, ruinWidth, ruinHeight);

            // Stone texture
            this.ctx.strokeStyle = '#050508';
            this.ctx.lineWidth = 1;
            for (let y = ruinY; y < ruinY + ruinHeight; y += 30) {
                this.ctx.beginPath();
                this.ctx.moveTo(ruinX, y);
                this.ctx.lineTo(ruinX + ruinWidth, y);
                this.ctx.stroke();
            }

            // Cracks
            const numCracks = Math.floor(this.random(1, 4));
            for (let c = 0; c < numCracks; c++) {
                const crackX = ruinX + this.random(10, ruinWidth - 10);
                const crackY = ruinY + this.random(10, ruinHeight - 30);

                this.ctx.beginPath();
                this.ctx.moveTo(crackX, crackY);
                this.ctx.lineTo(crackX + this.random(-15, 15), crackY + 20);
                this.ctx.lineTo(crackX + this.random(-10, 10), crackY + 40);
                this.ctx.stroke();
            }

            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
        }
    }

    drawFog() {
        // Add atmospheric fog at bottom
        const fogGradient = this.ctx.createLinearGradient(0, this.height - 150, 0, this.height);
        fogGradient.addColorStop(0, 'rgba(50, 50, 70, 0)');
        fogGradient.addColorStop(0.5, 'rgba(50, 50, 70, 0.2)');
        fogGradient.addColorStop(1, 'rgba(50, 50, 70, 0.4)');

        this.ctx.fillStyle = fogGradient;
        this.ctx.fillRect(0, this.height - 150, this.width, 150);
    }

    getImage() {
        return this.canvas;
    }

    getDataURL() {
        return this.canvas.toDataURL();
    }
}

// Pre-generate backgrounds for all 20 levels
export const castleBackgroundImages = {};
for (let i = 1; i <= 20; i++) {
    castleBackgroundImages[`level${i}`] = new CastleBackgroundImage(i);
}
