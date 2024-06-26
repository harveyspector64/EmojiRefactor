import { EMOJIS } from './constants.js';

export const birdStates = {
    PERCHING: 'perching',
    FLYING: 'flying',
    WALKING: 'walking',
    MOVING_TO_WORM: 'movingToWorm',
    EATING: 'eating',
    DESCENDING: 'descending',
    LANDING: 'landing',
    ASCENDING: 'ascending'
};

export class Bird {
    constructor(x, y) {
        this.element = this.createBirdElement(x, y);
        this.currentState = birdStates.FLYING;
        this.hunger = 100;
        this.foodConsumed = 0;
    }

    createBirdElement(x, y) {
        const birdElement = document.createElement('div');
        birdElement.textContent = EMOJIS.BIRD;
        birdElement.classList.add('emoji', 'bird');
        birdElement.style.position = 'absolute';
        birdElement.style.left = `${x}px`;
        birdElement.style.top = `${y}px`;
        return birdElement;
    }

    update(playArea) {
        // Update bird state and position
    }

    // Other methods...
}

export function addBird(x, y, playArea) {
    const bird = new Bird(x, y);
    playArea.appendChild(bird.element);
    return bird;
}
