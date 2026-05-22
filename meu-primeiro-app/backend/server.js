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

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});