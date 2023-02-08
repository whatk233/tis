export interface RegWrite {
  key: string;
  valueName: string;
  type:
    | "REG_SZ"
    | "REG_MULTI_SZ"
    | "REG_EXPAND_SZ"
    | "REG_DWORD"
    | "REG_QWORD"
    | "REG_BINARY";
  value: string | number | "";
}

export interface RegDelete {
  key: string;
  valueName: string | "" | undefined;
}

export interface RunCommand {
  command: string;
  action: "cmd" | "pwsh" | undefined | null;
  showWindow: boolean | undefined | null;
  defaultApplyMode: "sysprep" | "desktop" | "all" | undefined | null;
}

export function generateRegWrite(name: string, reg: RegWrite) {
  const { key, valueName, type, value } = reg;
  return `
		_T_RegWrite('${name}','${key}','${valueName}','${type}','${value}')
	`.trim();
}

export function generateRegDelete(name: string, reg: RegDelete) {
  const { key, valueName } = reg;
  return `
		_T_RegDelete('${name}','${key}','${valueName ? valueName : ""}')
	`.trim();
}

export function generateRunCommand(name: string, runCommandConf: RunCommand) {
  const { command, action, showWindow, defaultApplyMode } = runCommandConf;
  const applyMode = defaultApplyMode
    ? defaultApplyMode == "sysprep"
      ? "sysprep"
      : defaultApplyMode == "desktop"
      ? "desktop"
      : defaultApplyMode == "all"
      ? "all"
      : "sysprep"
    : "sysprep";
  const defaultShowWindow = showWindow ? true : false;
  return `
		_T_Run('${name}','${command}','${
    action ? action : "cmd"
  }',${defaultShowWindow},'${applyMode}')
	`.trim();
}

export function generateTweakFuncBlock(name: string, str: string) {
  const ifBlock = () => {
    return `
		If _Config_Tweak_IsApply("${name}") Then
			${str}
		Endif
		`.trim();
  };
  return ifBlock();
}

export function generateCustomCommand(name:string) {
	return `${name}()`
}
