# MKP Professor

Versão independente do projeto MKP, organizada no padrão do repositório do professor.

## O que tem aqui

- `api/` - API Express com as rotas do MKP e testes unitários.
- `app/` - Site Express + EJS que entrega a interface.
- `e2e-tests/` - Testes funcionais com Selenium e screenshots.

## Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Google Chrome instalado para rodar os testes E2E.

## Instalação

Abra um terminal na pasta `mkp-professor` e rode:

```powershell
cd api
npm install

cd ..\app
npm install

cd ..\e2e-tests
npm install
```

Se preferir, você pode instalar cada pasta separadamente em qualquer terminal, desde que esteja dentro de `mkp-professor`.

## Como rodar o app

### 1. Inicie a API

```powershell
cd api
npm start
```

A API sobe em `http://localhost:3001`.

### 2. Inicie o site

Abra outro terminal na pasta `mkp-professor`:

```powershell
cd app
npm start
```

O site sobe em `http://localhost:3000` e abre a tela do MKP em `/MKP`.

## Como rodar os testes

### Testes unitários da API

```powershell
cd api
npm test
```

Esse comando valida `GET /health` e as rotas do MKP.

### Testes funcionais E2E

Antes de rodar os testes E2E, deixe a API e o site abertos em dois terminais diferentes.

```powershell
cd e2e-tests
npm test
```

Os testes usam Selenium, percorrem splash, login, dashboard, calculadora, sobre e ajuda, e salvam screenshots dentro de `e2e-tests/screenshots/`.

## Fluxo completo recomendado

1. Instalar dependências em `api`, `app` e `e2e-tests`.
2. Rodar `api`.
3. Rodar `app`.
4. Rodar `api` tests com `npm test` dentro de `api`.
5. Rodar `e2e-tests` com `npm test` dentro de `e2e-tests`.

## Estrutura esperada dos testes E2E

- `e2e-tests/tests/base.test.js` - orquestra toda a suíte.
- `e2e-tests/tests/mkp/helpers.js` - funções compartilhadas do Selenium.
- `e2e-tests/tests/mkp/*.test.js` - testes por tela e fluxo.
- `e2e-tests/screenshots/` - imagens geradas pelos testes.

## Observações

- Não é necessário usar caminhos absolutos.
- Todos os comandos acima funcionam a partir da pasta `mkp-professor`.
- Se algum terminal estiver em outra pasta, volte para `mkp-professor` com `cd` antes de rodar os comandos.
