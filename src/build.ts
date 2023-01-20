import "dotenvLoad";
import chalk from "chalk";
import { resolve } from "path";
import { TEMPDIR } from "./constants.ts";
import {
  generateIniSection,
  generateTweakFunc,
  getRuleList,
} from "./tweakRule.ts";
import {
  cpCore,
  delTempdir,
  replaceConstants,
  writeAutoitFile,
  writeConfigFile,
} from "./utils/file.ts";
import { getShortCommit } from "./utils/git.ts";
import * as log from "./utils/log.ts";
import { log as l } from "./utils/log.ts";
import { buildTis } from "./autoit/build.ts";
import getVersion from "./utils/version.ts";

const tisVersion = getVersion();

const DISABLE_DELETE_TEMPDIR = Deno.env.get("DISABLE_DELETE_TEMPDIR")
  ? true
  : false;

log.info(
  `⭐ TIS - ${tisVersion} (${await getShortCommit()})`,
  "(https://tis.whatk.me)",
);

const ruleList = getRuleList();

if (ruleList.length == 0) {
  log.error(`📑 Total 0 Tweak Rules, exit.`);
  Deno.exit(-1);
}

l(`📑 Total ${ruleList.length} Tweak Rules`);
log.info(`🔧 Start generating files`);
l("📑 Generate a temporary folder");
cpCore();
ruleList.map((item) => {
  const { name } = item;
  l(`📑 Generate ${chalk.yellow(name)}`);
  writeAutoitFile.add(generateTweakFunc(name) || "");
  writeConfigFile.add(generateIniSection(name));
});
l(`📑 Write to file`);
writeAutoitFile.done();
writeConfigFile.done();
l("📑 Replacement constants");
const constantsFile = ["tis.au3", "constants.au3"];
constantsFile.map(async (file) => {
  await replaceConstants(resolve(TEMPDIR, file));
});
log.info(`🔨 Start build`);
await buildTis();
if (!DISABLE_DELETE_TEMPDIR) {
  delTempdir();
}
log.success(`✅ Build completed!`);
Deno.exit(0);
