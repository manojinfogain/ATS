import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(
    private _http: HttpClient
  ) { }

  public httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  /**company list getting for company master screen to add new company */
  getCompanyListForCompanyMaster(page: number, pageSize: number, search: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getCompanyName?page=${page}&pagesize=${pageSize}&name=${search ? search : ''}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  /**submit api for adding the new company */
  addCompany2(data: any): Observable<any> {
    let url = `${environment.apiMainUrlNet}/master/AddUpdateCompany?ComapanyName=${data.newCompany}&Tier=${data.tierType}`;
    return this._http.post<any>(url, this.httpOption);
  }
  addCompany(data: any): Observable<any> {
    let url = `${environment.apiMainUrlNet}/master/AddUpdateCompany`;
    return this._http.post<any>(url, data, this.httpOption);
  }

}
