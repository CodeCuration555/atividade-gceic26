# atividade-gceic26

## API `/MKP/custos`

Calcula o custo total de um produto a partir dos custos diretos e indiretos.

### Rodar o projeto

```bash
npm install
npm start
```

### Exemplo de uso

```bash
curl -X POST http://localhost:3000/MKP/custos \
  -H "Content-Type: application/json" \
  -d '{"custosDiretos": 120, "custosIndiretos": 30}'
```

### Resposta esperada

```json
{
  "custosDiretos": 120,
  "custosIndiretos": 30,
  "custoTotal": 150
}
```


### Rodar os testes unitários

```bash
npm test
```
