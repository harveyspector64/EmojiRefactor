import { EMOJIS } from './constants.js';

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
        this.pollinationMeter = Math.max(0, this.pollinationMeter - 0.1);
        if (this.pollinationMeter <= 0) {
            this.die();
        }
    }

    checkForNewButterflies() {
        if (!this.cooldown && Math.random() < 0.01) {
            this.addButterfly();
            this.startCooldown();
        }
    }

    addButterfly() {
        const butterfly = new Butterfly(this);
        this.butterflies.push(butterfly);
        return butterfly;
    }

    startCooldown() {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, Math.random() * 30000 + 30000);
    }

    die() {
        this.element.remove();
    }

    pollinate(amount) {
        this.pollinationMeter = Math.min(100, this.pollinationMeter + amount);
    }
}

export function addFloweringBush(x, y, playArea) {
    const bush = new FloweringBush(x, y);
    playArea.appendChild(bush.element);
    return bush;
}
