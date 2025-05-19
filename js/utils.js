// Función para obtener el valor del color
export function getColorValue(color) {
    const colorMap = {
        'blue': 'var(--primary-color)',
        'green': 'var(--secondary-color)',
        'red': 'var(--accent-color)',
        'yellow': 'var(--warning-color)',
        'purple': '#7c4dff',
        'teal': '#009688',
        'pink': '#e91e63',
        'orange': '#ff5722'
    };
    return colorMap[color] || colorMap['blue'];
}

// Función para obtener el nombre del color desde su valor
export function getColorName(colorValue) {
    const colorMap = {
        'var(--primary-color)': 'blue',
        'var(--secondary-color)': 'green',
        'var(--accent-color)': 'red',
        'var(--warning-color)': 'yellow',
        '#7c4dff': 'purple',
        '#009688': 'teal',
        '#e91e63': 'pink',
        '#ff5722': 'orange'
    };
    return colorMap[colorValue] || 'blue';
}

// Función para guardar el estado en localStorage
export function saveToLocalStorage() {
    const board = document.querySelector('.board');
    const columns = Array.from(board.querySelectorAll('[data-column]')).map(column => {
        const cards = Array.from(column.querySelectorAll('.card')).map(card => {
            return {
                title: card.querySelector('h3').textContent,
                description: card.querySelector('.card-description').textContent,
                startDate: card.querySelector('.date-range:first-child .date-value')?.textContent || '',
                endDate: card.querySelector('.date-range:last-child .date-value')?.textContent || ''
            };
        });

        return {
            title: column.querySelector('h2').textContent,
            color: getColorName(column.style.borderTopColor),
            cards: cards
        };
    });

    localStorage.setItem('boardState', JSON.stringify(columns));
}

// Función para obtener el estado desde localStorage
export function getStoredState() {
    const savedState = localStorage.getItem('boardState');
    if (savedState) {
        try {
            return JSON.parse(savedState);
        } catch (error) {
            console.error('Error al parsear el estado guardado:', error);
            return null;
        }
    }
    return null;
}

// Función para verificar tareas vencidas
export function checkOverdueTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    document.querySelectorAll('.card').forEach(card => {
        const endDateElement = card.querySelector('.date-range:last-child .date-value');
        if (endDateElement) {
            const endDate = new Date(endDateElement.textContent);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < today) {
                card.classList.add('overdue');
            } else {
                card.classList.remove('overdue');
            }
        }
    });
}

// Función para mover tarjetas con animación
export function moveCardWithAnimation(card, targetContainer) {
    const startRect = card.getBoundingClientRect();
    targetContainer.appendChild(card);
    const endRect = card.getBoundingClientRect();
    
    const deltaX = startRect.left - endRect.left;
    const deltaY = startRect.top - endRect.top;
    
    card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    card.style.transition = 'none';
    
    card.offsetHeight;
    
    card.style.transform = '';
    card.style.transition = 'transform 0.3s ease-in-out';
    
    card.addEventListener('transitionend', () => {
        card.style.transform = '';
        card.style.transition = '';
    }, { once: true });
} 