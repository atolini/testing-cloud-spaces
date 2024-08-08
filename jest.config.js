module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    "@middleware-suite/(.*)": "<rootDir>/lambda/middleware-suite/$1",
    "@model/(.*)": "<rootDir>/lambda/model/$1",
    "@middleware": "<rootDir>/lambda/middleware",
    "@pipeline": "<rootDir>/lambda/pipeline",
  }
};
