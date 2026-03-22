const heroImg = document.querySelector('.hero-img');
const hotspots = document.querySelector('.led-hotspots');
const base = 'assets/photos/leds.png';

let resetTimeout = null;

// PRELOAD
for (let i = 1; i <= 16; i++) {
  const img = new Image();
  img.src = `assets/photos/ledsp${i}.png`;
}

// ═══════════════════════════════════════════════════════════════════
// SYNC HOTSPOTS TO ACTUAL IMAGE BOUNDS (accounts for object-fit:cover)
// ═══════════════════════════════════════════════════════════════════
function syncHotspotsToImage() {
  const img = heroImg;
  const container = img.parentElement; // .hero-media

  // Get container dimensions
  const containerW = container.clientWidth;
  const containerH = container.clientHeight;

  // Get image natural dimensions
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  if (!naturalW || !naturalH) return; // Image not loaded yet

  // Calculate how object-fit:cover scales the image
  const containerRatio = containerW / containerH;
  const imageRatio = naturalW / naturalH;

  let renderedW, renderedH;

  if (containerRatio > imageRatio) {
    // Container is wider — image scales to fill width, crops top/bottom
    renderedW = containerW;
    renderedH = containerW / imageRatio;
  } else {
    // Container is taller — image scales to fill height, crops left/right
    renderedH = containerH;
    renderedW = containerH * imageRatio;
  }

  // Calculate offset based on object-position: center 40%
  const offsetX = (containerW - renderedW) / 2;          // center
  const offsetY = (containerH - renderedH) * 0.4;        // 40%

  // Apply to hotspots container
  hotspots.style.width = renderedW + 'px';
  hotspots.style.height = renderedH + 'px';
  hotspots.style.left = offsetX + 'px';
  hotspots.style.top = offsetY + 'px';
}

// Run on load and resize
heroImg.addEventListener('load', syncHotspotsToImage);
window.addEventListener('resize', syncHotspotsToImage);

// Initial sync (if image already cached)
if (heroImg.complete && heroImg.naturalWidth) {
  syncHotspotsToImage();
}

// ═══════════════════════════════════════════════════════════════════
// HOVER LOGIC
// ═══════════════════════════════════════════════════════════════════
document.querySelectorAll('.led-spot').forEach(spot => {
  spot.addEventListener('mouseenter', () => {
    if (resetTimeout) clearTimeout(resetTimeout);
    console.log('hovering:', spot.dataset.led);
    heroImg.src = `assets/photos/ledsp${spot.dataset.led}.png`;
  });

  spot.addEventListener('mouseleave', () => {
    resetTimeout = setTimeout(() => {
      heroImg.src = base;
    }, 60);
  });
});

// DEBUG CLICK (optional)
document.querySelector('.hero').addEventListener('click', (e) => {
  const rect = hotspots.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  console.log(`left: ${x.toFixed(2)}%; top: ${y.toFixed(2)}%;`);
});
