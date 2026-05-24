module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: ['app.js'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: '.', outputName: 'junit.xml' }]
  ]
};
