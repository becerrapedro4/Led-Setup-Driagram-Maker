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
    // Paneles de 50x50 cm (medio metro)
    panelWidth = 0.5;  // 50x50 cm -> 0.5m
    panelHeight = 0.5; // 50x50 cm -> 0.5m
  } else if (panelSize === '50x100') {
    // Paneles de 50x100 cm (un metro)
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

  // Calcular el tamaño de los paneles en píxeles
  let panelWidthInPixels, panelHeightInPixels;
  
  if (panelWidth === panelHeight) {
    // Si es un panel 50x50 (cuadrado), dibujamos un cuadrado
    panelWidthInPixels = Math.min(canvas.width / numPanelsX, canvas.height / numPanelsY);
    panelHeightInPixels = panelWidthInPixels;  // Aseguramos que sea cuadrado
  } else {
    // Si es un panel 50x100 (rectangular), calculamos el tamaño en píxeles para mantener la proporción
    panelWidthInPixels = canvas.width / numPanelsX;  // Ancho proporcional
    panelHeightInPixels = canvas.height / numPanelsY; // Alto proporcional
    
    // Aseguramos que el alto sea proporcional a 2x el ancho para los paneles 50x100
    if (panelWidth === 0.5 && panelHeight === 1) {
      // Los paneles de 50x100 cm deben tener la proporción correcta, por eso el alto es el doble que el ancho
      panelHeightInPixels = panelWidthInPixels * 2;
    }
  }

  // Dibujar los paneles respetando sus proporciones
  for (let i = 0; i < numPanelsX; i++) {
    for (let j = 0; j < numPanelsY; j++) {
      if (panelWidth === panelHeight) {
        // Si es un panel 50x50 (cuadrado), dibujamos un cuadrado
        ctx.strokeRect(i * panelWidthInPixels, j * panelHeightInPixels, panelWidthInPixels, panelHeightInPixels);
      } else {
        // Si es un panel 50x100 (rectangular), respetamos la proporción
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
