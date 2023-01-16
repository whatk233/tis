#include-once
#include "..\constants.au3"
#include "utils.au3"
#include "config.au3"

Func _T_RegWrite($sName, $sKey, $sKeyname, $sType, $sValue)
	If _IsSysprepEnv() Then
		If _Config_Tweak_IsApplyDefaultUser($sName) And _Is_HKCU($sKey) Then
			Const $sNTUSER_Key = _Convert_KeyRoot_NTUSER($sKey)
			RegWrite($sNTUSER_Key, $sKeyname, $sType, $sValue)
			Return
		EndIf
	EndIf
	_T_RegWriteArch($sKey, $sKeyname, $sType, $sValue)
EndFunc   ;==>_T_RegWrite

Func _T_RegDelete($sName, $sKey, $sKeyname = "")
	If _IsSysprepEnv() Then
		If _Config_Tweak_IsApplyDefaultUser($sName) And _Is_HKCU($sKey) Then
			Const $sNTUSER_Key = _Convert_KeyRoot_NTUSER($sKey)
			If $sKeyname = "" Then
				RegDelete($sNTUSER_Key)
			Else
				RegDelete($sNTUSER_Key, $sKeyname)
			EndIf
			Return
		EndIf
	EndIf
	_T_RegDeleteArch($sKey, $sKeyname)
EndFunc   ;==>_T_RegDelete

Func _T_RegWriteArch($sKey, $sKeyname, $sType, $sValue)
	If @OSArch = 'X64' Then
		Const $sX64Key = _Convert_KeyRoot_X64($sKey)
		RegWrite($sX64Key, $sKeyname, $sType, $sValue)
	ElseIf @OSArch = 'X86' Then
		RegWrite($sKey, $sKeyname, $sType, $sValue)
	EndIf
EndFunc   ;==>_T_RegWriteArch

Func _T_RegDeleteArch($sKey, $sKeyname = "")
	If @OSArch = 'X64' Then
		Const $sX64Key = _Convert_KeyRoot_X64($sKey)
		If $sKeyname = "" Then
			RegDelete($sX64Key)
		Else
			RegDelete($sX64Key, $sKeyname)
		EndIf
	ElseIf @OSArch = 'X86' Then
		If $sKeyname = "" Then
			RegDelete($sKey)
		Else
			RegDelete($sKey, $sKeyname)
		EndIf
	EndIf
EndFunc   ;==>_T_RegDeleteArch

Func _Convert_KeyRoot_X64($str)
	Local $sX64Key
	Const $aSplit = StringSplit($str, "\")
	$sX64Key = $aSplit[1] & "64"
	For $i = 2 To $aSplit[0]
		$sX64Key = $sX64Key & "\" & $aSplit[$i]
	Next
	Return $sX64Key
EndFunc   ;==>_Convert_KeyRoot_X64

Func _Convert_KeyRoot_NTUSER($str)
	Local $sNTUSER_Key
	Const $aSplit = StringSplit($str, "\")
	$sNTUSER_Key = $G_NTUSER_MOUNT_ROOT64
	For $i = 2 To $aSplit[0]
		$sNTUSER_Key = $sNTUSER_Key & "\" & $aSplit[$i]
	Next
	Return $sNTUSER_Key
EndFunc   ;==>_Convert_KeyRoot_NTUSER

Func _T_Run($sName, $sCommand, $sAction = "cmd", $bShowWindow = False, $sDefaultApplyMode = "sysprep")
	Const $Config_Tweak_ApplyMode = _Config_Tweak_ApplyMode($sName)
	Const $Config_Tweak_ShowWindow = _Config_Tweak_ShowWindow($sName)
	
	If $Config_Tweak_ApplyMode = "sysprep" Then
		$sDefaultApplyMode = "sysprep"
	ElseIf $Config_Tweak_ApplyMode = "desktop" Then
		$sDefaultApplyMode = "desktop"
	ElseIf $Config_Tweak_ApplyMode = "all" Then
		$sDefaultApplyMode = "all"
	EndIf
	
	If $Config_Tweak_ShowWindow Then
		$bShowWindow = True
	EndIf
	
	If $sDefaultApplyMode = "sysprep" Then
		If _IsSysprepEnv() Then
			_T_Run_CommandExt($sCommand, $sAction, $bShowWindow)
		EndIf
	ElseIf $sDefaultApplyMode = "desktop" Then
		If _IsSysprepEnv() = False Then
			_T_Run_CommandExt($sCommand, $sAction, $bShowWindow)
		EndIf
	ElseIf $sDefaultApplyMode = "all" Then
		_T_Run_CommandExt($sCommand, $sAction, $bShowWindow)
	EndIf
EndFunc   ;==>_T_Run

Func _T_Run_CommandExt($sCommand, $sAction = "cmd", $bShowWindow = False)
	If $sAction = "cmd" Then
		_RunCmd($sCommand, $bShowWindow)
	ElseIf $sAction = "pwsh" Then
		_RunPwsh($sCommand, $bShowWindow)
	EndIf
EndFunc   ;==>_T_Run_CommandExt
