let currentAudio = null;
let userInteracted = false;

// Detectar primera interacción
window.addEventListener('click', () => {
  userInteracted = true;
  console.log("✅ Usuario ha interactuado. Se permite reproducir audio.");
}, { once: true });

export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    console.log("⏹️ Audio detenido");
  }
}

export function handleAudioPlayback(viewName) {
  const autorizado = localStorage.getItem('audioAutorizado') === '1';
  if (!autorizado || !userInteracted) {
    console.warn("🔇 Audio bloqueado: sin autorización o sin interacción");
    return;
  }

  let audioPath = null;

  if (viewName === 'webdoc') {
    audioPath = 'assets/audio/index.mp3';
  } else if (viewName.startsWith('transitions/')) {
    const name = viewName.split('/').pop();
    audioPath = `assets/audio/transitions/${name}.mp3`;
  }

  if (audioPath) {
    stopCurrentAudio();
    currentAudio = new Audio(audioPath);
    currentAudio.play()
      .then(() => console.log(`▶️ Reproduciendo: ${audioPath}`))
      .catch(err => console.warn("⚠️ Error reproduciendo:", err));
  }
}
