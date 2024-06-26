import { EMOJIS } from './constants.js';

export class Worm {
    constructor(x, y) {
        this.element = this.createWormElement(x, y);
        this.startWiggle();
    }

    createWormElement(x, y) {
        const wormElement = document.createElement('div');
        wormElement.textContent = EMOJIS.WORM;
        wormElement.classList.add('emoji', 'worm');
        wormElement.style.position = 'absolute';
        wormElement.style.left = `${x}px`;
        wormElement.style.top = `${y}px`;
        return wormElement;
    }

    startWiggle() {
        // Implement wiggle animation
    }

    update() {
        // Update worm state if needed
    }
}

export function addWorm(x, y, playArea) {
    const worm = new Worm(x, y);
    playArea.appendChild(worm.element);
    return worm;
}

export function addRandomWorms(playArea, count = 1) {
    const newWorms = [];
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (playArea.clientWidth - 20);
        const y = Math.random() * (playArea.clientHeight - 20);
        newWorms.push(addWorm(x, y, playArea));
    }
    return newWorms;
}
