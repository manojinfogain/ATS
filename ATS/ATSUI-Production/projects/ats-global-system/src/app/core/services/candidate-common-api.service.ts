import { Injectable } from '@angular/core';
import  { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CandidateCommonApiService {

  constructor(
    private _http:HttpClient
  ) { }

  getCandidateDetailsByCid(cid:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}Interview/getCandidateDetailsByCid?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getCandidateDetailsProfile(cid:number=null,id:number=null,profileId:number =null,IsFromNaukriAPI:string='N'): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}Interview/getCandidateProfileDetails?${cid?'cid='+cid+'&':''}${id?'id='+id:''}${profileId?'&profileId='+profileId:''}${IsFromNaukriAPI?'&IsFromNaukriAPI='+IsFromNaukriAPI:'N'}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getJDQuestionsByThId(cid:number =0): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}Interview/getQuestionsByCid?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getResumeAssesmentById(cid:number =0,ProfileType:string='N'): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}dashboard/getResumeAssesmentById?cid=${cid}&ProfileType=${ProfileType}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

    getProfileDetailsById(id:number=null,profileId:number =null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}dashboard/getProfileDetailsById?${id?'id='+id:''}${profileId?'&profileId='+profileId:''}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
}
