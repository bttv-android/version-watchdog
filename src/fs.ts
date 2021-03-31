import * as fs from 'fs';
import * as path from 'path';
import { setNewAssetlinksHash, setNewPreviousUpdatedAt } from './hub';

export async function getPreviousUpdatedAt(fallback: string): Promise<string> {
  const pUaPath = path.join(__dirname, '../../previousUpdatedAt.txt');
  try {
    return fs.readFileSync(pUaPath, 'utf-8');
  } catch (e) {
    console.log(e.code);

    if (e.code === 'ENOENT') {
      console.log('previousUpdatedAt.txt does not exist, use fallback');
      fs.writeFileSync(pUaPath, fallback, { encoding: 'utf-8' });
      await setNewPreviousUpdatedAt(fallback);
    } else {
      throw e;
    }

    console.warn(e);
    return fallback;
  }
}

export async function getPreviousAssetlinksHash(
  fallback: string,
): Promise<string> {
  const palhPath = path.join(__dirname, '../../assetlinksHash.txt');
  try {
    return fs.readFileSync(palhPath, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('assetlinksHash.txt does not exist, use fallback');
      fs.writeFileSync(palhPath, fallback, { encoding: 'utf-8' });
      await setNewAssetlinksHash(fallback);
    } else {
      throw e;
    }

    console.warn(e);
    return fallback;
  }
}
