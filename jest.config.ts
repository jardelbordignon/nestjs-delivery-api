export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: './prisma/test-environment.ts',

  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.controller.(t|j)s'],
  coverageDirectory: '../coverage',
}
