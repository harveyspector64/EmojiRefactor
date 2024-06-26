import { EMOJIS } from './constants.js';

export class Butterfly {
    constructor(homeBush) {
        this.element = this.createButterflyElement();
        this.homeBush = homeBush;
        this.state = 'flying';
        this.carriesPollen = false;
        this.pollenSource = null;
        this.setPosition(this.getRandomPositionAroundBush(homeBush));
    }

    createButterflyElement() {
        const butterflyElement = document.createElement('div');
        butterflyElement.textContent = EMOJIS.BUTTERFLY;
        butterflyElement.classList.add('emoji', 'butterfly');
        return butterflyElement;
    }

    update(playArea) {
        // Update butterfly position and state
    }

    // Other methods...
}

export function addButterflies(bush, playArea) {
    const numButterflies = Math.floor(Math.random() * 2) + 1;
    const newButterflies = [];
    for (let i = 0; i < numButterflies; i++) {
        const butterfly = new Butterfly(bush);
        playArea.appendChild(butterfly.element);
        newButterflies.push(butterfly);
    }
    return newButterflies;
}
