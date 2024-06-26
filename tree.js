// tree.js
import { EMOJIS } from './constants.js';

export class Tree {
    constructor(x, y) {
        this.element = this.createTreeElement(x, y);
        this.birds = [];
        this.nest = null;
    }

    createTreeElement(x, y) {
        const treeElement = document.createElement('div');
        treeElement.textContent = EMOJIS.TREE;
        treeElement.classList.add('emoji', 'tree');
        treeElement.style.position = 'absolute';
        treeElement.style.left = `${x}px`;
        treeElement.style.top = `${y}px`;
        return treeElement;
    }

    update() {
        if (this.nest) {
            this.nest.update();
        }
    }

    addBird(bird) {
        this.birds.push(bird);
    }

    removeBird(bird) {
        const index = this.birds.indexOf(bird);
        if (index > -1) {
            this.birds.splice(index, 1);
        }
    }

    createNest() {
        if (!this.nest) {
            this.nest = new Nest(this);
            this.element.appendChild(this.nest.element);
        }
    }
}

class Nest {
    constructor(tree) {
        this.tree = tree;
        this.element = this.createNestElement();
        this.hatchTimer = null;
        this.startHatchTimer();
    }

    createNestElement() {
        const nestElement = document.createElement('div');
        nestElement.textContent = '🥚';
        nestElement.classList.add('emoji', 'nest');
        nestElement.style.position = 'absolute';
        nestElement.style.left = '0px';
        nestElement.style.top = '-30px';
        return nestElement;
    }

    startHatchTimer() {
        const hatchTime = Math.random() * 60000 + 120000;
        this.hatchTimer = setTimeout(() => this.hatch(), hatchTime);
    }

    update() {
        // Nests don't need regular updates
    }

    hatch() {
        this.element.remove();
        this.tree.nest = null;
        // Logic for adding new birds would go here, but should be handled by the GameEngine
    }
}

export function addTree(x, y, playArea) {
    const tree = new Tree(x, y);
    playArea.appendChild(tree.element);
    return tree;
}

export function unlockTree(treeElement) {
    treeElement.classList.remove('disabled');
    treeElement.setAttribute('draggable', 'true');
}
