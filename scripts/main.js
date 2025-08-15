// Guard module execution
function init() {
    console.log('Cat Chronicles initializing...');
    
    // Safety guard: ensure no containers are hidden
    ['html','body','#app','#root','#background-layer','#ui-layer'].forEach(function(sel) {
        var el = document.querySelector(sel);
        if (!el) return;
        el.classList.remove('hidden');
        el.removeAttribute('hidden');
        el.style.removeProperty('display');
        el.style.removeProperty('visibility');
        el.style.removeProperty('opacity');
    });
    
    var backgroundLayer = document.getElementById('background-layer');
    
    if (backgroundLayer) {
        backgroundLayer.innerHTML = 
            '<div class="parallax-container">' +
                '<div class="parallax-layer parallax-far" data-speed="0.2" style="background: linear-gradient(135deg, #C4704F 0%, #F4E4BC 50%, #2C5F7A 100%); opacity: 0.6;"></div>' +
                '<div class="parallax-layer parallax-mid" data-speed="0.5" style="background-image: url(\'./Backgrounds/tombHall.png\'); background-size: cover; background-position: center;"></div>' +
                '<div class="parallax-layer parallax-near" data-speed="0.8"></div>' +
                '<div class="hotspots-overlay">' +
                    '<div class="hotspot" style="left: 25%; top: 35%;" onclick="alert(\'Hieroglyphics found!\')"></div>' +
                    '<div class="hotspot" style="left: 60%; top: 50%;" onclick="alert(\'Treasure discovered!\')"></div>' +
                    '<div class="hotspot" style="left: 80%; top: 70%;" onclick="alert(\'Ancient tablet!\')"></div>' +
                '</div>' +
            '</div>';

        var mouseX = 0;
        var mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
            var rect = backgroundLayer.getBoundingClientRect();
            mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width * 30;
            mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height * 20;
            
            var layers = document.querySelectorAll('.parallax-layer');
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                var speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
                layer.style.transform = 'translate3d(' + (mouseX * speed) + 'px, ' + (mouseY * speed) + 'px, 0)';
            }
        });
    }
    console.log('Cat Chronicles initialized');
}

// Safe initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}