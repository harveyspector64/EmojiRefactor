// script.js

import { EMOJIS } from './constants.js';
import { FloweringBush, addFloweringBush } from './flowering-bush.js';
import { Tree, addTree, unlockTree } from './tree.js';
import { Butterfly, addButterflies } from './butterfly.js';
import { Worm, addWorm, addRandomWorms } from './worm.js';
import { Bird, addBird } from './bird.js';

class GameEngine {
    constructor() {
        this.entities = {
            bushes: [],
            trees: [],
            butterflies: [],
            birds: [],
            worms: []
        };
        this.playArea = document.getElementById('play-area');
        this.emojiPanel = document.getElementById('emoji-panel');
        this.eventMenu = document.getElementById('event-menu');
        this.selectedEmoji = null;
        this.draggedElement = null;
    }

    initialize() {
        this.setupEventListeners();
        this.initializeEmojis();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupEventListeners() {
        this.emojiPanel.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.playArea.addEventListener('mousemove', this.handleDragOver.bind(this));
        this.playArea.addEventListener('mouseup', this.handleDrop.bind(this));
        this.emojiPanel.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    initializeEmojis() {
        const initialEmojis = [
            { id: 'flowering-bush', emoji: EMOJIS.BUSH },
            { id: 'tree', emoji: EMOJIS.TREE, disabled: true }
        ];

        initialEmojis.forEach(item => {
            const element = document.createElement('div');
            element.id = item.id;
            element.textContent = item.emoji;
            element.classList.add('emoji');
            if (item.disabled) {
                element.classList.add('disabled');
            }
            this.emojiPanel.appendChild(element);
        });
    }

    handleDragStart(e) {
        if (e.target.classList.contains('emoji') && !e.target.classList.contains('disabled')) {
            this.selectedEmoji = e.target.textContent;
            this.draggedElement = e.target.cloneNode(true);
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.pointerEvents = 'none';
            document.body.appendChild(this.draggedElement);
            this.updateDraggedElementPosition(e.clientX, e.clientY);
        }
    }

    handleDragOver(e) {
        if (this.draggedElement) {
            this.updateDraggedElementPosition(e.clientX, e.clientY);
        }
    }

    handleDrop(e) {
        if (this.selectedEmoji) {
            const x = e.clientX - this.playArea.offsetLeft;
            const y = e.clientY - this.playArea.offsetTop;
            this.addEmojiToPlayArea(this.selectedEmoji, x, y);
            this.resetDragState();
        }
    }

    handleTouchStart(e) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target.classList.contains('emoji') && !target.classList.contains('disabled')) {
            this.selectedEmoji = target.textContent;
            this.draggedElement = target.cloneNode(true);
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.pointerEvents = 'none';
            document.body.appendChild(this.draggedElement);
            this.updateDraggedElementPosition(touch.clientX, touch.clientY);
        }
    }

    handleTouchMove(e) {
        if (this.draggedElement) {
            e.preventDefault();
            const touch = e.touches[0];
            this.updateDraggedElementPosition(touch.clientX, touch.clientY);
        }
    }

    handleTouchEnd(e) {
        if (this.selectedEmoji) {
            const touch = e.changedTouches[0];
            const x = touch.clientX - this.playArea.offsetLeft;
            const y = touch.clientY - this.playArea.offsetTop;
            this.addEmojiToPlayArea(this.selectedEmoji, x, y);
            this.resetDragState();
        }
    }

    updateDraggedElementPosition(x, y) {
        this.draggedElement.style.left = `${x - 15}px`;
        this.draggedElement.style.top = `${y - 15}px`;
    }

    resetDragState() {
        if (this.draggedElement) {
            document.body.removeChild(this.draggedElement);
        }
        this.draggedElement = null;
        this.selectedEmoji = null;
    }

    addEmojiToPlayArea(emoji, x, y) {
        switch (emoji) {
            case EMOJIS.BUSH:
                const bush = addFloweringBush(x, y, this.playArea);
                this.entities.bushes.push(bush);
                this.entities.butterflies = this.entities.butterflies.concat(addButterflies(bush, this.playArea));
                this.unlockTreeIfNeeded();
                break;
            case EMOJIS.TREE:
                const tree = addTree(x, y, this.playArea);
                this.entities.trees.push(tree);
                const bird = addBird(x, y, this.playArea);
                this.entities.birds.push(bird);
                break;
            case EMOJIS.WORM:
                const worm = addWorm(x, y, this.playArea);
                this.entities.worms.push(worm);
                break;
        }
        this.addEventLogMessage(`A ${this.getEmojiName(emoji)} has been added to the ecosystem!`);
    }

    unlockTreeIfNeeded() {
        if (this.entities.bushes.length === 1) {
            const treeElement = document.getElementById('tree');
            unlockTree(treeElement);
        }
    }

    getEmojiName(emoji) {
        switch(emoji) {
            case EMOJIS.BUSH: return 'bush';
            case EMOJIS.TREE: return 'tree';
            case EMOJIS.BUTTERFLY: return 'butterfly';
            case EMOJIS.BIRD: return 'bird';
            case EMOJIS.WORM: return 'worm';
            default: return 'creature';
        }
    }

    addEventLogMessage(message) {
        const eventMessageElement = document.createElement('div');
        eventMessageElement.className = 'event-message';
        eventMessageElement.textContent = message;
        
        this.eventMenu.appendChild(eventMessageElement);
        
        while (this.eventMenu.children.length > 6) {
            this.eventMenu.removeChild(this.eventMenu.children[1]);
        }
        
        console.log(`BREAKING NEWS: ${message}`);
    }

    gameLoop(timestamp) {
        this.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        for (let entityType in this.entities) {
            this.entities[entityType].forEach(entity => entity.update(this.playArea));
        }
        this.checkInteractions();
    }

    checkInteractions() {
        // Implement entity interactions here
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.initialize();
});
