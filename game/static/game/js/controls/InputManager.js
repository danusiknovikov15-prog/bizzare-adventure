// Input manager for keyboard and mobile controls
export class InputManager {
    constructor() {
        // Input state
        this.keys = {
            left: false,
            right: false,
            jump: false,
            attack: false
        };

        // Key mappings (using e.code for keyboard layout independence)
        this.keyMap = {
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowUp': 'jump',
            'KeyA': 'left',
            'KeyD': 'right',
            'KeyW': 'jump',
            'Space': 'jump',
            'KeyZ': 'attack',
            'KeyX': 'attack'
        };

        // Mobile controls (will be set from outside)
        this.joystick = null;
        this.actionButtons = null;

        // Bind keyboard events
        this.bindKeyboard();

        console.log('InputManager initialized');
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                this.keys[action] = true;
                e.preventDefault(); // Prevent scrolling with arrow keys
            }
        });

        document.addEventListener('keyup', (e) => {
            const action = this.keyMap[e.code];
            if (action) {
                this.keys[action] = false;
                e.preventDefault();
            }
        });
    }

    // Bind mobile controls
    bindMobileControls(joystick, actionButtons) {
        this.joystick = joystick;
        this.actionButtons = actionButtons;
        console.log('Mobile controls bound to InputManager');
    }

    // Get input state (keyboard OR mobile)
    isLeft() {
        return this.keys.left || (this.joystick && this.joystick.isLeft());
    }

    isRight() {
        return this.keys.right || (this.joystick && this.joystick.isRight());
    }

    isJump() {
        return this.keys.jump || (this.actionButtons && this.actionButtons.isJumpPressed());
    }

    isAttack() {
        return this.keys.attack || (this.actionButtons && this.actionButtons.isAttackPressed());
    }

    // Update player input from this manager
    updatePlayer(player) {
        player.input.left = this.isLeft();
        player.input.right = this.isRight();
        player.input.jump = this.isJump();
        player.input.attack = this.isAttack();
    }
}
