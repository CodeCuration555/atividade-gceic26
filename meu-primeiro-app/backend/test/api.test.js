const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');

test('POST /MKP/custos deve calcular o custo total', async () => {
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

test('POST /MKP/custos deve retornar erro quando faltar custoIndireto', async () => {
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

test('POST /MKP/markup deve calcular multiplicador e preço de venda', async () => {
  const response = await request(app)
    .post('/MKP/markup')
    .send({
      custoProduto: 50,
      despesasVariaveis: 10,
      despesasFixas: 15,
      margemLucro: 20
    });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    multiplicador: '1.82',
    precoVenda: '90.91'
  });
});

test('POST /MKP/markup deve retornar erro quando faltar algum campo', async () => {
  const response = await request(app)
    .post('/MKP/markup')
    .send({
      custoProduto: 50,
      despesasVariaveis: 10,
      despesasFixas: 15
    });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: 'Informe custoProduto, despesasVariaveis, despesasFixas e margemLucro como números.'
  });
});

test('POST /MKP/preco-venda deve calcular o preço sugerido', async () => {
  const response = await request(app)
    .post('/MKP/preco-venda')
    .send({
      custoTotal: 150,
      indiceMarkup: 1.25
    });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    custoTotal: 150,
    indiceMarkup: 1.25,
    precoVenda: '187.50'
  });
});

test('POST /MKP/preco-venda deve aceitar multiplicador como alias', async () => {
  const response = await request(app)
    .post('/MKP/preco-venda')
    .send({
      custoTotal: 150,
      multiplicador: 1.25
    });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    custoTotal: 150,
    indiceMarkup: 1.25,
    precoVenda: '187.50'
  });
});

test('POST /MKP/preco-venda deve retornar erro quando faltar indiceMarkup', async () => {
  const response = await request(app)
    .post('/MKP/preco-venda')
    .send({
      custoTotal: 150
    });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    erro: 'Informe custoTotal e indiceMarkup como números.'
  });
});
