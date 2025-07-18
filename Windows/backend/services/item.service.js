// Importa el módulo fs para leer archivos desde el sistema de archivos
const fs = require('fs');

// Importa path para construir rutas de forma segura y compatible con el sistema operativo
const path = require('path');

/**
 * Busca un producto por su ID en el archivo items.json
 * @param {string} id - ID del producto a buscar
 * @returns {object|null} - Objeto del producto encontrado o null si no existe
 */
const findItemById = (id) => {
  // Construye la ruta absoluta al archivo items.json
  const dataPath = path.join(__dirname, '..', 'data', 'items.json');

  // Lee el contenido del archivo y lo convierte en un array de objetos
  const items = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Busca el primer ítem cuyo ID coincida con el solicitado
  return items.find(item => item.id === id);
};

// Exporta la función para que pueda ser usada en controladores u otros módulos
module.exports = { findItemById };
