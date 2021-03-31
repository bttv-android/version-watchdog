import * as browser from '../src/browser';
import * as puppetteer from 'puppeteer';

jest.mock('puppeteer');

test('getLatestUpdateDate should start puppetteer', async () => {
  mock();
  const res = await browser.getLatestUpdateDate();
  expect(res).toEqual('test');
});

function mock() {
  (puppetteer.launch as jest.MockedFunction<() => unknown>).mockImplementation(
    () => ({
      newPage: () => ({
        goto: jest.fn(),
        evaluate: jest.fn().mockReturnValue('test'),
      }),
      close: jest.fn(),
    }),
  );
}
