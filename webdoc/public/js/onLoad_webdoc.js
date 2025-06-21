export function onLoad_webdoc() {
  console.log("✅ onLoad_webdoc ejecutado");

  requestAnimationFrame(() => {
    const btn = document.getElementById('start-btn');
    if (!btn) {
      console.warn("❌ No se encontró #start-btn");
      return;
    }

    const indexAudio = new Audio('assets/audio/index.mp3');
    window.indexAudio = indexAudio;

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      localStorage.setItem('audioAutorizado', '1');

      indexAudio.play().then(() => {
        console.log("▶️ Reproduciendo index.mp3");
        window.navigateTo('transitions/transitionIndex');
      }).catch(err => {
        console.warn("⚠️ Audio bloqueado:", err);
        window.navigateTo('transitions/transitionIndex');
      });
    });

    console.log("✅ Listener añadido a #start-btn");
  });

  window.stopIndexAudio = () => {
    if (window.indexAudio) {
      window.indexAudio.pause();
      window.indexAudio.currentTime = 0;
      console.log("⏹️ Detenido index.mp3");
    }
  };
}
