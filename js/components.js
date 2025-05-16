import { saveToLocalStorage, getColorValue, checkOverdueTasks } from './utils.js';
import { handleCardDragStart, handleCardDragEnd, handleCardDragOver, handleCardDragLeave, handleCardDrop } from './dragAndDrop.js';
import { showAddCardForm } from './forms.js';

// Función para crear una nueva tarjeta
export function createCard(title, description = '', startDate = '', endDate = '') {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.setAttribute('data-card', '');
    // Generar un ID único para la tarjeta
    const cardId = 'card-' + Date.now();
    card.setAttribute('data-card-id', cardId);
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${title}</h3>
            <button class="delete-card-btn" title="Eliminar tarea">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        <div class="card-dates">
            <div class="date-range">
                <i class="fas fa-calendar-alt"></i>
                <span class="date-value">${startDate}</span>
            </div>
            <div class="date-range">
                <i class="fas fa-calendar-check"></i>
                <span class="date-value">${endDate}</span>
            </div>
        </div>
    `;

    // Crear el modal
    const modal = document.createElement('div');
    modal.className = 'card-modal';
    modal.setAttribute('data-modal-id', cardId);
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <input type="text" class="modal-title" value="${title}" maxlength="100">
                <button class="close-modal-btn" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-dates">
                    <div class="date-input-group">
                        <label>
                            <i class="fas fa-calendar-alt"></i>
                            Fecha de inicio
                        </label>
                        <input type="text" class="date-start modal-date" value="${startDate}">
                    </div>
                    <div class="date-input-group">
                        <label>
                            <i class="fas fa-calendar-check"></i>
                            Fecha de término
                        </label>
                        <input type="text" class="date-end modal-date" value="${endDate}">
                    </div>
                </div>
                <div class="description-group">
                    <label>
                        <i class="fas fa-align-left"></i>
                        Descripción
                    </label>
                    <textarea class="modal-description" rows="6" placeholder="Agregar una descripción más detallada...">${description}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="save-modal-btn" type="button">
                    <i class="fas fa-save"></i>
                    Guardar cambios
                </button>
            </div>
        </div>
    `;

    // Agregar el modal al body si no existe ya
    if (!document.querySelector(`[data-modal-id="${cardId}"]`)) {
        document.body.appendChild(modal);
    }

    // Agregar eventos de drag and drop
    card.addEventListener('dragstart', handleCardDragStart);
    card.addEventListener('dragend', handleCardDragEnd);

    // Función para abrir el modal
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        initializeModalDatePickers(modal);
        // Enfocar el título al abrir
        modal.querySelector('.modal-title').focus();
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Evento para abrir modal al hacer click en la tarjeta
    card.addEventListener('click', (e) => {
        const isDeleteButton = e.target.closest('.delete-card-btn');
        if (!isDeleteButton) {
            openModal();
        }
    });

    // Evento para eliminar tarjeta
    const deleteBtn = card.querySelector('.delete-card-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
            modal.remove();
            card.remove();
            saveToLocalStorage();
        }
    });

    // Eventos del modal
    const closeBtn = modal.querySelector('.close-modal-btn');
    const saveBtn = modal.querySelector('.save-modal-btn');

    closeBtn.addEventListener('click', closeModal);

    // Cerrar con Escape
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Prevenir que los clicks dentro del modal se propaguen
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    saveBtn.addEventListener('click', () => {
        const newTitle = modal.querySelector('.modal-title').value.trim();
        const newDescription = modal.querySelector('.modal-description').value.trim();
        const newStartDate = modal.querySelector('.date-start').value;
        const newEndDate = modal.querySelector('.date-end').value;

        if (newTitle) {
            card.querySelector('h3').textContent = newTitle;
            card.querySelector('.date-range:first-child .date-value').textContent = newStartDate;
            card.querySelector('.date-range:last-child .date-value').textContent = newEndDate;
            closeModal();
            saveToLocalStorage();
        } else {
            alert('El título es obligatorio');
        }
    });

    return card;
}

// Función para inicializar los date pickers del modal
function initializeModalDatePickers(modal) {
    const startDate = modal.querySelector('.date-start');
    const endDate = modal.querySelector('.date-end');

    const startDatePicker = initializeDatePicker(startDate);
    const endDatePicker = initializeDatePicker(endDate);

    startDatePicker.config.onChange = function(selectedDates) {
        endDatePicker.set('minDate', selectedDates[0]);
    };
}

// Colores predefinidos para las columnas
const columnColors = {
    blue: '#1a73e8',    // Google Blue
    green: '#34a853',   // Google Green
    red: '#ea4335',     // Google Red
    yellow: '#fbbc05',  // Google Yellow
    purple: '#7c4dff',  // Material Purple
    teal: '#009688',    // Material Teal
    pink: '#e91e63',    // Material Pink
    orange: '#ff5722'   // Material Orange
};

// Función para inicializar una columna
export function initializeColumn(column) {
    // Verificar si la columna ya está inicializada
    if (column.hasAttribute('data-initialized')) {
        return;
    }

    const deleteBtn = column.querySelector('.delete-column-btn');
    const title = column.querySelector('h2');
    const colorDisplay = column.querySelector('.color-display');
    const colorOptions = column.querySelectorAll('.color-option');

    // Evento para eliminar columna
    deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta lista y todas sus tarjetas?')) {
            column.remove();
            saveToLocalStorage();
        }
    });

    // Eventos para editar título
    title.addEventListener('blur', () => {
        if (!title.textContent.trim()) {
            title.textContent = 'Sin título';
        }
        saveToLocalStorage();
    });

    title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            title.blur();
        }
    });

    // Eventos para cambiar color
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            const colorValue = getColorValue(color);
            column.style.borderTopColor = colorValue;
            column.style.setProperty('color', colorValue);
            colorDisplay.style.backgroundColor = colorValue;
            saveToLocalStorage();
        });
    });

    // Establecer color inicial
    const colorValue = getColorValue('blue');
    column.style.borderTopColor = colorValue;
    column.style.setProperty('color', colorValue);
    colorDisplay.style.backgroundColor = colorValue;

    // Agregar eventos para las tarjetas dentro de la columna
    const cardsContainer = column.querySelector('[data-cards]');
    cardsContainer.addEventListener('dragover', handleCardDragOver);
    cardsContainer.addEventListener('dragleave', handleCardDragLeave);
    cardsContainer.addEventListener('drop', handleCardDrop);

    // Inicializar el botón de agregar tarjeta
    const addCardBtn = column.querySelector('[data-add-card]');
    addCardBtn.addEventListener('click', () => showAddCardForm(column));

    // Marcar la columna como inicializada
    column.setAttribute('data-initialized', 'true');
}

// Función para inicializar Flatpickr
export function initializeDatePicker(element) {
    const fp = flatpickr(element, {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "es",
        onChange: function(selectedDates) {
            checkOverdueTasks();
            saveToLocalStorage();
        }
    });
    return fp;
} 