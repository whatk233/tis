#include-once
If @OSArch = 'X64' Then
	Global $G_HKLM = "HKLM64"
Else
	Global $G_HKLM = "HKLM"
EndIf

Global Const $G_NAME = "TIS"
Global Const $G_VERSION = "${G_VERSION}"
Global Const $G_SHORTCOMMIT = "${G_SHORTCOMMIT}"
Global Const $G_BUILDTIME = "${G_BUILDTIME}"
Global Const $G_FULLVERSION = $G_VERSION & " (" & $G_SHORTCOMMIT & ")"
Global Const $G_FULLNAME = "TIS " & $G_FULLVERSION

Global Const $G_CONFIG_NAME = "config.ini"
Global Const $G_CONFIG_PATH = @ScriptDir & "\" & $G_CONFIG_NAME

Global Const $G_NTUSER_MOUNT_ROOT = "HKLM\WIS_NTUSER"
Global Const $G_NTUSER_MOUNT_ROOT64 = $G_HKLM & "\WIS_NTUSER"

Global Const $G_IsSysprepEnv = _IsSysprepEnv()
