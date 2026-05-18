const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('POST /MKP/custos deve calcular e retornar o custo total', async () => {
  const response = await request(app)
    .post('/MKP/custos')
    .send({
      custosDiretos: 120,
      custosIndiretos: 30
    });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    custosDiretos: 120,
    custosIndiretos: 30,
    custoTotal: 150
  });
});

test('POST /MKP/custos deve retornar erro se faltar algum custo', async () => {
  const response = await request(app)
    .post('/MKP/custos')
    .send({
      custosDiretos: 120
    });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    erro: 'Informe custosDiretos e custosIndiretos como números.'
  });
});
