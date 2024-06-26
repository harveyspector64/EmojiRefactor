// worm.js
import { EMOJIS } from './constants.js';


const EMOJIS = {
    WORM: '🐛'
};

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
            const wiggleAmount = Math.random() * 5; // Wiggle by up to 5px
            const wiggleDirection = Math.random() > 0.5 ? 1 : -1; // Random direction

            this.element.style.transform = `translateX(${wiggleDirection * wiggleAmount}px)`;

            // Randomize next wiggle time between 2 and 5 seconds
            const wiggleTime = Math.random() * 3000 + 2000;

            this.wiggleInterval = setTimeout(() => {
                // Reset transformation after wiggle
                this.element.style.transform = '';
                this.wiggleInterval = setTimeout(wiggle, wiggleTime);
            }, 500); // Wiggle duration
        };

        // Initial delay before the first wiggle
        this.wiggleInterval = setTimeout(wiggle, Math.random() * 3000 + 2000);
    }

    stopWiggle() {
        if (this.wiggleInterval) {
            clearTimeout(this.wiggleInterval);
            this.wiggleInterval = null;
        }
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
    addEventLogMessage("A worm has appeared!");
    return worm;
}

// Helper function to add random worms to the play area
export function addRandomWorms(playArea, count = 1) {
    for (let i = 0; i < count; i++) {
        const x = Math.random() * (playArea.clientWidth - 20);
        const y = Math.random() * (playArea.clientHeight - 20);
        addWorm(x, y, playArea);
    }
}

function addEventLogMessage(message) {
    // This function would typically be in a separate module
    console.log(`BREAKING NEWS: ${message}`);
    // Add logic to update the UI event log
}
