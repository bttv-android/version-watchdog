import { createHash } from 'crypto';
import fetch from 'node-fetch';
import { getPreviousAssetlinksHash } from './fs';
import { createAssetlinksIssue, setNewAssetlinksHash } from './hub';

const URL = `https://twitch.tv/.well-known/assetlinks.json`;

export async function assetlinksWatchdog(): Promise<void> {
  const hash: string | undefined = await getHash();
  console.log('hash', hash);
  if (!hash) {
    throw new Error('hash is invalid');
  }
  let previousHash: string = await getPreviousAssetlinksHash(hash);
  previousHash = previousHash.trim();
  console.log('previousHash', previousHash);
  if (hash === previousHash) {
    console.log('no update found');
    return;
  }
  console.log('update found!');
  await setNewAssetlinksHash(hash);
  await createAssetlinksIssue(previousHash, hash);
}

async function getHash(): Promise<string> {
  const res = await fetch(URL);
  return createHash('sha256')
    .update(await res.text())
    .digest('hex');
}
