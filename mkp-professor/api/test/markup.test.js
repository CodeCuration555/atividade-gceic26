const request = require('supertest');
const app = require('../app');

describe('MKP API', () => {
  describe('GET /health', () => {
    it('returns ok status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /MKP/markup', () => {
    it('calculates markup and price for valid input', async () => {
      const response = await request(app)
        .post('/MKP/markup')
        .send({
          custoProduto: 50,
          despesasVariaveis: 10,
          despesasFixas: 15,
          margemLucro: 20
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        multiplicador: '1.82',
        precoVenda: '90.91'
      });
    });

    it('rejects invalid numeric payloads', async () => {
      const response = await request(app)
        .post('/MKP/markup')
        .send({
          custoProduto: 'abc',
          despesasVariaveis: 10,
          despesasFixas: 15,
          margemLucro: 20
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/custoProduto/i);
    });

    it('rejects sums that reach 100 percent', async () => {
      const response = await request(app)
        .post('/MKP/markup')
        .send({
          custoProduto: 50,
          despesasVariaveis: 50,
          despesasFixas: 30,
          margemLucro: 20
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/100%/);
    });
  });

  describe('POST /MKP/custos', () => {
    it('sums direct and indirect costs', async () => {
      const response = await request(app)
        .post('/MKP/custos')
        .send({ custosDiretos: 100, custosIndiretos: 25.5 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        custosDiretos: 100,
        custosIndiretos: 25.5,
        custoTotal: 125.5
      });
    });

    it('returns error for non numeric inputs', async () => {
      const response = await request(app)
        .post('/MKP/custos')
        .send({ custosDiretos: 'x', custosIndiretos: 25.5 });

      expect(response.status).toBe(400);
      expect(response.body.erro).toMatch(/custosDiretos/i);
    });
  });

  describe('POST /MKP/preco-venda', () => {
    it('calculates sale price from total cost and markup', async () => {
      const response = await request(app)
        .post('/MKP/preco-venda')
        .send({ custoTotal: 125.5, indiceMarkup: 1.82 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        custoTotal: 125.5,
        indiceMarkup: 1.82,
        precoVenda: '228.41'
      });
    });

    it('accepts multiplicador as fallback field', async () => {
      const response = await request(app)
        .post('/MKP/preco-venda')
        .send({ custoTotal: 125.5, multiplicador: 1.82 });

      expect(response.status).toBe(200);
      expect(response.body.precoVenda).toBe('228.41');
    });

    it('returns error for invalid payloads', async () => {
      const response = await request(app)
        .post('/MKP/preco-venda')
        .send({ custoTotal: 'x', indiceMarkup: 1.82 });

      expect(response.status).toBe(400);
      expect(response.body.erro).toMatch(/custoTotal/i);
    });
  });
});
