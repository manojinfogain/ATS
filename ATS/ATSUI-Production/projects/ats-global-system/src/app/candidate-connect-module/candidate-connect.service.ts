import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateConnectService {

  constructor(private _http: HttpClient) { }

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

//candidate connect
  // GetOfferedCandidatesList(param: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}CandidateConnect/GetOfferedCandidatesList?${param}`;
  //   return this._http.get<any>(url, this.httpOptions);
  // }

  GetOfferedCandidatesList(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}CandidateConnect/GetOfferedCandidatesList`, data, httpOptions);
  }
 
  CandidateStatusMaster(cid:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/CandidateStatusMaster?${cid?'cid='+cid:''}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  //get candidate calls details
  CandidateCallsDetails(cid:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/getCandidateConnectCallDetails?${cid?'cid='+cid:''}`;
    return this._http.get<any>(url, this.httpOptions);
  }


  UpdateOfferedStatus(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/addUpdateCandidateConnectHistory`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  //get candidate list
  getCandidateList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/getAllEmployeeList`;
    return this._http.get<any>(url, this.httpOptions);
  }

  //get candidate view data
  getCandidateConnectView(cid:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/getCandidateConnectView?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  //candiate connect tracker
  //http://ipagshareserver:3434/api/CandidateConnect/GetCandidateConnectTracker'

  getCandidateConnectTracker(data:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
     return this._http.post<any>(`${environment.apiMainUrlNet}CandidateConnect/GetCandidateConnectTracker`, data, httpOptions);
   }

   //get candidate reason
   getCandidateReasonList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}CandidateConnect/CandidateConnectReason`;
    return this._http.get<any>(url, this.httpOptions);
  }

}
