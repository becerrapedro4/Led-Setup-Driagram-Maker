document.getElementById('setupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener los valores de entrada
  const width = parseFloat(document.getElementById('screenWidth').value);
  const height = parseFloat(document.getElementById('screenHeight').value);
  const brand = document.getElementById('brand').value;

  // Calcular la cantidad de paneles que caben
  let panelWidth, panelHeight;
  if (brand === 'absen') {
    panelWidth = 0.5; // en metros
    panelHeight = 0.5; // en metros
  } else if (brand === 'naipix') {
    panelWidth = 0.5; // en metros
    panelHeight = 0.5; // en metros o 1.0 (50x100)
  }

  const numPanelsX = Math.floor(width / panelWidth);
  const numPanelsY = Math.floor(height / panelHeight);

  // Dibujar la grilla en el canvas
  const canvas = document.getElementById('gridCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gridWidth = canvas.width;
  const gridHeight = canvas.height;

  // Dibuja la grilla de paneles
  const panelWidthInPixels = gridWidth / numPanelsX;
  const panelHeightInPixels = gridHeight / numPanelsY;

  for (let i = 0; i < numPanelsX; i++) {
    for (let j = 0; j < numPanelsY; j++) {
      ctx.strokeRect(i * panelWidthInPixels, j * panelHeightInPixels, panelWidthInPixels, panelHeightInPixels);
    }
  }

  // Llamar a la función para calcular el diagrama de tensión y señal
  drawDiagrams(numPanelsX, numPanelsY, panelWidth, panelHeight);
});

function drawDiagrams(numPanelsX, numPanelsY, panelWidth, panelHeight) {
  // Ejemplo de cálculo para el diagrama de tensión y señal
  const diagramCanvas = document.getElementById('diagramCanvas');
  const ctx = diagramCanvas.getContext('2d');
  ctx.clearRect(0, 0, diagramCanvas.width, diagramCanvas.height);

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
