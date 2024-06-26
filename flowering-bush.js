// flowering-bush.js

const EMOJIS = {
    BUSH: '🌺',
    BUTTERFLY: '🦋'
};

export class FloweringBush {
    constructor(x, y) {
        this.element = this.createBushElement(x, y);
        this.pollinationMeter = 100;
        this.butterflies = [];
        this.cooldown = false;
    }

    createBushElement(x, y) {
        const bushElement = document.createElement('div');
        bushElement.textContent = EMOJIS.BUSH;
        bushElement.classList.add('emoji', 'bush');
        bushElement.style.position = 'absolute';
        bushElement.style.left = `${x}px`;
        bushElement.style.top = `${y}px`;
        return bushElement;
    }

    update() {
        this.updatePollinationMeter();
        this.checkForNewButterflies();
    }

    updatePollinationMeter() {
        // Decrease pollination meter over time
        this.pollinationMeter = Math.max(0, this.pollinationMeter - 0.1);
        
        // Check if the bush should die due to lack of pollination
        if (this.pollinationMeter <= 0) {
            this.die();
        }
    }

    checkForNewButterflies() {
        if (!this.cooldown && Math.random() < 0.01) { // 1% chance every update
            this.addButterfly();
            this.startCooldown();
        }
    }

    addButterfly() {
        const butterfly = createButterfly(this);
        this.butterflies.push(butterfly);
        addEventLogMessage(`A new butterfly has appeared near a flowering bush!`);
    }

    startCooldown() {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, Math.random() * 30000 + 30000); // 30-60 seconds cooldown
    }

    die() {
        addEventLogMessage(`A flowering bush has withered away due to lack of pollination.`);
        this.element.remove();
        // Additional logic for removing the bush from the game state
    }

    pollinate(amount) {
        this.pollinationMeter = Math.min(100, this.pollinationMeter + amount);
    }
}

function createButterfly(homeBush) {
    // This function would typically be in butterfly.js
    // For now, we'll just return a placeholder object
    return {
        update: () => {},
        element: document.createElement('div')
    };
}

function addEventLogMessage(message) {
    // This function would typically be in a separate module
    console.log(`BREAKING NEWS: ${message}`);
    // Add logic to update the UI event log
}

export function addFloweringBush(x, y, playArea) {
    const bush = new FloweringBush(x, y);
    playArea.appendChild(bush.element);
    return bush;
}
