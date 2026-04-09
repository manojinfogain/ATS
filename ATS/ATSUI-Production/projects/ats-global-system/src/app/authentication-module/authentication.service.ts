import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SERVICE_CONST } from 'projects/ats-global-system/src/app/core/constant/service.const';
import  { environment } from 'projects/ats-global-system/src/environments/environment'
import { ILogin } from '../core/models/common-model';
import { SkipError } from 'projects/ats-global-system/src/app/core/interceptors/http-error.interceptor';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private httpclient: HttpClient) {
  }

  LoginUser(data:ILogin = null,token:string = null, code:string=null, OTP: string = null): Observable<any> {
    let url = `${environment.apiBaseUrlNet}token`;
    let body = new URLSearchParams();
    body.set('grant_type', 'password');
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        SkipError:''
      })
    }
    if (token) {
      body.set('token', token);
    }
    if (OTP) {
      body.set('OTP', OTP);
    }
    if (code) {
      body.set('Code', code);
    }
    else {

      const username = data.userName;
      const password = data.password;
      body.set('UserName', username);

      if(password){
        body.set('Password', password);
      }
     
    }
    return this.httpclient.post<ILogin>(url, body, httpopt)
  }

  loginOffice365(){
  window.location.href=`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
   client_id=${environment.clientId}
   &response_type=code
   &redirect_uri=${environment.redirect_uri}
   &response_mode=query
   &scope=openid%20profile%20email`
  }

  logOutOffice365(){
    window.location.href=`https://login.microsoftonline.com/common/oauth2/v2.0/logout?
     client_id=${environment.clientId}
     &post_logout_redirect_uri=${environment.redirect_uri}`
    }
}


