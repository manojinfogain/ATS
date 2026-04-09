import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SERVICE_CONST } from 'projects/ats-global-system/src/app/core/constant/service.const';

@Injectable({
  providedIn: 'root'
})
export class SearchCandidateService {
  serviceConst = SERVICE_CONST;
  serviceUrl = this.serviceConst.mainUrl;
  constructor(private _httpclient: HttpClient) { }
  getCandidateDataBySearch(val): Observable<any> {
    let canUrl = this.serviceUrl + 'infoconnect/employee/search?searchString='+ val;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(canUrl, httpOptions)

  }

}
