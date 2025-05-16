import { saveToLocalStorage } from './utils.js';

let draggedCard = null;
let originalCardY = 0;

// Funciones para el drag and drop de tarjetas
export function handleCardDragStart(e) {
    draggedCard = e.target;
    draggedCard.classList.add('dragging');
    originalCardY = e.clientY;
    
    // Configurar datos de transferencia
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggedCard.innerHTML);
    
    // Crear imagen fantasma personalizada
    const ghost = draggedCard.cloneNode(true);
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    
    // Eliminar el clon después
    setTimeout(() => {
        document.body.removeChild(ghost);
    }, 0);
}

export function handleCardDragEnd(e) {
    if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard = null;
    }
    
    // Eliminar las clases de drag-over de todas las zonas
    document.querySelectorAll('.cards').forEach(container => {
        container.classList.remove('drag-over');
    });
    
    saveToLocalStorage();
}

export function handleCardDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const container = e.target.closest('.cards');
    if (!container || !draggedCard) return;
    
    container.classList.add('drag-over');
    
    const cards = [...container.querySelectorAll('.card:not(.dragging)')];
    const card = e.target.closest('.card');
    
    if (!card) {
        container.appendChild(draggedCard);
        return;
    }
    
    const cardRect = card.getBoundingClientRect();
    const cardMiddleY = cardRect.top + cardRect.height / 2;
    
    if (e.clientY < cardMiddleY) {
        card.parentNode.insertBefore(draggedCard, card);
    } else {
        card.parentNode.insertBefore(draggedCard, card.nextSibling);
    }
}

export function handleCardDragLeave(e) {
    const container = e.target.closest('.cards');
    if (container) {
        container.classList.remove('drag-over');
    }
}

export function handleCardDrop(e) {
    e.preventDefault();
    const container = e.target.closest('.cards');
    if (container) {
        container.classList.remove('drag-over');
    }
    saveToLocalStorage();
} 