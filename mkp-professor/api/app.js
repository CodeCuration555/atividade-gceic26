const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health endpoint required by CI
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Copied/ported endpoints from the legacy backend (keeps same contract)
app.post('/MKP/markup', (req, res) => {
  const { custoProduto, despesasVariaveis, despesasFixas, margemLucro } = req.body;

  const cp = parseFloat(custoProduto);
  const dv = parseFloat(despesasVariaveis) || 0;
  const df = parseFloat(despesasFixas) || 0;
  const ml = Math.min(parseFloat(margemLucro) || 0, 20);

  if (Number.isNaN(cp) || Number.isNaN(parseFloat(despesasVariaveis)) || Number.isNaN(parseFloat(despesasFixas)) || Number.isNaN(parseFloat(margemLucro))) {
    return res.status(400).json({
      error: 'Informe custoProduto, despesasVariaveis, despesasFixas e margemLucro como números.'
    });
  }

  const somaTaxas = dv + df + ml;

  if (somaTaxas >= 100) {
    return res.status(400).json({
      error: 'A soma das despesas e margem de lucro não pode atingir ou ultrapassar 100%.'
    });
  }

  const mk = 100 / (100 - somaTaxas);
  const pv = cp * mk;

  return res.json({
    multiplicador: mk.toFixed(2),
    precoVenda: pv.toFixed(2)
  });
});

app.post('/MKP/custos', (req, res) => {
  const { custosDiretos, custosIndiretos } = req.body;

  const custosDiretosNumero = parseFloat(custosDiretos);
  const custosIndiretosNumero = parseFloat(custosIndiretos);

  if (Number.isNaN(custosDiretosNumero) || Number.isNaN(custosIndiretosNumero)) {
    return res.status(400).json({
      erro: 'Informe custosDiretos e custosIndiretos como números.'
    });
  }

  const custoTotal = custosDiretosNumero + custosIndiretosNumero;

  return res.json({
    custosDiretos: custosDiretosNumero,
    custosIndiretos: custosIndiretosNumero,
    custoTotal: Number(custoTotal.toFixed(2))
  });
});

app.post('/MKP/preco-venda', (req, res) => {
  const { custoTotal, indiceMarkup, multiplicador } = req.body;

  const custoTotalNumero = parseFloat(custoTotal);
  const indiceMarkupNumero = parseFloat(indiceMarkup ?? multiplicador);

  if (Number.isNaN(custoTotalNumero) || Number.isNaN(indiceMarkupNumero)) {
    return res.status(400).json({
      erro: 'Informe custoTotal e indiceMarkup como números.'
    });
  }

  const precoVenda = custoTotalNumero * indiceMarkupNumero;

  return res.json({
    custoTotal: Number(custoTotalNumero.toFixed(2)),
    indiceMarkup: Number(indiceMarkupNumero.toFixed(2)),
    precoVenda: precoVenda.toFixed(2)
  });
});

module.exports = app;
