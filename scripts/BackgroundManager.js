/**
 * Background Manager for Cat Chronicles
 * Handles dynamic background loading, parallax effects, and interactive hotspots
 */
export class BackgroundManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.backgroundLayer = null;
    this.currentBackground = null;
    this.parallaxLayers = [];
    this.hotspots = [];
    this.backgroundCache = new Map();
    
    // Parallax configuration
    this.parallaxConfig = {
      enabled: true,
      layers: [
        { name: 'far', speed: 0.2, zIndex: 1 },
        { name: 'mid', speed: 0.5, zIndex: 2 },
        { name: 'near', speed: 0.8, zIndex: 3 }
      ]
    };
  }

  /**
   * Initialize the background manager
   */
  init() {
    this.backgroundLayer = this.gameEngine.getLayer('background');
    if (!this.backgroundLayer) {
      throw new Error('Background layer not found');
    }

    // Set up parallax container structure
    this.setupParallaxLayers();
    
    // Set up mouse/touch tracking for parallax
    this.setupParallaxControls();
    
    console.log('BackgroundManager initialized');
  }

  /**
   * Set up parallax layer structure
   */
  setupParallaxLayers() {
    this.backgroundLayer.innerHTML = `
      <div class="parallax-container">
        <div class="parallax-layer parallax-far" data-speed="0.2"></div>
        <div class="parallax-layer parallax-mid" data-speed="0.5"></div>
        <div class="parallax-layer parallax-near" data-speed="0.8"></div>
        <div class="hotspots-overlay"></div>
      </div>
    `;

    // Cache parallax layer references
    this.parallaxLayers = {
      far: this.backgroundLayer.querySelector('.parallax-far'),
      mid: this.backgroundLayer.querySelector('.parallax-mid'),
      near: this.backgroundLayer.querySelector('.parallax-near'),
      hotspots: this.backgroundLayer.querySelector('.hotspots-overlay')
    };
  }

  /**
   * Set up parallax mouse/touch controls
   */
  setupParallaxControls() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateParallax = () => {
      // Smooth interpolation for parallax movement
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Apply parallax transforms to each layer
      Object.entries(this.parallaxLayers).forEach(([name, layer]) => {
        if (name === 'hotspots' || !layer) return;
        
        const speed = parseFloat(layer.dataset.speed) || 0.5;
        const translateX = targetX * speed * 0.5;
        const translateY = targetY * speed * 0.3;
        
        layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });

      requestAnimationFrame(updateParallax);
    };

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      const rect = this.backgroundLayer.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width * 100;
      mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height * 100;
    });

    // Touch movement tracking
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.backgroundLayer.getBoundingClientRect();
        mouseX = (e.touches[0].clientX - rect.left - rect.width / 2) / rect.width * 100;
        mouseY = (e.touches[0].clientY - rect.top - rect.height / 2) / rect.height * 100;
      }
    });

    // Start parallax animation loop
    updateParallax();
  }

  /**
   * Load background from the backgrounds folder
   * @param {string} backgroundName - Name of the background file (without extension)
   * @param {Object} options - Loading options
   */
  async loadBackground(backgroundName, options = {}) {
    const {
      layer = 'mid',
      parallax = true,
      hotspots = [],
      transition = 'fade'
    } = options;

    try {
      // Check cache first
      let backgroundUrl = this.backgroundCache.get(backgroundName);
      
      if (!backgroundUrl) {
        // Try different extensions
        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
        let foundExtension = null;
        
        for (const ext of extensions) {
          const testUrl = `./Backgrounds/${backgroundName}.${ext}`;
          try {
            const response = await fetch(testUrl, { method: 'HEAD' });
            if (response.ok) {
              foundExtension = ext;
              backgroundUrl = testUrl;
              break;
            }
          } catch (e) {
            // Continue trying other extensions
          }
        }
        
        if (!foundExtension) {
          throw new Error(`Background image not found: ${backgroundName}`);
        }
        
        // Cache the successful URL
        this.backgroundCache.set(backgroundName, backgroundUrl);
      }

      // Preload the image
      await this.preloadImage(backgroundUrl);

      // Apply background to specified layer
      const targetLayer = this.parallaxLayers[layer];
      if (!targetLayer) {
        throw new Error(`Parallax layer not found: ${layer}`);
      }

      // Apply transition
      if (transition === 'fade') {
        targetLayer.style.opacity = '0';
        targetLayer.style.backgroundImage = `url(${backgroundUrl})`;
        
        // Trigger fade in
        requestAnimationFrame(() => {
          targetLayer.style.transition = 'opacity 0.5s ease-in-out';
          targetLayer.style.opacity = '1';
        });
      } else {
        targetLayer.style.backgroundImage = `url(${backgroundUrl})`;
      }

      // Set up hotspots if provided
      if (hotspots.length > 0) {
        this.setupHotspots(hotspots);
      }

      this.currentBackground = backgroundName;
      console.log(`Background loaded: ${backgroundName}`);
      
      return true;
    } catch (error) {
      console.error(`Failed to load background: ${backgroundName}`, error);
      return false;
    }
  }

  /**
   * Preload an image to ensure smooth loading
   * @param {string} url - Image URL to preload
   */
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  /**
   * Set up interactive hotspots on the background
   * @param {Array} hotspots - Array of hotspot configurations
   */
  setupHotspots(hotspots) {
    const hotspotsLayer = this.parallaxLayers.hotspots;
    if (!hotspotsLayer) return;

    // Clear existing hotspots
    hotspotsLayer.innerHTML = '';

    hotspots.forEach((hotspot, index) => {
      const hotspotElement = document.createElement('div');
      hotspotElement.className = 'hotspot interactive';
      hotspotElement.setAttribute('data-hotspot-id', hotspot.id || index);
      hotspotElement.setAttribute('aria-label', hotspot.label || 'Interactive hotspot');
      hotspotElement.setAttribute('role', 'button');
      hotspotElement.setAttribute('tabindex', '0');

      // Position the hotspot
      hotspotElement.style.left = `${hotspot.x}%`;
      hotspotElement.style.top = `${hotspot.y}%`;

      // Add click/touch handlers
      const handleActivation = (e) => {
        e.preventDefault();
        if (hotspot.onClick) {
          hotspot.onClick(hotspot, e);
        }
        
        // Dispatch custom event
        hotspotsLayer.dispatchEvent(new CustomEvent('hotspotActivated', {
          detail: { hotspot, element: hotspotElement }
        }));
      };

      hotspotElement.addEventListener('click', handleActivation);
      hotspotElement.addEventListener('touchend', handleActivation);
      
      // Keyboard support
      hotspotElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleActivation(e);
        }
      });

      hotspotsLayer.appendChild(hotspotElement);
    });

    this.hotspots = hotspots;
    console.log(`Set up ${hotspots.length} hotspots`);
  }

  /**
   * Get available backgrounds from the backgrounds folder
   */
  async getAvailableBackgrounds() {
    // This would typically require a server endpoint or build-time generation
    // For now, return known backgrounds
    return ['labIntro', 'tombHall'];
  }

  /**
   * Clear current background and hotspots
   */
  clear() {
    Object.values(this.parallaxLayers).forEach(layer => {
      if (layer) {
        layer.style.backgroundImage = '';
        layer.innerHTML = '';
      }
    });
    
    this.hotspots = [];
    this.currentBackground = null;
  }

  /**
   * Enable or disable parallax effects
   * @param {boolean} enabled - Whether to enable parallax
   */
  setParallaxEnabled(enabled) {
    this.parallaxConfig.enabled = enabled;
    
    if (!enabled) {
      // Reset all transforms
      Object.values(this.parallaxLayers).forEach(layer => {
        if (layer && layer.style) {
          layer.style.transform = 'translate3d(0, 0, 0)';
        }
      });
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.clear();
    this.backgroundCache.clear();
    console.log('BackgroundManager cleaned up');
  }
}