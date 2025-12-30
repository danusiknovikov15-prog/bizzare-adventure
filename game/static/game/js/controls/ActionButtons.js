// Action buttons for mobile controls (Jump, Attack)
export class ActionButtons {
    constructor(containerElementId) {
        this.container = document.getElementById(containerElementId);

        if (!this.container) {
            console.error(`Container element ${containerElementId} not found!`);
            return;
        }

        // Button states
        this.buttons = {
            jump: { pressed: false, element: null, touchId: null },
            attack: { pressed: false, element: null, touchId: null }
        };

        // Create button elements
        this.createButtons();
        this.bindEvents();

        console.log('ActionButtons initialized');
    }

    createButtons() {
        // Jump button
        this.buttons.jump.element = this.createButton('JUMP', 'jump');

        // Attack button
        this.buttons.attack.element = this.createButton('ATTACK', 'attack');
    }

    createButton(label, action) {
        const button = document.createElement('div');
        button.className = `action-button ${action}`;
        button.textContent = label;
        button.dataset.action = action;
        this.container.appendChild(button);
        return button;
    }

    bindEvents() {
        // Touch events for each button
        for (let action in this.buttons) {
            const button = this.buttons[action].element;

            button.addEventListener('touchstart', (e) => this.handleTouchStart(e, action), { passive: false });
            button.addEventListener('touchend', (e) => this.handleTouchEnd(e, action), { passive: false });
            button.addEventListener('touchcancel', (e) => this.handleTouchEnd(e, action), { passive: false });

            // Mouse events for desktop testing
            button.addEventListener('mousedown', (e) => this.handleMouseDown(e, action));
            button.addEventListener('mouseup', (e) => this.handleMouseUp(e, action));
            button.addEventListener('mouseleave', (e) => this.handleMouseUp(e, action));
        }
    }

    handleTouchStart(e, action) {
        e.preventDefault();
        e.stopPropagation();

        const button = this.buttons[action];

        if (!button.pressed) {
            const touch = e.changedTouches[0];
            button.touchId = touch.identifier;
            button.pressed = true;
            button.element.classList.add('pressed');
        }
    }

    handleTouchEnd(e, action) {
        e.preventDefault();
        e.stopPropagation();

        const button = this.buttons[action];

        // Check if this is the touch we're tracking
        for (let touch of e.changedTouches) {
            if (touch.identifier === button.touchId) {
                button.pressed = false;
                button.touchId = null;
                button.element.classList.remove('pressed');
                break;
            }
        }
    }

    // Mouse events for desktop testing
    handleMouseDown(e, action) {
        e.preventDefault();
        const button = this.buttons[action];
        button.pressed = true;
        button.element.classList.add('pressed');
    }

    handleMouseUp(e, action) {
        e.preventDefault();
        const button = this.buttons[action];
        button.pressed = false;
        button.element.classList.remove('pressed');
    }

    // Check button states
    isJumpPressed() {
        return this.buttons.jump.pressed;
    }

    isAttackPressed() {
        return this.buttons.attack.pressed;
    }

    // Get all pressed buttons
    getPressedButtons() {
        const pressed = {};
        for (let action in this.buttons) {
            pressed[action] = this.buttons[action].pressed;
        }
        return pressed;
    }

    // Reset all buttons
    reset() {
        for (let action in this.buttons) {
            this.buttons[action].pressed = false;
            this.buttons[action].touchId = null;
            this.buttons[action].element.classList.remove('pressed');
        }
    }
}
