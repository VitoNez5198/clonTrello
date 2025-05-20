# TaskiTo - Clon de Trello en el Navegador

TaskiTo es una aplicación de gestión de tareas tipo Kanban desarrollada con HTML, CSS y JavaScript puro. Permite crear columnas, agregar tarjetas con fechas límite, y organizar tareas visualmente. Funciona 100% en el navegador, sin necesidad de base de datos o backend.

## Características

- Crear y personalizar columnas.
- Agregar tarjetas con título, descripción y fechas (inicio y vencimiento).
- Mover tarjetas entre columnas mediante arrastrar y soltar.
- Las tarjetas vencidas se resaltan automáticamente.
- Todos los datos se almacenan en el navegador usando localStorage.
- Estilo responsive adaptado a pantallas grandes y medianas.
- Aplicación totalmente funcional sin conexión a internet.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Flatpickr (selector de fechas)
- Font Awesome (iconos)
- LocalStorage (persistencia de datos)

## Estructura del Proyecto

```
CLON_TRELLO/
│
├── assets/
│ └── cheque.svg # Íconos o recursos gráficos
│
├── css/
│ ├── components/
│ │ └── header.css # Estilos específicos del encabezado
│ └── utils/
│ ├── animations.css # Animaciones personalizadas
│ ├── variables.css # Variables CSS (colores, tamaños, etc.)
│ └── styles.css # Estilos generales
│
├── js/
│ ├── components/
│ │ └── Card.js # Componente para crear tarjetas
│ ├── config/
│ │ └── constants.js # Constantes globales
│ ├── services/
│ │ └── stateManager.js # Lógica para manejar el estado de la app
│ ├── utils/
│ │ ├── dateUtils.js # Funciones relacionadas con fechas
│ │ └── optimizations.js # Mejoras de rendimiento u optimización
│ ├── app.js # Punto de entrada principal
│ ├── components.js # Generación de columnas
│ ├── dragAndDrop.js # Lógica para arrastrar y soltar
│ ├── forms.js # Manejo de formularios
│ └── utils.js # Funciones auxiliares generales
│
├── index.html # Página principal
└── README.md # Este archivo
```

## Módulos Principales

### app.js
- Inicialización de la aplicación
- Gestión del estado global
- Carga y guardado de datos

### components.js
- Creación y gestión de columnas
- Creación y gestión de tarjetas
- Manipulación del DOM

### dragAndDrop.js
- Implementación del sistema de arrastrar y soltar
- Gestión de eventos de arrastre

### forms.js
- Formularios para crear/editar tarjetas
- Validación de datos
- Gestión de fechas

### utils.js
- Funciones de utilidad
- Persistencia en LocalStorage
- Verificación de tareas vencidas

## Instalación y Uso

1. Clona el repositorio ```bash
git clone https://github.com/VitoNez5198/clonTrello.git```
2. Abre `index.html` en tu navegador
3. ¡Listo para usar!

## Mejoras Futuras

- Implementación de etiquetas para tarjetas
- Filtrado y búsqueda de tarjetas
- Modo oscuro
- Exportación/importación de datos
- Soporte para múltiples tableros.
