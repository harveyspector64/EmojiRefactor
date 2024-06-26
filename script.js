// script.js

import { EMOJIS } from './constants.js';
import { FloweringBush, addFloweringBush } from './flowering-bush.js';
import { Tree, addTree, unlockTree } from './tree.js';
import { Butterfly, addButterflies } from './butterfly.js';
import { Worm, addWorm, addRandomWorms } from './worm.js';
import { Bird, addBird } from './bird.js';

class GameEngine {
    constructor() {
        console.log("GameEngine: Initializing");
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
        this.firstBirdLanded = false;
    }

    initialize() {
        console.log("GameEngine: Setting up game");
        this.setupEventListeners();
        this.initializeEmojis();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupEventListeners() {
        console.log("GameEngine: Setting up event listeners");
        this.emojiPanel.addEventListener('mousedown', this.handleDragStart.bind(this));
        this.playArea.addEventListener('mousemove', this.handleDragOver.bind(this));
        this.playArea.addEventListener('mouseup', this.handleDrop.bind(this));
        this.emojiPanel.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    initializeEmojis() {
        console.log("GameEngine: Initializing emoji panel");
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
            console.log(`GameEngine: Started dragging ${this.selectedEmoji}`);
        }
    }

    handleDragOver(e) {
        if (this.draggedElement) {
            this.updateDraggedElementPosition(e.clientX, e.clientY);
        }
    }

    handleDrop(e) {
        if (this.selectedEmoji) {
            const rect = this.playArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addEmojiToPlayArea(this.selectedEmoji, x, y);
            this.resetDragState();
            console.log(`GameEngine: Dropped ${this.selectedEmoji} at (${x}, ${y})`);
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
            console.log(`GameEngine: Started touch drag of ${this.selectedEmoji}`);
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
            const rect = this.playArea.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.addEmojiToPlayArea(this.selectedEmoji, x, y);
            this.resetDragState();
            console.log(`GameEngine: Touch dropped ${this.selectedEmoji} at (${x}, ${y})`);
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
        console.log(`GameEngine: Adding ${emoji} to play area at (${x}, ${y})`);
        switch (emoji) {
            case EMOJIS.BUSH:
                const bush = addFloweringBush(x, y, this.playArea);
                this.entities.bushes.push(bush);
                setTimeout(() => {
                    const newButterflies = addButterflies(bush, this.playArea);
                    this.entities.butterflies = this.entities.butterflies.concat(newButterflies);
                    console.log(`GameEngine: Added ${newButterflies.length} butterflies`);
                }, Math.random() * 3000 + 1000);
                this.unlockTreeIfNeeded();
                break;
            case EMOJIS.TREE:
                const tree = addTree(x, y, this.playArea);
                this.entities.trees.push(tree);
                setTimeout(() => {
                    const bird = addBird(tree, this.playArea);
                    this.entities.birds.push(bird);
                    console.log("GameEngine: Added a bird");
                }, Math.random() * 3000 + 1000);
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
            console.log("GameEngine: Unlocked tree emoji");
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
        this.checkInteractions();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        for (let entityType in this.entities) {
            this.entities[entityType].forEach(entity => {
                if (typeof entity.update === 'function') {
                    entity.update(this.playArea);
                } else {
                    console.warn(`GameEngine: Update method not found for entity type: ${entityType}`);
                }
            });
        }
    }

    checkInteractions() {
        this.checkBirdWormInteractions();
        this.checkButterflyBushInteractions();
    }

    checkBirdWormInteractions() {
        this.entities.birds.forEach(bird => {
            if (bird.currentState === 'walking') {
                this.entities.worms.forEach((worm, index) => {
                    if (this.checkCollision(bird.element, worm.element)) {
                        bird.eatWorm(worm);
                        this.entities.worms.splice(index, 1);
                        this.addEventLogMessage(`A bird has eaten a worm!`);
                        console.log("GameEngine: Bird ate a worm");
                    }
                });
            }
        });
    }

    checkButterflyBushInteractions() {
        this.entities.butterflies.forEach(butterfly => {
            this.entities.bushes.forEach(bush => {
                if (this.checkCollision(butterfly.element, bush.element)) {
                    butterfly.pollinate(bush);
                }
            });
        });
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

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, initializing game");
    const game = new GameEngine();
    game.initialize();
});

console.log("script.js loaded");
