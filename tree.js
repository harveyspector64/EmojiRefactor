// tree.js

const EMOJIS = {
    TREE: '🌳',
    BIRD: '🐦',
    NEST: '🥚'
};

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
        // Trees don't have much to update, but we can check for nest hatching here
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
            addEventLogMessage('A nest has been created in a tree.');
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
        nestElement.textContent = EMOJIS.NEST;
        nestElement.classList.add('emoji', 'nest');
        nestElement.style.position = 'absolute';
        nestElement.style.left = '0px';
        nestElement.style.top = '-30px'; // Position the nest slightly above the tree
        return nestElement;
    }

    startHatchTimer() {
        const hatchTime = Math.random() * 60000 + 120000; // 2-3 minutes
        this.hatchTimer = setTimeout(() => this.hatch(), hatchTime);
    }

    update() {
        // Nests don't need regular updates, but we could add visual changes over time
    }

    hatch() {
        addEventLogMessage('A nest has hatched! New birds have appeared.');
        this.element.remove();
        this.tree.nest = null;

        const numberOfBirds = Math.floor(Math.random() * 2) + 2; // 2-3 new birds
        for (let i = 0; i < numberOfBirds; i++) {
            const x = parseFloat(this.tree.element.style.left) + Math.random() * 40 - 20;
            const y = parseFloat(this.tree.element.style.top) + Math.random() * 40 - 20;
            addBird(x, y);
        }
    }
}

export function addTree(x, y, playArea) {
    const tree = new Tree(x, y);
    playArea.appendChild(tree.element);
    return tree;
}

function addBird(x, y) {
    // This function would typically be in bird.js
    // For now, we'll just log the action
    console.log(`Adding a new bird at (${x}, ${y})`);
}

function addEventLogMessage(message) {
    // This function would typically be in a separate module
    console.log(`BREAKING NEWS: ${message}`);
    // Add logic to update the UI event log
}

export function unlockTree(treeElement) {
    treeElement.classList.remove('disabled');
    treeElement.setAttribute('draggable', 'true');
}
