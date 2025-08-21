export function onLoad_webdoc() {

  requestAnimationFrame(() => {
    const btn = document.getElementById('start-btn');
    if (!btn) {
      return;
    }

    const indexAudio = new Audio('assets/audio/index.mp3');
    window.indexAudio = indexAudio;

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      localStorage.setItem('audioAutorizado', '1');

      indexAudio.play().then(() => {
        window.navigateTo('transitions/transitionIndex');
      }).catch(err => {
        window.navigateTo('transitions/transitionIndex');
      });
    });
  });

  window.stopIndexAudio = () => {
    if (window.indexAudio) {
      window.indexAudio.pause();
      window.indexAudio.currentTime = 0;
    }
  };
}
