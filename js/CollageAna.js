const fondoInput = document.getElementById('fondoInput');
const fotoInputs = document.querySelectorAll('.fotoInput');
const generarBtn = document.getElementById('generarBtn');
const salirBtn = document.getElementById('salirBtn');  // Nuevo botón
const descargarBtn = document.getElementById('descargarBtn');
const canvas = document.getElementById('collageCanvas');
const ctx = canvas.getContext('2d');

const modalDescarga = document.getElementById('modalDescarga');
const btnDescargarImagen = document.getElementById('btnDescargarImagen');
const btnDescargarPDF = document.getElementById('btnDescargarPDF');
const btnCerrarModal = document.getElementById('btnCerrarModal');

let fondoImg = null;
let fotos = [];

fondoInput.addEventListener('change', async (e) => {
  fondoImg = await cargarImagen(e.target.files[0]);
  actualizarEstadoArchivo(fondoInput, 'Fondo seleccionado');
});

fotoInputs.forEach((input, i) => {
  input.addEventListener('change', async (e) => {
    const img = await cargarImagen(e.target.files[0]);
    fotos[i] = img;
    actualizarEstadoArchivo(input, 'Foto seleccionada');
  });
});

generarBtn.addEventListener('click', () => {
  if (!fondoImg || fotos.length < 4 || fotos.includes(undefined)) {
    alert("Debes subir el fondo y las 4 fotos");
    return;
  }

  // Limpia canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja el fondo en todo el canvas
  ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height);

  // Capa oscura para bajar la intensidad del fondo (overlay negro semi-transparente)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibuja las 4 fotos centradas y un poco más grandes
  const size = 180; // tamaño más grande
  const espacioEntreFotos = 30;

  // Calculamos el ancho total de las 2 fotos (horizontal) + espacio entre ellas
  const totalWidth = size * 2 + espacioEntreFotos;
  // Coordenada X de inicio para centrar las dos columnas de fotos
  const startX = (canvas.width - totalWidth) / 2;

  // Calculamos el alto total de las 2 filas de fotos + espacio entre filas
  const totalHeight = size * 2 + espacioEntreFotos;
  // Coordenada Y de inicio para centrar las dos filas de fotos
  const startY = (canvas.height - totalHeight) / 2;

  for (let i = 0; i < 4; i++) {
    const x = startX + (i % 2) * (size + espacioEntreFotos);
    const y = startY + Math.floor(i / 2) * (size + espacioEntreFotos);
    ctx.drawImage(fotos[i], x, y, size, size);
  }

  document.getElementById('preview').style.display = 'block';
});

descargarBtn.addEventListener('click', () => {
  modalDescarga.style.display = 'flex';
});

btnDescargarImagen.addEventListener('click', () => {
  const enlace = document.createElement('a');
  enlace.download = 'collage.png';
  enlace.href = canvas.toDataURL();
  enlace.click();
  modalDescarga.style.display = 'none';
});

btnDescargarPDF.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, 'PNG', 10, 10, 190, 200);
  pdf.save("collage.pdf");
  modalDescarga.style.display = 'none';
});

btnCerrarModal.addEventListener('click', () => {
  modalDescarga.style.display = 'none';
});

function cargarImagen(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function actualizarEstadoArchivo(inputElement, mensaje) {
  const estado = inputElement.closest('.foto-item').querySelector('.estado-archivo');
  if (inputElement.files.length > 0) {
    estado.textContent = `📸 ${mensaje}`;
    estado.style.color = 'green';
  } else {
    estado.textContent = 'Ningún archivo seleccionado';
    estado.style.color = 'gray';
  }
}

salirBtn.addEventListener('click', () => {
  window.location.href = 'seleccion.html';
});