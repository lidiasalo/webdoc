// router.js (tipo module)

let lastView = null;
let autoScrollInterval;
let sliderIsRunning = false;

function navigateTo(view) {
  const nextView = view;
  const currentView = lastView || (location.hash ? location.hash.substring(1) : 'webdoc');

  console.log(`🔁 Navegando de ${currentView} → ${nextView}`);

  if (currentView === '/transitions/transitionIndex' && nextView !== '/transitions/transitionIndex' && typeof stopIndexAudio === "function") {
    stopIndexAudio();
  }

  if (typeof stopTransitionAudio === "function") {
    stopTransitionAudio();
  }

  window.location.hash = nextView;
  lastView = nextView;

  loadScene(nextView).then(() => {
    if (nextView === 'objects') {
      import('./slider.js')
        .then(module => {
          module.initSlider({
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
        .catch(err => console.error("No se pudo cargar slider.js", err));
    }
  });
}

function loadScene(view) {
  const path = `components/${view}.html`;
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

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("DOMContentLoaded", handleHashChange);

function openPanel(contentType) {
  const panel = document.getElementById('side-panel');
  const content = document.getElementById('panel-content');

  if (autoScrollInterval) clearInterval(autoScrollInterval);
  sliderIsRunning = false;

  panel.classList.add('active');
  panel.classList.remove('hidden');

  const panelContentMap = {
    'biografia': `
    <h2>NÚRIA GROS CARMONA</h2>
    <p>Inició su camino profesional y vocacional formándose como educadora social después de años de voluntariado en diferentes asociaciones y ONG. Su experiencia como nieta de emigrantes andaluces que vivían en barrios donde la colaboración y la fraternidad eran una realidad, así como formar parte de una familia pequeña muy unida, marcó profundamente su manera de ver y entender el mundo. Estas experiencias tempranas le hicieron entender que la colaboración entre las personas, no el individualismo ni la competencia, es la herramienta para la transformación social. Esto hizo que escogiera dedicarse al ámbito social.</p>
    <p>Una vez acabada la carrera decidió irse a vivir a Buenos Aires para formarse en alfabetización de adultas dentro de la educación popular (Paulo Freire) y colaborar en diferentes proyectos de alfabetización de adultas y acompañamiento a la infancia en barrios populares de la ciudad. Aprovechó aquellos años de intenso descubrimiento para estudiar en la Universidad de las Madres de Plaza de Mayo y formarse como pedagoga y guía Montessori. Empezó a sentir que la escuela es una gran herramienta de transformación social. A nivel personal, el cambio de ciudad y el alejamiento de su familia la llevó a iniciar un proceso terapéutico dentro de la terapia Gestalt que sigue actualmente.</p>
    <p>Después de cuatro años en Buenos Aires volvió a Cataluña, donde empezó a trabajar dentro del ámbito de la educación libre, colaborando y trabajando en varios proyectos (La Xauxa Xica, La Mainada…), mientras iniciaba su formación en terapia Gestalt y Gestalt infantil, un camino que duró cuatro años y que supuso un antes y un después en su vida. En este periodo tuvo la suerte de formarse en Ecuador con Rebeca y Mauricio Wild, creadores del centro experimental Pestalozzi.</p>
    <p>Durante una etapa que duró unos cuántos años se preparó profesionalmente en distintas disciplinas, todas relacionadas con el ámbito de la infancia y la familia: pedagogía sistémica (con Carles Parellada y Mercè Traveset), crianza ecológica y prevención psicosocial, terapia del juego y sandplay (Joaquín Blix) y constelaciones familiares individuales. Todo esto la llevó a dejar el ámbito de la educación libre y a entrar en el campo terapéutico como parte de CreaEspai, proyecto de acompañamiento a niños, niñas y familias, durante un periodo de 4 años.</p>
    <p>Actualmente coordina su propio proyecto: <strong>DAMARA</strong>, desde donde acompaña a niños y niñas, familias y centros educativos.</p>
    <p>Su especialidad es el acompañamiento a niños y niñas desde la terapia de juego y el acompañamiento sistémico a las familias. También asesora proyectos educativos que quieran acompañar emocionalmente y con más recursos a los niños y las niñas.</p>
  `,
    'terapia': `
      <h2>LA TERAPIA DE JUEGO</h2>
      <p>La <strong>terapia de juego</strong> es una terapia humanista no directiva...</p>
      <p>Una de las líneas de la terapia de juego es la creada por <strong>Virginia Axline</strong>...</p>
      <p>La terapia de juego se emplea para trabajar con niños y niñas que tienen dificultades emocionales...</p>
      <p>En esta técnica terapéutica los niños y niñas <strong>expresan su mundo interno</strong>...</p>
      <p>La terapia de juego genera un <strong>espacio seguro</strong>...</p>
    `,
    'testimonios': `
      <h2>TESTIMONIOS</h2>
      <blockquote>“Es importante acompañar al niño o a la niña en el juego agresivo...”</blockquote>
      <blockquote>“El trabajo tiene que ser sistémico...”</blockquote>
      <blockquote>“El dibujo es una herramienta muy potente...”</blockquote>
      <p style="text-align: right; font-weight: bold;">Núria Gros Carmona</p>
    `,
    'default': `<h2>Panel</h2><p>Contenido no definido.</p>`
  };

  content.innerHTML = panelContentMap[contentType] || panelContentMap['default'];

  requestAnimationFrame(() => {
    const children = content.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      el.style.opacity = 0;
      el.style.animation = 'fadeUp 0.8s ease forwards';
      el.style.animationDelay = `${i * 0.3}s`;
    }
  });
}

function closePanel() {
  const panel = document.getElementById('side-panel');
  panel.classList.remove('active');

  const content = document.getElementById('panel-content');
  content.querySelectorAll('*').forEach(el => {
    el.style.animation = 'none';
    el.style.opacity = '0';
  });

  setTimeout(() => panel.classList.add('hidden'), 300);

  if (typeof startAutoScroll === 'function' && sliderIsRunning) {
    startAutoScroll();
  }
}

window.navigateTo = navigateTo;
window.openPanel = openPanel;
window.closePanel = closePanel;
