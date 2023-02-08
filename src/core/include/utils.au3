#include-once
#include "..\constants.au3"
#include "config.au3"

Func _msg($sText)
	MsgBox(64, $G_NAME, $sText)
EndFunc   ;==>_msg

Func _GetOsBuildVer()
	Local $sCurrentBuild = RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion", "CurrentBuild")
	Local $sUbr = RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion", "UBR")
	Return String($sCurrentBuild) & "." & String($sUbr)
EndFunc   ;==>_GetOsBuildVer

Func _IsSysprepEnv()
	Local $sSystemSetupInProgress = RegRead("HKEY_LOCAL_MACHINE\SYSTEM\Setup", "SystemSetupInProgress")
	If $sSystemSetupInProgress = 1 Then
		Return True
	Else
		Return False
	EndIf
EndFunc   ;==>_IsSysprepEnv

Func _GetOsVer()
	Local $sCurrentBuild = RegRead("HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion", "CurrentBuild")
	Local $sKernel32DirVer = Number(StringLeft(FileGetVersion(@WindowsDir & "\System32\Kernel32.dll", "ProductVersion"), 3))
	Select
		Case $sCurrentBuild >= 22000
			Return "Win11"
		Case $sCurrentBuild >= 10240
			Return "Win10"
	EndSelect
	Switch $sKernel32DirVer
		Case 5.0
			Return "Win2000"
		Case 5.1
			Return "WinXP"
		Case 5.2
			Return "WinXP"
		Case 6.0
			Return "WinVista"
		Case 6.1
			Return "Win7"
		Case 6.2
			Return "Win8"
		Case 6.3
			Return "Win8.1"
	EndSwitch
	Return 0
EndFunc   ;==>_GetOsVer

Func _Is_HKCU($str)
	Const $aSplit = StringSplit($str, "\")
	If $aSplit[0] > 0 Then
		If $aSplit[1] = "HKEY_CURRENT_USER" Or $aSplit[1] = "HKCU" Then
			Return True
		EndIf
	EndIf
	Return False
EndFunc   ;==>_Is_HKCU

Func _IsMount_NTUSER_Reg()
	Local $s = RegEnumKey($G_NTUSER_MOUNT_ROOT64, 1)
	If @error Then
		Return False
	Else
		Return True
	EndIf
EndFunc   ;==>_IsMount_NTUSER_Reg

Func _Mount_NTUSER_Reg()
	If _IsMount_NTUSER_Reg() = False Then
		RunWait(@ComSpec & ' /c reg load ' & $G_NTUSER_MOUNT_ROOT & ' "' & EnvGet("systemdrive") & '\Users\Default\ntuser.dat"', "", @SW_HIDE)
		If @error Then
			Return False
		EndIf
	EndIf
	Return True
EndFunc   ;==>_Mount_NTUSER_Reg

Func _UnMount_NTUSER_Reg()
	RunWait(@ComSpec & ' /c reg unload ' & $G_NTUSER_MOUNT_ROOT, "", @SW_HIDE)
EndFunc   ;==>_UnMount_NTUSER_Reg

Func _RunPwsh($sCommand, $bShowWindow = False)
	If $bShowWindow Then
		Return RunWait('powershell -command ' & $sCommand, "")
	Else
		Return RunWait('powershell -command ' & $sCommand, "", @SW_HIDE)
	EndIf
EndFunc   ;==>_RunPwsh

Func _RunCmd($sCommand, $bShowWindow = False)
	If $bShowWindow Then
		Return RunWait(@ComSpec & " /c " & $sCommand, "")
	Else
		Return RunWait(@ComSpec & " /c " & $sCommand, "", @SW_HIDE)
	EndIf
EndFunc   ;==>_RunCmd

;~ Check tweak apply requirements
Func _CheckRequireMents($sName, $sMode = "all")
;~ 	tweak is apply?
	If _Config_Tweak_IsApply($sName) <> True Then
		Return False
	EndIf ;==>_CheckRequireMents
	
	Const $Config_Tweak_ApplyMode = _Config_Tweak_ApplyMode($sName)
	If $Config_Tweak_ApplyMode = "sysprep" Then
		$sMode = "sysprep"
	ElseIf $Config_Tweak_ApplyMode = "desktop" Then
		$sMode = "desktop"
	ElseIf $Config_Tweak_ApplyMode = "all" Then
		$sMode = "all"
	Else
		$sMode = "all"
	EndIf
	
	If $sMode <> "all" Then
;~ 		Requires apply in sysprep, but is not currently a sysprep environment
		If $sMode = "sysprep" Then
			If $G_IsSysprepEnv <> True Then
				Return False
			EndIf
		ElseIf $sMode = "desktop" Then
			If $G_IsSysprepEnv Then
				Return False
			EndIf
		EndIf
	EndIf
	
	Return True
	
EndFunc   ;==>_CheckRequireMents

Func _Restart_Explorer()
	ProcessClose("explorer.exe")
	Run("%SystemDrive%\Windows\Explorer.EXE", "%SystemDrive%\Windows\Explorer.EXE")
EndFunc   ;==>_Restart_Explorer
