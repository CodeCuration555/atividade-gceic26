const express = require("express");
const router = express.Router();

// POST /api/mkp/custos — calcula custo total
router.post("/custos", (req, res) => {
  const { custosDiretos, custosIndiretos } = req.body;

  const cd = parseFloat(custosDiretos);
  const ci = parseFloat(custosIndiretos);

  if (Number.isNaN(cd) || Number.isNaN(ci)) {
    return res.status(400).json({
      erro: "Informe custosDiretos e custosIndiretos como números.",
    });
  }

  const custoTotal = cd + ci;

  return res.json({
    custosDiretos: cd,
    custosIndiretos: ci,
    custoTotal: Number(custoTotal.toFixed(2)),
  });
});

// POST /api/mkp/markup — calcula multiplicador e preço de venda
router.post("/markup", (req, res) => {
  const { custoProduto, despesasVariaveis, despesasFixas, margemLucro } = req.body;

  const cp = parseFloat(custoProduto);
  const dv = parseFloat(despesasVariaveis) || 0;
  const df = parseFloat(despesasFixas) || 0;
  const ml = Math.min(parseFloat(margemLucro) || 0, 20);

  if (
    Number.isNaN(cp) ||
    Number.isNaN(parseFloat(despesasVariaveis)) ||
    Number.isNaN(parseFloat(despesasFixas)) ||
    Number.isNaN(parseFloat(margemLucro))
  ) {
    return res.status(400).json({
      error:
        "Informe custoProduto, despesasVariaveis, despesasFixas e margemLucro como números.",
    });
  }

  const somaTaxas = dv + df + ml;

  if (somaTaxas >= 100) {
    return res.status(400).json({
      error:
        "A soma das despesas e margem de lucro não pode atingir ou ultrapassar 100%.",
    });
  }

  const mk = 100 / (100 - somaTaxas);
  const pv = cp * mk;

  return res.json({
    multiplicador: mk.toFixed(2),
    precoVenda: pv.toFixed(2),
  });
});

// POST /api/mkp/preco-venda — calcula preço de venda a partir do custo total e índice de markup
router.post("/preco-venda", (req, res) => {
  const { custoTotal, indiceMarkup, multiplicador } = req.body;

  const ct = parseFloat(custoTotal);
  const im = parseFloat(indiceMarkup ?? multiplicador);

  if (Number.isNaN(ct) || Number.isNaN(im)) {
    return res.status(400).json({
      erro: "Informe custoTotal e indiceMarkup como números.",
    });
  }

  const precoVenda = ct * im;

  return res.json({
    custoTotal: Number(ct.toFixed(2)),
    indiceMarkup: Number(im.toFixed(2)),
    precoVenda: precoVenda.toFixed(2),
  });
});

module.exports = router;
