module.exports = {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>', '<rootDir>/__tests__'],
    moduleFileExtensions: ['js', 'json'],
    testMatch: [
      "**/__tests__/**/*.js",
      "**/?(*.)+(spec|test).js"
    ]
  };
  