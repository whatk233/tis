#RequireAdmin
#NoTrayIcon
#Region ;**** Directives created by AutoIt3Wrapper_GUI ****
#AutoIt3Wrapper_Outfile=build/tis_x86.exe
#AutoIt3Wrapper_Outfile_x64=build/tis.exe
#AutoIt3Wrapper_UseUpx=y
#AutoIt3Wrapper_Compile_Both=y
#AutoIt3Wrapper_Res_Description=TIS - ${G_VERSION} (${G_SHORTCOMMIT}) (https://tis.whatk.me)
#AutoIt3Wrapper_Res_Fileversion=${G_VERSION}.0
#AutoIt3Wrapper_Res_ProductName=TIS
#AutoIt3Wrapper_Res_ProductVersion=${G_VERSION}
#AutoIt3Wrapper_Res_CompanyName=https://tis.whatk.me
#AutoIt3Wrapper_Res_LegalCopyright=https://tis.whatk.me
#AutoIt3Wrapper_Res_Language=2052
#AutoIt3Wrapper_Tidy_Stop_OnError=n
#EndRegion ;**** Directives created by AutoIt3Wrapper_GUI ****
#include <WinAPIFiles.au3>
#include "constants.au3"
#include "include\utils.au3"
#include "include\tweak.au3"
#include "include\config.au3"

If @OSArch = 'x64' Then
	_WinAPI_Wow64EnableWow64FsRedirection(True)
EndIf

If $Cmdline[0] > 0 Then
	Switch $Cmdline[1]
		Case $Cmdline[1] = "/tweak"
			OnAutoItExitRegister("_Exit")
			_Tweak()
			Exit
	EndSwitch
EndIf

_About()

Func _About()
	MsgBox(64, $G_FULLNAME, "TIS - " & $G_FULLVERSION & @CRLF & @CRLF & $G_BUILDTIME & @CRLF & @CRLF & "https://tis.whatk.me" & @CRLF & "https://github.com/whatk233/tis" & @CRLF & @CRLF & "GNU General Public License v3.0")
	Exit
EndFunc   ;==>_About

Func _Tweak()
	If _IsSysprepEnv() Then _Mount_NTUSER_Reg()
	#include "_tweak_include.au3"
	If _IsSysprepEnv() Then _UnMount_NTUSER_Reg()
EndFunc   ;==>_Tweak

Func _Exit()
	_UnMount_NTUSER_Reg()
EndFunc   ;==>_Exit

