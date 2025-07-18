// Importa el framework Express para construir el servidor HTTP
const express = require('express');

// Importa CORS para permitir peticiones desde otros dominios (como el frontend)
const cors = require('cors');

// Importa las rutas de los ítems desde el archivo correspondiente
const itemRoutes = require('./routes/item.routes');

// Importa el middleware para manejo de errores centralizado
const errorHandler = require('./middleware/errorHandler');

// Importa el logger personalizado para imprimir logs
const logger = require('./utils/logger');

// Crea una nueva aplicación de Express
const app = express();

// Middleware que habilita CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware que permite recibir y parsear JSON en el body de las requests
app.use(express.json());

/* 
 * Rutas principales de la API:
 * Todas las rutas que empiecen con /api/items serán manejadas
 * por el módulo itemRoutes (controladores de productos)
 */
app.use('/api/items', itemRoutes);

/*
 * Middleware de manejo de errores:
 * Si ocurre un error en cualquier parte del procesamiento de la request,
 * este middleware lo captura y envía una respuesta adecuada al cliente.
 */
app.use(errorHandler);

// Puerto donde el servidor escuchará las conexiones HTTP
const PORT = 3001;

// Inicia el servidor y muestra un mensaje cuando está corriendo
app.listen(PORT, () => {
  logger.info(`✅ Backend corriendo en http://localhost:${PORT}`);
});
