import * as fs from 'fs';
import * as path from 'path';
import { setNewPreviousUpdatedAt } from './hub';

export async function getPreviousUpdatedAt(fallback: string): Promise<string> {
  const pUaPath = path.join(__dirname, '../../previousUpdatedAt.txt');
  try {
    return fs.readFileSync(pUaPath, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('previousUpdatedAt.txt does not exist, use fallback');
    }
    fs.writeFileSync(pUaPath, fallback, { encoding: 'utf-8' });
    await setNewPreviousUpdatedAt(fallback);
    console.warn(e);
    return fallback;
  }
}
