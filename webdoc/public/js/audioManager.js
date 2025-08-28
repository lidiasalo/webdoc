let currentAudio = null;
let userInteracted = false;

window.addEventListener('click', () => {
  userInteracted = true;
}, { once: true });

/**
 * Detiene el audio actual y reinicia su posición
 */
export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

/**
 * Devuelve true si el usuario autorizó y ya interactuó con la página
 */
function isAudioAllowed() {
  return localStorage.getItem('audioAutorizado') === '1' && userInteracted;
}

/**
 * Mapa de vistas a sus rutas de audio
 */
const audioRoutes = {
  menu: "assets/audio/index.mp3",
  objects: "assets/audio/bloques1.mp3",
  therapySeries: "assets/audio/bloques2.mp3",
  boxes: "assets/audio/bloques3.mp3",
  therapyIndividual: "assets/audio/bloques4.mp3",
  camera: "assets/audio/bloques5.mp3"
};

/**
 * Obtiene la ruta del audio según la vista
 */
function getAudioPath(viewName) {
  if (viewName.startsWith("transitions/")) {
    const name = viewName.split("/").pop();
    return `assets/audio/transitions/${name}.mp3`;
  }
  return audioRoutes[viewName] || null;
}

/**
 * Maneja la reproducción de audio de acuerdo a la vista
 */
export function handleAudioPlayback(viewName) {
  if (!isAudioAllowed()) return;

  const audioPath = getAudioPath(viewName);
  if (!audioPath) return;

  stopCurrentAudio();

  currentAudio = new Audio(audioPath);
  currentAudio.play().catch(() => { });
}
