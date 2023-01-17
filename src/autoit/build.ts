import { AUTOIT3WRAPPER_PATH, TEMPDIR } from "../constants.ts";
import { resolve } from "path";
import { emptyDirSync } from "fs";
import * as log from "../utils/log.ts";
import { log as l } from "../utils/log.ts";

export async function buildTis() {
  const autoIt3WrapperPath = getAutoIt3WrapperPath();
  const tisSourcePath = resolve(TEMPDIR, "tis.au3");
  const cmd = [autoIt3WrapperPath, "/NoStatus", "/prod", "/in", tisSourcePath];
  if (!Deno.statSync(tisSourcePath).isFile) {
    throw new Error("TIS temp source not found!");
  }
  const process = Deno.run({
    cmd,
    cwd: TEMPDIR,
    stderr: "piped",
    stdout: "piped",
  });
  const [status, stdout, stderr] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();
  log.info("AutoIt3Wrapper stdout start ==>");
  l(new TextDecoder().decode(stdout).trim());
  log.info("AutoIt3Wrapper stdout end   <==");
  log.error("AutoIt3Wrapper stderr start ==>");
  log.error(new TextDecoder().decode(stderr).trim());
  log.error("AutoIt3Wrapper stderr end   <==");
  if (
    status.success ||
    Deno.statSync(resolve(TEMPDIR, "build", "tis.exe")).isFile
  ) {
    const tempBuildPath = resolve(TEMPDIR, "build");
    const buildDirPath = resolve(".", "build");
    const tempBuildDir = Deno.readDirSync(tempBuildPath);
    emptyDirSync(buildDirPath);
    for (const file of tempBuildDir) {
      if (file.isFile) {
        Deno.copyFileSync(
          resolve(tempBuildPath, file.name),
          resolve(buildDirPath, file.name)
        );
      }
    }
    return true;
  } else {
    throw new Error("TIS Compile failure!");
  }
}

export function getAutoIt3WrapperPath() {
  const AUTOIT_COMPILER_TOOLKIT = Deno.env.get("AUTOIT_COMPILER_TOOLKIT");
  if (!AUTOIT_COMPILER_TOOLKIT) {
    throw new Error("AUTOIT_COMPILER_TOOLKIT env is emtpy!");
  }
  const autoIt3WrapperBinPATH = resolve(
    AUTOIT_COMPILER_TOOLKIT,
    AUTOIT3WRAPPER_PATH
  );
  if (!Deno.statSync(autoIt3WrapperBinPATH).isFile) {
    throw new Error("AutoIt3Wrapper.exe not found!");
  }
  return autoIt3WrapperBinPATH;
}
