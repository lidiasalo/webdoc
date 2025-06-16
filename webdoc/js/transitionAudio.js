let currentAudio = null;

function playTransitionAudio() {
  const hash = window.location.hash;
  const parts = hash.split('/');
  const name = parts[parts.length - 1];

  if (!name || !hash.includes('/transitions/')) return;

  console.log("🔊 Reproduciendo audio de transición:", name);

  // Detener audio anterior si lo hay
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(`assets/audio/transitions/${name}.mp3`);
  currentAudio.play().catch(e => {
    console.warn("❌ Autoplay bloqueado:", e);
  });
}

function stopTransitionAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    console.log("⏹️ Audio detenido manualmente");
  }
}

// Exportar la función globalmente para usarla desde HTML
window.stopTransitionAudio = stopTransitionAudio;

window.addEventListener('DOMContentLoaded', playTransitionAudio);
window.addEventListener('hashchange', playTransitionAudio);

  