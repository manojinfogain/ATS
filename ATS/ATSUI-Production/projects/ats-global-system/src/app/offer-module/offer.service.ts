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
    SkipLoader: ''
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

  //get selected candidate list for US location
  getSelectedCandidateListForUS(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}USOffer/GetSelectedCandidatesList`, data, httpOptions);
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

  /**get shpining laptop us */
  GetShippingLaptopList(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/GetShippingLaptopList`;
    return this._http.get<any>(url, this.httpOptions);
  }


  /**hr appoval activity details */
  getCandidateHRApprovalDetails(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/getCandidateHRApprovalDetails?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getCandidateStatusHistory(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getCandidateStatusHistory?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }


  addUpdateOfferApproval(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/addUpdateOfferApproval`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /**send for offer approval us */
  addUpdateOfferApprovalForUS(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/addUpdateOfferApprovalForUS`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  uploadDocumnetByRecApprover(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/AddOfferApprovalAttachment`;
    return this._http.post<any>(url, data);
  }

  /***
 * get Approval Count
 */
  getOfferApprovalAttachaments(param: string) {
    let url: string = `${environment.apiMainUrlNet}Offer/GetOfferApprovalAttachaments?${param}`;
    return this._http.get<any>(url, { headers: this.headerHttpSkipLoader });
  }

  //approve offer
  approveOffer(cid: number, ActionTaken: string, Remark: string, IsDelegator: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/UpdateOfferApprovalStatus?cid=${cid}&ActionTaken=${ActionTaken}&Remark=${encodeURIComponent(Remark)}&IsDelegator=${IsDelegator}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  //approve offer for US
  // approveOfferForUS(cid: number, ActionTaken: string, Remark: string, IsDelegator: string): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}USOffer/UpdateOfferApprovalStatusForUS?cid=${cid}&ActionTaken=${ActionTaken}&Remark=${Remark}&IsDelegator=${IsDelegator}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }

  approveOfferForUS(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/UpdateOfferApprovalStatusForUS`;
    return this._http.post<any>(url, data);
  }

  /***
   * get Approval Count
   */
  getApprovalCount(gradeID: number, gradeBandId: number, ctc: number, cubeClusterID: number, ExpYear: number, ExpMonth: number, JFCategory: string = null, CandidateTypeID: string = null, divisionID: number = 1, joiningBonus: number = 0, NoticeBuyOut: number = 0, TravelExp: number = 0, RelocationExp: number = 0, RetentionBonus: number = 0, RequirementType: number = 0, PracticeId: number = 0, cid: number = null, ReqTypeId: number = null) {
    let url: string = `${environment.apiMainUrlNet}Offer/GetNumberOfApprovers?CubeClusterID=${cubeClusterID}&gradeID=${gradeID}&GradeBand=${gradeBandId}&ctc=${ctc}&joiningBonus=${joiningBonus || 0}&NoticeBuyOut=${NoticeBuyOut  || 0}&TravelExp=${TravelExp  || 0}&RelocationExp=${RelocationExp  || 0}&RetentionBonus=${RetentionBonus  || 0}&RequirementType=${RequirementType}&PracticeId=${PracticeId}&ExpYear=${ExpYear}&ExpMonth=${ExpMonth}${JFCategory ? '&JFCategory=' + JFCategory : ''}${CandidateTypeID ? '&CondidateTypeId=' + CandidateTypeID : ''}${divisionID ? '&division=' + divisionID : ''}&cid=${cid}&reqType=${ReqTypeId}`;
    return this._http.get<any>(url, { headers: this.headerHttpSkipLoader });
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

  /***
 *  offer generate USA
 */
  getSendOfferUS(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}USOffer/GetApprovedCandidatesListForUS`, data, httpOptions);
  }

  /***
*  get candidate list for hr poending
*/
  GetCandidateListForHR(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}USOffer/GetCandidateListForHR`, data, httpOptions);
  }

  //generateOffer 
  generateOffer(body: any): Observable<any> {
    //original api  GenerateOffer
    let url: string = `${environment.apiMainUrlNet}Offer/GenerateOffer`;
    return this._http.post<any>(url, body);
  }

  /**india upload offer manual */
  uploadOffer(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/UploadOffer`;
    return this._http.post<any>(url, body);
  }

  /**US upload offer manual */
  USuploadOffer(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/UploadOffer`;
    return this._http.post<any>(url, body);
  }

  /***
   * upload BGV
   */
  UploadBGVDocuments(body: any): Observable<any> {
    //original api  GenerateOffer
    let url: string = `${environment.apiMainUrlNet}Offer/UploadBGVDocuments`;
    return this._http.post<any>(url, body);
  }

  /***
 * get Approval Count
 */
  getDgmCalc(body: any) {
    let param = `LocationId=${body.JoiningLocationID}&cadidateTypeId=${body.CandidateTypeID}&billingRate=${body.billingRateHrCurrency}&annualCTC=${body.ctc}&billingCurrencyId=${body.billingCurrencyId}&joiningBonus=${body.joiningBonus}&localCurrencyId=${body.JoiningLocationID}&NonReimbursableTravelCost=${body.NonReimbursableTravelCost}&projectSpecificCost=${body.projectSpecificCost}&projectBuffer=${body.projectBuffer}&billableHoursDay=${body.billableHoursDay}`
    let url: string = `${environment.apiMainUrlNet}Offer/DgmCalculaterForOffer`;
    return this._http.post<any>(url, body, { headers: this.headerHttpSkipLoader });
  }

  getDGMOfferNNT(cid: number) {
    // let param = `LocationId=${body.JoiningLocationID}&cadidateTypeId=${body.CandidateTypeID}&billingRate=${body.billingRateHrCurrency}&annualCTC=${body.ctc}&billingCurrencyId=${body.billingCurrencyId}&joiningBonus=${body.joiningBonus}&localCurrencyId=${body.JoiningLocationID}&NonReimbursableTravelCost=${body.NonReimbursableTravelCost}&projectSpecificCost=${body.projectSpecificCost}&projectBuffer=${body.projectBuffer}&billableHoursDay=${body.billableHoursDay}`
    let url: string = `${environment.apiMainUrlNet}Offer/DgmCalculaterForOfferNNT?cid=${cid}`;
    return this._http.post<any>(url, { headers: this.headerHttpSkipLoader });
  }

  //get decline categ
  getDeclineCategory(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getOfferDeclinedCategory`;
    return this._http.get<any>(url, this.httpOptions);
  }


  //update offer status
  // updateOfferStatus(data: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Offer/UpdateCandidateOfferDetailsStatus?cid=${data.cid}&offerStatus=${data.offerStatus}${data.declineCateg ? '&odid=' + data.declineCateg : ''}${data.remarks ? '&Remark=' + data.remarks : ''}${data.DateOfJoining ? '&DateOfJoining=' + data.DateOfJoining : ''}${data.DateOfDecline ? '&DeclineDate=' + data.DateOfDecline : ''}`;
  //   return this._http.post<any>(url, null, this.httpOptions);
  // }

  /**update status India */
  updateOfferStatus(data: any): Observable<any> {
    debugger
    let url: string = `${environment.apiMainUrlNet}Offer/UpdateCandidateOfferDetailsStatus?cid=${data.cid}&offerStatus=${data.offerStatus}${data.declineCateg ? '&odid=' + data.declineCateg : ''}${data.JoinedEmpId ? '&JoinedEmpId=' + data.JoinedEmpId : ''}${data.remarks ? '&Remark=' + data.remarks : ''}${data.DateOfJoining ? '&DateOfJoining=' + data.DateOfJoining : ''}${data.DateOfDecline ? '&DeclineDate=' + data.DateOfDecline : ''}${data.candidateId ? '&candidateId=' + data.candidateId : ''}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  /**update status US */
  updateOfferStatusUS(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/UpdateCandidateOfferDetailsStatusForUS?cid=${data.cid}&offerStatus=${data.offerStatus}${data.declineCateg ? '&odid=' + data.declineCateg : ''}${data.JoinedEmpId ? '&JoinedEmpId=' + data.JoinedEmpId : ''}${data.remarks ? '&Remark=' + data.remarks : ''}${data.DateOfJoining ? '&DateOfJoining=' + data.DateOfJoining : ''}${data.DateOfDecline ? '&DeclineDate=' + data.DateOfDecline : ''}${data.offereddate ? '&offereddate=' + data.offereddate : ''}${data.offerAcceptanceDate ? '&offerAcceptanceDate=' + data.offerAcceptanceDate : ''}${data.offeredGenerationDate ? '&OfferGenerateDate=' + data.offeredGenerationDate : ''}`; 
    return this._http.post<any>(url, null, this.httpOptions);
  }
  /**Upload manual Sign Offer letter and agrement US */
  UploadSignOfferUS(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/UploadSignOffer`;
    return this._http.post<any>(url, body);
  }

  sendOffer(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/sendOffer`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  transferSelectedCandidateByTalentId(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/transferSelectedCandidateByTalentId`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  updateConfirmShippingAddress(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/updateConfirmShippingAddress`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  //update offer drop reason 
  // updateDropOfferReason(body:any):Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Offer/updateDropReasonOfferedCandByCid`;
  //   return this._http.post<any>(url,body,this.httpOptions);
  // }
  updateDropOfferReason(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/updateDropReasonOfferedCandByCid?Cid=${body.Cid}&StatusId=${body.statusType}&DropReasonId=${body.dropReason}&DropRemark=${body.remark ? body.remark : ''}`;
    return this._http.post<any>(url, this.httpOptions);
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
  addDelegation(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/addDelegation?DelegateTo=${data.DelegateTo}&FromDate=${data.FromDate}&ToDate=${data.ToDate}&Remarks=${data.Remarks}&Approver=${data.Approver}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  revokeDelegation(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/RevokeDelegation?${data}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }
  /***
   * Create Candidate User
   */
  CreateCandidateUser(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OnBoard/CreateCandidateUser`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /***
  * get Approval Count for US
  */
  getApprovalCountForUS(gradeID: number, TCID: number, ctc: number, joiningBonus: number = 0, cityId: number, CandidateTypeID: number = null) {
    let url: string = `${environment.apiMainUrlNet}USOffer/GetNumberOfApprovers?TCID=${TCID}&gradeID=${gradeID}&ctc=${ctc}&joiningBonus=${joiningBonus}&CityID=${cityId}${CandidateTypeID ? '&CondidateTypeId=' + CandidateTypeID : ''}`;
    return this._http.get<any>(url, { headers: this.headerHttpSkipLoader });
  }

  /***
   * get gross margin for US offer
   */
  getGMData(body: any) {
    let url: string = `${environment.apiMainUrlNet}USOffer/DgmCalculater`;
    return this._http.post<any>(url, body, { headers: this.headerHttpSkipLoader });
  }
  /** Add Offer Approval Attachment For US */
  AddOfferApprovalAttachmentForUS(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/AddOfferApprovalAttachmentForUS`;
    return this._http.post<any>(url, data);
  }
  /**us generate offer */
  usGenerateOffer(body: any): Observable<any> {
    //original api  GenerateOffer
    let url: string = `${environment.apiMainUrlNet}USOffer/GenerateOffer`;
    return this._http.post<any>(url, body);
  }
  // updateDropOfferReason(body: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Offer/updateDropReasonOfferedCandByCid?Cid=${body.Cid}&StatusId=${body.statusType}&DropReasonId=${body.dropReason}&DropRemark=${body.remark ? body.remark : ''}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }
  // AddUpdateHRApproval(body: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}USOffer/AddUpdateHRApproval?cid=${body.cid}&HRApprovalId=${body.hrApprover}&Remark=${body.remarks ? body.remarks : ''}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }
  AddUpdateHRApproval(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/AddUpdateHRApproval`;
    return this._http.post<any>(url, data);
  }
  /**approve/reject offer by US hr */
  // ApprovReferrbackByUsHR(body: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}USOffer/ApprovedOrReferrbackByHR?cid=${body.cid}&ActionTaken=${body.actionTaken}&Remark=${body.remarks ? body.remarks : ''}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }
  ApprovReferrbackByUsHR(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/ApprovedOrReferrbackByHR`;
    return this._http.post<any>(url, data);
  }

  /**Send offer to candidate US */
  usSendOfferToCandidate(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}USOffer/sendOffer`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getFieldsList(): Observable<any> {
    let url = `${environment.apiMainUrlNet}/Offer/GetFieldsList`;
    return this._http.get<any>(url, { headers: this.headerHttpSkipLoader });
  }

  resendOfferApproval(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/resendOfferForApproval`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  getReferredOrPendingApprover(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getPendingApproversList?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  cahngeApprovers(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/changeApproversOfOfferApproval`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /**get target talent full details */
  getTargetTHIDDetails(cid: number, thId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}Offer/getTransferTalentIdDetails?cid=${cid}&TransferTHID=${thId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get current talent full details */
  getCurrentTHIDDetails(cid: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}Offer/getTalentIdCurrentDetails?cid=${cid}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**transfer to other talent id implimented with tc */
  transferSelectedCandidateByTalentIdWithTC(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/TransferTalentIdwithTC`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  GetApprovedCandidatesListReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}USOffer/GetApprovedCandidatesListReport`, data, httpOptions);
  }

  GetHRApprovedCandidatesListReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}USOffer/GetHRApprovedCandidatesListReport`, data, httpOptions);
  }

  getApproverListSupport(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}OfferG5Above/getG5AboveApproverList`;
    return this._http.get<any>(url, this.httpOptions);
  }

  addUpdateOfferApprovalSupport(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/addUpdateOfferApprovalSupport`;
    return this._http.post<any>(url, data, this.httpOptions);
  }
    
  uploadApprovalDocumentByRec(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/AddTidReopenOfferApprovalAttachment`;
    return this._http.post<any>(url, data);
  }

  getReopenedCandidateList(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Offer/GetAllReopenedSelectedCandidatesList`, data, httpOptions);
  }

  /***
   * updateConsetnByRecForVideoCompare
   */
  updateConsetnByRecForVideoCompare(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}interview/updateConsetnByRecForVideoCompare?cid=${cid}`;
    return this._http.post<any>(url, null, this.httpOptions);
  }

  //to get details fro approval  
  GetCandidateDetailsForApproval(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/GetCandidateDetailsForApproval?cid=${cid}`;
    return this._http.get<any>(url, this.httpOptions);
  }
   uplaodOfferInHandDocument(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/uplaodOfferInHandDocument`;
    return this._http.post<any>(url, data);
  }
}

