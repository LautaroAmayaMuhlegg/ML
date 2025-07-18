// Importación de módulos necesarios
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Importa la función para obtener un producto por ID desde el controlador
const { getItemById } = require('../controllers/item.controller');

/**
 * GET /api/items/:id
 * Ruta para obtener los datos de un producto específico por su ID
 */
router.get('/:id', getItemById);

/**
 * POST /api/items/:id/reviews
 * Ruta para agregar una nueva reseña (opinión) a un producto
 */
router.post('/:id/reviews', (req, res) => {
  // Ruta al archivo de productos
  const dbPath = path.join(__dirname, '../data/items.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Busca el producto por ID
  const product = db.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  // Extrae y valida los campos requeridos
  const { user, comment, rating } = req.body;
  if (!user || !comment || isNaN(rating)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Crea y agrega la nueva reseña al principio del array
  const newReview = { user, comment, rating: parseInt(rating) };
  product.reviews.unshift(newReview);

  // Guarda el archivo actualizado
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  // Devuelve la reseña creada
  res.status(201).json(newReview);
});

/**
 * POST /api/items/:id/questions
 * Ruta para agregar una nueva pregunta a un producto
 */
router.post('/:id/questions', (req, res) => {
  const dbPath = path.join(__dirname, '../data/items.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const product = db.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  // Valida campos obligatorios
  const { user, question } = req.body;
  if (!user || !question) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // Crea nueva pregunta con campos adicionales
  const newQuestion = {
    user,
    question,
    date: new Date().toISOString(), // Fecha de publicación
    answer: null,                  // Inicialmente sin respuesta
    answerDate: null
  };

  // Agrega la pregunta al principio del array
  product.questions.unshift(newQuestion);

  // Guarda cambios en el archivo
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json(newQuestion);
});

/**
 * POST /api/items/:id/questions/:index/answer
 * Ruta para que el vendedor responda una pregunta existente
 */
router.post('/:id/questions/:index/answer', (req, res) => {
  const dbPath = path.join(__dirname, '../data/items.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  const { id, index } = req.params;
  const { answer } = req.body;

  const product = db.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  // Verifica que la pregunta exista en el índice dado
  if (!product.questions || !product.questions[index]) {
    return res.status(404).json({ error: 'Pregunta no encontrada' });
  }

  // Actualiza la pregunta con la respuesta y la fecha
  product.questions[index].answer = answer;
  product.questions[index].answerDate = new Date().toISOString();

  // Guarda los cambios
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(200).json(product.questions[index]);
});

// Exporta el router con todas las rutas configuradas
module.exports = router;
