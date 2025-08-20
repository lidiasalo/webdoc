// --- Audio Router con LOGS: transiciones + vistas intermedias ---

let currentAudio = null;
let lastTrackId = null;
let userInteracted = false;
let navDebounce = null;
console.log("🎧 Audio Router iniciado");

// Marca interacción (autoplay policy)
['pointerdown','touchstart','keydown','click'].forEach(evt => {
  window.addEventListener(evt, () => { 
    userInteracted = true; 
    console.log("👆 Usuario interactuó, audio habilitado");
  }, { once: true });
});

// Mapa de VISTAS → archivo de audio
const VIEW_AUDIO_MAP = {
  webdoc:            'assets/audio/index.mp3',
  objects:           'assets/audio/bloques1.mp3',
  therapySeries:     'assets/audio/bloques2.mp3',
  boxes:             'assets/audio/bloques3.mp3',
  therapyIndividual: 'assets/audio/bloques4.mp3',
  camera:            'assets/audio/bloques5.mp3',
};

// --- TRANSICIONES ---
const SECTION_DEFAULT_TRACK = 'index';
const AUDIO_ROUTES = { transitions: 'assets/audio/transitions' };

function resolveTransitionFromHash(hashStr) {
  if (!hashStr) return null;
  const clean = hashStr.replace(/^#/, '').split('?')[0].replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] !== 'transitions') return null;

  const trackName = (parts[parts.length - 1] || SECTION_DEFAULT_TRACK);
  const path = `${AUDIO_ROUTES.transitions}/${trackName}.mp3`;
  const id = `transition::${trackName}`;
  console.log("🎯 Detectada transición:", { hash: hashStr, path, id });
  return { path, id };
}

// --- Core ---
function stopCurrentAudio(resetId = false) {
  if (currentAudio) {
    try { 
      currentAudio.pause(); 
      currentAudio.currentTime = 0; 
      console.log("⏹️ Audio detenido"); 
    } catch (e) {
      console.warn("⚠️ Error al detener audio:", e);
    }
  }
  currentAudio = null;
  if (resetId) {
    console.log("🧹 Reset lastTrackId");
    lastTrackId = null;
  }
}

async function playPath(path, id) {
  if (!userInteracted || localStorage.getItem('audioAutorizado') !== '1') {
    console.log("🚫 No autorizado aún, no se reproduce:", { path, id });
    return;
  }
  if (!path) {
    console.log("❌ Sin path de audio");
    return;
  }
  if (id === lastTrackId) {
    console.log("🔁 Mismo track que ya sonaba, no se repite:", id);
    return;
  }

  stopCurrentAudio(); 
  currentAudio = new Audio(path);
  lastTrackId = id;

  try { 
    await currentAudio.play(); 
    console.log("🔊 Reproduciendo:", path, "ID:", id); 
  }
  catch (e) { 
    console.warn("⚠️ No se pudo reproducir", path, e); 
  }
}

// --- VISTAS ---
function detectViewFromHash(hashStr) {
  if (!hashStr) return null;
  const clean = hashStr.replace(/^#/, '').split('?')[0].replace(/\/+$/, '');
  const parts = clean.split('/').filter(Boolean);
  const candidate = parts[0]; 
  if (VIEW_AUDIO_MAP.hasOwnProperty(candidate)) {
    console.log("🎯 Detectada vista:", candidate, "→", VIEW_AUDIO_MAP[candidate]);
    return candidate;
  }
  console.log("❓ Vista no reconocida en hash:", hashStr);
  return null;
}

async function playViewAudio(viewName) {
  const path = VIEW_AUDIO_MAP[viewName];
  if (!path) { 
    console.log("❌ Vista sin audio definido:", viewName);
    stopCurrentAudio(true); 
    return; 
  }
  console.log("🎵 Reproduciendo audio de vista:", viewName, "→", path);
  await playPath(path, `view::${viewName}`);
}

window.setCurrentView = (viewName) => {
  console.log("📌 setCurrentView llamado:", viewName);
  playViewAudio(viewName);
};

// --- Navegación ---
function handleRouteChange() {
  clearTimeout(navDebounce);
  navDebounce = setTimeout(async () => {
    console.log("🔀 HashChange →", location.hash);

    const tx = resolveTransitionFromHash(location.hash);
    if (tx) {
      await playPath(tx.path, tx.id);
      return;
    }

    const view = detectViewFromHash(location.hash);
    if (view) {
      await playViewAudio(view);
    } else {
      console.log("🛑 Ruta sin audio definido, silencio");
      stopCurrentAudio(true);
    }
  }, 30);
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('popstate', handleRouteChange);

document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ DOM listo, chequeo inicial de audio");
  setTimeout(() => handleRouteChange(), 50);
});
