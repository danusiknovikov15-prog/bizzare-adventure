// Virtual joystick for mobile controls
export class VirtualJoystick {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);

        if (!this.container) {
            console.error(`Container element ${containerElementId} not found!`);
            return;
        }

        // Joystick state
        this.active = false;
        this.touchId = null;
        this.centerX = 0;
        this.centerY = 0;
        this.stickX = 0;
        this.stickY = 0;
        this.maxRadius = 50; // Maximum stick movement radius

        // Direction vector (-1 to 1)
        this.direction = { x: 0, y: 0 };

        // Create joystick elements
        this.createElements();
        this.bindEvents();

        console.log('VirtualJoystick initialized');
    }

    createElements() {
        // Create base (outer circle)
        this.base = document.createElement('div');
        this.base.className = 'joystick-base';
        this.container.appendChild(this.base);

        // Create stick (inner circle)
        this.stick = document.createElement('div');
        this.stick.className = 'joystick-stick';
        this.container.appendChild(this.stick);
    }

    bindEvents() {
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.container.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });

        // Mouse events for desktop testing
        this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleTouchStart(e) {
        e.preventDefault();

        if (this.active) return; // Already active

        const touch = e.changedTouches[0];
        this.touchId = touch.identifier;
        this.active = true;

        const rect = this.container.getBoundingClientRect();
        this.centerX = rect.left + rect.width / 2;
        this.centerY = rect.top + rect.height / 2;

        this.updateStickPosition(touch.clientX, touch.clientY);
        this.stick.classList.add('active');
    }

    handleTouchMove(e) {
        e.preventDefault();

        if (!this.active) return;

        // Find the touch we're tracking
        for (let touch of e.changedTouches) {
            if (touch.identifier === this.touchId) {
                this.updateStickPosition(touch.clientX, touch.clientY);
                break;
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();

        // Check if our touch ended
        for (let touch of e.changedTouches) {
            if (touch.identifier === this.touchId) {
                this.reset();
                break;
            }
        }
    }

    // Mouse events for desktop testing
    handleMouseDown(e) {
        e.preventDefault();
        this.active = true;

        const rect = this.container.getBoundingClientRect();
        this.centerX = rect.left + rect.width / 2;
        this.centerY = rect.top + rect.height / 2;

        this.updateStickPosition(e.clientX, e.clientY);
        this.stick.classList.add('active');
    }

    handleMouseMove(e) {
        if (!this.active) return;
        this.updateStickPosition(e.clientX, e.clientY);
    }

    handleMouseUp(e) {
        if (!this.active) return;
        this.reset();
    }

    updateStickPosition(clientX, clientY) {
        // Calculate offset from center
        let deltaX = clientX - this.centerX;
        let deltaY = clientY - this.centerY;

        // Calculate distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Limit to max radius
        if (distance > this.maxRadius) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * this.maxRadius;
            deltaY = Math.sin(angle) * this.maxRadius;
        }

        // Update stick position
        this.stickX = deltaX;
        this.stickY = deltaY;

        // Calculate normalized direction (-1 to 1)
        this.direction.x = deltaX / this.maxRadius;
        this.direction.y = deltaY / this.maxRadius;

        // Apply small deadzone
        if (Math.abs(this.direction.x) < 0.1) this.direction.x = 0;
        if (Math.abs(this.direction.y) < 0.1) this.direction.y = 0;

        // Update visual position
        this.stick.style.transform = `translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px)`;
    }

    reset() {
        this.active = false;
        this.touchId = null;
        this.stickX = 0;
        this.stickY = 0;
        this.direction.x = 0;
        this.direction.y = 0;

        this.stick.style.transform = 'translate(-50%, -50%)';
        this.stick.classList.remove('active');
    }

    getDirection() {
        return this.direction;
    }

    isLeft() {
        return this.direction.x < -0.3;
    }

    isRight() {
        return this.direction.x > 0.3;
    }

    isUp() {
        return this.direction.y < -0.3;
    }

    isDown() {
        return this.direction.y > 0.3;
    }
}
