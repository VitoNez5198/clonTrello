import { saveToLocalStorage, getStoredState, checkOverdueTasks, getColorValue } from './utils.js';
import { handleCardDragOver, handleCardDragLeave, handleCardDrop } from './dragAndDrop.js';
import { initializeColumn, createCard } from './components.js';
import { showAddColumnForm } from './forms.js';

// Función para cargar el estado desde localStorage
function loadFromLocalStorage() {
    const state = getStoredState();
    if (!state || !Array.isArray(state)) return;

    const board = document.querySelector('.board');
    const addColumnBtn = board.querySelector('.add-column');
    
    // Limpiar el tablero excepto el botón de agregar columna
    Array.from(board.children).forEach(child => {
        if (!child.classList.contains('add-column')) {
            child.remove();
        }
    });

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
                    <h2 contenteditable="true" spellcheck="false">${columnData.title}</h2>
                </div>
                <div class="column-actions">
                    <button class="delete-column-btn" title="Eliminar lista">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="cards" data-cards></div>
            <button class="add-card-btn" data-add-card>
                <i class="fas fa-plus"></i>
                Agregar tarjeta
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

        // Insertar la columna antes del botón de agregar
        board.insertBefore(column, addColumnBtn);
        
        // Inicializar la columna
        initializeColumn(column);

        // Restaurar las tarjetas
        const cardsContainer = column.querySelector('[data-cards]');
        if (columnData.cards && Array.isArray(columnData.cards)) {
            columnData.cards.forEach(cardData => {
                const card = createCard(
                    cardData.title,
                    cardData.description,
                    cardData.startDate,
                    cardData.endDate
                );
                cardsContainer.appendChild(card);
            });
        }
    });
}

// Inicializar el tablero
document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    
    // Eventos de drag and drop para el tablero
    board.addEventListener('dragover', handleCardDragOver);
    board.addEventListener('dragleave', handleCardDragLeave);
    board.addEventListener('drop', handleCardDrop);

    // Cargar el estado guardado
    loadFromLocalStorage();

    // Inicializar las columnas existentes
    document.querySelectorAll('.column').forEach(column => {
        initializeColumn(column);
    });

    // Inicializar el botón de agregar columna
    const addColumnBtn = document.querySelector('.add-column-btn');
    addColumnBtn.addEventListener('click', () => {
        showAddColumnForm(addColumnBtn.parentElement);
    });

    // Verificar tareas vencidas periódicamente
    setInterval(checkOverdueTasks, 60000); // Verificar cada minuto
    checkOverdueTasks(); // Verificar al cargar
});

// Prevenir el comportamiento predeterminado de arrastrar en el documento
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault()); 