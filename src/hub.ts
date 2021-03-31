import { Base64 } from 'js-base64';
import octokit from './octokit';

async function overwriteFile(
  file: string,
  newcontent: string,
  commitMessage: string,
): Promise<void> {
  const old = await octokit.repos.getContent({
    owner: 'bttv-android',
    repo: 'version-watchdog',
    path: file,
  });
  const { sha } = old.data as { sha: string };
  await octokit.repos.createOrUpdateFileContents({
    owner: 'bttv-android',
    repo: 'version-watchdog',
    path: file,
    message: commitMessage,
    content: Base64.encode(newcontent),
    sha: sha,
  });
}

export async function setNewPreviousUpdatedAt(s: string): Promise<void> {
  return overwriteFile('previousUpdatedAt.txt', s, 'new version detected');
}

export async function setNewAssetlinksHash(s: string): Promise<void> {
  return overwriteFile('assetlinksHash.txt', s, 'new assetlinks.json detected');
}

export async function createIssue(
  oldUpdateDate: string,
  newUpdateDate: string,
): Promise<void> {
  const createRes = await octokit.issues.create({
    owner: 'bttv-android',
    repo: 'bttv',
    title: `Base update detected (${newUpdateDate.trim()})`,
    body:
      `The watchdog detected a new update was pushed on ${newUpdateDate.trim()} (last record was on ${oldUpdateDate.trim()}).\n` +
      `Google Play: https://play.google.com/store/apps/details?id=tv.twitch.android.app&hl=en&gl=us\n` +
      `cc: @bttv-android/developers\n`,
    labels: ['base-update'],
  });
  console.log(createRes);
}

export async function createAssetlinksIssue(
  oldHash: string,
  newHash: string,
): Promise<void> {
  const createRes = await octokit.issues.create({
    owner: 'bttv-android',
    repo: 'bttv',
    title: `New assetlinks.json detected (${newHash.trim()})`,
    body:
      `The watchdog detected a new assetlinks.json (last record had hash ${oldHash.trim()}).\n` +
      `https://twitch.tv/.well-known/assetlinks.json\n` +
      `cc: @bttv-android/developers\n`,
    labels: ['base-update'],
  });
  console.log(createRes);
}
