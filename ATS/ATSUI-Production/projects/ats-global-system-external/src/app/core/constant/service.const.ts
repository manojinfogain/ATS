
/*--------------------
	Code By - Md Ayatullah Rahmani
	Infoconnect ++
	date: 05-12-2018
--------------------*/

import  { environment } from 'projects/ats-global-system-external/src/environments/environment'
export const SERVICE_CONST = {
    mainUrl:  environment.apiMainUrl,
    mainUrlNet:  environment.apiMainUrlNet,
    protocol: '',
    path: '',
    name: environment.name,
    localUrl: environment.apiBaseUrl,
    localUrlNet: environment.apiBaseUrlNet
}