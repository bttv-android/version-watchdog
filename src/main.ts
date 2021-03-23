import { versionWatchdog } from "./version";

async function main() {
  await versionWatchdog();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
