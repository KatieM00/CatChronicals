/**
 * Core Game Engine for Cat Chronicles
 * Handles initialization, game loop, and scene management
 */
export class GameEngine {
  constructor() {
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.targetFPS = 60;
    this.frameInterval = 1000 / this.targetFPS;
    
    // Core systems
    this.currentScene = null;
    this.gameContainer = null;
    this.layers = {};
    
    // Bind methods to maintain context
    this.gameLoop = this.gameLoop.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  /**
   * Initialize the game engine and set up core systems
   */
  async init() {
    try {
      console.log('Initializing Cat Chronicles Game Engine...');
      
      // Get game container and layers
      this.gameContainer = document.getElementById('game-container');
      if (!this.gameContainer) {
        throw new Error('Game container not found');
      }

      // Initialize layer references
      this.layers = {
        background: document.getElementById('background-layer'),
        catSprite: document.getElementById('cat-sprite-layer'),
        dialogue: document.getElementById('dialogue-layer'),
        ui: document.getElementById('ui-layer')
      };

      // Verify all layers exist
      for (const [name, layer] of Object.entries(this.layers)) {
        if (!layer) {
          throw new Error(`Layer '${name}' not found`);
        }
      }

      // Set up event listeners
      this.setupEventListeners();

      // Initialize responsive design
      this.handleResize();

      console.log('Game Engine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Game Engine:', error);
      return false;
    }
  }

  /**
   * Set up event listeners for window events
   */
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    
    // Handle visibility change for performance optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  /**
   * Handle window resize for responsive design
   */
  handleResize() {
    // Update viewport dimensions
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Dispatch resize event for components
    this.gameContainer.dispatchEvent(new CustomEvent('gameResize', {
      detail: viewport
    }));
  }

  /**
   * Start the game engine and begin the game loop
   */
  start() {
    if (this.isRunning) {
      console.warn('Game Engine is already running');
      return;
    }

    console.log('Starting Game Engine...');
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Stop the game engine
   */
  stop() {
    console.log('Stopping Game Engine...');
    this.isRunning = false;
  }

  /**
   * Pause the game engine
   */
  pause() {
    if (!this.isRunning) return;
    console.log('Pausing Game Engine...');
    this.isRunning = false;
  }

  /**
   * Resume the game engine
   */
  resume() {
    if (this.isRunning) return;
    console.log('Resuming Game Engine...');
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Main game loop - handles update and render cycles
   */
  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // Calculate delta time
    this.deltaTime = currentTime - this.lastFrameTime;

    // Only update if enough time has passed (60fps throttling)
    if (this.deltaTime >= this.frameInterval) {
      // Update game logic
      this.update(this.deltaTime);

      // Render the current frame
      this.render();

      // Update last frame time
      this.lastFrameTime = currentTime - (this.deltaTime % this.frameInterval);
    }

    // Continue the game loop
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Update game logic
   * @param {number} deltaTime - Time elapsed since last frame
   */
  update(deltaTime) {
    // Update current scene if it exists
    if (this.currentScene && typeof this.currentScene.update === 'function') {
      this.currentScene.update(deltaTime);
    }

    // Update any global systems here
    this.updateAnimations(deltaTime);
  }

  /**
   * Render the current frame
   */
  render() {
    // Render current scene if it exists
    if (this.currentScene && typeof this.currentScene.render === 'function') {
      this.currentScene.render();
    }
  }

  /**
   * Update CSS animations and transitions
   * @param {number} deltaTime - Time elapsed since last frame
   */
  updateAnimations(deltaTime) {
    // Handle any custom animation updates here
    // CSS animations are handled by the browser, but we can
    // manage custom JavaScript animations if needed
  }

  /**
   * Set the current scene
   * @param {Object} scene - Scene object with update and render methods
   */
  setScene(scene) {
    // Clean up previous scene
    if (this.currentScene && typeof this.currentScene.cleanup === 'function') {
      this.currentScene.cleanup();
    }

    // Set new scene
    this.currentScene = scene;

    // Initialize new scene
    if (this.currentScene && typeof this.currentScene.init === 'function') {
      this.currentScene.init(this);
    }

    console.log('Scene changed:', scene.constructor.name || 'Unknown Scene');
  }

  /**
   * Get a reference to a specific layer
   * @param {string} layerName - Name of the layer
   * @returns {HTMLElement|null} Layer element
   */
  getLayer(layerName) {
    return this.layers[layerName] || null;
  }

  /**
   * Clear all layers
   */
  clearLayers() {
    Object.values(this.layers).forEach(layer => {
      if (layer) {
        layer.innerHTML = '';
        layer.className = layer.className.split(' ')[0]; // Keep base class
      }
    });
  }

  /**
   * Clean up resources and event listeners
   */
  cleanup() {
    console.log('Cleaning up Game Engine...');
    
    this.stop();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    
    // Clean up current scene
    if (this.currentScene && typeof this.currentScene.cleanup === 'function') {
      this.currentScene.cleanup();
    }
    
    // Clear layers
    this.clearLayers();
  }
}

// Export singleton instance
export const gameEngine = new GameEngine();