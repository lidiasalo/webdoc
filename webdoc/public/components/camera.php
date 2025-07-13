<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cámara - Webdoc</title>
  <link rel="stylesheet" href="css/camera.css" />
</head>

<body>
  <div id="app">
    <div class="camera-wrapper">

      <!-- Botón menú y acciones -->
      <div class="header">
        <div class="btn-menu" onclick="navigateTo('menu')">
          <img src="assets/images/menu.png" alt="Menú" />
        </div>

        <div class="btn-top-right">
          <button onclick="openPanel('juegoPresimbolico')">JUEGO PRESIMBÓLICO</button>
        </div>
      </div>

      <!-- Slider de imágenes -->
      <div class="camera-slider">
        <div class="camera-slider-content">
          <?php
          for ($i = 1; $i <= 210; $i++) {
            $num = str_pad($i, 4, '0', STR_PAD_LEFT);
            echo "<div class=\"camera-slide\"><img src=\"assets/images/camera/camera{$num}.jpg\" alt=\"foto {$i}\" /></div>\n";
          }
          ?>
        </div>

        <!-- Flechas de navegación -->

            <div class="nav prev">&#10094;</div>
            <div class="nav next">&#10095;</div>
      </div>

      <!-- Texto explicativo -->
      <div class="camera-caption">
        <p>
          Durante el reportaje dejamos una cámara compacta en Damara para que les niñes pudieran usarla durante las sesiones como un elemento de juego más. Estas son las fotografías realizadas por uno de los niños.
        </p>
      </div>
    </div>

    <!-- Panel lateral derecho -->
    <div id="side-panel">
      <div class="close-btn" onclick="closePanel()">✕</div>
      <div id="panel-content"></div>
    </div>
  </div>
</body>

</html>
