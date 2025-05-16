import { CONFIG } from '../config/constants.js';

class StateManager {
    constructor() {
        this.state = this.loadState();
    }

    loadState() {
        const storedState = localStorage.getItem(CONFIG.STORAGE_KEY);
        return storedState ? JSON.parse(storedState) : [];
    }

    saveState(state) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
        this.state = state;
    }

    getState() {
        return this.state;
    }

    addColumn(column) {
        this.state.push(column);
        this.saveState(this.state);
    }

    updateColumn(columnIndex, column) {
        this.state[columnIndex] = column;
        this.saveState(this.state);
    }

    deleteColumn(columnIndex) {
        this.state.splice(columnIndex, 1);
        this.saveState(this.state);
    }

    addCard(columnIndex, card) {
        if (!this.state[columnIndex].cards) {
            this.state[columnIndex].cards = [];
        }
        this.state[columnIndex].cards.push(card);
        this.saveState(this.state);
    }

    updateCard(columnIndex, cardIndex, card) {
        this.state[columnIndex].cards[cardIndex] = card;
        this.saveState(this.state);
    }

    deleteCard(columnIndex, cardIndex) {
        this.state[columnIndex].cards.splice(cardIndex, 1);
        this.saveState(this.state);
    }

    moveCard(fromColumn, fromIndex, toColumn, toIndex) {
        const card = this.state[fromColumn].cards[fromIndex];
        this.state[fromColumn].cards.splice(fromIndex, 1);
        this.state[toColumn].cards.splice(toIndex, 0, card);
        this.saveState(this.state);
    }
}

export const stateManager = new StateManager(); 