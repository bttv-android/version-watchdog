import { getLatestUpdateDate } from './browser';
import { getPreviousUpdatedAt } from './fs';
import { setNewPreviousUpdatedAt, createOrUpdateIssue } from './hub';

async function main() {
  const lastUpdatedAt: string | undefined = await getLatestUpdateDate();
  console.log('lastUpdatedAt', lastUpdatedAt);
  if (!lastUpdatedAt) {
    throw new Error('lastUpdatedAt is invalid');
  }

  const previousUpdatedAt: string = await getPreviousUpdatedAt(lastUpdatedAt);
  console.log('previousUpdatedAt', previousUpdatedAt);

  if (lastUpdatedAt === previousUpdatedAt) {
    console.log('no update found');
    return;
  }

  console.log('update found!');
  await setNewPreviousUpdatedAt(lastUpdatedAt);
  await createOrUpdateIssue(lastUpdatedAt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
