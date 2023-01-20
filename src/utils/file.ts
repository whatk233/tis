import { TEMPDIR, TIS_BUILDTIME, TWEAK_INCLUDE_NAME } from "../constants.ts";
import { copySync, emptyDirSync, ensureFileSync } from "fs";
import { resolve } from "path";
import { getShortCommit } from "./git.ts";
import getVersion from "./version.ts";

const tisVersion = getVersion();

export function cpCore() {
  if (!TEMPDIR.includes(".TIS_TEMP")) {
    throw new Error();
  }
  const coreDir = Deno.readDirSync(resolve(".", "src", "core"));
  emptyDirSync(TEMPDIR);
  for (const file of coreDir) {
    if (file.isDirectory) {
      copySync(
        resolve(".", "src", "core", file.name),
        resolve(TEMPDIR, file.name),
      );
    } else if (file.isFile) {
      Deno.copyFileSync(
        resolve(".", "src", "core", file.name),
        resolve(TEMPDIR, file.name),
      );
    }
  }
  Deno.mkdirSync(resolve(TEMPDIR, "build"));
  ensureFileSync(resolve(TEMPDIR, "build", "config.ini"));
}

export function delTempdir() {
  if (!TEMPDIR.includes(".TIS_TEMP")) {
    throw new Error();
  }
  emptyDirSync(TEMPDIR);
  Deno.removeSync(TEMPDIR, { recursive: true });
}

export function writeTextToFile(file: string, str: string) {
  const fileInfo = Deno.statSync(resolve(file));
  if (!fileInfo.isFile) {
    throw new Error(`${file} not file!`);
  }
  Deno.writeTextFileSync(file, str);
}

export async function replaceConstants(file: string) {
  const shortGitCommit = await getShortCommit();
  let data = Deno.readTextFileSync(file);
  const replaceArr = [
    ["${G_VERSION}", tisVersion],
    ["${G_BUILDTIME}", TIS_BUILDTIME],
    ["${G_SHORTCOMMIT}", shortGitCommit],
  ];
  replaceArr.map((item) => {
    data = data.replaceAll(item[0], item[1]);
  });
  Deno.writeTextFileSync(file, data);
}

export const writeAutoitFile = {
  codes: [] as string[],
  add(codeStr: string) {
    this.codes.push(codeStr);
    return this;
  },
  done() {
    writeTextToFile(
      resolve(TEMPDIR, TWEAK_INCLUDE_NAME),
      this.codes.join("\n").trim(),
    );
  },
};

export const writeConfigFile = {
  config: [] as string[],
  add(codeStr: string) {
    this.config.push(codeStr);
    return this;
  },
  done() {
    this.config.unshift(`; TIS https://tis.whatk.me`);
    writeTextToFile(
      resolve(TEMPDIR, "build", "config.ini"),
      this.config.join("\n").trim(),
    );
  },
};
