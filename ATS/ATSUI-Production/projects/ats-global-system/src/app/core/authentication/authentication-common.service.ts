import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { IChangePassword } from '../models/common-model';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationCommonService {
  
  constructor(private _httpclient: HttpClient) {}

  getUser() {
    let _url: string = `${environment.apiMainUrlNet}Account/me`;
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(_url, httpopt);
  }

  changeUserPassword(pass:IChangePassword){
    const url: string = `${environment.apiMainUrlNet}Account/changePassword?NewPassword=${pass}`;
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<IChangePassword>(url, httpopt);
  }
  
  SendOtp(){
    const url: string = `${environment.apiMainUrlNet}Account/SendOtp`;
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, httpopt);
  }
}
