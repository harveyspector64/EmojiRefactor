// butterfly.js
import { EMOJIS } from './constants.js';

export class Butterfly {
    constructor(homeBush) {
        this.element = this.createButterflyElement();
        this.homeBush = homeBush;
        this.state = 'flying';
        this.carriesPollen = false;
        this.pollenSource = null;
        this.setPosition(this.getRandomOffscreenPosition());
    }

    createButterflyElement() {
        const butterflyElement = document.createElement('div');
        butterflyElement.textContent = EMOJIS.BUTTERFLY;
        butterflyElement.classList.add('emoji', 'butterfly');
        butterflyElement.style.position = 'absolute';
        butterflyElement.style.fontSize = '0.8em'; // Smaller size for butterflies
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
        const side = Math.floor(Math.random() * 4);
        const playArea = document.getElementById('play-area');
        const width = playArea.clientWidth;
        const height = playArea.clientHeight;

        switch (side) {
            case 0: // Top
                return { x: Math.random() * width, y: -20 };
            case 1: // Right
                return { x: width + 20, y: Math.random() * height };
            case 2: // Bottom
                return { x: Math.random() * width, y: height + 20 };
            case 3: // Left
                return { x: -20, y: Math.random() * height };
        }
    }

    getBushPosition(bush) {
        return {
            x: parseFloat(bush.element.style.left),
            y: parseFloat(bush.element.style.top)
        };
    }

    update(playArea) {
        this.move(playArea);
    }

    move(playArea) {
        const currentPosition = this.getPosition();
        let targetPosition;

        if (Math.random() < 0.8) { // 80% chance to move towards home bush
            targetPosition = this.getBushPosition(this.homeBush);
        } else { // 20% chance to move randomly
            targetPosition = {
                x: Math.random() * playArea.clientWidth,
                y: Math.random() * playArea.clientHeight
            };
        }

        const dx = targetPosition.x - currentPosition.x;
        const dy = targetPosition.y - currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            const speed = 2;
            const newX = currentPosition.x + (dx / distance) * speed;
            const newY = currentPosition.y + (dy / distance) * speed;
            this.setPosition({ x: newX, y: newY });
        }

        // Add some randomness to the movement
        this.setPosition({
            x: parseFloat(this.element.style.left) + (Math.random() - 0.5) * 2,
            y: parseFloat(this.element.style.top) + (Math.random() - 0.5) * 2
        });
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
