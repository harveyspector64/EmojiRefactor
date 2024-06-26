// script.js

import { FloweringBush, addFloweringBush } from './flowering-bush.js';
import { Tree, addTree, unlockTree } from './tree.js';
import { Butterfly, addButterflies } from './butterfly.js';
import { Worm, addWorm, addRandomWorms } from './worm.js';
import { Bird, addBird } from './bird.js';

const EMOJIS = {
    BUSH: '🌺',
    TREE: '🌳',
    BUTTERFLY: '🦋',
    BIRD: '🐦',
    WORM: '🐛'
};

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
        this.firstBirdLanded = false;
    }

    initialize() {
        this.setupEventListeners();
        this.initializeEmojis();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    setupEventListeners() {
        this.emojiPanel.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.playArea.addEventListener('dragover', (e) => e.preventDefault());
        this.playArea.addEventListener('drop', this.handleDrop.bind(this));
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
            const element = document.getElementById(item.id);
            if (item.disabled) {
                element.classList.add('disabled');
                element.setAttribute('draggable', 'false');
            } else {
                element.setAttribute('draggable', 'true');
            }
        });
    }

    handleDragStart(e) {
        if (e.target.classList.contains('emoji')) {
            this.selectedEmoji = e.target.textContent;
            e.dataTransfer.setData('text/plain', e.target.textContent);
        }
    }

    handleDrop(e) {
        e.preventDefault();
        const x = e.clientX - this.playArea.offsetLeft;
        const y = e.clientY - this.playArea.offsetTop;
        const emoji = e.dataTransfer.getData('text/plain');
        if (emoji) {
            this.addEmojiToPlayArea(emoji, x, y);
            this.selectedEmoji = null;
        }
    }

    handleTouchStart(e) {
        const touchedElement = e.target;
        if (touchedElement && touchedElement.classList.contains('emoji')) {
            this.selectedEmoji = touchedElement.textContent;
            this.draggedElement = touchedElement.cloneNode(true);
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.pointerEvents = 'none';
            document.body.appendChild(this.draggedElement);
        }
    }

    handleTouchMove(e) {
        if (this.draggedElement) {
            const touch = e.touches[0];
            this.draggedElement.style.left = `${touch.clientX - 15}px`;
            this.draggedElement.style.top = `${touch.clientY - 15}px`;
        }
    }

    handleTouchEnd(e) {
        if (this.selectedEmoji && this.draggedElement) {
            const touch = e.changedTouches[0];
            const x = touch.clientX - this.playArea.offsetLeft;
            const y = touch.clientY - this.playArea.offsetTop;
            this.addEmojiToPlayArea(this.selectedEmoji, x, y);
            document.body.removeChild(this.draggedElement);
            this.draggedElement = null;
            this.selectedEmoji = null;
        }
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
        
        // Keep only the last 5 messages
        while (this.eventMenu.children.length > 6) { // +1 for the header
            this.eventMenu.removeChild(this.eventMenu.children[1]);
        }
        
        console.log(`BREAKING NEWS: ${message}`);
    }

    gameLoop(timestamp) {
        this.update();
        this.performanceMonitor.update(timestamp);
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
        // e.g., birds eating worms, butterflies pollinating bushes, etc.
    }

    performanceMonitor = {
        frameCount: 0,
        lastTime: performance.now(),
        fps: 0,
        lastLogTime: 0,

        update: function(currentTime) {
            this.frameCount++;
            if (currentTime - this.lastTime >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                if (currentTime - this.lastLogTime >= 5000) {
                    console.log(`Current FPS: ${this.fps}`);
                    this.lastLogTime = currentTime;
                }
            }
        }
    };
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.initialize();
});
