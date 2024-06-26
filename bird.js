// bird.js
import { EMOJIS } from './constants.js';

const EMOJIS = {
    BIRD: '🐦',
    WORM: '🐛',
    BUTTERFLY: '🦋'
};

let birdCounter = 0;

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
        this.hunger = 100;
        this.foodConsumed = 0;
        this.currentState = birdStates.FLYING;
        this.id = `bird-${++birdCounter}`;
    }

    createBirdElement(x, y) {
        const birdElement = document.createElement('div');
        birdElement.textContent = EMOJIS.BIRD;
        birdElement.classList.add('emoji', 'bird');
        birdElement.style.position = 'absolute';
        birdElement.style.left = `${x}px`;
        birdElement.style.top = `${y}px`;
        birdElement.style.zIndex = '1';
        return birdElement;
    }

    setState(newState) {
        console.log(`Bird state transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
    }

    update(playArea) {
        switch (this.currentState) {
            case birdStates.FLYING:
                this.fly(playArea);
                break;
            case birdStates.WALKING:
                this.walk(playArea);
                break;
            case birdStates.MOVING_TO_WORM:
                this.moveToWorm(playArea);
                break;
            case birdStates.PERCHING:
                this.perch();
                break;
            // Add other states as needed
        }
        this.hunger = Math.max(this.hunger - 0.1, 0);
        this.checkHunger(playArea);
    }

    fly(playArea) {
        const currentX = parseFloat(this.element.style.left);
        const currentY = parseFloat(this.element.style.top);
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 5 + 2;
        const newX = currentX + distance * Math.cos(angle);
        const newY = currentY + distance * Math.sin(angle);
        this.element.style.left = `${Math.max(0, Math.min(newX, playArea.clientWidth - 20))}px`;
        this.element.style.top = `${Math.max(0, Math.min(newY, playArea.clientHeight - 20))}px`;
        this.detectButterflies(playArea);
    }

    walk(playArea) {
        const currentX = parseFloat(this.element.style.left);
        const currentY = parseFloat(this.element.style.top);
        const distance = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2;
        const newX = currentX + distance * Math.cos(angle);
        const newY = currentY + distance * Math.sin(angle);
        this.element.style.left = `${Math.max(0, Math.min(newX, playArea.clientWidth - 20))}px`;
        this.element.style.top = `${Math.max(0, Math.min(newY, playArea.clientHeight - 20))}px`;
        this.detectWorms(playArea);
    }

    moveToWorm(playArea) {
        // Implement logic to move towards the nearest worm
    }

    perch() {
        // Implement perching behavior
    }

    checkHunger(playArea) {
        if (this.hunger <= 30 && this.currentState !== birdStates.WALKING) {
            this.setState(birdStates.DESCENDING);
            this.descendToGround(playArea);
        }
    }

    descendToGround(playArea) {
        this.element.style.transition = 'top 1s';
        this.element.style.top = `${parseFloat(this.element.style.top) + 50}px`;
        setTimeout(() => {
            this.setState(birdStates.WALKING);
            this.walk(playArea);
        }, 1000);
    }

    detectWorms(playArea) {
        const worms = playArea.querySelectorAll('.worm');
        worms.forEach(worm => {
            const distance = this.getDistance(this.element, worm);
            if (distance < 30) {
                this.eatWorm(worm);
            }
        });
    }

    detectButterflies(playArea) {
        const butterflies = playArea.querySelectorAll('.butterfly');
        butterflies.forEach(butterfly => {
            const distance = this.getDistance(this.element, butterfly);
            if (distance < 20) {
                this.eatButterfly(butterfly);
            }
        });
    }

    eatWorm(worm) {
        worm.remove();
        this.hunger = Math.min(this.hunger + 20, 100);
        this.foodConsumed += 20;
        this.logEvent(`Bird ${this.id} ate a worm. Food consumed: ${this.foodConsumed}`);
        this.checkForNestCreation();
    }

    eatButterfly(butterfly) {
        butterfly.remove();
        this.hunger = Math.min(this.hunger + 5, 100);
        this.foodConsumed += 5;
        this.logEvent(`Bird ${this.id} ate a butterfly. Food consumed: ${this.foodConsumed}`);
        this.checkForNestCreation();
    }

    checkForNestCreation() {
        if (this.foodConsumed >= 120) {
            this.createNest();
            this.foodConsumed = 0;
        }
    }

    createNest() {
        // Implement nest creation logic
    }

    getDistance(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        const dx = rect1.left - rect2.left;
        const dy = rect1.top - rect2.top;
        return Math.sqrt(dx * dx + dy * dy);
    }

    logEvent(message) {
        console.log(message);
        // Implement event logging to the UI
    }
}

export function addBird(x, y, playArea) {
    const bird = new Bird(x, y);
    playArea.appendChild(bird.element);
    return bird;
}
