import { saveToLocalStorage, getStoredState, checkOverdueTasks, getColorValue } from './utils.js';
import { handleCardDragOver, handleCardDragLeave, handleCardDrop } from './dragAndDrop.js';
import { initializeColumn, createCard } from './components.js';
import { showAddColumnForm, showAddCardForm } from './forms.js';
import { debounce, throttle } from './utils/optimizations.js';

// Delegación de eventos para el tablero
function setupBoardEventDelegation(board) {
    board.addEventListener('click', (e) => {
        // Delegación para botones de agregar tarjeta
        const addCardBtn = e.target.closest('[data-add-card]');
        if (addCardBtn) {
            const column = addCardBtn.closest('.column');
            showAddCardForm(column);
            return;
        }

        // Delegación para botones de eliminar columna
        const deleteColumnBtn = e.target.closest('.delete-column-btn');
        if (deleteColumnBtn) {
            const column = deleteColumnBtn.closest('.column');
            if (confirm('¿Estás seguro de que deseas eliminar esta lista y todas sus tarjetas?')) {
                column.remove();
                saveToLocalStorage();
            }
            return;
        }
    });

    // Optimizar eventos de drag and drop
    const throttledDragOver = throttle(handleCardDragOver, 50);
    const throttledDragLeave = throttle(handleCardDragLeave, 50);
    const throttledDrop = throttle(handleCardDrop, 50);

    board.addEventListener('dragover', throttledDragOver);
    board.addEventListener('dragleave', throttledDragLeave);
    board.addEventListener('drop', throttledDrop);
}

// Función optimizada para cargar desde localStorage
function loadFromLocalStorage() {
    const state = getStoredState();
    const board = document.querySelector('.board');
    const addColumnBtn = board.querySelector('.add-column');
    
    // Limpiar el tablero antes de cargar
    const existingColumns = board.querySelectorAll('[data-column]');
    existingColumns.forEach(column => column.remove());
    
    // Si no hay estado guardado, crear las columnas predeterminadas
    if (!state || !Array.isArray(state)) {
        const defaultColumns = [
            {
                title: 'Por hacer',
                color: 'blue',
                cards: []
            },
            {
                title: 'En progreso',
                color: 'green',
                cards: []
            }
        ];
        
        // Usar DocumentFragment para mejor rendimiento
        const fragment = document.createDocumentFragment();
        
        defaultColumns.forEach(columnData => {
            const column = document.createElement('div');
            column.className = 'column';
            column.setAttribute('data-column', '');
            column.innerHTML = `
                <div class="column-header">
                    <div class="column-title">
                        <div class="color-picker">
                            <div class="color-display" title="Cambiar color de la lista"></div>
                            <div class="color-options">
                                <div class="color-option" data-color="blue" title="Azul"></div>
                                <div class="color-option" data-color="green" title="Verde"></div>
                                <div class="color-option" data-color="red" title="Rojo"></div>
                                <div class="color-option" data-color="yellow" title="Amarillo"></div>
                                <div class="color-option" data-color="purple" title="Morado"></div>
                                <div class="color-option" data-color="teal" title="Verde azulado"></div>
                                <div class="color-option" data-color="pink" title="Rosa"></div>
                                <div class="color-option" data-color="orange" title="Naranja"></div>
                            </div>
                        </div>
                        <h2 contenteditable="true" spellcheck="false" role="heading">${columnData.title}</h2>
                    </div>
                    <div class="column-actions">
                        <button class="delete-column-btn" title="Eliminar lista" aria-label="Eliminar lista">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="cards" data-cards role="list"></div>
                <button class="add-card-btn" data-add-card aria-label="Agregar nueva tarea">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    Agregar tarea
                </button>
            `;

            // Establecer el color de la columna
            const colorDisplay = column.querySelector('.color-display');
            const colorValue = getColorValue(columnData.color);
            colorDisplay.style.background = colorValue;
            column.style.borderTopColor = colorValue;
            column.style.setProperty('color', colorValue);

            fragment.appendChild(column);
            
            // Inicializar la columna
            initializeColumn(column);
        });

        // Insertar todas las columnas de una vez
        board.insertBefore(fragment, addColumnBtn);
        
        // Guardar el estado inicial
        saveToLocalStorage();
        return;
    }

    // Si hay estado guardado, cargarlo
    const fragment = document.createDocumentFragment();
    
    state.forEach(columnData => {
        const column = document.createElement('div');
        column.className = 'column';
        column.setAttribute('data-column', '');
        column.innerHTML = `
            <div class="column-header">
                <div class="column-title">
                    <div class="color-picker">
                        <div class="color-display" title="Cambiar color de la lista"></div>
                        <div class="color-options">
                            <div class="color-option" data-color="blue" title="Azul"></div>
                            <div class="color-option" data-color="green" title="Verde"></div>
                            <div class="color-option" data-color="red" title="Rojo"></div>
                            <div class="color-option" data-color="yellow" title="Amarillo"></div>
                            <div class="color-option" data-color="purple" title="Morado"></div>
                            <div class="color-option" data-color="teal" title="Verde azulado"></div>
                            <div class="color-option" data-color="pink" title="Rosa"></div>
                            <div class="color-option" data-color="orange" title="Naranja"></div>
                        </div>
                    </div>
                    <h2 contenteditable="true" spellcheck="false" role="heading">${columnData.title}</h2>
                </div>
                <div class="column-actions">
                    <button class="delete-column-btn" title="Eliminar lista" aria-label="Eliminar lista">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="cards" data-cards role="list"></div>
            <button class="add-card-btn" data-add-card aria-label="Agregar nueva tarea">
                <i class="fas fa-plus" aria-hidden="true"></i>
                Agregar tarea
            </button>
        `;

        // Restaurar el color de la columna
        if (columnData.color) {
            const colorDisplay = column.querySelector('.color-display');
            const colorValue = getColorValue(columnData.color);
            colorDisplay.style.background = colorValue;
            column.style.borderTopColor = colorValue;
            column.style.setProperty('color', colorValue);
        }

        fragment.appendChild(column);
        
        // Inicializar la columna
        initializeColumn(column);

        // Restaurar las tarjetas usando DocumentFragment
        if (columnData.cards && Array.isArray(columnData.cards)) {
            const cardsContainer = column.querySelector('[data-cards]');
            const cardsFragment = document.createDocumentFragment();
            
            columnData.cards.forEach(cardData => {
                const card = createCard(
                    cardData.title,
                    cardData.description,
                    cardData.startDate,
                    cardData.endDate
                );
                cardsFragment.appendChild(card);
            });
            
            cardsContainer.appendChild(cardsFragment);
        }
    });

    // Insertar todas las columnas de una vez
    board.insertBefore(fragment, addColumnBtn);
}

// Inicializar el tablero
document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    
    // Configurar delegación de eventos
    setupBoardEventDelegation(board);

    // Cargar el estado guardado
    loadFromLocalStorage();

    // Inicializar el botón de agregar columna
    const addColumnBtn = document.querySelector('.add-column-btn');
    addColumnBtn.addEventListener('click', () => {
        showAddColumnForm(addColumnBtn.parentElement);
    });

    // Optimizar verificación de tareas vencidas
    const debouncedCheckOverdueTasks = debounce(checkOverdueTasks, 1000);
    setInterval(debouncedCheckOverdueTasks, 60000);
    debouncedCheckOverdueTasks();
});

// Prevenir el comportamiento predeterminado de arrastrar en el documento
const throttledPreventDefault = throttle((e) => e.preventDefault(), 100);
document.addEventListener('dragover', throttledPreventDefault);
document.addEventListener('drop', throttledPreventDefault); 