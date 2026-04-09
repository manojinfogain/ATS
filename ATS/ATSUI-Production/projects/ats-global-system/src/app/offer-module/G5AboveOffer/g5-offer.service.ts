import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class G5OfferService {

  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getSelectedG5AboveCandidateList(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/GetG5AboveSelectedCandidatesList`;
    return this._http.post<any>(url,data, this.httpOptions);
  }
  getApprovedG5AboveCandidatesList(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/GetApprovedG5AboveCandidatesList`;
    return this._http.post<any>(url,data, this.httpOptions);
  }
  addUpdateOfferApprovalG5Above(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/addUpdateOfferApprovalG5Above`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  updateEditOfferApprovalG5Above(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/UpdateEditOfferApprovalG5Above`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  //approve offer
  updateOfferApprovalStatusg5Above(cid: number, ActionTaken: string, Remark: string, IsDelegator: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/UpdateOfferApprovalStatusG5Above?cid=${cid}&ActionTaken=${ActionTaken}&Remark=${encodeURIComponent(Remark)}&IsDelegator=${IsDelegator}`;
    return this._http.post<any>(url, this.httpOptions);
  }


  getG5AboveApproverList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/getG5AboveApproverList`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getGradeList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/GetGradeMaster`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getVariablePayPercentageMaster(gradeId:number =null,cid:number =null,cubeId:number =null): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/GetVariablePayPercentageMaster?gradeId=${gradeId}&cid=${cid}&cubeId=${cubeId}`;
    return this._http.get<any>(url, this.httpOptions);
  }

    //generateOffer 
    generateOfferG5Above(body: any): Observable<any> {
      //original api  GenerateOffer
      let url: string = `${environment.apiMainUrlNet}OfferG5Above/GenerateOffer`;
      return this._http.post<any>(url, body);
    }

    /**india upload offer manual */
  uploadOffer(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/UploadOffer`;
    return this._http.post<any>(url, body);
  }

}
