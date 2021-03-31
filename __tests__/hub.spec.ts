import { RestEndpointMethodTypes } from '@octokit/rest';
import * as hub from '../src/hub';
import octokit from '../src/octokit';
import { mockOctokit } from './util/octokit';

type ParamsType = RestEndpointMethodTypes['issues']['create']['parameters'];
type ReturnType = RestEndpointMethodTypes['issues']['create']['response'];

mockOctokit();

beforeEach(() => {
  jest.restoreAllMocks();
});

test('createIssue should create proper issue request', async () => {
  const spy = jest
    .spyOn(octokit.issues, 'create')
    .mockImplementation((params: ParamsType) => {
      expect(params.title).toEqual('Base update detected (march 27, 2021)');
      expect(params.body).toEqual(
        'The watchdog detected a new update was pushed on march 27, 2021 (last record was on march 22, 2021).\n' +
          'Google Play: https://play.google.com/store/apps/details?id=tv.twitch.android.app&hl=en&gl=us\n' +
          'cc: @bttv-android/developers\n',
      );
      return Promise.resolve({} as ReturnType);
    });
  await hub.createIssue(' march 22, 2021 \n ', 'march 27, 2021  \n');
  expect(spy).toHaveBeenCalled();
});

test('createAssetlinksIssue should create proper issue request', async () => {
  const spy = jest
    .spyOn(octokit.issues, 'create')
    .mockImplementation((params: ParamsType) => {
      expect(params.title).toEqual(
        'New assetlinks.json detected (9054fbe0b622c638224d50d20824d2ff6782e308)',
      );
      expect(params.body).toEqual(
        'The watchdog detected a new assetlinks.json (last record had hash 4e1243bd22c66e76c2ba9eddc1f91394e57f9f83).\n' +
          'https://twitch.tv/.well-known/assetlinks.json\n' +
          'cc: @bttv-android/developers\n',
      );
      return Promise.resolve({} as ReturnType);
    });

  await hub.createAssetlinksIssue(
    ' 4e1243bd22c66e76c2ba9eddc1f91394e57f9f83 \n ',
    '  9054fbe0b622c638224d50d20824d2ff6782e308 \n ',
  );
  expect(spy).toHaveBeenCalled();
});
