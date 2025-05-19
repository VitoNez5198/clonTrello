import { saveToLocalStorage } from './utils.js';
import { createCard, initializeColumn } from './components.js';

// Función para mostrar el formulario de agregar tarjeta
export function showAddCardForm(column) {
    const button = column.querySelector('[data-add-card]');
    
    // Crear el formulario
    const form = document.createElement('div');
    form.className = 'add-card-form';
    form.innerHTML = `
        <input type="text" 
               class="card-title form-input" 
               placeholder="Título..." 
               maxlength="100" 
               required>
        <textarea 
            class="card-description form-input" 
            placeholder="Descripción..." 
            rows="3"></textarea>
        <div class="date-inputs">
            <div class="date-input-group">
                <label>
                    <i class="fas fa-calendar-alt"></i>
                    Fecha de inicio
                </label>
                <input type="text" class="date-start form-input" placeholder="Seleccionar fecha">
            </div>
            <div class="date-input-group">
                <label>
                    <i class="fas fa-calendar-check"></i>
                    Fecha de término
                </label>
                <input type="text" class="date-end form-input" placeholder="Seleccionar fecha">
            </div>
        </div>
        <div class="form-buttons">
            <button type="button" class="save-btn">
                <i class="fas fa-plus"></i>
                Agregar tarea
            </button>
            <button type="button" class="cancel-btn">
                <i class="fas fa-times"></i>
                Cancelar
            </button>
        </div>
    `;

    // Ocultar el botón
    button.style.display = 'none';

    // Insertar el formulario antes del botón
    button.parentNode.insertBefore(form, button);

    // Inicializar los selectores de fecha
    const startDate = form.querySelector('.date-start');
    const endDate = form.querySelector('.date-end');

    const startDatePicker = flatpickr(startDate, {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "es",
        onChange: function(selectedDates) {
            // Actualizar la fecha mínima de la fecha de término
            if (selectedDates[0]) {
                endDatePicker.set('minDate', selectedDates[0]);
                // Si la fecha de término es anterior a la nueva fecha de inicio, actualizarla
                if (endDatePicker.selectedDates[0] && endDatePicker.selectedDates[0] < selectedDates[0]) {
                    endDatePicker.setDate(selectedDates[0]);
                }
            }
        }
    });

    const endDatePicker = flatpickr(endDate, {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: "es",
        onChange: function(selectedDates) {
            // Si se selecciona una fecha de término, asegurarse de que no sea anterior a la fecha de inicio
            if (selectedDates[0] && startDatePicker.selectedDates[0]) {
                if (selectedDates[0] < startDatePicker.selectedDates[0]) {
                    endDatePicker.setDate(startDatePicker.selectedDates[0]);
                }
            }
        }
    });

    // Enfocar el título
    const titleInput = form.querySelector('.card-title');
    titleInput.focus();

    // Función para guardar la tarjeta
    function saveCard() {
        const title = titleInput.value.trim();
        const description = form.querySelector('.card-description').value.trim();
        const start = startDate.value;
        const end = endDate.value;

        if (title && start && end) {
            const cardsContainer = column.querySelector('[data-cards]');
            const newCard = createCard(title, description, start, end);
            cardsContainer.appendChild(newCard);
            form.remove();
            button.style.display = '';
            saveToLocalStorage();
        } else {
            alert('Por favor, complete al menos el título y las fechas');
        }
    }

    // Función para cancelar
    function cancelAdd() {
        form.remove();
        button.style.display = '';
    }

    // Agregar eventos a los botones
    const saveButton = form.querySelector('.save-btn');
    const cancelButton = form.querySelector('.cancel-btn');

    saveButton.addEventListener('click', saveCard);
    cancelButton.addEventListener('click', cancelAdd);

    // Permitir enviar con Enter en el título y cancelar con Escape
    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveCard();
        }
        if (e.key === 'Escape') {
            cancelAdd();
        }
    });
}

// Función para mostrar el formulario de nueva columna
export function showAddColumnForm() {
    const addColumnContainer = document.querySelector('.add-column');
    const addColumnBtn = addColumnContainer.querySelector('.add-column-btn');
    
    // Crear el formulario
    const form = document.createElement('div');
    form.className = 'add-column-form';
    form.innerHTML = `
        <input type="text" 
               placeholder="Título de la lista..." 
               maxlength="50"
               autofocus>
        <div class="form-buttons">
            <button type="button" class="save-btn">
                <i class="fas fa-plus"></i>
                Agregar lista
            </button>
            <button type="button" class="cancel-btn">
                <i class="fas fa-times"></i>
                Cancelar
            </button>
        </div>
    `;

    // Ocultar el botón
    addColumnBtn.style.display = 'none';

    // Insertar el formulario
    addColumnContainer.insertBefore(form, addColumnBtn);

    // Obtener elementos del formulario
    const input = form.querySelector('input');
    const saveBtn = form.querySelector('.save-btn');
    const cancelBtn = form.querySelector('.cancel-btn');

    // Función para guardar la columna
    function saveColumn() {
        const title = input.value.trim();
        if (title) {
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
                        <h2 contenteditable="true" spellcheck="false">${title}</h2>
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

            // Insertar antes del contenedor de "Agregar lista"
            addColumnContainer.parentNode.insertBefore(column, addColumnContainer);

            // Inicializar la nueva columna
            initializeColumn(column);

            // Limpiar el formulario
            form.remove();
            addColumnBtn.style.display = '';
            saveToLocalStorage();
        } else {
            alert('Por favor, ingrese un título para la lista');
        }
    }

    // Eventos del formulario
    saveBtn.addEventListener('click', saveColumn);
    cancelBtn.addEventListener('click', () => {
        form.remove();
        addColumnBtn.style.display = '';
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveColumn();
        }
        if (e.key === 'Escape') {
            form.remove();
            addColumnBtn.style.display = '';
        }
    });

    // Enfocar el input
    input.focus();
} 