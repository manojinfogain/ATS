// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'Development external',
  locationWise: true,
  defaultSSO: false,
  isNotification:true,
  apiKey: '1234567890',
  apiBaseUrl: 'https://atsapijava.infogain.com:7070/',
  apiMainUrl: 'https://atsapijava.infogain.com:7070/info/',
  apiBaseUrlNet:'http://localhost:52000/',
  apiMainUrlNet:'http://localhost:52000/api/',
  clientId:'',
  redirect_uri:'http://localhost:4200/login',
  clientSecret:'',

 
  // apiBaseUrlNet: 'http://ipagshareserver:3434/',
  // apiMainUrlNet: 'http://ipagshareserver:3434/api/'

  // apiBaseUrlNet: 'http://ipagdevserver:2244/',
  // apiMainUrlNet: 'http://ipagdevserver:2244/api/'

  
  // apiBaseUrlNet: 'http://ipagdevserver:3434/',
  // apiMainUrlNet: 'http://ipagdevserver:3434/api/'

  

   // apiBaseUrlNet:'https://atsapi.infogain.com/',
  // apiMainUrlNet:'https://atsapi.infogain.com/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
