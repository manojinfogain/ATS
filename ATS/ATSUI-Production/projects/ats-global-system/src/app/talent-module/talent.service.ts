import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SkipLoader } from '../core/interceptors/loader-interceptor';

@Injectable({
  providedIn: 'root'
})
export class TalentService {

  constructor(private _http: HttpClient) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getRequirementTypeList(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetRequirementType?EmpUnit=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get state */
  getStateNameList(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetStates?CountryID=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get cities from location/state*/
  getCitiesNameList(Countryid: number, stateName: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getCities?CountryID=${Countryid}&StateName=${stateName ? stateName : ''}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get du list*/
  getDuList(unitId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetDeliveryUnit?EmpUnitID=${unitId ? unitId : null}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get account list*/
  getAccountList(reqtype: number, duId: number, empUnitId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetAccountsList?ReqTypeID=${reqtype}&DUID=${duId}&Unit=${empUnitId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get project list*/
  getProjectsList(accountId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetProjectsList?AccountID=${accountId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get opportunity list*/
  getOpportunityList(accountId: string, reqTypeId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetOpportunityDetails?AccountID=${accountId}&ReqTypeID=${reqTypeId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**  Get Opportunity Details For Mapping list*/
  GetOpportunityDetailsForMapping(accountId: string, reqTypeId: number, thId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetOpportunityDetailsForMapping?AccountID=${accountId}&ReqTypeID=${reqTypeId}&THID=${thId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get SfdcClient  list*/
  getSfdcClientList(accountId: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSFDCClient?AccountID=${accountId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get desigcantion list*/
  GetDesignationCategories(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetDesignationCategories`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get SfdcClient  list*/
  GetDesignations(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetDesignations?DesigCateID=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get GetQualifications list*/
  GetQualifications(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetQualifications`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get Get Primary Skills list*/
  GetPrimarySkills(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetPrimarySkills`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get sub skills  list*/
  GetSubSkills(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSubSkills?PriSkillID=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get Employee Type list*/
  GetEmployeeType(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetEmployeeType`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get SfdcClient  list*/
  GetTeamDetailsFromPricing(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTeamDetailsFromPricing?OppID=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get salary details  list*/
  GetSalaryDetails(expRangeid: number, jobId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSalaryDetails?ExpRangeID=${expRangeid}&JobFamilyID=${jobId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get division */
  GetDivisionDetails() {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetDivisions`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**add update data for talent creations */
  AddUpdateTalentIDDetails(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddUpdateTalentIDDetails`;
    return this._http.post<any>(url, data);
  }

  /** update */
  updateTalentIDDetails(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateTalentIDDetails`;
    return this._http.post<any>(url, data);
  }


  /** get Raised THID Detailss  list*/
  GetRaisedTHIDDetails(data: any): Observable<any> {
    // let canUrl = `${environment.apiMainUrlNet}/Talent/GetRaisedTHIDDetails?Page=${data?.page}&PageSize=${data?.pageSize}&search=${data?.search ? data?.search : ''}&StatusID=${data?.StatusID ? data?.StatusID : ''}`;
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetRaisedTHIDDetails`;
    return this._http.post<any>(canUrl, data, this.httpOptions)
  }

  /** get Raised THID Detailss  list*/
  GetAllRaisedTHIDDetails(body: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetAllRaisedTHIDs`;
    return this._http.post<any>(canUrl, body, this.httpOptions)
  }

  // GetTHIDDetailsByTHID(thId:number){
  //   let canUrl = `${environment.apiBaseUrlNet}/Talent/GetTHIDDetailsByTHID?THID=${thId}`;
  //   return this._http.get<any>(canUrl, this.httpOptions)
  // }
  /**get talent full details */
  GetTHIDDetailsByTHID(thId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTHIDDetailsByTHID?THID=${thId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get replacement reason list*/
  GetReplacementReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetReplacementReason`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get rebidType list*/
  GetBidType(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetBidType`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get conersion emp list*/
  getConverstionEmpList(reqTypeID: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getConverstionEmpList?reqType=${reqTypeID ? reqTypeID : null}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  //approve talent request
  approveRequestGDL(THID: number, ActionTaken: string, subReasonId: number, Remark: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateGDLAction?THID=${THID}&ActionTaken=${ActionTaken}&SubCateID=${subReasonId}&Remarks=${Remark}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  //approve  request by finance
  approveRequestFinance(THID: number, ActionTaken: string, subReasonId: number, Remark: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateFinanceAction?THID=${THID}&ActionTaken=${ActionTaken}&SubCateID=${subReasonId}&Remarks=${Remark}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**get talent statuslist */
  getStatusList(ActionTaken: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentStatus?ActionTaken=${ActionTaken}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get Get Sent Back To WMG Reason */
  GetSentBackToWMGReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSentBackToWMGReason`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get Get Sent Back To WMG Reason */
  GetReferBackReasonForWMG(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetReferBackReasonForWMG`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  //update status talent 
  // UpdateTalentIdStatus(THID: number, StatusId: number, Remark: string): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Talent/UpdateTalentIdStatus?THID=${THID}&StatusId=${StatusId}&Remark=${Remark}`;
  //   return this._http.post<any>(url, this.httpOptions);
  // }
  UpdateTalentIdStatus(data: any): Observable<any> {

    let url: string = `${environment.apiMainUrlNet}Talent/UpdateTalentIdStatus?THID=${data?.THID}&StatusId=${data?.StatusId}&ReasonId=${data?.ReasonId ? data?.ReasonId : null}&subReason=${data?.subReason ? data?.subReason : null}&EmpName=${data?.EmpName ? data?.EmpName : null}&ProposedEmpId=${data?.ProposedEmpId ? data?.ProposedEmpId : null}&Remark=${data?.Remark ? data?.Remark : ''}&ExfulfiledEmpId=${data?.ExfulfiledEmpId ? data?.ExfulfiledEmpId : ''}&sourceId=${data?.sourceId ? data?.sourceId : ''}&offerdate=${data?.offerdate ? data?.offerdate : ''}&Dateofjoining=${data?.Dateofjoining ? data?.Dateofjoining : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }


  /** get poposed Employee refer list*/
  // GetEmployeeToReferTalentId(body: any): Observable<any> {
  //   let canUrl = `${environment.apiMainUrlNet}/Talent/GetEmployeeToReferTalentId?page=${body.page}&pagesize=${body.pageSize}&Type=${body.type}&search=${body.search ? body.search : ''}`;
  //   return this._http.get<any>(canUrl, this.httpOptions)
  // }
  // GetEmployeeToReferTalentId(body: any): Observable<any> {
  //   let canUrl = `${environment.apiMainUrlNet}/Talent/GetEmployeeToReferTalentId?page=${body.page}&pagesize=${body.pageSize}&Type=${body.type}&search=${body.search ? body.search : ''}&Skill=${body.Skill ? body.Skill : ''}&Departments=${body.Departments ? body.Departments : ''}&MINExperince=${body.MINExperince ? body.MINExperince : ''}&MAXExperince=${body.MAXExperince ? body.MAXExperince : ''}`;
  //   return this._http.get<any>(canUrl, this.httpOptions)
  // }

  GetEmployeeToReferTalentId(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Talent/GetEmployeeToReferTalentId`, data, httpOptions);
  }
  //refer employee to talent 
  AddReferralEmployeesAgainstTHID(THID: number, EmpIds: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddProposedEmployeesAgainstTHID?THID=${THID}&EmpIds=${EmpIds}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /** get proposed employees  list*/
  GetProposedEmployeesTHIDWise(thId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetProposedEmployeesTHIDWise?THID=${thId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** internal job posting post  */
  AddUpdateIJP(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddUpdateIJP`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**get iJP details by thId */
  GetIJPTHIDDetails(thId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetIJPTHIDDetails?THID=${thId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get ijp job  list view job landing page*/
  GetIJPViewJobList(data: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetIJPViewList`;
    return this._http.post<any>(canUrl, data, this.httpOptions)
  }


  //submit request for job applly ijp
  ApplyForIJP(paramData: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/ApplyForIJP?IJPID=${paramData.thId}&TalentId=${paramData.TalentId}&FitmentRemarks=${paramData.Justification}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**get ijp applicant list */
  GetIJPApplicantList(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetIJPApplicantList?talentID=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**
   * Get My Application Stats - Dashboard summary
   */
  getMyApplicationStats(data:any): Observable<any> {
    // let url = `${environment.apiMainUrlNet}Talent/GetMyApplicationStats`;
    let url = `${environment.apiMainUrlNet}Talent/GetIJPAndProposalWmgCount`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /**
   * Get My Application History - User's applied IJP positions with details
   */
  getMyApplicationHistory(data: any): Observable<any> {
    // let url = `${environment.apiMainUrlNet}Talent/GetIJPViewListForDashboard`;
    let url = `${environment.apiMainUrlNet}Talent/GetIJPAndProposeList`;
    return this._http.post<any>(url, data, this.httpOptions);
  }

  /**get Offered Candidate Details For Talent  list */
  GetOfferedCandidateDetailsForTalent(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetOfferedCandidateDetailsForTalent?talentID=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  //  submit cancel talent id 
  cancletTalentId(thId: number, subReasonId: number, remarks: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/CancelTHID?THID=${thId}&SubCateID=${subReasonId}&Remarks=${remarks}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**get cancel Talent Reason Categ list */
  cancelTalentReasonCateg(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetCancellationCategory`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get cancel reason list */
  cancelTalentReason(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetCancellationSubCategory?CateID=${id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  //  update thid details by wmg
  updateThIdDetailsWmg(thId: number, FulfilmentDate: string, remarks: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateTHIDDetailsWMG?THID=${thId}&FulfilmentDate=${FulfilmentDate}&Remarks=${remarks}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**get Talent status list */
  GetTalentStatusList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetStatusList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**get history of talent ID */
  GetHistoryForTalentID(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetStatusHistoryForTalentID?talentID=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**add update data for talent creations */
  MappingOppIDtoTHID(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/MappingOppIDtoTHID`;
    return this._http.post<any>(url, data);
  }

  ApprovedOrRejectThIdFromMail(THID: number, ActionTaken: string, subReasonId: number, Remark: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/ApprovedOrRejectThIdFromMail?THID=${THID}&ActionTaken=${ActionTaken}&SubCateID=${subReasonId}&Remarks=${Remark}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  //submit request for job applly ijp
  AddOrRemoveFromWebsite(thID: number, ActionTaken: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddOrRemoveFromWebsite?talentID=${thID}&ActionTaken=${ActionTaken}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  /**get employee List for US */
  getEmployeeListForUS(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetUSEmpList`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  //TalentIDClone
  TalentIDClone(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/TalentIDClone?THID=${data?.thId}&Frequency=${data?.Frequency}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  AddUpdateOfferDetailsByTHID(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddUpdateOfferDetailsByTHID`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  CloseTHID(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/CloseTHID?OfferId=${body?.OfferId}&EmpId=${body?.EmpId}&dateOfJoing=${body?.dateOfJoing}${body?.remarks ? '&Remarks=' + body?.remarks : ''}`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /**get history of talent ID */
  GetExperienceByGradeID(GradeID: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetExperienceByGradeID?GradeID=${GradeID}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }


  /** GetRaisedTHIDDetailsCount*/
  GetRaisedTHIDDetailsCount(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetRaisedTHIDDetailsCount`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }


  /** get c2h conversion employee details*/
  GetAllDetailsOfContractualEmployee(empID: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetAllDetailsOfContractualEmployee?EmpId=${empID}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** get sub skills  list*/
  GetSubSkillsByIds(skillIds: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSubSkillsByIds?skillIds=${skillIds}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /***
   * update recuition Details
   */
  updateRequisitionDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/updateRequisitionFullfillmentDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /***
  * update recuition Details
  */
  updateRequisitionDetailsPriSecRecruiter(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/updateRequisitionDetailsPriSecRecruiter`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /** GetTagCommitmentHistory*/
  GetTagCommitmentHistory(thid: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTagCommitmentHistory?thid=${thid}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**Send To Tag Reason categ by wmg */
  GetSendToTagReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/GetSendToTagReason`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**Get Approved Over by wmg */
  GetApprovedOver(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/GetApprovedOver`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**Get Approved Over by wmg */
  GetApprovedBy(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/GetApprovedBy`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  //GetIJPApplyValidation
  getIJPApplyValidation(thid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/GetIJPApplyValidation?thid=${thid}`;
    return this._http.get<any>(url, this.httpOptions);
  }
  /** GetTagCommitmentHistory*/
  CheckReplacementIdCreated(ReplacementEmpId: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/CheckReplacementIdCreated?ReplacementEmpId=${ReplacementEmpId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /** update status wmg - send to tag */

  UpdateTalentIdStatusByWmg(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateTalentIdStatusByWmg`;
    return this._http.post<any>(url, data);
  }

  /**reject talent id while approval */
  RejectTalentId(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/CancelTalentIDByTHID?THID=${data?.THID ? data?.THID : ''}&ActionTaken=${data?.ActionTaken ? data?.ActionTaken : ''}&SubCateID=${data?.SubCateID ? data?.SubCateID : ''}&Remarks=${data?.Remark ? data?.Remark : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }

  getJoinedCandidateDetails(th_id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetJoinedCandidateDetailsByTHID?THID=${th_id}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  // transfer and reopen talent id
  transferAndReopenTalentId(body: any): Observable<any> {
    // let url: string = `${environment.apiMainUrlNet}Talent/ReopenTalentId?cid=${body?.cid}&toThId=${body?.toThId}&IsReinitiationRequired=${body?.IsReinitiationRequired}${body?.Remarks ? '&Remarks=' + body?.Remarks : ''}`;
    let url: string = `${environment.apiMainUrlNet}Talent/ReopenTalentId`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  ReopenTransferTalentIdNonReinitiation(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/ReopenTransferTalentIdNonReinitiation`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  getProfileListByLocation(thid: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getProfileListByLocation?thid=` + thid;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  getExternalPortal(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getSubProfileListById?id=` + id;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get reasonlist for activation of dormant tid*/
  GetTalentUndormantReasons(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentUndormantReasons`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**activate dormant tid */
  UndormantTalentIDByTHID(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UndormantTalentIDByTHID?THID=${data?.THID ? data?.THID : ''}&RevisedOnbDate=${data?.RevisedOnbDate ? data?.RevisedOnbDate : ''}&UndormantReason=${data?.UndormantReason ? data?.UndormantReason : ''}&RevisedBillingDate=${data?.RevisedBillingDate ? data?.RevisedBillingDate : ''}`;
    return this._http.post<any>(url, this.httpOptions);
  }
  /**clone multiple talentids  */
  multipleTalentIDClone(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/TalentIDClone`;
    return this._http.post<any>(url, data);
  }
  /**get Get Panel Nomination Notification listBy tid */
  GetPanelNominationNotificationlistBytid(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/NominationPanel/GetPanelNominationNotificationlistBytid?thid=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get no of cuunnet offer talent id */
  GetNumberOfOffersOnTid(THID: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetNumberOfOffersOnTid?THID=${THID}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**Get Allocation Details By Tid*/
  GetAllocationDetailsByTid(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetAllocationDetailsByTid?THID=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /** get Primary SKills List By Tc*/
  getPrimarySKillsListByTc(tcId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetPrimarySkillsByTalentCube?TalentCubeCode=${tcId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }


  /**GetClientWorkRequirements*/
  GetClientWorkRequirements(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetClientWorkRequirements`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  /**GetSubClientWorkRequirements*/
  GetSubClientWorkRequirements(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSubClientWorkRequirements`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  AddUpdateTalentOfferDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/AddUpdateTalentOfferDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /***
 * get DGM Calculation for Poland
 */
  getDgmCalcForPoland(body: any) {
    let param = `LocationId=${body.JoiningLocationID}&cadidateTypeId=${body.CandidateTypeID}&billingRate=${body.billingRateHrCurrency}&annualCTC=${body.ctc}&billingCurrencyId=${body.billingCurrencyId}&joiningBonus=${body.joiningBonus}&localCurrencyId=${body.JoiningLocationID}&NonReimbursableTravelCost=${body.NonReimbursableTravelCost}&projectSpecificCost=${body.projectSpecificCost}&projectBuffer=${body.projectBuffer}&billableHoursDay=${body.billableHoursDay}`
    let url: string = `${environment.apiMainUrlNet}Talent/DgmCalculaterForPoland`;
    return this._http.post<any>(url, body, this.httpOptions);
  }
  /**get Offered Candidate Details For Talent  list for poland */
  GetOfferedCandidateDetailsForTalentForPoland(talentId: number, offerId: number = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentIdOfferdetails?THID=${talentId}&OfferId=${offerId ? offerId : 'null'}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  CloseTHIDForPoland(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateCandidateOfferStatusForPoland`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  /** get Raised THID Detailss  list*/
  getRaisedTHIDDetailsReport(data: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetRaisedTHIDDetailsReport`;
    return this._http.post<any>(canUrl, data, this.httpOptions)
  }

  getReplGradeChangeReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/GetReplGradeChangeReason`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

  // <<<<<<< HEAD
  //    /**get my application ijp */
  //   getMyApplicationDetails(talentId: number): Observable<any> {
  //     let canUrl = `${environment.apiMainUrlNet}/Talent/GetFitmentRemarksByTHID?thid=${talentId}`;
  // =======
  //     /** GetTagCommitmentHistory*/
  //   CheckReplacementRotationIdCreated(ReplacementEmpId: string): Observable<any> {
  //     let canUrl = `${environment.apiMainUrlNet}/Talent/CheckReplacementRotationIdCreated?ReplacementEmpId=${ReplacementEmpId}`;
  // >>>>>>> Production
  //     return this._http.get<any>(canUrl, this.httpOptions)
  //   }
  /** GetTagCommitmentHistory*/
  CheckReplacementRotationIdCreated(ReplacementEmpId: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/CheckReplacementRotationIdCreated?ReplacementEmpId=${ReplacementEmpId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }
  /**get my application ijp */
  getMyApplicationDetails(talentId: number, selectedEmployeeId: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetFitmentRemarksByTHID?thid=${talentId}&SelectedEmpId=${selectedEmployeeId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

    /** get getInternalDemandProbability*/
  getInternalDemandProbability(data: any): Observable<any> {
      const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    [SkipLoader]: 'true'   // ✅ dynamic header key
  });
    let canUrl = `${environment.apiMainUrlNet}/Talent/getInternalDemandProbability`;
    return this._http.post<any>(canUrl, data,  { headers })
  }

     /** get getInternalDemandProbability*/
  GetdataByIds(data: any): Observable<any> {
     const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    [SkipLoader]: 'true'   // ✅ dynamic header key
  });
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetdataByIds`;
    return this._http.post<any>(canUrl, data, { headers })
  }

     /** get getInternalDemandProbability*/
  getDemandProbability(data: any): Observable<any> {
      const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    [SkipLoader]: 'true'   // ✅ dynamic header key
  });
    let canUrl = `${environment.apiMainUrlNet}/Talent/predict`;
    return this._http.post<any>(canUrl, data, { headers })
  }

  getJdQuality(payload: any): Observable<any> {
     const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    [SkipLoader]: 'true'   // ✅ dynamic header key
  });
    let canUrl = `${environment.apiMainUrlNet}/Talent/JDQualiltyAssesment`;
    return this._http.post<any>(canUrl, payload, { headers });
  }

   //bulk approve talentids
  TalentIDApprovalActionBulk(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/TalentIDApprovalActionBulk`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  //bulk Edit talentids
  UpdateTalentBillingOnboardingDate(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Talent/UpdateTalentBillingOnboardingDate`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

      /**get my application ijp */
  CheckCancelTHIDAuthorization(talentId: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/CheckCancelTHIDAuthorization?THID=${talentId}`;
    return this._http.get<any>(canUrl, this.httpOptions)
  }

   getApplicationHistory(data: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetFeedbackProposedEmp`;
    return this._http.post<any>(canUrl, data, this.httpOptions)
  }

  SearchEmployeeByEmpId(payload: any): Observable<any> {
  const url = `${environment.apiMainUrlNet}Talent/SearchEmployeeByEmpId`;
  return this._http.post<any>(url, payload, this.httpOptions);
}


}


