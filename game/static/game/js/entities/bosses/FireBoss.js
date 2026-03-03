// FireBoss - Boss with fire zone area damage ability
import { Boss } from '../Boss.js';

export class FireBoss extends Boss {
    constructor(x, y) {
        super(x, y, 'fire');

        // Boss stats for Level 6 (Boss #2)
        this.maxHealth = 120;
        this.health = 120;
        this.damage = 11;

        // Visual customization
        this.color = '#FF4500'; // Orange-red for fire
        this.projectileColor = '#FF6347'; // Tomato red for fire projectiles

        // Fire zone ability
        this.fireZones = [];
        this.maxFireZones = 3;
        this.fireZoneSpawnTimer = 0;
        this.fireZoneSpawnInterval = 4.0; // Create new zones every 4 seconds
        this.fireZoneDuration = 8.0; // Zones last 8 seconds
        this.fireZoneDamage = 3; // 3 damage per second

        // Meteor ability
        this.meteors = [];
        this.maxMeteors = 5;
        this.meteorSpawnInterval = 3.0; // Spawn meteor every 3 seconds
        this.meteorSpawnTimer = this.meteorSpawnInterval; // Start ready to spawn
        this.meteorDamage = 40;
        this.meteorSpeed = 400; // Pixels per second
        this.meteorRadius = 15;

        // Fire Tornado ability
        this.tornadoes = [];
        this.maxTornadoes = 2;
        this.tornadoSpawnInterval = 6.0; // Spawn tornado every 6 seconds
        this.tornadoSpawnTimer = this.tornadoSpawnInterval; // Start ready to spawn
        this.tornadoDamage = 40;
        this.tornadoSpeed = 80; // Moves slowly
        this.tornadoDuration = 10.0; // Lasts 10 seconds
        this.tornadoWidth = 60;
        this.tornadoHeight = 150;
    }

    initializeAbilities() {
        // Fire boss creates fire zones on platforms
        this.abilityTimers.fireZoneSpawn = 0;
    }

