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

  if (container.dataset.inited === '1') return;
  container.dataset.inited = '1';


  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  firstClone.dataset.clone = "first";
  lastClone.dataset.clone = "last";


  container.innerHTML = '';
  container.appendChild(lastClone);
  originalSlides.forEach(s => container.appendChild(s));
  container.appendChild(firstClone);

  const slides = Array.from(container.querySelectorAll('.slide'));


  slides.forEach(sl => {
    const img = sl.querySelector('img');
    if (img && img.src) { const i = new Image(); i.src = img.src; }
  });

  container.style.transition = 'none';
  container.style.transform = `translateX(-${currentSlide * 100}%)`;

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

    if (slides[currentSlide]?.dataset.clone === "first") {
      currentSlide = 1;
      container.style.transition = 'none';
      container.style.transform = `translateX(-${currentSlide * 100}%)`;

      requestAnimationFrame(() => { container.style.transition = 'transform 0.5s ease-in-out'; });
    } else if (slides[currentSlide]?.dataset.clone === "last") {
      currentSlide = slides.length - 2;
      container.style.transition = 'none';
      container.style.transform = `translateX(-${currentSlide * 100}%)`;
      requestAnimationFrame(() => { container.style.transition = 'transform 0.5s ease-in-out'; });
    }
  }


  document.querySelector('.prev')?.addEventListener('click', () => changeSlide(-1));
  document.querySelector('.next')?.addEventListener('click', () => changeSlide(1));


  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });

  window.addEventListener('resize', () => {
    const wasTransition = container.style.transition;
    container.style.transition = 'none';
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
    requestAnimationFrame(() => { container.style.transition = wasTransition || 'transform 0.5s ease-in-out'; });
  });

  if (typeof options.exposeStart === 'function') options.exposeStart(() => { });
  if (typeof options.onStop === 'function') {
    window.stopAutoScroll = () => { options.onStop(); };
  }
}
