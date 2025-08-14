/**
 * Base Component Class
 * Provides common functionality for all game components
 */
export class BaseComponent {
  constructor(element = null) {
    this.element = element;
    this.isInitialized = false;
    this.eventListeners = new Map();
  }

  /**
   * Initialize the component
   */
  init() {
    if (this.isInitialized) {
      console.warn(`Component ${this.constructor.name} is already initialized`);
      return;
    }

    this.isInitialized = true;
    console.log(`Component ${this.constructor.name} initialized`);
  }

  /**
   * Update component logic
   * @param {number} deltaTime - Time elapsed since last frame
   */
  update(deltaTime) {
    // Override in subclasses
  }

  /**
   * Render component
   */
  render() {
    // Override in subclasses
  }

  /**
   * Add event listener with automatic cleanup tracking
   * @param {HTMLElement} element - Element to attach listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  addEventListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    // Track for cleanup
    const key = `${element.tagName}-${event}`;
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, event, handler, options });
  }

  /**
   * Remove all tracked event listeners
   */
  removeAllEventListeners() {
    for (const listeners of this.eventListeners.values()) {
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }
    this.eventListeners.clear();
  }

  /**
   * Show the component
   */
  show() {
    if (this.element) {
      this.element.classList.remove('hidden');
      this.element.classList.add('fade-in');
    }
  }

  /**
   * Hide the component
   */
  hide() {
    if (this.element) {
      this.element.classList.add('fade-out');
      setTimeout(() => {
        this.element.classList.add('hidden');
        this.element.classList.remove('fade-out');
      }, 300); // Match CSS animation duration
    }
  }

  /**
   * Clean up component resources
   */
  cleanup() {
    console.log(`Cleaning up component ${this.constructor.name}`);
    
    this.removeAllEventListeners();
    
    if (this.element) {
      this.element.innerHTML = '';
    }
    
    this.isInitialized = false;
  }

  /**
   * Create DOM element with classes and attributes
   * @param {string} tag - HTML tag name
   * @param {Object} options - Element options
   * @returns {HTMLElement} Created element
   */
  createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.classes) {
      element.className = Array.isArray(options.classes) 
        ? options.classes.join(' ') 
        : options.classes;
    }
    
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    
    return element;
  }
}