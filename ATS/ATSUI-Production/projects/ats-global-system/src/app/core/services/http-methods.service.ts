import { Injectable } from '@angular/core';
import  { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpMethodsService {
  constructor(private _http: HttpClient) {

  }
  /*******  error handle *****/
  private httpErrorHandle(error: any) {
    return throwError(error);
  }
  /*******  Get Method *****/
  get(type:number,path: string, headers: HttpHeaders = new HttpHeaders(), params: HttpParams = new HttpParams()): Observable<any> {
    return this._http.get(`${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`, { params, headers },)
      .pipe(catchError(this.httpErrorHandle));
  }
  /*******  Post Method *****/
  post(type:number,path: string, body: Object = {},headers: HttpHeaders = new HttpHeaders(),params: HttpParams = new HttpParams()): Observable<any> {
    return this._http.post(
      `${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`,
      JSON.stringify(body),
      { params, headers }
    ).pipe(catchError(this.httpErrorHandle));
  }
  /*******  Put Method *****/
  put(type:number,path: string, body: Object = {},headers: HttpHeaders = new HttpHeaders(),params: HttpParams = new HttpParams()): Observable<any> {
    return this._http.put(
      `${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`,
      JSON.stringify(body),
      { params, headers }
    ).pipe(catchError(this.httpErrorHandle));
  }
  /*******  Delete Method *****/
  delete(type,number,path: string): Observable<any> {
    return this._http.delete(
      `${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`,
    ).pipe(catchError(this.httpErrorHandle));
  }

  deleteMethod(type:number,path:string,body:Object = {}):Observable<any>{
    const options = {
      headers: new HttpHeaders(),
      body: JSON.stringify(body)
    }
    return this._http.delete(
      `${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`,
      options
    ).pipe(catchError(this.httpErrorHandle));
  }

  patch(type:number,path:string,body:Object = {},headers: HttpHeaders = new HttpHeaders(),params: HttpParams = new HttpParams()):Observable<any>{
    return this._http.patch(
      `${type === 1?environment.apiMainUrl:environment.apiMainUrlNet}${path}`,
      JSON.stringify(body),
      { params, headers }
    ).pipe(catchError(this.httpErrorHandle));
  }
}
