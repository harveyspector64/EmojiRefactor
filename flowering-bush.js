import { EMOJIS } from './constants.js';

export class FloweringBush {
    constructor(x, y) {
        this.element = this.createBushElement(x, y);
        this.pollinationMeter = 100;
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
        // Update pollination meter and bush state
    }
}

export function addFloweringBush(x, y, playArea) {
    const bush = new FloweringBush(x, y);
    playArea.appendChild(bush.element);
    return bush;
}
