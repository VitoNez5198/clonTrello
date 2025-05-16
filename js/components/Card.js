import { CONFIG } from '../config/constants.js';
import { formatDate, isOverdue } from '../utils/dateUtils.js';

export class Card {
    constructor(title, description = '', startDate = '', endDate = '') {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.element = this.createElement();
    }

    createElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        
        if (this.endDate && isOverdue(this.endDate)) {
            card.classList.add('overdue');
        }

        card.innerHTML = `
            <div class="card-header">
                <h3 contenteditable="true" spellcheck="false">${this.title}</h3>
                <div class="card-actions">
                    <button class="delete-card-btn" title="Eliminar tarjeta">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="card-description" contenteditable="true" spellcheck="false" 
                    data-placeholder="Añadir descripción...">${this.description}</div>
            </div>
            <div class="card-dates">
                ${this.startDate ? `
                    <div class="date-range">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(this.startDate)}</span>
                    </div>` : ''}
                ${this.endDate ? `
                    <div class="date-range">
                        <i class="fas fa-calendar-check"></i>
                        <span>${formatDate(this.endDate)}</span>
                    </div>` : ''}
            </div>
        `;

        this.setupEventListeners(card);
        return card;
    }

    setupEventListeners(card) {
        const title = card.querySelector('h3');
        const description = card.querySelector('.card-description');
        const deleteBtn = card.querySelector('.delete-card-btn');

        title.addEventListener('blur', () => {
            this.title = title.textContent;
        });

        description.addEventListener('blur', () => {
            this.description = description.textContent;
        });

        deleteBtn.addEventListener('click', () => {
            card.remove();
        });

        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    }

    getElement() {
        return this.element;
    }

    getData() {
        return {
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate
        };
    }
} 