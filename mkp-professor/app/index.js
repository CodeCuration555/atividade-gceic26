const path = require('path');
const express = require('express');
const app = express();

const API_URL = process.env.API_URL || 'http://localhost:3001';
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve app-specific static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Also expose the legacy assets so we don't have to copy images (read-only)
const legacyAssets = path.join(__dirname, '..', '..', 'meu-primeiro-app', 'src', 'assets');
app.use('/assets', express.static(legacyAssets));

app.use(express.json());

app.get('/MKP', (req, res) => {
  res.render('mkp');
});

// Proxy POST requests to the API so client can call /MKP/* like before
// Proxy specific MKP endpoints to the API (keeps same contract)
async function proxyToApi(path, req, res) {
  try {
    const target = `${API_URL}${path}`;
    const fetchRes = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await fetchRes.text();
    res.status(fetchRes.status).type('application/json').send(data);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Erro ao encaminhar a requisição para a API.' });
  }
}

app.post('/MKP/markup', (req, res) => proxyToApi('/MKP/markup', req, res));
app.post('/MKP/custos', (req, res) => proxyToApi('/MKP/custos', req, res));
app.post('/MKP/preco-venda', (req, res) => proxyToApi('/MKP/preco-venda', req, res));

app.get('/', (req, res) => res.redirect('/MKP'));

if (require.main === module) {
  app.listen(PORT, () => console.log(`App server running on port ${PORT} (API_URL=${API_URL})`));
}

module.exports = app;
