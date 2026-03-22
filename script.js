// ═══════════════════════════════════════════════
// LED HOTSPOTS
// ═══════════════════════════════════════════════
const heroImg = document.querySelector('.hero-img');
const hotspots = document.querySelector('.led-hotspots');
const base = 'assets/photos/leds.png';

if (heroImg && hotspots) {

  let resetTimeout = null;

  // PRELOAD
  for (let i = 1; i <= 16; i++) {
    const img = new Image();
    img.src = `assets/photos/ledsp${i}.png`;
  }

  // SYNC HOTSPOTS TO ACTUAL IMAGE BOUNDS
  function syncHotspotsToImage() {
    const containerW = heroImg.parentElement.clientWidth;
    const containerH = heroImg.parentElement.clientHeight;
    const naturalW   = heroImg.naturalWidth;
    const naturalH   = heroImg.naturalHeight;

    if (!naturalW || !naturalH) return;

    const containerRatio = containerW / containerH;
    const imageRatio     = naturalW / naturalH;

    let renderedW, renderedH;
    if (containerRatio > imageRatio) {
      renderedW = containerW;
      renderedH = containerW / imageRatio;
    } else {
      renderedH = containerH;
      renderedW = containerH * imageRatio;
    }

    const offsetX = (containerW - renderedW) / 2;
    const offsetY = (containerH - renderedH) * 0.4;

    hotspots.style.width  = renderedW + 'px';
    hotspots.style.height = renderedH + 'px';
    hotspots.style.left   = offsetX + 'px';
    hotspots.style.top    = offsetY + 'px';
  }

  heroImg.addEventListener('load', syncHotspotsToImage);
  window.addEventListener('resize', syncHotspotsToImage);
  if (heroImg.complete && heroImg.naturalWidth) syncHotspotsToImage();

  // HOVER
  document.querySelectorAll('.led-spot').forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      if (resetTimeout) clearTimeout(resetTimeout);
      heroImg.src = `assets/photos/ledsp${spot.dataset.led}.png`;
    });
    spot.addEventListener('mouseleave', () => {
      resetTimeout = setTimeout(() => { heroImg.src = base; }, 60);
    });
  });

  // DEBUG CLICK — logs coordinates to console
  document.querySelector('.hero').addEventListener('click', (e) => {
    const rect = hotspots.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(`left: ${x.toFixed(2)}%; top: ${y.toFixed(2)}%;`);
  });
}

// ═══════════════════════════════════════════════
// WORK FILTER
// ═══════════════════════════════════════════════
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.project-card');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

// ═══════════════════════════════════════════════
// CURTAIN WIPE TRANSITION
// ═══════════════════════════════════════════════
const curtain = document.querySelector('.curtain');

if (curtain) {
  // Reveal on page load
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      curtain.classList.add('reveal');
    });
  });

  // Slide up on internal link click
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      curtain.classList.remove('reveal');
      curtain.classList.add('slide-up');
      setTimeout(() => { window.location.href = href; }, 620);
    });
  });
}