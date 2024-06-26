// butterfly.js
import { EMOJIS } from './constants.js';

export class Butterfly {
    constructor(homeBush) {
        this.element = this.createButterflyElement();
        this.homeBush = homeBush;
        this.state = 'flying';
        this.carriesPollen = false;
        this.pollenSource = null;
        this.hunger = 100;
        this.setPosition(this.getRandomOffscreenPosition());
    }

    createButterflyElement() {
        const butterflyElement = document.createElement('div');
        butterflyElement.textContent = EMOJIS.BUTTERFLY;
        butterflyElement.classList.add('emoji', 'butterfly');
        butterflyElement.style.position = 'absolute';
        return butterflyElement;
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
        if (this.state === 'resting') {
            if (Math.random() < 0.1) {
                this.state = 'flying';
            } else {
                return;
            }
        }

        this.move(playArea);
        this.hunger = Math.max(this.hunger - 0.1, 0);
        
        if (this.hunger <= 0) {
            this.die(playArea);
        }
    }

    move(playArea) {
        const currentPosition = this.getPosition();
        let targetPosition;

        if (this.homeBush && Math.random() < 0.8) {
            targetPosition = this.getBushPosition(this.homeBush);
        } else {
            const nearbyBush = this.findNearbyBush(playArea);
            if (nearbyBush) {
                targetPosition = this.getBushPosition(nearbyBush);
                this.visitBush(nearbyBush);
            } else {
                targetPosition = this.getRandomPositionInPlay(playArea);
            }
        }

        if (targetPosition) {
            const dx = targetPosition.x - currentPosition.x;
            const dy = targetPosition.y - currentPosition.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance > 5) {
                const speed = 2;
                const newX = currentPosition.x + (dx / distance) * speed;
                const newY = currentPosition.y + (dy / distance) * speed;
                this.setPosition({x: newX, y: newY});
            } else if (Math.random() < 0.3) {
                this.state = 'resting';
            }

            // Add some randomness to the movement
            this.setPosition({
                x: parseFloat(this.element.style.left) + (Math.random() - 0.5) * 2,
                y: parseFloat(this.element.style.top) + (Math.random() - 0.5) * 2
            });
        }
    }

    getBushPosition(bush) {
        if (bush && bush.element && bush.element.style) {
            return {
                x: parseFloat(bush.element.style.left),
                y: parseFloat(bush.element.style.top)
            };
        }
        // If the bush doesn't exist, return the butterfly's current position
        return this.getPosition();
    }

    findNearbyBush(playArea) {
        const bushes = Array.from(playArea.querySelectorAll('.bush'));
        const currentPosition = this.getPosition();
        for (let bushElement of bushes) {
            const bushPosition = {
                x: parseFloat(bushElement.style.left),
                y: parseFloat(bushElement.style.top)
            };
            const distance = this.getDistance(currentPosition, bushPosition);
            if (distance < 200) {
                return { element: bushElement };
            }
        }
        return null;
    }

    visitBush(bush) {
        if (this.carriesPollen && bush !== this.pollenSource) {
            this.pollinate(bush);
        }
        this.carriesPollen = true;
        this.pollenSource = bush;
        this.hunger = Math.min(this.hunger + 20, 100);
    }

    pollinate(bush) {
        if (Math.random() < 0.1) {
            bush.pollinate(10);
        }
        this.carriesPollen = false;
        this.pollenSource = null;
    }

    getRandomPositionInPlay(playArea) {
        return {
            x: Math.random() * (playArea.clientWidth - 20),
            y: Math.random() * (playArea.clientHeight - 20)
        };
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    die(playArea) {
        playArea.removeChild(this.element);
        // The GameEngine should handle removing this butterfly from its entities
    }
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
