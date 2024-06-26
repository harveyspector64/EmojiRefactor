import { EMOJIS } from './constants.js';

export class Tree {
    constructor(x, y) {
        this.element = this.createTreeElement(x, y);
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
        // Update tree state if needed
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
