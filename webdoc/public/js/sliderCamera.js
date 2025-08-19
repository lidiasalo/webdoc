let autoScrollInterval = null;
let sliderIsRunning = false;

export function initSlider(options = {}) {
  let currentSlide = 1;

  const container = document.querySelector('.slider-content-camera');
  const originalSlides = Array.from(document.querySelectorAll('.slide-camera'));
  if (!container || originalSlides.length === 0) {
    console.warn("Slider no inicializado: faltan elementos.");
    return;
  }

  // Evitar re-inits que duplican clones
  if (container.dataset.inited === '1') return;
  container.dataset.inited = '1';

  // Clonado de extremos
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone  = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.dataset.clone = "first";
  lastClone.dataset.clone  = "last";

  // Montaje: [lastClone][...originales][firstClone]
  container.innerHTML = '';
  container.appendChild(lastClone);
  originalSlides.forEach(s => container.appendChild(s));
  container.appendChild(firstClone);

  const slides = Array.from(container.querySelectorAll('.slide'));

  // Precarga simple (no bloqueante)
  slides.forEach(sl => {
    const img = sl.querySelector('img');
    if (img && img.src) { const i = new Image(); i.src = img.src; }
  });

  // Posición inicial SIN transición (slide 1 = primer original)
  container.style.transition = 'none';
  container.style.transform  = `translateX(-${currentSlide * 100}%)`;

  // Asegurar que el navegador aplica el estado inicial antes de activar la transición
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.style.transition = 'transform 0.5s ease-in-out';
    });
  });

  function changeSlide(direction = 1) {
    if (container.classList.contains('transitioning')) return;
    container.classList.add('transitioning');

    currentSlide += direction;
    container.style.transform = `translateX(-${currentSlide * 100}%)`;

    container.addEventListener('transitionend', handleTransitionEnd, { once: true });
  }

  function handleTransitionEnd(e) {
    if (e.propertyName !== 'transform') return;
    container.classList.remove('transitioning');

    // Saltos en clones sin animación
    if (slides[currentSlide]?.dataset.clone === "first") {
      currentSlide = 1;
      container.style.transition = 'none';
      container.style.transform  = `translateX(-${currentSlide * 100}%)`;
      // reactivar transición en el próximo frame
      requestAnimationFrame(() => { container.style.transition = 'transform 0.5s ease-in-out'; });
    } else if (slides[currentSlide]?.dataset.clone === "last") {
      currentSlide = slides.length - 2;
      container.style.transition = 'none';
      container.style.transform  = `translateX(-${currentSlide * 100}%)`;
      requestAnimationFrame(() => { container.style.transition = 'transform 0.5s ease-in-out'; });
    }
  }

  // Botones
  document.querySelector('.prev')?.addEventListener('click', () => changeSlide(-1));
  document.querySelector('.next')?.addEventListener('click', () => changeSlide(1));

  // Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  // (Opcional) re-colocar al hacer resize brusco
  window.addEventListener('resize', () => {
    const wasTransition = container.style.transition;
    container.style.transition = 'none';
    container.style.transform  = `translateX(-${currentSlide * 100}%)`;
    requestAnimationFrame(() => { container.style.transition = wasTransition || 'transform 0.5s ease-in-out'; });
  });

  // Exponer callbacks que ya usabas
  if (typeof options.exposeStart === 'function') options.exposeStart(() => {});
  if (typeof options.onStop === 'function') {
    window.stopAutoScroll = () => { options.onStop(); };
  }
}
