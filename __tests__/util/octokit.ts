import { Octokit } from '@octokit/rest';

export function mockOctokit(): void {
  jest.mock('../../src/octokit', () => ({
    __esModule: true,
    default: new Octokit({
      request: { fetch: jest.fn() },
    }),
  }));
}
