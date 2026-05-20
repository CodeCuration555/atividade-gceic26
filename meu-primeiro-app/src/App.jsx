import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  // Controle de Navegação: 'splash' | 'login' | 'principal' | 'sobre' | 'help'
  const [telaAtual, setTelaAtual] = useState('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. LÓGICA DA SPLASH SCREEN (Roda por 3 segundos e vai para o Login)
  useEffect(() => {
    if (telaAtual === 'splash') {
      const timer = setTimeout(() => {
        setTelaAtual('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [telaAtual]);

  // Função para deslogar
  const handleLogout = () => {
    setIsLoggedIn(false);
    setTelaAtual('login');
  };

  // RENDERIZAÇÃO CONDICIONAL DAS TELAS
  return (
    <div className="app-container">
      {telaAtual === 'splash' && <SplashScreen />}
      
      {telaAtual === 'login' && (
        <TelaLogin onLoginSuccess={() => { setIsLoggedIn(true); setTelaAtual('principal'); }} />
      )}

      {/* Se estiver logado, exibe o Menu de Navegação Superior junto com a respectiva tela */}
      {isLoggedIn && telaAtual !== 'splash' && telaAtual !== 'login' && (
        <>
          <nav className="navbar">
            <div className="nav-logo">CalcMarkup </div>
            <div className="nav-links">
              <button className={telaAtual === 'principal' ? 'active' : ''} onClick={() => setTelaAtual('principal')}>Calculadora</button>
              <button className={telaAtual === 'sobre' ? 'active' : ''} onClick={() => setTelaAtual('sobre')}>Sobre a Equipe</button>
              <button className={telaAtual === 'help' ? 'active' : ''} onClick={() => setTelaAtual('help')}>Ajuda / FAQ</button>
              <button className="logout-btn" onClick={handleLogout}>Sair</button>
            </div>
          </nav>

          <main className="main-content">
            {telaAtual === 'principal' && <TelaPrincipal />}
            {telaAtual === 'sobre' && <TelaSobre />}
            {telaAtual === 'help' && <TelaHelp />}
          </main>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   1. COMPONENTE: SPLASH SCREEN
   ========================================================================== */
function SplashScreen() {
  return (
    <div className="screen-center splash-bg">
      <div className="splash-content">
        <div className="logo-icon"></div>
        <h1>CalcMarkup</h1>
        <p>Carregando o seu sistema financeiro...</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. COMPONENTE: TELA DE LOGIN
   ========================================================================== */
function TelaLogin({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Credenciais fixas solicitadas
    if (usuario === 'admin' && senha === '1234') {
      setErro('');
      onLoginSuccess();
    } else {
      setErro('Usuário ou senha incorretos! (Dica: admin / 1234)');
    }
  };

  return (
    <div className="screen-center login-bg">
      <div className="card login-card">
        <h2>Acesso ao Sistema</h2>
        <p className="subtitle">Insira suas credenciais para continuar</p>
        
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label>Usuário</label>
            <input 
              type="text" 
              placeholder="Digite 'admin'" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required
            />
          </div>
          
          <div className="input-group">
            <label>Senha</label>
            <input 
              type="password" 
              placeholder="Digite '1234'" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required
            />
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. COMPONENTE: TELA PRINCIPAL (CÁLCULO DE MARKUP)
   ========================================================================== */
function TelaPrincipal() {
  const [custoProduto, setCustoProduto] = useState('');
  const [despesasVariaveis, setDespesasVariaveis] = useState('');
  const [despesasFixas, setDespesasFixas] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  
  const [resultado, setResultado] = useState(null);

  const calcularMarkup = (e) => {
    e.preventDefault();
    
    const cp = parseFloat(custoProduto);
    const dv = parseFloat(despesasVariaveis) || 0;
    const df = parseFloat(despesasFixas) || 0;
    const ml = parseFloat(margemLucro) || 0;

    // Soma das porcentagens de despesas e lucro desejado
    const somaPorcentagens = dv + df + ml;

    // Validação para evitar divisão por zero ou markup negativo/infinito
    if (somaPorcentagens >= 100) {
      alert("A soma das despesas e margem de lucro não pode ser maior ou igual a 100%!");
      return;
    }

    // Fórmula: Markup Multiplicador = 100 / (100 - (DV + DF + ML))
    const markupMultiplicador = 100 / (100 - somaPorcentagens);
    const precoVenda = cp * markupMultiplicador;
    const lucroDinheiro = precoVenda - cp - (precoVenda * (dv/100)) - (precoVenda * (df/100));

    setResultado({
      multiplicador: markupMultiplicador.toFixed(2),
      precoVenda: precoVenda.toFixed(2),
      lucro: lucroDinheiro.toFixed(2)
    });
  };

  return (
    <div className="container-calculadora">
      <div className="card">
        <h3>Preencha os dados abaixo</h3>
        <form onSubmit={calcularMarkup} className="form-grid">
          <div className="input-group">
            <label>Custo do Produto (R$)</label>
            <input type="number" step="0.01" value={custoProduto} onChange={(e) => setCustoProduto(e.target.value)} required placeholder="Ex: 50.00" />
          </div>
          <div className="input-group">
            <label>Despesas Variáveis (%) <small>(Impostos, comissões)</small></label>
            <input type="number" step="0.1" value={despesasVariaveis} onChange={(e) => setDespesasVariaveis(e.target.value)} required placeholder="Ex: 10" />
          </div>
          <div className="input-group">
            <label>Despesas Fixas (%) <small>(Aluguel, salários)</small></label>
            <input type="number" step="0.1" value={despesasFixas} onChange={(e) => setDespesasFixas(e.target.value)} required placeholder="Ex: 15" />
          </div>
          <div className="input-group">
            <label>Margem de Lucro Desejada (%)</label>
            <input type="number" step="0.1" value={margemLucro} onChange={(e) => setMargemLucro(e.target.value)} required placeholder="Ex: 20" />
          </div>
          <button type="submit" className="btn-primary btn-full">Calcular Preço Ideal</button>
        </form>
      </div>

      {resultado && (
        <div className="card result-card">
          <h3>Resultados Gerados</h3>
          <hr />
          <div className="result-item">
            <span>Multiplicador Markup:</span>
            <strong>{resultado.multiplicador}x</strong>
          </div>
          <div className="result-item deestaque">
            <span>Preço de Venda Sugerido:</span>
            <strong className="text-sucess">R$ {resultado.precoVenda}</strong>
          </div>
          <div className="result-item">
            <span>Lucro Bruto Estimado:</span>
            <span>R$ {resultado.lucro}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. COMPONENTE: TELA DE SOBRE (A EQUIPE)
   ========================================================================== */
function TelaSobre() {
  // Mock de dados dos integrantes do grupo
  const integrantes = [
    { nome: 'Integrante 1', funcao: 'Desenvolvedor Frontend', foto: 'https://via.placeholder.com/150' },
    { nome: 'Integrante 2', funcao: 'UI/UX Designer', foto: 'https://via.placeholder.com/150' },
    { nome: 'Integrante 3', funcao: 'Product Owner', foto: 'https://via.placeholder.com/150' },
    { nome: 'Integrante 4', funcao: 'QA Tester', foto: 'https://via.placeholder.com/150' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Conheça Nossa Equipe</h2>
      <p style={{ marginBottom: '30px', color: '#666' }}>Projeto desenvolvido para a disciplina de Engenharia / Desenvolvimento de Software.</p>
      
      <div className="team-grid">
        {integrantes.map((membro, index) => (
          <div key={index} className="card team-card">
            <img src={membro.foto} alt={membro.nome} className="team-img" />
            <h4>{membro.nome}</h4>
            <p>{membro.funcao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. COMPONENTE: TELA DE HELP (AJUDA / FAQ)
   ========================================================================== */
function TelaHelp() {
  return (
    <div className="help-container">
      <h2>Central de Ajuda</h2>
      <p className="subtitle">Entenda como extrair o melhor valor da nossa calculadora.</p>
      
      <div className="card faq-section">
        <h3>Como usar a calculadora passo a passo?</h3>
        <ol>
          <li>Informe o <strong>Custo de Aquisição</strong> (quanto você pagou para comprar ou fabricar uma unidade do item).</li>
          <li>Insira o percentual estimado de <strong>Despesas Variáveis</strong> que incidem diretamente sobre a venda (ex: impostos de nota fiscal, taxas de maquininha de cartão).</li>
          <li>Coloque o percentual de rateio das suas <strong>Despesas Fixas</strong> (ex: a fatia de custos como água, luz, internet que cada produto deve pagar).</li>
          <li>Defina qual a <strong>Margem de Lucro</strong> pura você quer que sobre para a empresa.</li>
          <li>Clique em <strong>Calcular Preço Ideal</strong> e veja a mágica acontecer!</li>
        </ol>
      </div>

      <div className="card faq-section">
        <h3>Qual fórmula matemática é utilizada?</h3>
        <p>O sistema automatiza o cálculo padrão do Markup multiplicador baseado na seguinte estrutura matemática:</p>
        <blockquote className="formula-box">
          Markup = 100 / (100 - (DV + DF + ML))
        </blockquote>
        <p>O preço de venda final sugerido é gerado a partir do cálculo: <br /><code>Preço de Venda = Custo do Produto × Markup</code></p>
      </div>
    </div>
  );
}