import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { SkipLoader } from '../core/interceptors/loader-interceptor';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  public headerHttpSkipLoader = new HttpHeaders({
    'Content-Type': 'application/json',
     SkipLoader:''
  })
  

  // getSelectedCandidateLisr(param: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Offer/GetSelectedCandidatesList?${param}`;
  //   return this._http.get<any>(url, this.httpOptions);
  // }
  getSelectedCandidateList(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Offer/GetSelectedCandidatesList`, data, httpOptions);
  }
 

  getSelectedCandidateDetails(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getSelectedCandidateDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  
  getCandidateOfferAprDetails(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getCandidateOfferAprDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateApprovalDetails(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getCandidateApprovalDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateStatusHistory(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getCandidateStatusHistory?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }


  addUpdateOfferApproval(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/addUpdateOfferApproval`;
    return this._http.post<any>(url,data,this.httpOptions);
  }

  uploadDocumnetByRecApprover(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/AddOfferApprovalAttachment`;
    return this._http.post<any>(url,data);
  }

    /***
   * get Approval Count
   */
     getOfferApprovalAttachaments(param:string){
      let url: string = `${environment.apiMainUrlNet}Offer/GetOfferApprovalAttachaments?${param}`;
      return this._http.get<any>(url, {headers:this.headerHttpSkipLoader});
    }
  
  //approve offer
  approveOffer(cid: number, ActionTaken:string, Remark:string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/UpdateOfferApprovalStatus?cid=${cid}&ActionTaken=${ActionTaken}&&Remark=${Remark}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /***
   * get Approval Count
   */
  getApprovalCount(gradeID:number,gradeBandId:number,ctc:number,JobFamilyID:number,ExpYear:number,ExpMonth:number,JFCategory:string = null,CandidateTypeID:string = null,divisionID?:number){
    let url: string = `${environment.apiMainUrlNet}Offer/GetNumberOfApprovers?JobFamilyID=${JobFamilyID}&gradeID=${gradeID}&GradeBand=${gradeBandId}&ctc=${ctc}&ExpYear=${ExpYear}&ExpMonth=${ExpMonth}${JFCategory?'&JFCategory='+JFCategory:''}${CandidateTypeID?'&CondidateTypeId='+CandidateTypeID:''}${divisionID?'&division='+divisionID:''}`;
    return this._http.get<any>(url, {headers:this.headerHttpSkipLoader});
  }

   /***
   *  offer generat
   */
    getSendOffer(data: any): Observable<any> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
      return this._http.post<any>(`${environment.apiMainUrlNet}Offer/GetApprovedCandidatesList`, data, httpOptions);
    }
   
    //generateOffer 

    generateOffer(body:any):Observable<any> {
      //original api  GenerateOffer
      let url: string = `${environment.apiMainUrlNet}Offer/GenerateOffer`;
      return this._http.post<any>(url,body);
    }

    uploadOffer(body:any):Observable<any> {
      let url: string = `${environment.apiMainUrlNet}Offer/UploadOffer`;
      return this._http.post<any>(url,body);
    }
  
    /***
     * upload BGV
     */
    UploadBGVDocuments(body:any):Observable<any> {
      //original api  GenerateOffer
      let url: string = `${environment.apiMainUrlNet}Offer/UploadBGVDocuments`;
      return this._http.post<any>(url,body);
    }

    /***
   * get Approval Count
   */
   getDgmCalc(body:any){
     let param = `LocationId=${body.JoiningLocationID}&cadidateTypeId=${body.CandidateTypeID}&billingRate=${body.billingRateHrCurrency}&annualCTC=${body.ctc}&billingCurrencyId=${body.billingCurrencyId}&joiningBonus=${body.joiningBonus}&localCurrencyId=${body.JoiningLocationID}&NonReimbursableTravelCost=${body.NonReimbursableTravelCost}&projectSpecificCost=${body.projectSpecificCost}&projectBuffer=${body.projectBuffer}&billableHoursDay=${body.billableHoursDay}`
    let url: string = `${environment.apiMainUrlNet}Offer/DgmCalculaterForOffer`;
    return this._http.post<any>(url,body,{headers:this.headerHttpSkipLoader});
  }
 
  //get decline categ
 getDeclineCategory():Observable<any>{
    let url:string = `${environment.apiMainUrlNet}Offer/getOfferDeclinedCategory`;
    return this._http.get<any>(url,this.httpOptions);
 }

 
  //update offer status
  updateOfferStatus(data:any):Observable<any>{
    let url:string = `${environment.apiMainUrlNet}Offer/UpdateCandidateOfferDetailsStatus?cid=${data.cid}&offerStatus=${data.offerStatus}${data.declineCateg?'&odid='+data.declineCateg:''}${data.remarks?'&Remark='+data.remarks:''}${data.DateOfJoining?'&DateOfJoining='+data.DateOfJoining:''}${data.DateOfDecline?'&DeclineDate='+data.DateOfDecline:''}`;
    return this._http.post<any>(url,null,this.httpOptions);
 }

 
 sendOffer(body:any):Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Offer/sendOffer`;
  return this._http.post<any>(url,body,this.httpOptions);
}

transferSelectedCandidateByTalentId(body:any):Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Offer/transferSelectedCandidateByTalentId`;
  return this._http.post<any>(url,body,this.httpOptions);
}

updateConfirmShippingAddress(body:any):Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Offer/updateConfirmShippingAddress`;
  return this._http.post<any>(url,body,this.httpOptions);
}
//update offer drop reason 
// updateDropOfferReason(body:any):Observable<any> {
//   let url: string = `${environment.apiMainUrlNet}Offer/updateDropReasonOfferedCandByCid`;
//   return this._http.post<any>(url,body,this.httpOptions);
// }
updateDropOfferReason(body:any):Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Offer/updateDropReasonOfferedCandByCid?Cid=${body.Cid}&StatusId=${body.statusType}&DropReasonId=${body.dropReason}&DropRemark=${body.remark?body.remark:''}`;
  return this._http.post<any>(url,this.httpOptions);
}


getDelegationRightsList(paging): Observable<any> {
  ;
  let url: string = `${environment.apiMainUrlNet}Offer/getDelegationRightsList?${paging}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this._http.get<any>(url, httpOptions);
}
addDelegation(data:any):Observable<any>{
  let url:string = `${environment.apiMainUrlNet}Offer/addDelegation?DelegateTo=${data.DelegateTo}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&Remarks=${data.Remarks}&Approver=${data.Approver}`;
  return this._http.post<any>(url,null,this.httpOptions);
}

revokeDelegation(data:any):Observable<any>{
  let url:string = `${environment.apiMainUrlNet}Offer/RevokeDelegation?${data}`;
  return this._http.post<any>(url,null,this.httpOptions);
}
}
