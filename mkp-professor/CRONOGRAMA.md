# Cronograma de Implantação de Features - CalcMarkup

Este documento estabelece o plano cronológico de desenvolvimento, testes e implantação do projeto **CalcMarkup**, atendendo às metas e entregas parciais da disciplina.

---

## 📅 Linha do Tempo de Entregas e Milestones

| Período / Data | Milestone / Entrega | Descrição Detalhada | Responsável | Status |
| :--- | :--- | :--- | :--- | :--- |
| **05/05 a 12/05** | **Fase 1: Concepção & Modelagem** | Definição do tema (MarkUp), levantamento de regras matemáticas de cálculo financeiro e modelagem inicial do banco/API. | Grupo | **Concluído** |
| **12/05 a 18/05** | **Fase 2: APIs de Negócio Individuais** | Desenvolvimento das APIs Node.js/Express: custos diretos/indiretos, multiplicador markup e preço ideal de venda. | João, Lucca, Augusto | **Concluído** |
| **18/05 a 22/05** | **Fase 3: Interface React & Adaptação EJS** | Construção da SPA do frontend, estilização moderna, splash screen animada, formulários, tela "Sobre" e "Central de Ajuda". Reestruturação no padrão do repositório monorepo do professor. | Lucca, João | **Concluído** |
| **23/05 a 24/05** | **Fase 4: Testes Unitários & Integração** | Implementação de testes de backend com **Jest** e **Supertest**, atingindo 100% de cobertura nos endpoints da API. Integração de todas as rotas em um monorepo funcional. | Augusto, João | **Concluído** |
| **25/05** | **Entrega Parcial (30% da Nota)** | **Envio no Canvas:** Código unificado, APIs funcionais, app adaptado ao monorepo e testes unitários validados no Git. | João | **Pronto** |
| **26/05 a 29/05** | **Fase 5: Automação CI/CD & E2E** | Criação e ajuste das rotinas do GitHub Actions (`ci.yml`) para testes automáticos a cada push. Validação dos testes funcionais com Selenium WebDriver. | Augusto | **Em Andamento** |
| **30/05 a 31/05** | **Fase 6: Homologação & QA** | Testes cruzados do frontend com o backend simulando latência e dados incorretos. Geração das capturas de tela (screenshots) automatizadas do Selenium. | Grupo | **Pendente** |
| **01/06** | **Entrega Final (40% da Nota)** | **Apresentação e Testes Funcionais:** Demonstração prática do site integrado operando em ambiente de produção (Render) e aprovação de todos os testes Selenium perante o professor. | Grupo | **Pendente** |

---

## 🛠️ Divisão Detalhada de Desenvolvimento das Features

### 👤 João Pedro Pires de Andrade
- **Feature:** API de Cálculo de Custos Totais (`POST /MKP/custos`)
- **Atividades:** 
  * Desenvolvimento da lógica de soma de custos diretos e indiretos no backend Express.
  * Validações de payload numérico de entrada e formatação de saída financeira com duas casas decimais.
  * Escrita e manutenção de arquivos de testes unitários para a rota `/custos`.

### 👤 Lucca Schroelder Scovini
- **Feature:** Interface do Usuário SPA (Frontend EJS / React) e API de Markup (`POST /MKP/markup`)
- **Atividades:**
  * Lógica matemática do índice de Markup: `100 / (100 - (DV + DF + ML))`.
  * Criação da Splash Screen animada (timer de 3 segundos), tela de Login de usuário com bypass de credenciais fixas (`admin`/`1234`).
  * Construção da UI responsiva utilizando a biblioteca de ícones Lucide.

### 👤 Augusto Fidélis dos Santos Custódio
- **Feature:** Lógica de Preço de Venda Final (`POST /MKP/preco-venda`) e Automação de Infraestrutura
- **Atividades:**
  * Endpoint backend para multiplicar custo total pelo multiplicador de markup retornado pela API.
  * Desenvolvimento e orquestração dos scripts de testes de ponta a ponta (E2E) com Selenium WebDriver.
  * Criação e configuração do pipeline do GitHub Actions para integração contínua (CI).
