/* campus-images.js
   Enhances .branch-image containers by converting multiple <img> children
   into a responsive slideshow with lazy loading, captions (from alt),
   controls (prev/next), dots, autoplay and pause-on-hover.
*/
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Inject minimal CSS required for the galleries
    const css = `
    .bnuts-gallery{position:relative; overflow:hidden; width:100%; height:100%;}
    .bnuts-slides-wrapper{display:flex; width:100%; height:100%; transition:transform 0.45s ease; will-change:transform}
    .bnuts-slide{min-width:100%; height:100%; position:relative; display:block; flex:0 0 100%;}
    .bnuts-slide img{display:block; width:100%; height:100%; object-fit:cover; vertical-align:middle}
    .bnuts-caption{position:absolute; left:12px; right:12px; bottom:10px; background:rgba(0,0,0,0.45); color:#fff; padding:6px 10px; border-radius:6px; font-size:0.85rem; max-width:calc(100% - 24px);}
    .bnuts-controls{position:absolute; top:50%; transform:translateY(-50%); width:100%; display:flex; justify-content:space-between; pointer-events:none}
    .bnuts-controls button{pointer-events:auto; background:rgba(0,0,0,0.45); color:#fff; border:0; padding:8px 10px; border-radius:6px; margin:0 8px; cursor:pointer}
    .bnuts-dots{position:absolute; left:50%; transform:translateX(-50%); bottom:8px; display:flex; gap:6px}
    .bnuts-dot{width:9px; height:9px; border-radius:50%; background:rgba(255,255,255,0.6); border:0; cursor:pointer}
    .bnuts-dot.active{background:#FFD700}
    `;

    const style = document.createElement('style');
    style.setAttribute('data-generated', 'bnuts-campus-gallery');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const containers = document.querySelectorAll('.branch-image');
    containers.forEach((container, idx) => {
      const imgs = Array.from(container.querySelectorAll('img'));
      if (!imgs.length) return; // nothing to do

      // Create gallery structure
      const gallery = document.createElement('div');
      gallery.className = 'bnuts-gallery';

      const wrapper = document.createElement('div');
      wrapper.className = 'bnuts-slides-wrapper';

      // Move images into slides
      imgs.forEach((img) => {
        img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
        img.classList.add('bnuts-img');
        const slide = document.createElement('div');
        slide.className = 'bnuts-slide';
        // Preserve alt for caption
        const alt = img.getAttribute('alt') || '';
        slide.appendChild(img);
        if (alt.trim()) {
          const cap = document.createElement('div');
          cap.className = 'bnuts-caption';
          cap.textContent = alt;
          slide.appendChild(cap);
        }
        wrapper.appendChild(slide);
      });

      // Clear original container and add gallery
      container.innerHTML = '';
      gallery.appendChild(wrapper);

      // Controls and dots only if more than 1 image
      const slides = Array.from(wrapper.children);
      let current = 0;
      let intervalId = null;

      function show(index) {
        index = (index + slides.length) % slides.length;
        current = index;
        wrapper.style.transform = `translateX(${-index * 100}%)`;
        // update dots
        if (dots) {
          dots.querySelectorAll('.bnuts-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
          });
        }
      }

      let dots = null;
      if (slides.length > 1) {
        const controls = document.createElement('div');
        controls.className = 'bnuts-controls';
        const prev = document.createElement('button');
        prev.type = 'button';
        prev.setAttribute('aria-label', 'Previous image');
        prev.innerHTML = '&#10094;';
        const next = document.createElement('button');
        next.type = 'button';
        next.setAttribute('aria-label', 'Next image');
        next.innerHTML = '&#10095;';
        controls.appendChild(prev);
        controls.appendChild(next);
        gallery.appendChild(controls);

        // Dots
        dots = document.createElement('div');
        dots.className = 'bnuts-dots';
        slides.forEach((s, i) => {
          const d = document.createElement('button');
          d.className = 'bnuts-dot';
          d.type = 'button';
          d.setAttribute('aria-label', `Go to slide ${i + 1}`);
          d.addEventListener('click', () => {
            show(i);
            restartAutoPlay();
          });
          dots.appendChild(d);
        });
        gallery.appendChild(dots);

        prev.addEventListener('click', () => { show(current - 1); restartAutoPlay(); });
        next.addEventListener('click', () => { show(current + 1); restartAutoPlay(); });

        // Keyboard support
        gallery.tabIndex = 0;
        gallery.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') { show(current - 1); restartAutoPlay(); }
          if (e.key === 'ArrowRight') { show(current + 1); restartAutoPlay(); }
        });

        // Auto-play
        function startAutoPlay() {
          if (intervalId) return;
          intervalId = setInterval(() => { show(current + 1); }, 4000);
        }
        function stopAutoPlay() { if (intervalId) { clearInterval(intervalId); intervalId = null; } }
        function restartAutoPlay() { stopAutoPlay(); startAutoPlay(); }

        gallery.addEventListener('mouseenter', stopAutoPlay);
        gallery.addEventListener('focusin', stopAutoPlay);
        gallery.addEventListener('mouseleave', startAutoPlay);
        gallery.addEventListener('focusout', startAutoPlay);

        startAutoPlay();
      }

      container.appendChild(gallery);
      // show first and activate dot
      show(0);
    });
  });
})();
