// Importa la función que busca un ítem por ID desde el servicio correspondiente
const { findItemById } = require('../services/item.service');

/**
 * Controlador para manejar la petición GET /api/items/:id
 * Busca un producto por ID y lo devuelve como JSON
 */
const getItemById = (req, res, next) => {
  try {
    // Extrae el parámetro de la URL (ID del producto)
    const itemId = req.params.id;

    // Llama al servicio que busca el ítem en el archivo JSON
    const item = findItemById(itemId);

    // Si no se encuentra, responde con error 404
    if (!item) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si se encuentra, devuelve el ítem como JSON
    res.json(item);
  } catch (err) {
    // En caso de error inesperado, pasa al middleware de manejo de errores
    next(err);
  }
};

// Exporta el controlador para que pueda ser usado en las rutas
module.exports = { getItemById };
