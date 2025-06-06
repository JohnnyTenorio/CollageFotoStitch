document.getElementById('testForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const respuestasCorrectas = {
    q1: '2',
    q2: 'verde',
    q3: 'stitch',
    q4: '20',
    q5: 'Leo'
  };

  const form = e.target;
  let puntaje = 0;
  let totalPreguntas = Object.keys(respuestasCorrectas).length;

  // Validar que se respondieron todas las preguntas obligatorias
  for (let q in respuestasCorrectas) {
    const opcion = form[q].value;
    if (!opcion) {
      alert("Por favor responde todas las preguntas obligatorias.");
      return;
    }
  }

  // Calcular puntaje
  for (let q in respuestasCorrectas) {
    const respuesta = form[q].value;
    if (respuesta === respuestasCorrectas[q]) {
      puntaje++;
    }
  }

  const adicional = form['q6'].value || "no";

  let mensaje = `Has acertado ${puntaje} de ${totalPreguntas} preguntas. `;

  if (puntaje === totalPreguntas) {
    mensaje += "¡Perfecto! Eres Ana Belén. ";
  } else {
    mensaje += "Parece que no eres Ana Belén, inténtalo de nuevo. ";
  }

  mensaje += `Respuesta adicional: ${adicional === 'si' ? '¡Gracias por aceptar la conquista!' : 'Relájate, todo bien.'}`;

  document.getElementById('resultado').textContent = mensaje;

  // Mostrar contador y ejecutar acciones
  const contador = document.getElementById("contador");
  contador.style.display = "block";

  let segundos = 10;
  contador.textContent = `Descargando en: ${segundos} segundos`;

  const intervalo = setInterval(() => {
    segundos--;
    contador.textContent = `Descargando en: ${segundos} segundos`;

    if (segundos === 5) {
      generarPDF();
    }

    if (segundos === 0) {
      clearInterval(intervalo);
      window.location.href = "CollageAna.html";
    }
  }, 1000);
});

function generarPDF() {
  const element = document.getElementById("testForm");

  html2pdf()
    .set({
      margin: 10,
      filename: "respuestas_de_Ana.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
}
