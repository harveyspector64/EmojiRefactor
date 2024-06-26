// bird.js
import { EMOJIS } from './constants.js';

export const birdStates = {
    FLYING: 'flying',
    PERCHING: 'perching',
    DESCENDING: 'descending',
    WALKING: 'walking',
    EATING: 'eating',
    ASCENDING: 'ascending'
};

export class Bird {
    constructor(tree) {
        this.element = this.createBirdElement();
        this.tree = tree;
        this.currentState = birdStates.FLYING;
        this.hunger = 100;
        this.foodConsumed = 0;
        this.setPosition(this.getRandomOffscreenPosition());
    }

    createBirdElement() {
        const birdElement = document.createElement('div');
        birdElement.textContent = EMOJIS.BIRD;
        birdElement.classList.add('emoji', 'bird');
        birdElement.style.position = 'absolute';
        return birdElement;
    }

    setPosition(position) {
        this.element.style.left = `${position.x}px`;
        this.element.style.top = `${position.y}px`;
    }

    getPosition() {
        return {
            x: parseFloat(this.element.style.left),
            y: parseFloat(this.element.style.top)
        };
    }

    getRandomOffscreenPosition() {
        const playArea = document.getElementById('play-area');
        const width = playArea.clientWidth;
        const height = playArea.clientHeight;
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: return { x: Math.random() * width, y: -20 };
            case 1: return { x: width + 20, y: Math.random() * height };
            case 2: return { x: Math.random() * width, y: height + 20 };
            case 3: return { x: -20, y: Math.random() * height };
        }
    }

    update(playArea) {
        this.hunger = Math.max(this.hunger - 0.1, 0);
        
        switch (this.currentState) {
            case birdStates.FLYING:
                this.fly(playArea);
                break;
            case birdStates.PERCHING:
                this.perch();
                break;
            case birdStates.DESCENDING:
                this.descend(playArea);
                break;
            case birdStates.WALKING:
                this.walk(playArea);
                break;
            case birdStates.EATING:
                // Eating is handled in eatWorm and eatButterfly methods
                break;
            case birdStates.ASCENDING:
                this.ascend(playArea);
                break;
        }

        this.checkHunger(playArea);
    }

    fly(playArea) {
        const currentPosition = this.getPosition();
        const treePosition = this.getTreePosition();
        const dx = treePosition.x - currentPosition.x;
        const dy = treePosition.y - currentPosition.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance > 10) {
            const speed = 3;
            const newX = currentPosition.x + (dx / distance) * speed;
            const newY = currentPosition.y + (dy / distance) * speed;
            this.setPosition({x: newX, y: newY});
        } else {
            this.currentState = birdStates.PERCHING;
        }

        this.checkForButterflies(playArea);
    }

    perch() {
        const treePosition = this.getTreePosition();
        this.setPosition({
            x: treePosition.x + Math.random() * 20 - 10,
            y: treePosition.y - 20
        });

        if (Math.random() < 0.01) { // 1% chance to start flying again
            this.currentState = birdStates.FLYING;
        }
    }

    descend(playArea) {
        const currentPosition = this.getPosition();
        const groundY = playArea.clientHeight - 20;
        if (currentPosition.y < groundY) {
            this.setPosition({x: currentPosition.x, y: currentPosition.y + 2});
        } else {
            this.currentState = birdStates.WALKING;
        }
    }

    walk(playArea) {
        const currentPosition = this.getPosition();
        const newX = currentPosition.x + (Math.random() - 0.5) * 4;
        const boundedX = Math.max(0, Math.min(newX, playArea.clientWidth - 20));
        this.setPosition({x: boundedX, y: currentPosition.y});
    }

    ascend(playArea) {
        const currentPosition = this.getPosition();
        const treePosition = this.getTreePosition();
        if (currentPosition.y > treePosition.y) {
            this.setPosition({x: currentPosition.x, y: currentPosition.y - 2});
        } else {
            this.currentState = birdStates.FLYING;
        }
    }

    checkHunger(playArea) {
        if (this.hunger < 30 && this.currentState !== birdStates.WALKING) {
            this.currentState = birdStates.DESCENDING;
        } else if (this.hunger > 70 && this.currentState === birdStates.WALKING) {
            this.currentState = birdStates.ASCENDING;
        }
    }

    checkForButterflies(playArea) {
        const butterflies = playArea.querySelectorAll('.butterfly');
        butterflies.forEach(butterfly => {
            if (this.checkCollision(this.element, butterfly)) {
                this.eatButterfly(butterfly);
            }
        });
    }

    eatWorm(worm) {
        worm.remove();
        this.hunger = Math.min(this.hunger + 20, 100);
        this.foodConsumed += 20;
        this.checkForNestCreation();
    }

    eatButterfly(butterfly) {
        butterfly.remove();
        this.hunger = Math.min(this.hunger + 5, 100);
        this.foodConsumed += 5;
        this.checkForNestCreation();
    }

    checkForNestCreation() {
        if (this.foodConsumed >= 100 && !this.tree.nest) {
            this.tree.createNest();
            this.foodConsumed = 0;
        }
    }

    getTreePosition() {
        return {
            x: parseFloat(this.tree.element.style.left),
            y: parseFloat(this.tree.element.style.top)
        };
    }

    checkCollision(elem1, elem2) {
        const rect1 = elem1.getBoundingClientRect();
        const rect2 = elem2.getBoundingClientRect();
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }
}

export function addBird(tree, playArea) {
    const bird = new Bird(tree);
    playArea.appendChild(bird.element);
    return bird;
}
