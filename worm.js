// worm.js
import { EMOJIS } from './constants.js';

export class Worm {
    constructor(x, y) {
        this.element = this.createWormElement(x, y);
        this.wiggleInterval = null;
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
        const wiggle = () => {
            const wiggleAmount = Math.random() * 5;
            const wiggleDirection = Math.random() > 0.5 ? 1 : -1;

            this.element.style.transform = `translateX(${wiggleDirection * wiggleAmount}px)`;

            const wiggleTime = Math.random() * 3000 + 2000;

            this.wiggleInterval = setTimeout(() => {
                this.element.style.transform = '';
                this.wiggleInterval = setTimeout(wiggle, wiggleTime);
            }, 500);
        };

        this.wiggleInterval = setTimeout(wiggle, Math.random() * 3000 + 2000);
    }

    stopWiggle() {
        if (this.wiggleInterval) {
            clearTimeout(this.wiggleInterval);
            this.wiggleInterval = null;
        }
    }

    update() {
        // Worms don't need regular updates beyond their wiggle animation
    }

    remove() {
        this.stopWiggle();
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
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
