import { useState, useEffect } from 'react';
import './App.css';
import fotoGrupo from './assets/foto_grupo_placeholder.png';
import fotoIntegrante from './assets/foto_integrante_placeholder.png';
import fotoIntegrante2 from './assets/foto_integrante_placeholder2.png';
import fotoIntegrante3 from './assets/foto_integrante_placeholder3.png';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('splash');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(true);

  useEffect(() => {
    if (telaAtual === 'splash') {
      const timer = setTimeout(() => {
        setTelaAtual('login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [telaAtual]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [telaAtual, sidebarAberta]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTelaAtual('login');
  };

  if (telaAtual === 'splash') return <SplashScreen />;
  if (telaAtual === 'login') {
    return (
      <TelaLogin onLoginSuccess={() => { setIsLoggedIn(true); setTelaAtual('principal'); }} />
    );
  }

  return (
    <div className="app-container">
      <div className={`dashboard-layout ${sidebarAberta ? 'sidebar-expandida' : 'sidebar-recolhida'}`}>
        
        <nav className="sidebar">
          <div className="sidebar-header">
            <span className="nav-logo">CM</span>
            <button className="toggle-sidebar-btn" onClick={() => setSidebarAberta(!sidebarAberta)}>
              <i data-lucide="menu"></i>
            </button>
          </div>

          <div className="sidebar-links">
            <button className={telaAtual === 'principal' ? 'active' : ''} onClick={() => setTelaAtual('principal')}>
              <i data-lucide="calculator" className="icon-lucide"></i>
              <span className="link-text">Calculadora</span>
            </button>
            <button className={telaAtual === 'sobre' ? 'active' : ''} onClick={() => setTelaAtual('sobre')}>
              <i data-lucide="users" className="icon-lucide"></i>
              <span className="link-text">Sobre a Equipe</span>
            </button>
            <button className={telaAtual === 'help' ? 'active' : ''} onClick={() => setTelaAtual('help')}>
              <i data-lucide="help-circle" className="icon-lucide"></i>
              <span className="link-text">Ajuda / FAQ</span>
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <i data-lucide="log-out" className="icon-lucide"></i>
            <span className="link-text">Sair</span>
          </button>
        </nav>

        <main className="main-content">
          {telaAtual === 'principal' && <TelaPrincipal />}
          {telaAtual === 'sobre' && <TelaSobre />}
          {telaAtual === 'help' && <TelaHelp />}
        </main>

      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <div className="screen-center splash-bg">
      <div className="splash-content">
        <h1>CalcMarkup</h1>
        <p>Carregando o seu sistema financeiro...</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

function TelaLogin({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === '1234') {
      setErro('');
      onLoginSuccess();
    } else {
      setErro('Usuário ou senha incorretos!');
    }
  };

  return (
    <div className="screen-center login-bg">
      <div className="card login-card">
        <h2>Entrar</h2>
        <p className="subtitle">Insira suas credenciais para continuar</p>
        <form onSubmit={handleLoginSubmit} className="form-grid">
          <div className="input-group">
            <input type="text" placeholder="Usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          {erro && <p className="error-message">{erro}</p>}
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  );
}

function TelaPrincipal() {
  const [custoProduto, setCustoProduto] = useState('');
  const [despesasVariaveis, setDespesasVariaveis] = useState('');
  const [despesasFixas, setDespesasFixas] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  const [resultado, setResultado] = useState(null);
  const apiBaseUrl = '/MKP';

  // Integração com a API via requisição HTTP POST
  const calcularMarkup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/markup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          custoProduto,
          despesasVariaveis,
          despesasFixas,
          margemLucro
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.erro || 'Ocorreu um erro ao processar o cálculo.');
        return;
      }

      // Aplica os dados retornados pela API nos states da aplicação
      setResultado({
        multiplicador: data.multiplicador,
        precoVenda: data.precoVenda
      });

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      alert('Não foi possível conectar ao servidor backend. Verifique se ele está rodando na porta 5000.');
    }
  };

  return (
    <div className="container-calculadora">
      <div className="card">
        <h3>Preencha os dados abaixo</h3>
        <form onSubmit={calcularMarkup} className="form-grid">
          <div className="input-group"><label>Custo do Produto (R$)</label><input type="number" step="0.01" value={custoProduto} onChange={(e) => setCustoProduto(e.target.value)} required placeholder="Ex: 50.00" /></div>
          <div className="input-group"><label>Despesas Variáveis (%)</label><input type="number" value={despesasVariaveis} onChange={(e) => setDespesasVariaveis(e.target.value)} required placeholder="Ex: 10" /></div>
          <div className="input-group"><label>Despesas Fixas (%)</label><input type="number" value={despesasFixas} onChange={(e) => setDespesasFixas(e.target.value)} required placeholder="Ex: 15" /></div>
          <div className="input-group"><label>Margem Desejada (%) <small>(Max 20%)</small></label><input type="number" max="20" value={margemLucro} onChange={(e) => setMargemLucro(e.target.value)} required placeholder="Ex: 20" /></div>
          <button type="submit" className="btn-primary">Calcular Preço Ideal</button>
        </form>
      </div>
      {resultado && (
        <div className="card result-card">
          <div className="result-item"><span>Markup Multiplicador:</span><strong>{resultado.multiplicador}x</strong></div>
          <div className="deestaque"><span>Preço Sugerido:</span><strong className="text-sucess">R$ {resultado.precoVenda}</strong></div>
        </div>
      )}
    </div>
  );
}

function TelaSobre() {
  return (
    <div className="team-container-center">
      <h2>Conheça Nossa Equipe</h2>
      <p className="subtitle">Projeto desenvolvido para a disciplina de Gerência de Configuração, Entrega e Integração Contínua no curso de Engenharia de Software.</p>
      <div className="team-photo-card card">
        <img src={fotoGrupo} alt="Foto do grupo" className="team-photo" />
      </div>
      <h2>Contribuições</h2>
      <div className="team-grid">
        <div className="card team-card"><img src={fotoIntegrante} alt="Foto do integrante João Pedro Pires de Andrade" className="team-img" /><h4>João Pedro Pires de Andrade</h4><p>Representante do grupo, Desenvolvedor do Backend e API /MKP/custos</p></div>
        <div className="card team-card"><img src={fotoIntegrante2} alt="Foto do integrante Lucca Schroelder Scovini" className="team-img" /><h4>Lucca Schroelder Scovini</h4><p>Desenvolvedor do Frontend e API /MKP/markup</p></div>
        <div className="card team-card"><img src={fotoIntegrante3} alt="Foto do integrante Augusto Fidélis dos Santos Custódio" className="team-img" /><h4>Augusto Fidélis dos Santos Custódio</h4><p>DevOps, Qualidade, Documentação e API /MKP/preco-venda</p></div>
      </div>
    </div>
  );
}

function TelaHelp() {
  return (
    <div className="help-container">
      <h2>Central de Ajuda</h2>
      <p className="subtitle">Entenda como extrair o melhor valor da nossa calculadora.</p>
      <div className="card faq-section"><h3>Fórmula Utilizada</h3><div className="formula-box">Markup = 100 / (100 - (DV + DF + ML))</div></div>
    </div>
  );
}