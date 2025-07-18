const request = require('supertest');
const express = require('express');
const itemRoutes = require('../routes/item.routes');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/items', itemRoutes);
app.use(errorHandler);

describe('GET /api/items/:id', () => {
  it('debe devolver 200 y el JSON del producto existente', async () => {
    const res = await request(app).get('/api/items/MLA001');

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      id: 'MLA001',
      title: expect.any(String),
      price: expect.any(Number)
    });
  });

  it('debe devolver 404 si el producto no existe', async () => {
    const res = await request(app).get('/api/items/NO_EXISTE');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Producto no encontrado' });
  });
});