    updateAbilities(deltaTime, player, game) {
        // Update fire zone spawn timer
        this.fireZoneSpawnTimer -= deltaTime;

        if (this.fireZoneSpawnTimer <= 0 && this.fireZones.length < this.maxFireZones) {
            // Create a new fire zone at random position
            this.createFireZone(game);
            this.fireZoneSpawnTimer = this.fireZoneSpawnInterval;
        }

        // Update existing fire zones
        this.fireZones = this.fireZones.filter(zone => {
            zone.lifetime -= deltaTime;
            zone.animationTimer += deltaTime;
            return zone.lifetime > 0;
        });

        // Update meteor spawn timer
        this.meteorSpawnTimer -= deltaTime;

        if (this.meteorSpawnTimer <= 0 && this.meteors.length < this.maxMeteors) {
            // Spawn meteor targeting player's position
            this.spawnMeteor(player);
            this.meteorSpawnTimer = this.meteorSpawnInterval;
        }

        // Update existing meteors
        this.meteors = this.meteors.filter(meteor => {
            // Move meteor towards target
            meteor.x += meteor.vx * deltaTime;
            meteor.y += meteor.vy * deltaTime;

            // Check collision with player
            const dx = meteor.x - (player.x + player.width / 2);
            const dy = meteor.y - (player.y + player.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < meteor.radius + player.width / 2 && player.isAlive) {
                // Hit player
                player.takeDamage(this.meteorDamage);
                console.log(`☄️ Meteor hit player for ${this.meteorDamage} damage!`);
                return false; // Remove meteor
            }

            // Remove if out of bounds or hit ground
            if (meteor.y > game.canvas.height || meteor.y < -100 || meteor.x < -100 || meteor.x > game.canvas.width + 100) {
                return false;
            }

            meteor.rotation += deltaTime * 5; // Rotate meteor
            return true;
        });

        // Update tornado spawn timer
        this.tornadoSpawnTimer -= deltaTime;

        if (this.tornadoSpawnTimer <= 0 && this.tornadoes.length < this.maxTornadoes) {
            // Spawn tornado
            this.spawnTornado(player, game);
            this.tornadoSpawnTimer = this.tornadoSpawnInterval;
        }

        // Update existing tornadoes
        this.tornadoes = this.tornadoes.filter(tornado => {
            tornado.lifetime -= deltaTime;
            tornado.animationTimer += deltaTime;

            // Move tornado towards player slowly
            const dx = player.x - tornado.x;
            const dy = player.y - tornado.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                tornado.x += (dx / distance) * this.tornadoSpeed * deltaTime;
                tornado.y += (dy / distance) * this.tornadoSpeed * deltaTime;
            }

            // Check collision with player
            if (player.isAlive &&
                player.x + player.width > tornado.x &&
                player.x < tornado.x + tornado.width &&
                player.y + player.height > tornado.y &&
                player.y < tornado.y + tornado.height) {

                // Damage player (with cooldown to prevent instant death)
                if (!tornado.lastHitTime || (Date.now() - tornado.lastHitTime > 1000)) {
                    player.takeDamage(this.tornadoDamage);
                    tornado.lastHitTime = Date.now();
                    console.log(`🌪️ Fire Tornado hit player for ${this.tornadoDamage} damage!`);
                }
            }

            return tornado.lifetime > 0;
        });
    }

    createFireZone(game) {
        // Create fire zone at random position within the level
        // Try to place on a platform near the boss
        const randomX = this.x + (Math.random() - 0.5) * 400; // Within 200px of boss
        const randomY = this.y + this.height; // At boss's feet level

        const fireZone = {
            x: randomX,
            y: randomY,
            width: 100,
            height: 50,
            lifetime: this.fireZoneDuration,
            damage: this.fireZoneDamage,
            animationTimer: 0
        };

        this.fireZones.push(fireZone);
        console.log('🔥 FireBoss created fire zone!');
    }

    spawnMeteor(player) {
        // Spawn meteor from above, targeting player's current position
        const spawnX = player.x + player.width / 2 + (Math.random() - 0.5) * 200; // Some randomness
        const spawnY = -50; // Above screen

        // Calculate velocity towards player
        const targetX = player.x + player.width / 2;
        const targetY = player.y + player.height / 2;

        const dx = targetX - spawnX;
        const dy = targetY - spawnY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const meteor = {
            x: spawnX,
            y: spawnY,
            vx: (dx / distance) * this.meteorSpeed,
            vy: (dy / distance) * this.meteorSpeed,
            radius: this.meteorRadius,
            damage: this.meteorDamage,
            rotation: 0
        };

        this.meteors.push(meteor);
        console.log('☄️ FireBoss launched meteor!');
    }

    spawnTornado(player, game) {
        // Spawn tornado near the boss
        const spawnX = this.x + (Math.random() - 0.5) * 300;
        const spawnY = this.y - this.tornadoHeight + this.height;

        const tornado = {
            x: spawnX,
            y: spawnY,
            width: this.tornadoWidth,
            height: this.tornadoHeight,
            lifetime: this.tornadoDuration,
            damage: this.tornadoDamage,
            animationTimer: 0,
            lastHitTime: 0
        };

        this.tornadoes.push(tornado);
        console.log('🌪️ FireBoss summoned Fire Tornado!');
    }

    renderAbilities(ctx) {
        // Render fire zones
        for (const zone of this.fireZones) {
            ctx.save();

            // Flickering animation
            const flicker = Math.sin(zone.animationTimer * 10) * 0.2 + 0.8;
            ctx.globalAlpha = flicker;

            // Gradient fire effect
            const gradient = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.height);
            gradient.addColorStop(0, '#FF4500'); // Orange-red at bottom
            gradient.addColorStop(0.5, '#FF6347'); // Tomato in middle
            gradient.addColorStop(1, '#FFD700'); // Gold at top

            ctx.fillStyle = gradient;
            ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

            // Fire particles
            for (let i = 0; i < 5; i++) {
                const particleX = zone.x + Math.random() * zone.width;
                const particleY = zone.y + Math.random() * zone.height;
                const particleSize = Math.random() * 8 + 4;

                ctx.fillStyle = i % 2 === 0 ? '#FF4500' : '#FFD700';
                ctx.globalAlpha = Math.random() * 0.7 + 0.3;
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // Render meteors
        for (const meteor of this.meteors) {
            ctx.save();

            // Fire trail effect
            ctx.globalAlpha = 0.3;
            const trailGradient = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, meteor.radius * 3);
            trailGradient.addColorStop(0, '#FF4500');
            trailGradient.addColorStop(0.5, '#FF6347');
            trailGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = trailGradient;
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, meteor.radius * 3, 0, Math.PI * 2);
            ctx.fill();

            // Meteor body with rotation
            ctx.globalAlpha = 1.0;
            ctx.translate(meteor.x, meteor.y);
            ctx.rotate(meteor.rotation);

            // Outer glow
            ctx.globalAlpha = 0.6;
            const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, meteor.radius + 8);
            glowGradient.addColorStop(0, '#FFD700');
            glowGradient.addColorStop(0.5, '#FF4500');
            glowGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(0, 0, meteor.radius + 8, 0, Math.PI * 2);
            ctx.fill();

            // Meteor core
            ctx.globalAlpha = 1.0;
            const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, meteor.radius);
            coreGradient.addColorStop(0, '#FFFFFF');
            coreGradient.addColorStop(0.3, '#FFD700');
            coreGradient.addColorStop(0.7, '#FF4500');
            coreGradient.addColorStop(1, '#8B0000');
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(0, 0, meteor.radius, 0, Math.PI * 2);
            ctx.fill();

            // Meteor texture (rocky surface)
            ctx.fillStyle = '#8B0000';
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const distance = meteor.radius * 0.6;
                const rockX = Math.cos(angle) * distance;
                const rockY = Math.sin(angle) * distance;
                ctx.beginPath();
                ctx.arc(rockX, rockY, meteor.radius * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // Render fire tornadoes
        for (const tornado of this.tornadoes) {
            ctx.save();

            // Tornado base gradient
            const tornadoGradient = ctx.createLinearGradient(
                tornado.x, tornado.y,
                tornado.x, tornado.y + tornado.height
            );
            tornadoGradient.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
            tornadoGradient.addColorStop(0.3, 'rgba(255, 69, 0, 0.6)');
            tornadoGradient.addColorStop(0.7, 'rgba(255, 99, 71, 0.8)');
            tornadoGradient.addColorStop(1, 'rgba(139, 0, 0, 0.9)');

            ctx.fillStyle = tornadoGradient;

            // Draw tornado spiral shape
            const spiralSegments = 20;
            const time = tornado.animationTimer;

            ctx.beginPath();
            for (let i = 0; i <= spiralSegments; i++) {
                const t = i / spiralSegments;
                const y = tornado.y + t * tornado.height;
                const widthAtT = tornado.width * (0.3 + t * 0.7); // Wider at bottom
                const spiralOffset = Math.sin(time * 5 + t * Math.PI * 4) * widthAtT * 0.3;

                const x = tornado.x + tornado.width / 2 + spiralOffset - widthAtT / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            for (let i = spiralSegments; i >= 0; i--) {
                const t = i / spiralSegments;
                const y = tornado.y + t * tornado.height;
                const widthAtT = tornado.width * (0.3 + t * 0.7);
                const spiralOffset = Math.sin(time * 5 + t * Math.PI * 4) * widthAtT * 0.3;

                const x = tornado.x + tornado.width / 2 + spiralOffset + widthAtT / 2;
                ctx.lineTo(x, y);
            }

            ctx.closePath();
            ctx.fill();

            // Fire particles swirling in tornado
            const numParticles = 15;
            for (let i = 0; i < numParticles; i++) {
                const t = (i / numParticles + time * 0.5) % 1;
                const y = tornado.y + t * tornado.height;
                const widthAtT = tornado.width * (0.3 + t * 0.7);
                const angle = time * 5 + t * Math.PI * 4 + i * 0.5;
                const radius = widthAtT * 0.4;
                const particleX = tornado.x + tornado.width / 2 + Math.cos(angle) * radius;
                const particleY = y;
                const particleSize = 3 + Math.random() * 5;

                ctx.globalAlpha = 0.6 + Math.random() * 0.4;
                ctx.fillStyle = i % 3 === 0 ? '#FFD700' : (i % 3 === 1 ? '#FF4500' : '#FF6347');
                ctx.beginPath();
                ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                ctx.fill();
            }

            // Outer glow
            ctx.globalAlpha = 0.3;
            const glowGradient = ctx.createRadialGradient(
                tornado.x + tornado.width / 2, tornado.y + tornado.height / 2, 0,
                tornado.x + tornado.width / 2, tornado.y + tornado.height / 2, tornado.width
            );
            glowGradient.addColorStop(0, '#FF4500');
            glowGradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(tornado.x + tornado.width / 2, tornado.y + tornado.height / 2, tornado.width, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Render fire projectiles
        ctx.fillStyle = this.projectileColor;
        for (const proj of this.projectiles) {
            ctx.save();

            // Outer glow
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius + 5, 0, Math.PI * 2);
            ctx.fill();

            // Inner projectile
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = this.projectileColor;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    render(ctx) {
        if (!this.isAlive) return;

        ctx.save();

        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        const isHit = this.hitFlashTimer > 0;
        const t = Date.now() / 1000;

        // === FIRE DEMON ===

        // Body - lava core with cracks
        const bodyGrad = ctx.createLinearGradient(x, y + 30, x + w, y + 100);
        bodyGrad.addColorStop(0, isHit ? '#FFF' : '#8B0000');
        bodyGrad.addColorStop(0.3, isHit ? '#FFF' : '#CC2200');
        bodyGrad.addColorStop(0.7, isHit ? '#FFF' : '#CC2200');
        bodyGrad.addColorStop(1, isHit ? '#FFF' : '#8B0000');
        ctx.fillStyle = bodyGrad;
        ctx.fillRect(x + 10, y + 35, w - 20, 65);

        // Lava cracks on body
        if (!isHit) {
            ctx.strokeStyle = '#FF6600';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#FF4500';
            ctx.shadowBlur = 6;
            // Crack pattern
            ctx.beginPath();
            ctx.moveTo(x + 30, y + 45);
            ctx.lineTo(x + 45, y + 60);
            ctx.lineTo(x + 35, y + 75);
            ctx.moveTo(x + 45, y + 60);
            ctx.lineTo(x + 60, y + 55);
            ctx.lineTo(x + 75, y + 65);
            ctx.moveTo(x + 60, y + 55);
            ctx.lineTo(x + 55, y + 80);
            ctx.moveTo(x + 75, y + 65);
            ctx.lineTo(x + 90, y + 50);
            ctx.lineTo(x + 85, y + 75);
            ctx.stroke();

            // Glowing lava inside cracks
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5 + Math.sin(t * 4) * 0.3;
            ctx.beginPath();
            ctx.moveTo(x + 31, y + 46);
            ctx.lineTo(x + 45, y + 60);
            ctx.lineTo(x + 36, y + 74);
            ctx.moveTo(x + 45, y + 60);
            ctx.lineTo(x + 60, y + 56);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }

        // Magma chest core (glowing center)
        if (!isHit) {
            const coreGrad = ctx.createRadialGradient(x + w / 2, y + 65, 3, x + w / 2, y + 65, 18);
            coreGrad.addColorStop(0, '#FFFFFF');
            coreGrad.addColorStop(0.3, '#FFD700');
            coreGrad.addColorStop(0.7, '#FF4500');
            coreGrad.addColorStop(1, 'rgba(255,69,0,0)');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 65, 18, 0, Math.PI * 2);
            ctx.fill();
        }

        // Shoulder flame plates
        ctx.fillStyle = isHit ? '#FFF' : '#B22222';
        ctx.beginPath();
        ctx.ellipse(x + 5, y + 40, 20, 14, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + w - 5, y + 40, 20, 14, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Flames on shoulders
        if (!isHit) {
            for (let side = 0; side < 2; side++) {
                const sx = side === 0 ? x - 2 : x + w + 2;
                for (let i = 0; i < 3; i++) {
                    const flameH = 12 + Math.sin(t * 6 + i * 2 + side) * 6;
                    const flameGrad = ctx.createLinearGradient(sx, y + 35, sx, y + 35 - flameH);
                    flameGrad.addColorStop(0, '#FF4500');
                    flameGrad.addColorStop(0.5, '#FFD700');
                    flameGrad.addColorStop(1, 'rgba(255,255,0,0)');
                    ctx.fillStyle = flameGrad;
                    ctx.beginPath();
                    const offset = (i - 1) * 8;
                    ctx.moveTo(sx + offset - 4, y + 38);
                    ctx.quadraticCurveTo(sx + offset, y + 35 - flameH, sx + offset + 4, y + 38);
                    ctx.fill();
                }
            }
        }

        // Head
        const headGrad = ctx.createRadialGradient(x + w / 2, y + 18, 5, x + w / 2, y + 18, 24);
        headGrad.addColorStop(0, isHit ? '#FFF' : '#CC3300');
        headGrad.addColorStop(1, isHit ? '#FFF' : '#8B0000');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 18, 24, 0, Math.PI * 2);
        ctx.fill();

        // Demon horns
        ctx.fillStyle = isHit ? '#FFF' : '#4A0000';
        // Left horn
        ctx.beginPath();
        ctx.moveTo(x + 25, y + 8);
        ctx.quadraticCurveTo(x + 15, y - 20, x + 10, y - 25);
        ctx.lineTo(x + 20, y - 15);
        ctx.quadraticCurveTo(x + 22, y - 5, x + 32, y + 8);
        ctx.closePath();
        ctx.fill();
        // Right horn
        ctx.beginPath();
        ctx.moveTo(x + w - 25, y + 8);
        ctx.quadraticCurveTo(x + w - 15, y - 20, x + w - 10, y - 25);
        ctx.lineTo(x + w - 20, y - 15);
        ctx.quadraticCurveTo(x + w - 22, y - 5, x + w - 32, y + 8);
        ctx.closePath();
        ctx.fill();

        // Flame crown between horns
        if (!isHit) {
            for (let i = 0; i < 5; i++) {
                const fx = x + 30 + i * 15;
                const fh = 10 + Math.sin(t * 8 + i * 1.5) * 5;
                const flameGrad = ctx.createLinearGradient(fx, y - 2, fx, y - 2 - fh);
                flameGrad.addColorStop(0, '#FF4500');
                flameGrad.addColorStop(0.6, '#FFD700');
                flameGrad.addColorStop(1, 'rgba(255,255,100,0)');
                ctx.fillStyle = flameGrad;
                ctx.beginPath();
                ctx.moveTo(fx - 5, y - 2);
                ctx.quadraticCurveTo(fx, y - 2 - fh, fx + 5, y - 2);
                ctx.fill();
            }
        }

        // Face - menacing
        ctx.fillStyle = isHit ? '#FFF' : '#2B0000';
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + 20);
        ctx.lineTo(x + w / 2 + 14, y + 20);
        ctx.lineTo(x + w / 2 + 10, y + 30);
        ctx.lineTo(x + w / 2 - 10, y + 30);
        ctx.closePath();
        ctx.fill();

        // Eyes - blazing
        ctx.fillStyle = isHit ? '#FFF' : '#FF6600';
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = isHit ? 0 : 12;
        ctx.fillRect(x + w / 2 - 14, y + 14, 9, 6);
        ctx.fillRect(x + w / 2 + 5, y + 14, 9, 6);
        // Eye pupils
        ctx.fillStyle = isHit ? '#FFF' : '#FFFF00';
        ctx.fillRect(x + w / 2 - 11, y + 15, 4, 4);
        ctx.fillRect(x + w / 2 + 8, y + 15, 4, 4);
        ctx.shadowBlur = 0;

        // Belt with fire buckle
        ctx.fillStyle = isHit ? '#FFF' : '#5C0000';
        ctx.fillRect(x + 15, y + 92, w - 30, 8);
        ctx.fillStyle = isHit ? '#FFF' : '#FF4500';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 96, 7, 0, Math.PI * 2);
        ctx.fill();

        // Legs - armored with lava glow
        const legGrad = ctx.createLinearGradient(x, y + 100, x, y + h);
        legGrad.addColorStop(0, isHit ? '#FFF' : '#8B0000');
        legGrad.addColorStop(1, isHit ? '#FFF' : '#4A0000');
        ctx.fillStyle = legGrad;
        ctx.fillRect(x + 18, y + 100, 30, 50);
        ctx.fillRect(x + w - 48, y + 100, 30, 50);

        // Lava boots
        ctx.fillStyle = isHit ? '#FFF' : '#3D0000';
        ctx.fillRect(x + 14, y + h - 14, 38, 14);
        ctx.fillRect(x + w - 52, y + h - 14, 38, 14);

        // Boot lava glow
        if (!isHit) {
            ctx.fillStyle = `rgba(255, 100, 0, ${0.3 + Math.sin(t * 3) * 0.2})`;
            ctx.fillRect(x + 14, y + h - 4, 38, 4);
            ctx.fillRect(x + w - 52, y + h - 4, 38, 4);
        }

        // Health bar
        const barWidth = w;
        const barHeight = 12;
        const barX = x;
        const barY = y - 35;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Render fire abilities
        this.renderAbilities(ctx);

        ctx.restore();
    }
}
