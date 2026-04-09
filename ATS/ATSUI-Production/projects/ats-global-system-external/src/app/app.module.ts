import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedLandingModule } from './shared/shared-landing/shared-landing.module';
import { LoaderInterceptor } from './core/interceptors/loader-interceptor';
import { HttpTokenInterceptor } from './core/interceptors/http-token-interceptor';
import { LoginComponent } from './authentication-module/login/login.component';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfigService } from './core/services/config.service';

export function initializeApp(configService: ConfigService) {
  return () =>
    configService.loadConfig().toPromise().then((config) => {
      configService.setConfig(config);
    });
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedLandingModule
  ],
  providers: [
   // { provide: MAT_DATE_LOCALE, useValue: "en-US" },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
