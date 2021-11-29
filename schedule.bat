@ECHO OFF
IF NOT exist results/ mkdir results
node.exe js/main.js
ECHO :
ECHO Check results folder
PAUSE