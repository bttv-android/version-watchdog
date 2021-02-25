import { Octokit } from '@octokit/rest';
import { Base64 } from 'js-base64';

const octokit = new Octokit({
  auth: process.env.BOT_TOKEN,
});

export async function setNewPreviousUpdatedAt(s: string): Promise<void> {
  console.log('setNewPreviousUpdatedAt', s);
  const old = await octokit.repos.getContent({
    owner: 'bttv-android',
    repo: 'version-watchdog',
    path: 'previousUpdatedAt.txt',
  });
  const { sha } = old.data as { sha: string };
  await octokit.repos.createOrUpdateFileContents({
    owner: 'bttv-android',
    repo: 'version-watchdog',
    path: 'previousUpdatedAt.txt',
    message: 'new version detected',
    content: Base64.encode(s),
    sha: sha,
  });
}

export async function createIssue(
  oldUpdateDate: string,
  newUpdateDate: string,
): Promise<void> {
  const createRes = await octokit.issues.create({
    owner: 'bttv-android',
    repo: 'bttv',
    title: `Base update detected (${newUpdateDate})`,
    body: `The watchdog detected a new update was pushed on ${newUpdateDate.trim()} (last record was on ${oldUpdateDate.trim()}).
    Google Play: https://play.google.com/store/apps/details?id=tv.twitch.android.app&hl=en&gl=us`,
    labels: ['base-update'],
  });
  console.log(createRes);
}
