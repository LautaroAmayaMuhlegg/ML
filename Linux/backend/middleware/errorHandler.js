// Importa el logger personalizado para registrar errores
const logger = require('../utils/logger');

/**
 * Middleware de manejo de errores global
 * Se utiliza para capturar cualquier error que ocurra en las rutas o middleware previos.
 * 
 * @param {Error} err - Objeto de error lanzado en la aplicación
 * @param {Request} req - Objeto de la solicitud HTTP
 * @param {Response} res - Objeto de la respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware (no se usa aquí)
 */
const errorHandler = (err, req, res, next) => {
  // Registra el error en consola con método HTTP, URL y mensaje de error
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`);

  // Devuelve una respuesta 500 con mensaje genérico
  res.status(500).json({ error: 'Error interno del servidor' });
};

// Exporta el middleware para que pueda ser usado en app.js
module.exports = errorHandler;
