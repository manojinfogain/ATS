import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuddyService {

  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  


  GetCandidateListForBuddyAssign(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Buddy/GetCandidateListForBuddyAssign`;
    return this._http.post<any>(url,data, this.httpOptions);
  }

  AddUpdateBuddy(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Buddy/AddUpdateBuddy`;
    return this._http.post<any>(url,data, this.httpOptions);
  }

  GetEmployeeListToAssign(cid:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Buddy/GetEmployeeListToAssign?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }




}
