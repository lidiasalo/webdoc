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
  container.style.transform = `translateX(-${currentSlide * 100}vw)`;

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

  function startAutoScroll(speed = 4000) {
  autoScrollInterval = setInterval(() => {
    changeSlide(1);
  }, speed);
  sliderIsRunning = true;
  if (typeof options.onStart === 'function') {
    options.onStart(autoScrollInterval);
  }
}
const view = options.view || '';
const autoScrollSpeed = (view === 'camera') ? 1500 : 4000;

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }
  const images = container.querySelectorAll('.slide img');

  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      if (autoScrollInterval) {
        console.log("Pausando slider al pasar el ratón por la imagen");
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        sliderIsRunning = false;
      }
    });
  
    img.addEventListener('mouseleave', () => {
      if (!autoScrollInterval) {
        console.log("Reanudando slider al salir de la imagen");
        startAutoScroll();
      }
    });
  });
  // Exponer startAutoScroll externamente
  if (typeof options.exposeStart === 'function') {
    options.exposeStart(startAutoScroll);
  }

  // Avisar que se detiene desde fuera
  if (typeof options.onStop === 'function') {
    window.stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
      sliderIsRunning = false;
      options.onStop();
    };
  }

  // Controles
  document.querySelector('.prev')?.addEventListener('click', () => {
    changeSlide(-1);
    resetAutoScroll();
  });

  document.querySelector('.next')?.addEventListener('click', () => {
    changeSlide(1);
    resetAutoScroll();
  });

  startAutoScroll(autoScrollSpeed);
}
