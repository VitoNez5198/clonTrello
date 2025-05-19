export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Intersection Observer para lazy loading
export function createIntersectionObserver(callback, options = {}) {
    return new IntersectionObserver(callback, {
        root: null,
        rootMargin: '20px',
        threshold: 0.1,
        ...options
    });
}

// Optimización de localStorage
let saveTimeout;
export function debouncedSaveToLocalStorage(saveFunction) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFunction, 1000);
} 