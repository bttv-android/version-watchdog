import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function setNewPreviousUpdatedAt(s: string): Promise<void> {
  console.log('setNewPreviousUpdatedAt', s);
  octokit.repos.createOrUpdateFileContents({
    owner: 'bttv-android',
    repo: 'version-watchdog',
    path: 'previousUpdatedAt.txt',
    message: 'new version detected',
    content: s,
  });
}

export async function createOrUpdateIssue(
  newUpdateDate: string,
): Promise<void> {
  octokit.issues.listForRepo({
    owner: 'bttv-android',
    repo: 'bttv',
    creator: 'github-actions[bot]',
  });
}
