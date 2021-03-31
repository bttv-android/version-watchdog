import * as actualFs from 'fs';
import * as fs from '../src/fs';
import * as hub from '../src/hub';

function mockReadFileSync(mock: (p: string) => unknown) {
  type t = jest.MockedFunction<(p: string) => unknown>;

  (actualFs.readFileSync as t).mockImplementationOnce(mock);
}

interface FsError extends Error {
  code: string;
}

jest.mock('fs');
jest.mock('../src/hub');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getPreviousUpdatedAt', () => {
  it('should get data from disk', async () => {
    mockReadFileSync((path: string) => {
      expect(path).toContain('previousUpdatedAt.txt');
      return 'dataOnDisk';
    });
    const res = await fs.getPreviousUpdatedAt('fallback');
    expect(res).toEqual('dataOnDisk');
  });

  it('should handle fallback when file not found', async () => {
    mockReadFileSync(() => {
      const e = new Error();
      (e as FsError).code = 'ENOENT';
      throw e;
    });
    const res = await fs.getPreviousUpdatedAt('fallback');
    expect(res).toEqual('fallback');
    expect(actualFs.writeFileSync).toHaveBeenCalledWith(
      expect.anything(),
      'fallback',
      expect.anything(),
    );
    expect(hub.setNewPreviousUpdatedAt).toHaveBeenCalled();
  });

  it('should pass all other errors up the stack', async () => {
    mockReadFileSync(() => {
      const e = new Error();
      (e as FsError).code = 'EPERM'; // e.g. permission issue
      throw e;
    });

    await expect(fs.getPreviousUpdatedAt('fallback')).rejects.toThrow();
    expect(actualFs.writeFileSync).not.toHaveBeenCalled();
    expect(hub.setNewPreviousUpdatedAt).not.toHaveBeenCalled();
  });
});

describe('getPreviousAssetlinksHash', () => {
  it('should get data from disk', async () => {
    mockReadFileSync((path: string) => {
      expect(path).toContain('assetlinksHash.txt');
      return 'dataOnDisk';
    });
    const res = await fs.getPreviousAssetlinksHash('fallback');
    expect(res).toEqual('dataOnDisk');
  });

  it('should handle fallback when file not found', async () => {
    mockReadFileSync(() => {
      const e = new Error();
      (e as FsError).code = 'ENOENT';
      throw e;
    });
    const res = await fs.getPreviousAssetlinksHash('fallback');
    expect(res).toEqual('fallback');
    expect(actualFs.writeFileSync).toHaveBeenCalledWith(
      expect.anything(),
      'fallback',
      expect.anything(),
    );
    expect(hub.setNewAssetlinksHash).toHaveBeenCalled();
  });

  it('should pass all other errors up the stack', async () => {
    mockReadFileSync(() => {
      const e = new Error();
      (e as FsError).code = 'EPERM'; // e.g. permission issue
      throw e;
    });

    await expect(fs.getPreviousAssetlinksHash('fallback')).rejects.toThrow();
    expect(actualFs.writeFileSync).not.toHaveBeenCalled();
    expect(hub.setNewAssetlinksHash).not.toHaveBeenCalled();
  });
});
