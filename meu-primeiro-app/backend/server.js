const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Permite que o React (que roda em outra porta) acesse a API
app.use(cors());
// Permite que a API leia o formato JSON enviado pelo front-end
app.use(express.json());

// Rota POST solicitada pelo documento: /MKP/markup
app.post('/MKP/markup', (req, res) => {
  const { custoProduto, despesasVariaveis, despesasFixas, margemLucro } = req.body;

  // Converte os valores para números flutuantes e valida as entradas
  const cp = parseFloat(custoProduto);
  const dv = parseFloat(despesasVariaveis) || 0;
  const df = parseFloat(despesasFixas) || 0;
  // Limita a margem ao teto máximo de 20% conforme a regra de negócio do app
  const ml = Math.min(parseFloat(margemLucro) || 0, 20); 

  if (Number.isNaN(cp) || Number.isNaN(parseFloat(despesasVariaveis)) || Number.isNaN(parseFloat(despesasFixas)) || Number.isNaN(parseFloat(margemLucro))) {
    return res.status(400).json({
      error: 'Informe custoProduto, despesasVariaveis, despesasFixas e margemLucro como números.'
    });
  }

  const somaTaxas = dv + df + ml;

  // Validação: a soma das taxas não pode ser maior ou igual a 100% (evita divisão por zero ou negativa)
  if (somaTaxas >= 100) {
    return res.status(400).json({ 
      error: 'A soma das despesas e margem de lucro não pode atingir ou ultrapassar 100%.' 
    });
  }

  // Execução da fórmula matemática do Markup
  const mk = 100 / (100 - somaTaxas);
  const pv = cp * mk;

  // Retorna os dados calculados formatados
  return res.json({
    multiplicador: mk.toFixed(2),
    precoVenda: pv.toFixed(2)
  });
});

// Rota de custos para manter a API do projeto unificada no mesmo servidor
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

// Rota final do Augusto: junta o custo total com o índice de markup
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
  });
}

module.exports = app;