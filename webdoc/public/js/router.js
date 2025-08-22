// router.js
import { handleAudioPlayback, stopCurrentAudio } from './audioManager.js';

let lastView = null;
let autoScrollInterval;
let sliderIsRunning = false;
let resumeSliderAfterPanel = false;

const FADE_MS = 600;
const STAG_MS = 300;

window.navigateTo = navigateTo;
window.stopCurrentAudio = stopCurrentAudio;
window.openPanel = openPanel;
window.closePanel = closePanel;

function clearAutoScroll() {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
  autoScrollInterval = null;
  sliderIsRunning = false;
}

function attachSlider(module, nextView) {
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
}

async function initSliderIf(selector, modulePath, nextView) {
  if (!document.querySelector(selector)) return;
  try {
    const module = await import(modulePath);
    attachSlider(module, nextView);
  } catch (_) {
    // silencioso
  }
}

async function navigateTo(view) {
  const nextView = view;
  const currentView = lastView || 'webdoc';

  stopCurrentAudio();

  // ✅ mantenemos siempre la URL limpia (solo "/")
  history.replaceState({ view: nextView }, "", "/");
  lastView = nextView;

  await loadScene(nextView);

  handleAudioPlayback(nextView);

  await initSliderIf('.slider-content', './slider.js', nextView);
  await initSliderIf('.slider-content-camera', './sliderCamera.js', nextView);

  const fnName = `onLoad_${nextView}`;
  if (typeof window[fnName] === 'function') {
    try { window[fnName](); } catch (_) { /* silencioso */ }
  }
}

async function loadScene(view) {
  const extension = view === 'camera' ? 'php' : 'html';
  const path = `components/${view}.${extension}`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error();
    const html = await res.text();
    document.getElementById('scene-container').innerHTML = html;
  } catch (_) {
    document.getElementById('scene-container').innerHTML = `<p>Error cargando escena: ${view}</p>`;
  }
}

function handleStart() {
  const initialView = lastView || 'webdoc';
  navigateTo(initialView);
}

function openPanel(contentType) {
  const panel = document.getElementById('side-panel');
  const content = document.getElementById('panel-content');

  resumeSliderAfterPanel = sliderIsRunning;
  clearAutoScroll();

  panel.classList.remove('hidden');
  panel.classList.remove('active');
  void panel.offsetWidth; // reflow
  panel.classList.add('active');

  fetch('data/panelContent.json')
    .then(r => r.json())
    .then(data => {
      const section = data[contentType] || { title: 'Panel', content: ['<p>Contenido no definido.</p>'] };
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
          void el.offsetHeight; // reset
          el.style.opacity = 0;
          el.style.animation = `fadeUp ${FADE_MS}ms ease forwards`;
          el.style.animationDelay = `${i * STAG_MS}ms`;
        }
      });
    })
    .catch(() => {
      content.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido.</p>`;
    });
}

function closePanel() {
  const panel = document.getElementById('side-panel');
  panel.classList.remove('active');

  if (resumeSliderAfterPanel && typeof window.startAutoScroll === 'function') {
    try { window.startAutoScroll(); } catch (_) { /* silencioso */ }
  }
  resumeSliderAfterPanel = false;
}

// ✅ solo lanzamos la SPA una vez cargado el DOM
window.addEventListener('DOMContentLoaded', handleStart);
