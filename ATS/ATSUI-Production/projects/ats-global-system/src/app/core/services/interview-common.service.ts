import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment'
import { GetSetStorageService } from './get-set-storage.service';
@Injectable({
  providedIn: 'root'
})
export class InterviewCommonService {
  public headerConfig = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private _httpclient: HttpClient, private _storage: GetSetStorageService) { }

  /***
 * get All interview Status
 */

  getIntStatusList(): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'master/getAllInterviewStatus';
    return this._httpclient.get<any>(url, this.headerConfig);
  }



  getInterviewType() {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}master/getInterviewTypes?EmpId=${getTokenEmp}`;
    return this._httpclient.get<any>(url, this.headerConfig)

  }

  getIntMode(): Observable<any> {
    const intUrl = environment.apiMainUrlNet + 'master/getAllInterviewModeDetails';
    return this._httpclient.get<any>(intUrl, this.headerConfig)
  }
  getCandidateType(): Observable<any> {
    let candTypeUrl: string = environment.apiMainUrlNet + 'master/getAllCandidateTypes';
    return this._httpclient.get<any>(candTypeUrl, this.headerConfig)
  }

  getProfileName(): Observable<any> {
    let getComLoc= this._storage.getLocationData();
    let locId = getComLoc?.locId || 0;
    let profileNameUrl: string = environment.apiMainUrlNet + `master/getProfilesList?locId=${locId}`;
    return this._httpclient.get<any>(profileNameUrl, this.headerConfig)
  }
  /**get cskill country */
  getcSkillCountryList(): Observable<any> {
    let profileNameUrl: string = environment.apiMainUrlNet + 'master/getcSkillCountryList';
    return this._httpclient.get<any>(profileNameUrl, this.headerConfig)
  }


  getIdType(): Observable<any> {
    let idTypeUrl: string = environment.apiMainUrlNet + 'master/getAllIdentityTypes';
    return this._httpclient.get<any>(idTypeUrl, this.headerConfig)
  }


  getAccountLists(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getAccountMaster?searchText`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }

  getAccountListByDuIds(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetAccountDUWise`;
    return this._httpclient.post<any>(url, body, this.headerConfig);
  }

  getProjectListLists(ids: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getProjectMaster`;
    let body = {
      "AccountID": ids
    }
    return this._httpclient.post<any>(url, body, this.headerConfig);
  }

  getRecruiterList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getRecruiterList`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }
  /***
   * get linked talentid
   */
  getLinkedTalentIdByCid(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/getLinkedTalentIdByCid?cid=${cid}`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }



  /***
    * candidateSearch
    */
  getAllcandidateSearchByOption(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/SearchCandidate`;
    return this._httpclient.post<any>(url, body, this.headerConfig)
  }

  getReqList(): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'master/getRequisitionTypes';
    return this._httpclient.get<any>(url, this.headerConfig);
  }

  /***
   * get additional Interviewr list
   */
  getAdditionalInterviewrList(RoundID: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetAdditionalInterviewers?RoundID=${RoundID}`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }

  //reason for drop
  getReasonDropList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetCandidateDropReasonList`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }

  //update interview drop  reason  -

  submitReasonFordrop(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/updateCandidateInterviewDetailsByCid?Cid=${body.Cid}&DropReasonId=${body.dropReason}&StatusId=${body.statusType}&DropRemark=${body.remark ? body.remark : ''}`;
    return this._httpclient.post<any>(url, this.headerConfig)
  }
  //
  getPannelDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetCandidateDropReasonList`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }

  updatePanelJdConfirmation(body: any, thid: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}interview/addJD_PanelClarificationHistory?Thid=${thid}&JDFlag=${body.JDFlag}&PanelFlag=${body.PanelFlag}`;
    return this._httpclient.post<any>(url, this.headerConfig)
  }

  getJDPanelAvailableDetails(thid: string) {
    let url: string = `${environment.apiMainUrlNet}interview/GetJDPanelAvailableDetails?ThId=${thid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  getUserCalenderHistory(param: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetCalender?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  getUserCalenderSchFree(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetScheduleCalender`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, body, httpOptions);
  }
  /**screen reject  submit*/
  submitScreenReject(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/CandidateScreenReject?id=${body.id}&profileTypeId=${body.profileTypeId}&screenRejectReasonId=${body.screenRejectId}&Remarks=${body.remark ? body.remark : ''}&IsFromNaukriAPI=${body.IsFromNaukriAPI ? body.IsFromNaukriAPI : 'N'}${body.ApplicantUid ? '&ApplicantUid='+body.ApplicantUid : ''}`;
    return this._httpclient.post<any>(url, this.headerConfig)
  }

  //get candidate  details by cid
  // GetInterviewProcesssReportDetailsByCid(data: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }
  //   return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetInterviewProcessReportDetailsByCid?${'cid='+data}` ,httpOptions);
  // }
  // getCandidateDetailsByCid(body: any): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}Interview/getAllCandidateDetailsByCID?cid=${body.id}&profileTypeId=${body.profileTypeId}&screenRejectReasonId=${body.screenRejectId}&Remarks=${body.remark ? body.remark : ''}`;
  //   return this._httpclient.post<any>(url, this.headerConfig)
  // }

  getCandidateDetailsByCid(param: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/getAllCandidateDetailsByCID?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /**assesment report  */
  getAssessmentReport(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/getCoderByteInterviewDetails?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /***
   * GetCandidateFeebackEnableStatusByCid
   */
  getCandidateFeebackEnableStatusByCid(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetCandidateFeebackEnableStatusByCid?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /***
   * GetCandidateFeebackEnableStatusByCid
   */
  getOpenRequisitionListByDateLapse(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetOpenRequisitionListByDateLapse`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

/**partner status list */
getPartnerstatusList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getPartnerstatus`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /**screen reject  submit*/
  updatescreenstatusbyId(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/updatescreenstatusbyId`;
    return this._httpclient.post<any>(url,body, this.headerConfig)
  }

    getOpportunityList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetOpportunityList`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }
  

    getBizOpsList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetBizOpsList`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }

    getOpportunityListDeamnd(search: string): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getOpportunityListDeamnd?search=${search}`;
    return this._httpclient.get<any>(url, this.headerConfig)
  }
}
