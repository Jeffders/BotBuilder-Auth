rd /S /Q node_modules\botframework-directlinejs
rd /S /Q node_modules\botframework-webchat
xcopy /I /S ..\..\..\WebchatPackages\botframework-directlinejs node_modules\botframework-directlinejs
xcopy /I /S ..\..\..\WebchatPackages\botframework-webchat node_modules\botframework-webchat