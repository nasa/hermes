package log

import (
	"runtime"
	"strings"
)

func funcNameToPkg(funcName string) string {
	lastSlash := strings.LastIndexByte(funcName, '/')
	lastSlashMax := max(lastSlash, 0)

	firstDot := strings.IndexByte(funcName[lastSlashMax:], '.') + lastSlashMax
	return funcName[lastSlash+1 : firstDot]
}

// See https://stackoverflow.com/questions/53012575/get-name-and-package-of-calling-function
func getCallerPackage() string {
	pc, _, _, _ := runtime.Caller(2)
	return funcNameToPkg(runtime.FuncForPC(pc).Name())
}
