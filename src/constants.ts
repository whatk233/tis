import "dotenvLoad";
import { resolve } from "path";

const TEMP_ENV = Deno.env.get("temp");
const TWEAK_RULE_PATH_ENV = Deno.env.get("TWEAK_RULE_PATH");
const AUTOIT3WRAPPER_PATH_ENV = Deno.env.get("AUTOIT3WRAPPER_PATH");

export const TIS_BUILDTIME = new Date().toISOString().toString();
export const TWEAK_RULE_PATH = TWEAK_RULE_PATH_ENV
  ? TWEAK_RULE_PATH_ENV
  : "tweaks";
export const TEMPDIR = TEMP_ENV
  ? resolve(TEMP_ENV, ".TIS_TEMP")
  : resolve(".", ".TIS_TEMP");
export const TWEAK_INCLUDE_NAME = "_tweak_include.au3";

export const AUTOIT3WRAPPER_PATH = AUTOIT3WRAPPER_PATH_ENV
  ? AUTOIT3WRAPPER_PATH_ENV
  : "SciTE/AutoIt3Wrapper/AutoIt3Wrapper.exe";
