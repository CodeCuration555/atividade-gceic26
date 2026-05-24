const request = require("supertest");
const app = require("../src/app");

describe("POST /api/mkp/custos", () => {
  it("deve calcular e retornar o custo total", async () => {
    const res = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 120, custosIndiretos: 30 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ custosDiretos: 120, custosIndiretos: 30, custoTotal: 150 });
  });

  it("deve retornar erro se faltar custosIndiretos", async () => {
    const res = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 120 });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  it("deve retornar erro se enviar string em vez de número", async () => {
    const res = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: "abc", custosIndiretos: 30 });
    expect(res.status).toBe(400);
  });

  it("deve calcular corretamente com valores zero", async () => {
    const res = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 0, custosIndiretos: 0 });
    expect(res.status).toBe(200);
    expect(res.body.custoTotal).toBe(0);
  });

  it("deve calcular corretamente com valores decimais", async () => {
    const res = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 99.5, custosIndiretos: 50.5 });
    expect(res.status).toBe(200);
    expect(res.body.custoTotal).toBe(150);
  });
});

describe("POST /api/mkp/markup", () => {
  it("deve calcular multiplicador e preço de venda", async () => {
    const res = await request(app)
      .post("/api/mkp/markup")
      .send({ custoProduto: 50, despesasVariaveis: 10, despesasFixas: 15, margemLucro: 20 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ multiplicador: "1.82", precoVenda: "90.91" });
  });

  it("deve retornar erro quando faltar margemLucro", async () => {
    const res = await request(app)
      .post("/api/mkp/markup")
      .send({ custoProduto: 50, despesasVariaveis: 10, despesasFixas: 15 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("deve retornar erro quando soma das taxas >= 100%", async () => {
    const res = await request(app)
      .post("/api/mkp/markup")
      .send({ custoProduto: 50, despesasVariaveis: 50, despesasFixas: 50, margemLucro: 20 });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/mkp/preco-venda", () => {
  it("deve calcular o preço de venda", async () => {
    const res = await request(app)
      .post("/api/mkp/preco-venda")
      .send({ custoTotal: 150, indiceMarkup: 1.25 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ custoTotal: 150, indiceMarkup: 1.25, precoVenda: "187.50" });
  });

  it("deve aceitar multiplicador como alias de indiceMarkup", async () => {
    const res = await request(app)
      .post("/api/mkp/preco-venda")
      .send({ custoTotal: 150, multiplicador: 1.25 });
    expect(res.status).toBe(200);
    expect(res.body.precoVenda).toBe("187.50");
  });

  it("deve retornar erro quando faltar indiceMarkup", async () => {
    const res = await request(app)
      .post("/api/mkp/preco-venda")
      .send({ custoTotal: 150 });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
  });
});

describe("GET /health", () => {
  it("deve retornar status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});
