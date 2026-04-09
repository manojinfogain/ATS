import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { ConfigService } from '../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  constructor(private _http: HttpClient,    private configService: ConfigService) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  SendOTPtoCandidate(cid:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/SendOTPtoCandidate?cid=${cid}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }

  /**send otp to candidate US */
  SendOTPtoCandidateUS(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/SendOTPtoCandidateUS?param=${param}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }

  /**Get Offer Templates US */
  GetOfferTemplates(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/GetOfferTemplates?param=${param}`;
    return this._http.get<any>(url,this.httpOptions);
  }
  CandidateSubmitOtp(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateSubmitOtp?${param}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }

  /**submit otp us */
  CandidateSubmitOtpUS(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateSubmitOtpUS?${param}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }

  /**submit otp us */
  CandidateSubmitOtpIndia(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/CandidateSubmitOtpIndia?${param}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }


  CandidateSubmitOfferAcceptUS(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/CandidateSubmitOfferAcceptUS`, data, httpOptions);
  }

   /***
    * get Candidate Details
    */
  getCandidateInfo(cid:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidateDetails?cid=${cid}`;
    return this._http.get<any>(url,this.httpOptions);
  }

  /**candidate details US */
  getCandidateDetailsByParam(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidateDetailsByParam?param=${param}`;
    return this._http.get<any>(url,this.httpOptions);
  }
  /**
   * upload Candidate Documents
   * @param formData 
   * @returns 
   */
  uploadDocuments(formData:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/uploadDocuments`;
    return this._http.post<any>(url,formData);
  }
  /**
   *get   Candidate Documents
   * @returns 
   */
  getCanddiateDocumentList(): Observable<any>{
    let url: string = `${environment.apiMainUrlNet}Candidate/getCanddiateDocumentList`;
    return this._http.get<any>(url,this.httpOptions);
  }
  /**
   *get   Candidate Documents
   * @returns 
   */
   updatePersonalDetails(body:any): Observable<any>{
    let url: string = `${environment.apiMainUrlNet}Candidate/updatePersonalDetails`;
    return this._http.post<any>(url,body,this.httpOptions);
  }

   /**
   *get   Candidate Documents
   * @returns 
   */
   getCandidatePersonalDetails(): Observable<any>{
    let url: string = `${environment.apiMainUrlNet}Candidate/getCandidatePersonalDetails`;
    return this._http.get<any>(url,this.httpOptions);
  }


  getVideoMatchDetails(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/GetVideoMatchDetails?param=${param}`;
    return this._http.get<any>(url,this.httpOptions);
  }
  getVideoMatchUserAccess(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/GetVideoMatchUserAccess?param=${param}`;
    return this._http.get<any>(url,this.httpOptions);
  }

  SendOTPtoVideoMatcher(param:string,EmpId:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/SendOTPtoVideoMatcher?param=${param}&EmpId=${EmpId}`;
    return this._http.post<any>(url,this.httpOptions);
  }
  submitOtpVideoMatching(param:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/SubmitOtpVideoMatching?${param}`;
    return this._http.post<any>(url,null,this.httpOptions);
  }
  getOfferTemp(cid:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/getOfferTemp?cid=${cid}`;
    return this._http.get<any>(url,this.httpOptions);
  }

  CandidateSubmitOfferAcceptIndia(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Candidate/CandidateSubmitOfferAcceptIndia`, data, httpOptions);
  }

  uploadOfferLetter(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Candidate/OfferAcceptCandidateManualIndia`;
    return this._http.post<any>(url,data);
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
    return this._http.post<any>(url,null,{headers});
  }
// getToken(): Observable<any> {

//   const headers = new HttpHeaders({
//     'X-API-KEY': environment.apiKey
//   });

//   const url = `${environment.apiMainUrlNet}auth/token`;

//   return this._http.post<any>(url, {}, { headers });

// }

}


