/**
 * Cat Chronicles - Main Entry Point
 * Initializes the game engine and starts the application
 */

import { gameEngine } from './GameEngine.js';

/**
 * Initialize and start the Cat Chronicles game
 */
async function initGame() {
  try {
    console.log('Cat Chronicles - Starting initialization...');

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    // Initialize the game engine
    const initialized = await gameEngine.init();
    
    if (!initialized) {
      throw new Error('Failed to initialize game engine');
    }

    // Start the game engine
    gameEngine.start();

    console.log('Cat Chronicles - Game started successfully!');

    // TODO: Load initial scene (will be implemented in later tasks)
    // For now, just show that the engine is running
    showEngineStatus();

  } catch (error) {
    console.error('Failed to start Cat Chronicles:', error);
    showErrorMessage(error.message);
  }
}

/**
 * Show engine status for debugging (temporary)
 */
function showEngineStatus() {
  const uiLayer = gameEngine.getLayer('ui');
  console.log('UI Layer found:', uiLayer);
  if (uiLayer) {
    uiLayer.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 20px;
        background: #F7F3E3;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Courier New', monospace;
        color: #2C5F7A;
        z-index: 1000;
        max-width: 300px;
      ">
        <h3 style="margin: 0 0 10px 0;">🐱 Cat Chronicles Engine</h3>
        <p style="margin: 5px 0;">✅ Game Engine: Running</p>
        <p style="margin: 5px 0;">✅ Layers: Initialized</p>
        <p style="margin: 5px 0;">✅ Animation System: Ready</p>
        <p style="margin: 5px 0;">⏳ Ready for scene loading...</p>
      </div>
    `;
  }
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: var(--color-papyrus);
        color: var(--color-error);
        font-family: var(--font-body);
        text-align: center;
        padding: var(--spacing-lg);
      ">
        <div>
          <h2>🚫 Game Loading Error</h2>
          <p>${message}</p>
          <button onclick="location.reload()" style="
            margin-top: var(--spacing-md);
            padding: var(--spacing-sm) var(--spacing-md);
            background: var(--color-terracotta);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: var(--font-size-medium);
          ">
            Reload Game
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Handle unhandled errors
 */
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  showErrorMessage('An unexpected error occurred. Please reload the game.');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showErrorMessage('An unexpected error occurred. Please reload the game.');
});

// Start the game
initGame();