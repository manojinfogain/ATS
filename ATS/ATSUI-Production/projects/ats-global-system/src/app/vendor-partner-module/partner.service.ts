import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { IpatnerAssignTalent } from '../core/models/partner-model';
import { GlobalCommonMethodService } from '../core/common/global-common-method.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private _http: HttpClient,
    private _globalCommonMethod: GlobalCommonMethodService
  ) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  addUpdatePartner(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    return this._http.post(`${environment.apiMainUrlNet}Partner/addUpdatePartnerDetails`, data, this.httpOptions);
  }

  updateStatusPartner(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/ChangePartnerStatus?${data}`, null, this.httpOptions);
  }


  //get reason
  getReasonAssingList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getpartnerselectionreason`;
    return this._http.get<any>(url, this.httpOptions);
  }

  createPartnerUser(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/CreatePartnerUser`, data, this.httpOptions);
  }

  updateStatusUserPartner(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/ChangePartnerUserStatus?${data}`, this.httpOptions);
  }

  // getPartnerUserList(param: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Partner/getPartnerUsersList?${param}`;
  //   return this._http.get<any>(url, this.httpOptions);
  // }
  getPartnerUserList(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    return this._http.post(`${environment.apiMainUrlNet}Partner/getPartnerUsersList`, data, this.httpOptions);
  }

  assignTalentIdToPartner(data: IpatnerAssignTalent): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/AssignTalentIdToPartner`, data, this.httpOptions);
  }


  updateStatusPartnerTalentID(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/partnerTalentIdStatusUpdate?${data}`, this.httpOptions);
  }

  getTalentIdListByPartner(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getTalentIDParterWise?page=1&pageSize=200`;
    return this._http.get<any>(url, this.httpOptions);
  }

  addupdateCandidateByPartner(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/addupdateCandidateByPartner`, data);
  }

  getCandidateListByPartner(param: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getCandidateListByPartner?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  candidateStatusUpdateByPartner(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/candidateStatusUpdateByPartner?${data}`, this.httpOptions);
  }

  checkExistEmail(param: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/checkEmailExistUploadProfByPartner?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  getcandDetails(param: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getCandidateDetailsPartner?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /***
  * get
  */
  getTalentIdInfo(thId) {
    let url: string = `${environment.apiMainUrlNet}Partner/getRequisitionTHIDByPartner?THID=${thId}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  resetPassPartnerUser(id: number, email: string): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/resetPartnerUserPassword?userId=${id}&Email=${email}`, this.httpOptions);
  }

  //partner transfer candidate
  //ipagshareserver:3434/api/Partner/PartnerTalentTransferRequest?id=1&toThId=1'
  transferCandiate(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/TransferCandidateByPartner?id=${data.id}&cid=${data.cid}&toThId=${data.toThId}&remarks=${data.remarksTransfer}`;
    return this._http.post<any>(url, data);
  }
  /**transfer unAttended candidate - partner profiles */
  UnattendedCandidateTransfer(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/UnattendedCandidateTransfer?id=${data.id}&toThId=${data.toThId}&remarks=${data.remarksTransfer}`;
    return this._http.post<any>(url, data);
  }


  transferUnattendedProfileByPartner(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/TransferUnattendedProfileByPartner?id=${data.id}&toThId=${data.toThId}&remarks=${data.remarksTransfer}`;
    return this._http.post<any>(url, data);
  }

  transferUnattendedProfileSource(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/UnattendedProfileSourceTransfer?id=${data.id}&IsThidPresnet=${data.isThidPresnet}&ProfileSourceId=${data.profileSource}&toThId=${data.toThId}&remarks=${data.remarks}`;
    return this._http.post<any>(url, data);
  }

  transferProfileSource(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/TransferAttendedProfileSourceforPartner`;
    return this._http.post<any>(url, data);
  }

  //get candiate profilelist shared by partner
  // getCandidateProfilelistSharedByPartner(param: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Partner/getProfilesListSharedByPartner?${param}`;
  //   return this._http.get<any>(url, this.httpOptions);
  // }

  /**partner profiles */
  getCandidateProfilelistSharedByPartner(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getProfilesListSharedByPartner`, data, httpOptions);
  }
  /**PARTNER TALENT ID LIST */
  // getPartnerTalentIdList(param: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Partner/getListOfPartnerTalentID?${param}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }
  getPartnerTalentIdList(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getListOfPartnerTalentID`, data, httpOptions);
  }

  getPartnerTalentIdAssinedList(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getListOfPartnerTalentID`, data, httpOptions);
  }

  getPartnerDashboard(partnerId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/GetPartnerDashboard?partnerId=` + partnerId;
    return this._http.get<any>(url, this.httpOptions);
  }

  getAssignedTalentIdList(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/GetTaletentDeatil?page=${data?.page}&pageSize=${data?.pageSize}&search=${data?.search ? data?.search : ''}&partnerId=${data?.partnerId}&Action=${data?.Action}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**coomon api to get partner - for filter */
  getVenderList(param: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getPartnerFullDetails?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }

  /**new api for talent details - api to be added from subhash */
  getVenderFullList(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getPartnerDetails`, data, httpOptions);
  }

  /**new api for talent details - api to be added from subhash */
  getAllPartnerList(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getAllPartnerList`, data, httpOptions);
  }
  /***
  * transfer candidate request
  **/
  requestTransferCandidateByPartner(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/CandidateTransferRequestByPartner?cid=${data.cid}&toThId=${data.toThId}&remarks=${data.remarks}`;
    return this._http.post<any>(url, data);
  }

  /***
  * Unattended Candidate Transfer Request By Partner
  **/
  UnattendedCandidateTransferRequestByPartner(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/UnattendedCandidateTransferRequestByPartner?id=${data.id}&toThId=${data.toThId}&remarks=${data.remarks}`;
    return this._http.post<any>(url, data);
  }

  //approve profiles
  approvePartnerRequestForProfile(cid: number, transferStatus: string, remark: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Partner/ApprRejectCandidateTransferReqByPartner?cid=${cid}&transferStatus=${transferStatus}&remark=${remark}`;
    return this._http.post<any>(url, httpOptions);
  }

  /**Approve Reject Unattended Candidate Transfer Requist By Partner */
  ApprRejectUnattendedCandidateTransferReqByPartner(id: number, transferStatus: string, remark: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Partner/ApprRejectUnattendedCandidateTransferReqByPartner?id=${id}&transferStatus=${transferStatus}&remark=${remark}`;
    return this._http.post<any>(url, httpOptions);
  }

  /***
   * UpdatePartnerTHIDAssignStatus
   */
  UpdatePartnerTHIDAssignStatus(data: any): Observable<any> {
    const url: string = `${environment.apiMainUrlNet}Partner/UpdatePartnerTHIDAssignStatus?AssignID=${data?.AssignID}&Action=${data?.Action}${data?.Remarks ? '&Remarks=' + data?.Remarks : ''}`;
    return this._http.post(url, null, this.httpOptions);
  }

  /***
 * UpdatePartnerTHIDAssignStatus
 */
  ChangeApprover(data: any): Observable<any> {
    const url: string = `${environment.apiMainUrlNet}Partner/ChangeApprover?AssignID=${data?.AssignID}&TAGLeadID=${data?.TAGLeadID}${data?.Remarks ? '&Remarks=' + data?.Remarks : ''}`;
    return this._http.post(url, null, this.httpOptions);
  }

  GetPartnerTalentContractType(param: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/GetPartnerTalentContractType?${param}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**get Pending With Me Partner Talent Id */
  getPendingWithMePartnerTalentId(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getPendingWithMePartnerTalentId`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /**ApproveOrRejectPartnerTHID */
  ApproveOrRejectPartnerTHID(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/ApproveOrRejectPartnerTHID?AssignID=${data.asignIds}&Action=${data.status}&Remarks=${data.remarks}`;
    return this._http.post<any>(url, data);
  }

  /**coomon api to get partner - for filter */
  getActivePartnerList(body: any): Observable<any> {
    body['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    let url: string = `${environment.apiMainUrlNet}Partner/getActivePartnerList`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getOpenTalentIdListAssignToPartner(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    return this._http.post(`${environment.apiMainUrlNet}Partner/getAllOpenRequisitionForAssignToPartner`, data, this.httpOptions);
  }


  getPartnerTagHeadApproverByLoc(locId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/GetPartnerTagHeadApproverByLoc?locId=${locId}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  getPartnerTagLeadApproverByLoc(locId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/GetPartnerTagLeadApproverByLoc?locId=${locId}`;
    return this._http.get<any>(url, this.httpOptions);
  }


  /***
* transfer talent id for partners profile
*/
  transferPratnerCandidateByTalentId(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/transferPratnerCandidateByTalentId`;
    return this._http.post<any>(url, data);
  }


  UnattendedCandidateTransferPartner(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/UnattendedCandidateTransferPartnerProfile?id=${data?.id}&toThId=${data?.toThId}&Action=${data?.Action}&remarks=${data?.remarks}`;
    return this._http.post<any>(url, null);
  }

  /***
* approve transfered candidate
*/
  //i/Interview/UpdateCandidateTransferDetails?cid=1&transferStatus=R'

  approveTransferedCandidatePartner(cid: number, transferStatus: string, remark: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Partner/ApprovePartnerProfileTransfer?id=${cid}&transferStatus=${transferStatus}&remark=${remark}`;
    return this._http.post<any>(url, httpOptions);
  }


  ApproveUnAttendentTransferProfilePartner(id: number, transferStatus: string, remark: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Partner/ApproveUnAttendentTransferPartnerProfile?id=${id}&transferStatus=${transferStatus}&remark=${remark}`;
    return this._http.post<any>(url, httpOptions);
  }

  //candidate withdrawn by partner for India
  candidateWithrawnByPartner(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Partner/candidateWithrawnByPartner?${data}`, this.httpOptions);
  }

  /**Add New Contract To Partner */
  AddNewContractToPartner(body: any): Observable<any> {
    // body['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    let url: string = `${environment.apiMainUrlNet}Partner/AddNewContractToPartner`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**update  partner contract */
  UpdatepartnerContractDetail(body: any): Observable<any> {
    // body['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    let url: string = `${environment.apiMainUrlNet}Partner/UpdatepartnerContractDetail`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**Delete Contract Detail */
  DeleteContractDetail(param: any): Observable<any> {
    // body['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    let url: string = `${environment.apiMainUrlNet}Partner/DeleteContractDetail?${param}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**approve/ reject partner Contract */
  approveRejectPartnerContractMulti(param: string): Observable<any> {
    const url: string = `${environment.apiMainUrlNet}Partner/MultiApproveRejectContractDetail?${param}`;
    return this._http.post(url, null, this.httpOptions);
  }

  /**get partner contracts main */
  getAllPartnerContractList(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Partner/getAllPartnerContractList`, data, httpOptions);
  }
  /**approve New Contract To Partner */
  SingleApproveRejectContractofPartner(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/SingleApproveRejectContractofPartner`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**Resend Contract for Approval */
  ResendContractforApproval(body: any): Observable<any> {
    // body['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    let url: string = `${environment.apiMainUrlNet}Partner/ResendContractforApproval`;
    return this._http.post<any>(url, body, this.httpOptions);
  }


}
