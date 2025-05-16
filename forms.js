// En el formulario de agregar tarjeta
form.innerHTML = `
    // ... existing code ...
    <div class="form-buttons">
        <button type="button" class="save-btn">
            <i class="fas fa-plus"></i>
            Agregar tarea
        </button>
        // ... existing code ...
    </div>
`;

// En la función saveColumn
column.innerHTML = `
    // ... existing code ...
    <button class="add-card-btn" data-add-card>
        <i class="fas fa-plus"></i>
        Agregar tarea
    </button>
`; 