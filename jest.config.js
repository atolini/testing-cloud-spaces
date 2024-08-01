module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    "@middleware-suite/(.*)": "<rootDir>/lambda/middleware-suite/$1",
    "@middleware": "<rootDir>/lambda/middleware"
  }
};
