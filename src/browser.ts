import * as puppetteer from 'puppeteer';

const TWITCH_PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=tv.twitch.android.app&hl=en_US&gl=US';

export async function getLatestUpdateDate(): Promise<string | undefined> {
  const browser = await puppetteer.launch();
  const page = await browser.newPage();
  await page.goto(TWITCH_PLAYSTORE_URL);

  const ex = `(() => {
    for (const updatedEl of document.getElementsByTagName('div')) {
      if (updatedEl.innerText.trim().toLowerCase() !== 'updated') {
        continue;
      }
      return updatedEl.parentElement
        ?.querySelector('span')
        ?.innerText.toLowerCase();
    }
  })();`;
  const lastUpdated = await page.evaluate(ex);
  await browser.close();
  return lastUpdated;
}
