import jestConfig from './jest.config'

export default {
  ...jestConfig,

  testRegex: '.*\\.e2e-spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage-e2e',
}
