@echo off
set "ROOT=webdoc"

rem Crear estructura de carpetas
mkdir %ROOT%
mkdir %ROOT%\assets
mkdir %ROOT%\assets\images
mkdir %ROOT%\assets\videos
mkdir %ROOT%\assets\audio
mkdir %ROOT%\css
mkdir %ROOT%\js
mkdir %ROOT%\data
mkdir %ROOT%\components

rem Crear archivos básicos
echo ^<html^>^<head^>^<title^>Webdoc^</title^>^<link rel="stylesheet" href="css/styles.css"^>^</head^>^<body^>^<script src="js/main.js"^>^</script^>^</body^>^</html^> > %ROOT%\index.html
echo {} > %ROOT%\manifest.json
echo /* CSS principal */ > %ROOT%\css\styles.css
echo // JS principal > %ROOT%\js\main.js
echo // Arrays de datos o fetch JSON > %ROOT%\js\data.js
echo // Gestión de rutas si aplica > %ROOT%\js\router.js
echo [ ] > %ROOT%\data\intro.json
echo [ ] > %ROOT%\data\escenas.json
echo [ ] > %ROOT%\data\personajes.json
echo ^<!-- Encabezado del documental --> > %ROOT%\components\header.html
echo ^<!-- Pie del documental --> > %ROOT%\components\footer.html
echo ^<!-- Plantilla para escenas --> > %ROOT%\components\escena.html

echo.
echo Estructura del Webdoc creada con éxito en: %ROOT%
pause
