// Mostrar el campo para seleccionar el tamaño de panel solo cuando se elija "Naipix"
document.getElementById('brand').addEventListener('change', function() {
  const brand = this.value;
  const panelSizeWrapper = document.getElementById('panelSizeWrapper');

  // Mostrar el campo para elegir el tamaño del panel si es Naipix
  if (brand === 'naipix') {
    panelSizeWrapper.style.display = 'block';
  } else {
    panelSizeWrapper.style.display = 'none';
  }
});

// Evento para manejar la sumisión del formulario
document.getElementById('setupForm').addEventListener('submit', function(e) {
  e.preventDefault();  // Previene que el formulario recargue la página

  // Obtener los valores de entrada
  const width = parseFloat(document.getElementById('screenWidth').value);
  const height = parseFloat(document.getElementById('screenHeight').value);
  const brand = document.getElementById('brand').value;
  const panelSize = brand === 'naipix' ? document.getElementById('panelSize').value : '50x50';

  // Validación de que los valores sean correctos
  if (isNaN(width) || isNaN(height)) {
    alert("Por favor, ingresa un valor válido para el tamaño de la pantalla.");
    return;
  }

  // Ajustar tamaño de panel según la selección
  let panelWidth, panelHeight;
  if (brand === 'absen' || panelSize === '50x50') {
    panelWidth = 0.5;  // 50x50 cm -> 0.5m
    panelHeight = 0.5; // 50x50 cm -> 0.5m
  } else if (panelSize === '50x100') {
    panelWidth = 0.5;  // 50x100 cm -> 0.5m
    panelHeight = 1;   // 50x100 cm -> 1m
  }

  // Calcular la cantidad de paneles que caben en la pantalla
  const numPanelsX = Math.floor(width / panelWidth);
  const numPanelsY = Math.floor(height / panelHeight);

  // Dibujar la grilla de paneles
  const canvas = document.getElementById('gridCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas antes de dibujar

  // Calculamos el tamaño de cada panel en píxeles
  const panelWidthInPixels = canvas.width / numPanelsX;
  const panelHeightInPixels = canvas.height / numPanelsY;

  // Asegurarnos de que los paneles sean cuadrados si son 50x50
  if (panelWidth === panelHeight) {
    const panelSizeInPixels = Math.min(panelWidthInPixels, panelHeightInPixels);
    for (let i = 0; i < numPanelsX; i++) {
      for (let j = 0; j < numPanelsY; j++) {
        ctx.strokeRect(i * panelSizeInPixels, j * panelSizeInPixels, panelSizeInPixels, panelSizeInPixels);
      }
    }
  } else {
    // Si no son paneles cuadrados (es decir, 50x100), mantener la proporción
    for (let i = 0; i < numPanelsX; i++) {
      for (let j = 0; j < numPanelsY; j++) {
        ctx.strokeRect(i * panelWidthInPixels, j * panelHeightInPixels, panelWidthInPixels, panelHeightInPixels);
      }
    }
  }

  // Llamar a la función para calcular el diagrama de tensión y señal
  drawDiagrams(numPanelsX, numPanelsY, panelWidth, panelHeight);
});

// Función para dibujar los diagramas de tensión y señal
function drawDiagrams(numPanelsX, numPanelsY, panelWidth, panelHeight) {
  const diagramCanvas = document.getElementById('diagramCanvas');
  const ctx = diagramCanvas.getContext('2d');
  ctx.clearRect(0, 0, diagramCanvas.width, diagramCanvas.height); // Limpiar el canvas antes de dibujar

  const totalPanels = numPanelsX * numPanelsY;
  const maxPanelsPerPort = 20;  // Por ejemplo, máximo 20 paneles por puerto de red

  // Calcular el consumo de energía y el número de puertos
  const totalPowerConsumption = totalPanels * 100; // suponer 100W por panel (valor de ejemplo)
  const numPorts = Math.ceil(totalPanels / maxPanelsPerPort);

  // Dibujar gráfico de consumo
  ctx.beginPath();
  ctx.moveTo(0, diagramCanvas.height / 2);
  ctx.lineTo(diagramCanvas.width, diagramCanvas.height / 2);
  ctx.stroke();

  ctx.fillText(`Consumo total: ${totalPowerConsumption}W`, 10, diagramCanvas.height / 2 - 10);
  ctx.fillText(`Puertos necesarios: ${numPorts}`, 10, diagramCanvas.height / 2 + 10);
}
