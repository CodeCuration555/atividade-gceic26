const request = require("supertest");
const app = require("../src/app");

describe("POST /api/mkp/custos", () => {
  it("deve calcular e retornar o custo total", async () => {
    const response = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 120, custosIndiretos: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      custosDiretos: 120,
      custosIndiretos: 30,
      custoTotal: 150,
    });
  });

  it("deve retornar erro se faltar algum custo", async () => {
    const response = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 120 });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      erro: "Informe custosDiretos e custosIndiretos como números.",
    });
  });

  it("deve retornar erro se enviar string em vez de número", async () => {
    const response = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: "abc", custosIndiretos: 30 });

    expect(response.status).toBe(400);
  });

  it("deve calcular corretamente com valores zero", async () => {
    const response = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 0, custosIndiretos: 0 });

    expect(response.status).toBe(200);
    expect(response.body.custoTotal).toBe(0);
  });

  it("deve calcular corretamente com valores decimais", async () => {
    const response = await request(app)
      .post("/api/mkp/custos")
      .send({ custosDiretos: 99.5, custosIndiretos: 50.5 });

    expect(response.status).toBe(200);
    expect(response.body.custoTotal).toBe(150);
  });
});

describe("GET /health", () => {
  it("deve retornar status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("timestamp");
  });
});
