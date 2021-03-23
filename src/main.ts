import { assetlinksWatchdog } from "./assetlinks";
import { versionWatchdog } from "./version";

async function main() {
  await versionWatchdog();
  await assetlinksWatchdog();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
