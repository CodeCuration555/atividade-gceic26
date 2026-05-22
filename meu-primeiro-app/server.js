const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/MKP/markup', (req, res) => {
  const { custoProduto, despesasVariaveis, despesasFixas, margemLucro } = req.body;
  const cp = parseFloat(custoProduto);
  const dv = parseFloat(despesasVariaveis) || 0;
  const df = parseFloat(despesasFixas) || 0;
  const ml = Math.min(parseFloat(margemLucro) || 0, 20); 

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

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});