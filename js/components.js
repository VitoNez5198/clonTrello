import { saveToLocalStorage, getColorValue, checkOverdueTasks } from './utils.js';
import { handleCardDragStart, handleCardDragEnd, handleCardDragOver, handleCardDragLeave, handleCardDrop } from './dragAndDrop.js';
import { showAddCardForm } from './forms.js';
import { debounce, createIntersectionObserver, debouncedSaveToLocalStorage } from './utils/optimizations.js';

// Observer para lazy loading de tarjetas
const cardObserver = createIntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            card.classList.add('card-visible');
            cardObserver.unobserve(card);
        }
    });
});

// Función para crear una nueva tarjeta
export function createCard(title, description = '', startDate = '', endDate = '') {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.setAttribute('data-card', '');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Tarea: ${title}`);
    
    // Generar un ID único para la tarjeta
    const cardId = 'card-' + Date.now();
    card.setAttribute('data-card-id', cardId);
    
    card.innerHTML = `
        <div class="card-header">
            <h3 tabindex="0" role="heading">${title}</h3>
            <button class="delete-card-btn" 
                    title="Eliminar tarea"
                    aria-label="Eliminar tarea">
                <i class="fas fa-trash-alt" aria-hidden="true"></i>
            </button>
        </div>
        <div class="card-content">
            <div class="card-description">${description || 'Sin descripción'}</div>
        </div>
        <div class="card-dates" role="contentinfo">
            <div class="date-range">
                <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                <span class="date-value">${startDate}</span>
            </div>
            <div class="date-range">
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
                <span class="date-value">${endDate}</span>
            </div>
        </div>
    `;

    // Optimizar eventos de arrastrar
    const debouncedDragStart = debounce(handleCardDragStart, 100);
    const debouncedDragEnd = debounce(handleCardDragEnd, 100);

    card.addEventListener('dragstart', debouncedDragStart);
    card.addEventListener('dragend', debouncedDragEnd);

    // Evento para abrir el modal al hacer clic en la tarjeta
    card.addEventListener('click', (e) => {
        // Evitar abrir el modal si se hizo clic en el botón de eliminar
        if (e.target.closest('.delete-card-btn')) return;
        
        showCardModal(cardId, title, description, startDate, endDate);
    });

    // Observar la tarjeta para lazy loading
    cardObserver.observe(card);

    // Función para limpiar recursos
    function destroyCard() {
        cardObserver.unobserve(card);
        card.removeEventListener('dragstart', debouncedDragStart);
        card.removeEventListener('dragend', debouncedDragEnd);
        card.remove();
    }

    // Evento para eliminar tarjeta
    const deleteBtn = card.querySelector('.delete-card-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            destroyCard();
            debouncedSaveToLocalStorage(saveToLocalStorage);
        }
    });

    return card;
}

// Función para mostrar el modal de la tarjeta
function showCardModal(cardId, title, description, startDate, endDate) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.className = 'card-modal';
    modal.setAttribute('data-modal-id', cardId);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-modal-btn" title="Cerrar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3>Descripción</h3>
                    <textarea class="modal-description" rows="4">${description}</textarea>
                </div>
                <div class="modal-section">
                    <h3>Fechas</h3>
                    <div class="modal-dates">
                        <div class="date-group">
                            <label>
                                <i class="fas fa-calendar-alt"></i>
                                Fecha de inicio
                            </label>
                            <input type="text" class="modal-date-start" value="${startDate}">
                        </div>
                        <div class="date-group">
                            <label>
                                <i class="fas fa-calendar-check"></i>
                                Fecha de término
                            </label>
                            <input type="text" class="modal-date-end" value="${endDate}">
                        </div>
                    </div>
                </div>
                <div class="modal-section">
                    <h3>Opciones adicionales</h3>
                    <div class="modal-options">
                        <button class="option-btn" title="Agregar etiquetas">
                            <i class="fas fa-tags"></i>
                            Etiquetas
                        </button>
                        <button class="option-btn" title="Agregar comentarios">
                            <i class="fas fa-comments"></i>
                            Comentarios
                        </button>
                        <button class="option-btn" title="Agregar archivos adjuntos">
                            <i class="fas fa-paperclip"></i>
                            Archivos
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="save-changes-btn">
                    <i class="fas fa-save"></i>
                    Guardar cambios
                </button>
            </div>
        </div>
    `;

    // Agregar el modal al body
    document.body.appendChild(modal);

    // Inicializar los selectores de fecha
    const startDateInput = modal.querySelector('.modal-date-start');
    const endDateInput = modal.querySelector('.modal-date-end');

    const startDatePicker = flatpickr(startDateInput, {
        dateFormat: "Y-m-d",
        locale: "es",
        onChange: function(selectedDates) {
            if (selectedDates[0]) {
                endDatePicker.set('minDate', selectedDates[0]);
                if (endDatePicker.selectedDates[0] && endDatePicker.selectedDates[0] < selectedDates[0]) {
                    endDatePicker.setDate(selectedDates[0]);
                }
            }
        }
    });

    const endDatePicker = flatpickr(endDateInput, {
        dateFormat: "Y-m-d",
        locale: "es",
        onChange: function(selectedDates) {
            if (selectedDates[0] && startDatePicker.selectedDates[0]) {
                if (selectedDates[0] < startDatePicker.selectedDates[0]) {
                    endDatePicker.setDate(startDatePicker.selectedDates[0]);
                }
            }
        }
    });

    // Función para guardar los cambios
    function saveChanges() {
        const newDescription = modal.querySelector('.modal-description').value.trim();
        const newStartDate = startDateInput.value;
        const newEndDate = endDateInput.value;

        // Actualizar la tarjeta
        const card = document.querySelector(`[data-card-id="${cardId}"]`);
        if (card) {
            card.querySelector('h3').textContent = title;
            card.querySelector('.card-description').textContent = newDescription || 'Sin descripción';
            if (card.querySelector('.date-range:first-child .date-value')) {
                card.querySelector('.date-range:first-child .date-value').textContent = newStartDate;
            }
            if (card.querySelector('.date-range:last-child .date-value')) {
                card.querySelector('.date-range:last-child .date-value').textContent = newEndDate;
            }
        }

        // Guardar en localStorage
        saveToLocalStorage();
        
        // Cerrar el modal
        closeModal();
    }

    // Función para cerrar el modal
    function closeModal() {
        modal.remove();
    }

    // Eventos del modal
    const closeBtn = modal.querySelector('.close-modal-btn');
    const saveBtn = modal.querySelector('.save-changes-btn');
    const optionBtns = modal.querySelectorAll('.option-btn');

    closeBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveChanges);

    // Cerrar el modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar el modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Eventos para las opciones adicionales (por ahora solo muestran un mensaje)
    optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Esta funcionalidad estará disponible próximamente');
        });
    });
}

