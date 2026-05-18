const express = require('express');

const app = express();
app.use(express.json());

app.post('/MKP/custos', (req, res) => {
  const { custosDiretos, custosIndiretos } = req.body;

  if (typeof custosDiretos !== 'number' || typeof custosIndiretos !== 'number') {
    return res.status(400).json({
      erro: 'Informe custosDiretos e custosIndiretos como números.'
    });
  }

  const custoTotal = custosDiretos + custosIndiretos;

  return res.json({
    custosDiretos,
    custosIndiretos,
    custoTotal
  });
});

module.exports = app;
