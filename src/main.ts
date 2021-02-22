import { getLatestUpdateDate } from './browser';
import { getPreviousUpdatedAt } from './fs';
import { setNewPreviousUpdatedAt, createIssue } from './hub';

async function main() {
  const lastUpdatedAt: string | undefined = await getLatestUpdateDate();
  console.log('lastUpdatedAt', lastUpdatedAt);
  if (!lastUpdatedAt) {
    throw new Error('lastUpdatedAt is invalid');
  }

  let previousUpdatedAt: string = await getPreviousUpdatedAt(lastUpdatedAt);
  previousUpdatedAt = previousUpdatedAt.trim();
  console.log('previousUpdatedAt', previousUpdatedAt);

  if (lastUpdatedAt === previousUpdatedAt) {
    console.log('no update found');
    return;
  }

  console.log('update found!');
  await setNewPreviousUpdatedAt(lastUpdatedAt);
  await createIssue(previousUpdatedAt, lastUpdatedAt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