// Optimizar la inicialización de columnas
export function initializeColumn(column) {
    if (column.hasAttribute('data-initialized')) return;

    const deleteBtn = column.querySelector('.delete-column-btn');
    const title = column.querySelector('h2');
    const colorDisplay = column.querySelector('.color-display');
    const colorOptions = column.querySelectorAll('.color-option');
    const cardsContainer = column.querySelector('[data-cards]');

    // Optimizar eventos de título
    const debouncedTitleSave = debounce(() => {
        if (!title.textContent.trim()) {
            title.textContent = 'Sin título';
        }
        debouncedSaveToLocalStorage(saveToLocalStorage);
    }, 500);

    title.addEventListener('blur', debouncedTitleSave);
    title.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            title.blur();
        }
    });

    // Optimizar eventos de color
    const debouncedColorChange = debounce((color) => {
        const colorValue = getColorValue(color);
        column.style.borderTopColor = colorValue;
        column.style.setProperty('color', colorValue);
        colorDisplay.style.backgroundColor = colorValue;
        debouncedSaveToLocalStorage(saveToLocalStorage);
    }, 100);

    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const color = e.target.getAttribute('data-color');
            debouncedColorChange(color);
        });
    });

    // Optimizar eventos de drag and drop
    const debouncedDragOver = debounce(handleCardDragOver, 50);
    const debouncedDragLeave = debounce(handleCardDragLeave, 50);
    const debouncedDrop = debounce(handleCardDrop, 50);

    cardsContainer.addEventListener('dragover', debouncedDragOver);
    cardsContainer.addEventListener('dragleave', debouncedDragLeave);
    cardsContainer.addEventListener('drop', debouncedDrop);

    // Función para limpiar recursos
    function destroyColumn() {
        cardObserver.disconnect();
        cardsContainer.removeEventListener('dragover', debouncedDragOver);
        cardsContainer.removeEventListener('dragleave', debouncedDragLeave);
        cardsContainer.removeEventListener('drop', debouncedDrop);
        column.remove();
        debouncedSaveToLocalStorage(saveToLocalStorage);
    }

    // Evento para eliminar columna
    deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar esta lista y todas sus tarjetas?')) {
            destroyColumn();
        }
    });

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