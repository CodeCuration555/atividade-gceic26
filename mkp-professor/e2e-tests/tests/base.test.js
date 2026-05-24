const { buildDriver } = require('./mkp/helpers');
const runSplashTest = require('./mkp/splash.test.js');
const runLoginInvalidoTest = require('./mkp/login-invalido.test.js');
const runLoginValidoTest = require('./mkp/login-valido.test.js');
const runDashboardTest = require('./mkp/dashboard.test.js');
const runCalculadoraTest = require('./mkp/calculadora.test.js');
const runSobreTest = require('./mkp/sobre.test.js');
const runHelpTest = require('./mkp/help.test.js');

async function main() {
  console.log('Iniciando os testes funcionais E2E (Selenium)...');
  const driver = await buildDriver();

  try {
    console.log('\n1. Testando Splash Screen...');
    await runSplashTest(driver);

    console.log('\n2. Testando Login com Credenciais Inválidas...');
    await runLoginInvalidoTest(driver);

    console.log('\n3. Testando Login com Credenciais Válidas...');
    await runLoginValidoTest(driver);

    console.log('\n4. Testando Carregamento do Dashboard...');
    await runDashboardTest(driver);

    console.log('\n5. Testando Calculadora de Markup...');
    await runCalculadoraTest(driver);

    console.log('\n6. Testando Tela Sobre a Equipe...');
    await runSobreTest(driver);

    console.log('\n7. Testando Central de Ajuda...');
    await runHelpTest(driver);

    console.log('\nTodos os testes funcionais passaram com sucesso!');
  } catch (error) {
    console.error('\nErro fatal durante a execução dos testes:', error.message);
    process.exit(1);
  } finally {
    console.log('Encerrando driver do Selenium...');
    await driver.quit();
  }
}

main();
