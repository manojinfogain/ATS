import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { SkipLoader } from 'projects/ats-global-system/src/app/core/interceptors/loader-interceptor';

@Injectable({
  providedIn: 'root'
})
export class BgvServiceService {

  constructor(private _http: HttpClient) { }
  public headerHttp = new HttpHeaders({
    'Content-Type': 'application/json',
    SkipLoader: ''
  })
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  GetAllBGVCandidateDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetAllBGVCandidateDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  GetBGVEmployeeReport(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetBGVEmployeeReport`;
    return this._http.post<any>(url, data, this.httpOptions);
  }
  GetBGVCheckWiseReport(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetBGVCheckWiseReport`;
    return this._http.post<any>(url,data, this.httpOptions);
  }
  GetBGVeDetailedReport(data:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetBGVeDetailedReport`;
    return this._http.post<any>(url, data, this.httpOptions);
  }
  /**
   * Get BGV Account Details for Drug test 
   */
  GetBGVDTAccountDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetBGVDTAccountDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   * Delete BGV Account from Drug test
   * @param AccountId 
   */
  DeleteDTAccount(AccountId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/DeleteDTAccount?AccountId=${AccountId}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**
   * get Account Lists
   * @param formData 
   */
  getAccountLists(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getAccountMaster?searchText`;
    return this._http.get<any>(url, this.httpOptions)
  }
   /**
   * Add BGV Account from Drug test
   * @param AccountId 
   */
    AddDTAccount(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/AddDTAccount?AccountId=${data?.AccountId}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**
   * provide BGV candidate access to RM
   * @param AccountId 
   */
  GiveBGVCandidateAccess(candidateId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GiveBGVCandidateAccess?Candidateid=${candidateId}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**
   * get BGV final status
   */
  getBgvFinalStatus(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetBGVColorCodeDetails`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   * Save penalty month details
   * @param data 
   */
  SavePenaltyMonthDetails(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/SavePenaltyMonthDetails`;
    return this._http.post<any>(url, data, this.httpOptions);
  }
  /**
   * Get BGV package master list
   */
  GetPackagesList(joiningLocationId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetPackages?Locationid=${joiningLocationId}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   * Get check wise report history
   */
  GetCheckwiseBGVHistory(candidateId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}BGV/GetCheckwiseBGVHistory?Candidateid=${candidateId}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**
   * Get month names for dropdowns
   */
  getMonthNames(): Observable<string[]> {
    const url = `${environment.apiMainUrlNet}BGV/GetBGVMonthsInYear`;
    return this._http.get<string[]>(url, this.httpOptions);
  }
}
