// test-ingreso.js
const enviarSimulacion = async () => {
  const ingreso = {
    emisor: "Consultora Ambiental Delta",
    monto: 75200,
    banco_origen: "Galicia",
    id_referencia: "REF-" + Math.floor(Math.random() * 1000)
  };

  try {
    const res = await fetch('http://localhost:8080/api/webhook-ingreso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingreso)
    });
    const data = await res.json();
    console.log("✅ Ingreso inyectado con éxito:", data);
  } catch (e) {
    console.error("❌ Error: ¿Está el backend corriendo?");
  }
};

enviarSimulacion();