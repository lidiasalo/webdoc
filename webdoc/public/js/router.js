// router.js
import { handleAudioPlayback, stopCurrentAudio } from './audioManager.js';

let lastView = null;
let autoScrollInterval;
let sliderIsRunning = false;
let resumeSliderAfterPanel = false;
const FADE_MS = 600;   // duración de cada item al entrar/salir
const STAG_MS = 300;   // separación entre items (como en tu open)


window.navigateTo = navigateTo;

function navigateTo(view) {
  const nextView = view;
  const currentView = lastView || (location.hash ? location.hash.substring(1) : 'webdoc');

  console.log(`🔁 Navegando de ${currentView} → ${nextView}`);

  // ✅ Parar el audio actual
  stopCurrentAudio();

  // Actualizar la ruta
  window.location.hash = nextView;
  lastView = nextView;

  // Cargar la nueva vista
  loadScene(nextView).then(() => {
    // Reproducción de audio asociada a la vista
    handleAudioPlayback(nextView);

    // Inicialización de slider si existe
    if (document.querySelector('.slider-content')) {
      import('./slider.js')
        .then(module => {
          module.initSlider({
            view: nextView,
            onStart(interval) {
              autoScrollInterval = interval;
              sliderIsRunning = true;
            },
            onStop() {
              sliderIsRunning = false;
            },
            exposeStart(fn) {
              window.startAutoScroll = fn;
            }
          });
        })
        .catch(err => console.error("❌ Error cargando slider.js", err));
    }

    // Ejecutar función específica si está definida
    const fnName = `onLoad_${nextView}`;
    if (typeof window[fnName] === 'function') {
      window[fnName]();
    }
  });
}

function loadScene(view) {
  console.log(`🔄 Cargando escena: ${view}`);
  const extension = view === 'camera' ? 'php' : 'html';
  const path = `components/${view}.${extension}`;

  return fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`No se encontró: ${path}`);
      return res.text();
    })
    .then(html => {
      document.getElementById("scene-container").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("scene-container").innerHTML = `<p>Error cargando escena: ${view}</p>`;
      console.error(err);
    });
}

function handleHashChange() {
  const view = location.hash ? location.hash.substring(1) : "webdoc";
  navigateTo(view);
}

function openPanel(contentType) {
  const panel = document.getElementById('side-panel');
  const content = document.getElementById('panel-content');

  resumeSliderAfterPanel = sliderIsRunning;
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  sliderIsRunning = false;

   // 1) Mostrar panel (quitar display:none)
  panel.classList.remove('hidden');

  // 2) Asegurar estado inicial off-screen y forzar reflow
  panel.classList.remove('active');
  void panel.offsetWidth; // reflow

  // 3) Slide-in
  panel.classList.add('active');


  fetch('data/panelContent.json')
    .then(response => response.json())
    .then(data => {
      const section = data[contentType] || { title: "Panel", content: ["Contenido no definido."] };
      console.log(`🔍 Cargando contenido del panel: ${contentType}`, section);
      const html = `
        <h2>${section.title}</h2>
        ${section.content.map(p => p).join('')}
      `;

      content.innerHTML = html;

     requestAnimationFrame(() => {
        const children = content.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i];
          el.style.animation = 'none';
          // reflow para resetear
          void el.offsetHeight;
          el.style.opacity = 0;
          el.style.animation = `fadeUp ${FADE_MS}ms ease forwards`;
          el.style.animationDelay = `${i * STAG_MS}ms`;
        }
      });
    })
    .catch(err => {
      console.error("Error cargando panelContent.json", err);
      content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido.</p>`;
    });
}

function closePanel() {
  const p = document.getElementById('side-panel');
  console.log('classes antes:', p.className, 'transition:', getComputedStyle(p).transitionProperty);
  p.classList.remove('active');
  console.log('transform tras quitar active:', getComputedStyle(p).transform);
}

window.stopCurrentAudio = stopCurrentAudio;
window.navigateTo = navigateTo;
window.openPanel = openPanel;
window.closePanel = closePanel;

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("DOMContentLoaded", handleHashChange);
