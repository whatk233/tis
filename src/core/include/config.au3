#include-once
#include "..\constants.au3"

Func _Config_Exists()
	If FileExists($G_CONFIG_PATH) Then
		Return True
	Else
		Return False
	EndIf
EndFunc   ;==>_Config_Exists

Func _Config_Tweak_Read($name, $key)
	Return IniRead($G_CONFIG_PATH, $name, $key, Null)
EndFunc   ;==>_Config_Tweak

Func _Config_Tweak_IsApply($name)
	Return Number(IniRead($G_CONFIG_PATH, $name, "apply", 0))
EndFunc   ;==>_Config_Tweak_IsApply

Func _Config_Tweak_IsApplyDefaultUser($name)
	Return Number(IniRead($G_CONFIG_PATH, $name, "applyDefaultUser", 0))
EndFunc   ;==>_Config_Tweak_IsApplyDefaultUser

Func _Config_Tweak_ShowWindow($name)
	Return Number(IniRead($G_CONFIG_PATH, $name, "showWindow", 0))
EndFunc   ;==>_Config_Tweak_ShowWindow

Func _Config_Tweak_ApplyMode($name)
	Return IniRead($G_CONFIG_PATH, $name, "applyMode", Null)
EndFunc   ;==>_Config_Tweak_ApplyMode

