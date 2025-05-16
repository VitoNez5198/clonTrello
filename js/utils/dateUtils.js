import { CONFIG } from '../config/constants.js';

export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function isOverdue(endDate) {
    if (!endDate) return false;
    const now = new Date();
    const end = new Date(endDate);
    return end < now;
}

export function checkOverdueTasks() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const endDateEl = card.querySelector('.date-range:last-child span');
        if (endDateEl) {
            const endDate = new Date(endDateEl.textContent);
            if (isOverdue(endDate)) {
                card.classList.add('overdue');
            } else {
                card.classList.remove('overdue');
            }
        }
    });
} 