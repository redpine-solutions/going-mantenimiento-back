module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/database/models/$1',
    '^@models$': '<rootDir>/src/database/models',
    '^@errors/(.*)$': '<rootDir>/src/api/v2/lib/errors/$1',
    '^@errors$': '<rootDir>/src/api/v2/lib/errors',
    '^@logs/(.*)$': '<rootDir>/src/api/v2/lib/logs/$1',
    '^@logs$': '<rootDir>/src/api/v2/lib/logs',
    '^@envs/(.*)$': '<rootDir>/src/api/v2/lib/environment/$1',
    '^@envs$': '<rootDir>/src/api/v2/lib/environment',
    '^@middlewares/(.*)$': '<rootDir>/src/api/v2/lib/middlewares/$1',
    '^@middlewares$': '<rootDir>/src/api/v2/lib/middlewares',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/__tests__/**'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
