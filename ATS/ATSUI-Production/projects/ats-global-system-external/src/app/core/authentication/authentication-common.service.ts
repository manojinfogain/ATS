import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { IChangePassword } from '../models/common-model';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { GetSetStorageService } from '../services/get-set-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationCommonService {
  constructor(private _httpclient: HttpClient, private configService: ConfigService,
    private _storage: GetSetStorageService) { }

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

  forgotPasword(email:string){
    const url: string = `${environment.apiMainUrlNet}Account/forgotPassword?email=${email}`;
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, httpopt);
  }
  changePasswordOTP(email:string,NewPassword:string,otp:string){
    const url: string = `${environment.apiMainUrlNet}Account/changePasswordOTP?email=${email}&otp=${otp}&NewPassword=${NewPassword}`;
    const httpopt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, httpopt);
  }

   /**
     *
     * @returns 
     */
     getToken(body:any={}): Observable<any>{
      const headers = new HttpHeaders({
        'X-API-KEY':  environment.apiKey,  
        'Content-Type': 'application/json' 
      });
      let url: string = `${environment.apiMainUrlNet}auth/token`;
      return this._httpclient.post<any>(url,null,{headers});
    }

    SendOtp(){
      let candidateId =this._storage.getCandidateId();
      const url: string = `${environment.apiMainUrlNet}Account/SendOtp?Candidateid=${candidateId}`;
      const httpopt = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      return this._httpclient.post<any>(url, httpopt);
    }

    
}
