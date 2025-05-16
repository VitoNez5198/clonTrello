# TaskiTo - Gestor de Tareas

TaskiTo es una aplicación web para la gestión de tareas inspirada en Trello, desarrollada con HTML, CSS y JavaScript vanilla. Permite organizar tareas en columnas personalizables con funcionalidad de arrastrar y soltar.

## Características

- Interfaz moderna y responsive
- Columnas personalizables con códigos de color
- Arrastrar y soltar tarjetas entre columnas
- Persistencia de datos local
- Fechas de inicio y vencimiento para tareas
- Notificaciones de tareas vencidas
- Edición en línea de títulos

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Flatpickr (selector de fechas)
- Font Awesome (iconos)
- LocalStorage (persistencia de datos)

## Estructura del Proyecto

```
TaskiTo/
├── assets/           # Recursos estáticos
├── css/             # Estilos CSS
│   ├── components/  # Componentes CSS
│   │   └── header.css
│   ├── utils/      # Utilidades CSS
│   │   ├── animations.css
│   │   └── variables.css
│   └── styles.css   # Estilos principales
├── js/              # Scripts JavaScript
│   ├── components/  # Componentes JS
│   │   └── Card.js
│   ├── config/     # Configuración
│   │   └── constants.js
│   ├── services/   # Servicios
│   │   └── stateManager.js
│   ├── utils/      # Utilidades JS
│   │   └── dateUtils.js
│   ├── app.js      # Punto de entrada
│   ├── dragAndDrop.js
│   └── forms.js
└── index.html       # Archivo HTML principal
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

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. ¡Listo para usar!

## Mejoras Futuras

- Implementación de etiquetas para tarjetas
- Filtrado y búsqueda de tarjetas
- Modo oscuro
- Exportación/importación de datos
- Soporte para múltiples tableros
