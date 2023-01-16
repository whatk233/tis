#include-once
#include "..\constants.au3"

Func _Config_Exists()
	If FileExists($G_CONFIG_PATH) Then
		Return True
	Else
		Return False
	EndIf
EndFunc   ;==>_Config_Exists

Func _Config_Tweak_IsApply($key)
	Return Number(IniRead($G_CONFIG_PATH, $key, "apply", 0))
EndFunc   ;==>_Config_Tweak_IsApply

Func _Config_Tweak_IsApplyDefaultUser($key)
	Return Number(IniRead($G_CONFIG_PATH, $key, "applyDefaultUser", 0))
EndFunc   ;==>_Config_Tweak_IsApplyDefaultUser

Func _Config_Tweak_ShowWindow($key)
	Return Number(IniRead($G_CONFIG_PATH, $key, "showWindow", 0))
EndFunc   ;==>_Config_Tweak_IsApplyDefaultUser

Func _Config_Tweak_ApplyMode($key)
	Return IniRead($G_CONFIG_PATH, $key, "applyMode", Null)
EndFunc   ;==>_Config_Tweak_IsApplyDefaultUser
