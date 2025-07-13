let autoScrollInterval = null;
let sliderIsRunning = false;

export function initSlider(options = {}) {
  let currentSlide = 1;

  const container = document.querySelector('.slider-content');
  const originalSlides = Array.from(document.querySelectorAll('.slide'));
  if (!container || originalSlides.length === 0) {
    console.warn("Slider no inicializado: faltan elementos.");
    return;
  }

  // Clonado de slides
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.dataset.clone = "first";
  lastClone.dataset.clone = "last";

  container.innerHTML = '';
  container.appendChild(lastClone);
  originalSlides.forEach(slide => container.appendChild(slide));
  container.appendChild(firstClone);

  const slides = Array.from(container.querySelectorAll('.slide'));
container.style.width = `${slides.length * 100}vw`;
container.style.transition = 'none';
container.style.transform = `translateX(-${currentSlide * 100}vw)`;

void container.offsetWidth; // ⚠️ fuerza reflow

container.style.transition = 'transform 0.5s ease-in-out';

  // Precarga
  container.querySelectorAll('img').forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });

  function changeSlide(direction = 1) {
    if (container.classList.contains('transitioning')) return;

    currentSlide += direction;
    container.classList.add('transitioning');
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(-${currentSlide * 100}vw)`;

    container.addEventListener('transitionend', handleTransitionEnd, { once: true });
  }

  function handleTransitionEnd() {
    container.classList.remove('transitioning');

    if (slides[currentSlide].dataset.clone === "first") {
      currentSlide = 1;
      container.style.transition = 'none';
      container.style.transform = `translateX(-${currentSlide * 100}vw)`;
    }

    if (slides[currentSlide].dataset.clone === "last") {
      currentSlide = slides.length - 2;
      container.style.transition = 'none';
      container.style.transform = `translateX(-${currentSlide * 100}vw)`;
    }
  }

  // Exponer startAutoScroll externamente (aunque ya no se usa auto scroll)
  if (typeof options.exposeStart === 'function') {
    options.exposeStart(() => {});
  }

  if (typeof options.onStop === 'function') {
    window.stopAutoScroll = () => {
      options.onStop();
    };
  }

  // Controles con botones
  document.querySelector('.prev')?.addEventListener('click', () => {
    changeSlide(-1);
  });

  document.querySelector('.next')?.addEventListener('click', () => {
    changeSlide(1);
  });

  // Controles con teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
      changeSlide(1);
    }
  });
} 
