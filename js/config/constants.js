export const CONFIG = {
    STORAGE_KEY: 'taskito-state',
    CHECK_INTERVAL: 60000, // 1 minuto
    COLORS: {
        blue: '#2196F3',
        green: '#4CAF50',
        red: '#F44336',
        yellow: '#FFC107',
        purple: '#9C27B0',
        teal: '#009688',
        pink: '#E91E63',
        orange: '#FF9800'
    }
};

export const CLASSES = {
    column: 'column',
    card: 'card',
    dragging: 'dragging',
    dragOver: 'drag-over'
};

export const SELECTORS = {
    board: '.board',
    column: '.column',
    cards: '[data-cards]',
    cardTitle: '[data-card-title]',
    addCard: '[data-add-card]'
};

export const DATE_FORMAT = {
    display: 'd/m/Y H:i',
    storage: 'Y-m-d H:i:s'
}; 