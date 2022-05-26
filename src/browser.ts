import * as puppetteer from 'puppeteer';

const TWITCH_PLAYSTORE_URL =
  'https://play.google.com/store/apps/details?id=tv.twitch.android.app&hl=en_US&gl=US';

export async function getLatestUpdateDate(): Promise<string | undefined> {
  const browser = await puppetteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(TWITCH_PLAYSTORE_URL);

  // At the point of writing, Google Play rolls out a new version of their website
  // Using A/B we sometimes get the new version and sometimes the old
  // So we have to try both
  const oldex = `(() => {
    for (const updatedEl of document.getElementsByTagName('div')) {
      if (updatedEl.innerText.trim().toLowerCase() !== 'updated') {
        continue;
      }
      return updatedEl.parentElement
        ?.querySelector('span')
        ?.innerText.toLowerCase();
    }
  })();`;
  let lastUpdated = await page.evaluate(oldex);

  if (!lastUpdated) {
    const newex = `(() => {
      for (const updatedEl of document.getElementsByTagName('div')) {
        if (updatedEl.innerText.trim().toLowerCase() !== 'updated on') {
          continue;
        }
        if (!updatedEl.parentElement.innerText) return undefined;
        return updatedEl.parentElement.innerText.trim().toLowerCase().split('updated on')[1].trim();
      }
    })();`;
    lastUpdated = await page.evaluate(newex);
  }

  await browser.close();
  return lastUpdated;
}
