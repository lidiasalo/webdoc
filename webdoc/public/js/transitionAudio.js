let currentAudio = null;
let lastAudioName = null;
let userInteracted = false;

window.addEventListener('click', () => {
  userInteracted = true;
}, { once: true });

function playCurrentAudio() {
  if (!userInteracted || localStorage.getItem('audioAutorizado') !== '1') return;

  const hash = location.hash;
  const parts = hash.split('/');
  const name = parts[parts.length - 1];

  if (!name || !hash.includes('/transitions/')) return;
  if (name === lastAudioName) return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioPath = `assets/audio/transitions/${name}.mp3`;
  console.log(`🔊 Reproduciendo transición: ${audioPath}`);

  currentAudio = new Audio(audioPath);
  lastAudioName = name;

  currentAudio.play().catch(e => {
    console.warn("⚠️ No se pudo reproducir:", e);
  });
}

window.stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    console.log("⏹️ Detenido audio de transición");
  }
  lastAudioName = null;
};

window.addEventListener('DOMContentLoaded', playCurrentAudio);
window.addEventListener('hashchange', playCurrentAudio);
