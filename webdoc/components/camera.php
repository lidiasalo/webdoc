<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/objects.css" />
</head>

<body>
    <div id="app">
        <div id="slider">
            <div class="btn-menu" onclick="navigateTo('menu')">
                <img src="assets/images/menu.png" alt="Menu" />
            </div>

            <div class="btn-top-right">
                <button onclick="openPanel('juegoPresimbolico')">JUEGO PRESIMBÓLICO</button>
            </div>

            
            <div class="slider-content">
              <?php
              for ($i = 1; $i <= 250; $i++) {
                $num = str_pad($i, 4, '0', STR_PAD_LEFT); // "0001"
                echo "<div class=\"slide\"><img src=\"assets/images/camera/camera{$num}.jpg\" alt=\"foto {$i}\" /></div>\n";
              }
              ?>
            </div>

            <div class="nav prev">&#10094;</div>
            <div class="nav next">&#10095;</div>
        </div>

        <!-- Panel derecho -->
        <div id="side-panel" class="hidden">
            <div class="close-btn" onclick="closePanel()">✕</div>
            <div id="panel-content"></div>
        </div>
    </div>


</body>
  
</html>