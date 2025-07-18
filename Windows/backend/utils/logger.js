// Función base que imprime un log con nivel e información temporal
const log = (level, message) => {
  // Obtiene la fecha y hora actual en formato ISO
  const timestamp = new Date().toISOString();

  // Imprime el mensaje formateado con timestamp y nivel de log
  console.log(`[${timestamp}] [${level}] ${message}`);
};

// Exporta funciones específicas para distintos niveles de log
module.exports = {
  // Logger para mensajes informativos
  info: (msg) => log('INFO', msg),

  // Logger para mensajes de error
  error: (msg) => log('ERROR', msg)
};
