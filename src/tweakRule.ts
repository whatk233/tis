import { TWEAK_RULE_PATH } from "./constants.ts";
import { extname, resolve } from "path";
import { parse as yamlParse } from "yaml";
import { stringify as iniStringify } from "ini";
import {
  generateRegDelete,
  generateRegWrite,
  generateRunCommand,
  generateTweakFuncBlock,
} from "./autoit/generate.ts";

interface TweakConfig {
  meta: {
    [index: string]: {
      [index: string]: string;
    };
  };
  applyDefaultUser: boolean;
  tweaks: {
    registry:
      | {
          key: string;
          valueName: string;
          type:
            | "REG_SZ"
            | "REG_MULTI_SZ"
            | "REG_EXPAND_SZ"
            | "REG_DWORD"
            | "REG_QWORD"
            | "REG_BINARY";
          value: string;
          action: "delete" | undefined | null;
        }[]
      | undefined;
    run:
      | {
          command: string;
          action: "pwsh" | "cmd" | null | undefined;
          showWindow: boolean | undefined | null;
          defaultApplyMode: "sysprep" | "desktop" | "all" | undefined | null;
        }[]
      | undefined;
  };
}

export function getRuleList() {
  const result = [];
  const tweaksRuleDir = Deno.readDirSync(resolve(TWEAK_RULE_PATH));
  for (const dirEntry of tweaksRuleDir) {
    if (dirEntry.isFile && extname(dirEntry.name) == ".yaml") {
      const tweakFileObj = {
        name: dirEntry.name.replace(".yaml", ""),
        fileName: dirEntry.name,
      };
      result.push(tweakFileObj);
    }
  }
  return result;
}

export function parse(name: string) {
  const file = Deno.readTextFileSync(resolve(TWEAK_RULE_PATH, `${name}.yaml`));
  const result = yamlParse(file);
  return result;
}

export function generateTweakFunc(name: string) {
  const tweakCode: string[] = [];
  const tweakParse = parse(name) as TweakConfig;
  const registryTweak = tweakParse.tweaks.registry;
  const runTweak = tweakParse.tweaks.run;
  if (registryTweak && registryTweak.length > 0) {
    registryTweak.map((reg) => {
      const { key, type, valueName, value, action } = reg;
      if (action == "delete") {
        tweakCode.push(
          generateRegDelete(name, {
            key,
            valueName: valueName ? valueName : "",
          })
        );
      } else {
        tweakCode.push(
          generateRegWrite(name, {
            key,
            type,
            valueName,
            value,
          })
        );
      }
    });
  }
  if (runTweak && runTweak.length > 0) {
    runTweak.map((item) => {
      const { command, action, showWindow, defaultApplyMode } = item;
      tweakCode.push(
        generateRunCommand(name, {
          command,
          action,
          showWindow,
          defaultApplyMode,
        })
      );
    });
  }
  return generateTweakFuncBlock(name, tweakCode.join("\n"));
}

export function generateIniSection(name: string) {
  const tweakParse = parse(name) as TweakConfig;
  const { meta } = tweakParse;
  const content: string[] = [];
  const notes = () => {
    const content: string[] = [];
    Object.keys(meta).map((langKey) => {
      const noteObj = meta[langKey];
      Object.keys(noteObj).map((key) => {
        content.push(`; ${key}: ${noteObj[key]}`);
      });
    });
    return content.join("\n");
  };
  content.push(`[${name}]`);
  content.push(notes());
  if (tweakParse.applyDefaultUser) {
    content.push(iniStringify({ apply: 0, applyDefaultUser: 0 }));
  } else {
    content.push(iniStringify({ apply: 0 }));
  }
  return content.join("\n");
}
