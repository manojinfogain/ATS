import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalMethod } from '../core/common/global-method';
import { ITotal } from '../core/models/common-model';
import { GetSetStorageService } from '../core/services/get-set-storage.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private _httpclient: HttpClient,
    private _storage: GetSetStorageService
  ) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getallProfileCount(id: number): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/getProfileWiseCandidateCount?thid=' + id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  addProfile(data: any, imgFile, reqData: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/addupdateCandidateDetailsFile';
    let formdata = new FormData();
    if (reqData.type === 1) {
      formdata.append('id', '0');
      formdata.append('Email', data.email);
    }
    else {
      formdata.append('id', reqData.list.id);
    }

    formdata.append('firstName', data.firstName);
    formdata.append('middleName', data.middleName?data.middleName:'');
    formdata.append('lastName', data.lastName?data.lastName:'');
    formdata.append('MobileNumber', data.mobileNumber);
    formdata.append('PrimarySkill', data.primarySkill);
    formdata.append('SecondarySkill', data.secondarySkill);
    formdata.append('totalExp', data.totalExperience);
    formdata.append('releventExp', data.releventExperience);
    formdata.append('totalExpMonth', data.totalExpMonth);
    formdata.append('relExpMonth', data.relExpMonth);
    formdata.append('StatusId', data.statusid);
    formdata.append('AddedBy', data.AddedBy);
    formdata.append('ProfileId', data.ProfileId);
    formdata.append('thid', data.thid);
    formdata.append('CountryCOde', data.countryCode);
    formdata.append('dob', data.candiDob ? GlobalMethod.formatDate(data.candiDob) : '');
    formdata.append('IsFromNaukriAPI', data.IsFromNaukriAPI);
    if (imgFile) {
      formdata.append('Resume', imgFile);
    }
    if(data?.Approver){
      formdata.append('ApproverId', data.Approver);
    }
    if(data?.ReferredBy){
      formdata.append('ReferredById', data.ReferredBy);
    }
    if(data?.Partner){
      formdata.append('PartnerId', data.Partner);
    }
    if(data?.Link){
      formdata.append('Link', data.Link);
    }
    if(data?.remarks){
      formdata.append('Remarks', data.remarks);
    }
    if(reqData?.list?.StatusApr == 'R'){
      formdata.append('IsResend', 'Y');
    }
    return this._httpclient.post(url, formdata);
  }

  /***
   * getProfilelist
   */

  getProfileList(id): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/getProfileWiseCandidateList?ProfileID=1';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /***
   * get Profile wise candidate list
   */
  getProfileWiseCandidateList(profileId, thId,ISFromNaukri, paging) {
    //let url: string = `${environment.apiMainUrlNet}Dashboard/getProfileWiseCandidateList?ProfileID=${profileId}&thid=${thId}&${paging}`;
     let url: string = `${environment.apiMainUrlNet}Dashboard/getProfileWiseCandidateList?ProfileID=${profileId}&thid=${thId}&ISFromNaukri=${ISFromNaukri}&${paging}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

   /**coomon api to get partner - for filter */
   getVenderList(param: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getPartnerFullDetails?${param}`;
    return this._httpclient.get<any>(url, this.httpOptions);
  }

   /**coomon api to get partner - for filter */
   getApproverList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/getApproverListForRenuTeam`;
    return this._httpclient.get<any>(url, this.httpOptions);
  }

  /***
   * get Profile wise candidate list
   */
  getTalentIdInfo(thId) {
    let url: string = `${environment.apiMainUrlNet}Dashboard/getRequisitionTHID?THID=${thId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  viewCkill(thId, paging): Observable<any> {
    let url = `${environment.apiMainUrlNet}Dashboard/getResumeOfProfilesBasedOnTalentID?thid=${thId}&${paging}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  viewCskillCount(data): Observable<any> {
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfProfilesBasedOnTalentID?thid=' + data;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  getFulfillmentDateBasedOnTalentID(thId): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/getFulfillmentDateBasedOnTalentID?THID=${thId}`
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.get<any>(url, httpOptions);

  }
  /**
   * get assigned talent id list
   * @param data 
   * @returns 
   */
  getAssignedTalentIdList(data): Observable<any> {
    let email = this._storage.getUserEmail();
    let url: string = `${environment.apiMainUrlNet}/Dashboard/getRequisitionForRecruiters?emailId=${email + data}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /**
  * get all talent id list
  * @param data 
  * @returns 
  */
  getAllTalentIdList(data): Observable<any> {
    let empId = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Dashboard/getAllOpenRequisitionDetails`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /**
   * total open position
   * @returns 
   */
  gettotalOpenposition(): Observable<any> {
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfAllOpenRequisition';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /***
   * get Count of assigned
   */
  gettalentidAssigned(): Observable<any> {
    let emailId = this._storage.getUserEmail();
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfRequisitionForRecruiters?emailId=' + emailId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /**
   * get Count fullfillment date available
   * @returns 
   */
  fullfillmentDateAvailable(): Observable<any> {
    let fullemailid = this._storage.getUserEmail();
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfTalentIDFulfillmentAvailable?emailId=' + fullemailid;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }


  /**
   * total open position
   * @returns 
   */
  getTotalUnmapProfile(): Observable<any> {
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfAllUnmapCandidatebyProfile';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  getAllUnmapProfileCount(): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/getProfileWiseUnmapCandidateCountByProfileId';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /***
   * get Profile wise candidate list
   */
  getProfileWiseUnmapCandidateList(profileId, paging) {
    let url: string = `${environment.apiMainUrlNet}Dashboard/getUnMapProfileWiseCandidateListByProfileId?ProfileID=${profileId}&${paging}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /***
  * get Profile wise candidate list
  */
  maptoTalentId(data) {
    let url: string = `${environment.apiMainUrlNet}Dashboard/updateUnMapCandidateProfileDetails`;
    return this._httpclient.post<any>(url, data);
  }
  /***
   * get Unused Cskill profile
   */
  getTotalUnusedProfile(uniq: number): Observable<any> {
    let url: string = environment.apiMainUrlNet + '/Dashboard/getCountOfAllUnusedCskillProfile?uniq=' + uniq;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /***
     * ge Listt Unused Cskill profile
     */
  // getUnusedCkillProfileList(paging): Observable<any> {
  //   let url = `${environment.apiMainUrlNet}Dashboard/getListOfAllUnusedCskillProfile?${paging}`;
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })

  //   }
  //   return this._httpclient.get<any>(url, httpOptions);
  // }

  getUnusedCkillProfileList(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(`${environment.apiMainUrlNet}Dashboard/getListOfAllUnusedCskillProfile`, data,httpOptions);
  }


  /***
* transfer talent id
*/
  shifttoTalentId(data) {
    let url: string = `${environment.apiMainUrlNet}Dashboard/transferCskillUnusedCandidateRecord`;
    return this._httpclient.post<any>(url, data);
  }


  getPartnerCandidateListByTalentId(param): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getPartnerCandidateListByTalentId?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  cskillScreenReject(param): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/CskillProfileScreenReject?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.post<any>(url, httpOptions);
  }

  unmapEmpRefScreenReject(param): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/unmapEmpRefProfileScreenReject?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.post<any>(url, httpOptions);
  }

  /**active screen reject */
  activeCandidateScreenReject(param): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/ActivateCandidate?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.post<any>(url, httpOptions);
  }


  partnerScreenReject(param): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}partner/partnerProfileScreenReject?${param}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.post<any>(url, httpOptions);
  }

  /***
  * getAllProfileCountByClosedTalentId
  */
  getAllProfileCountByClosedTalentId(): Observable<ITotal> {
    let url: string = environment.apiMainUrlNet + '/Dashboard/getAllProfileCountByClosedTalentId';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<ITotal>(url, httpOptions);
  }

  /***
 *get Common Repo Profile List
 */
  getCommonRepoProfileList(paging): Observable<any> {
    let url = `${environment.apiMainUrlNet}Dashboard/getAllProfileByClosedTalentId?${paging}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  /***
   * update recuition Details
   */
  updateRequisitionDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Dashboard/updateRequisitionDetails`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })

    }
    return this._httpclient.post<any>(url, body, httpOptions);
  }

  /***
   * get Du Wise Report
   */
  getDeliveryHeadWiseDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getDeliveryHeadWiseDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }


  /***
  * getgetDeliveryWiseCandidateDetails
  */
  getDeliveryWiseCandidateDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getDeliveryWiseCandidateDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
  * get Bu Wise Report
  */
  getBUHeadWiseDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getBUHeadWiseDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
   * getBUHeadWiseCandidateDetails
   */
  getBUHeadWiseCandidateDetails(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getBUHeadWiseCandidateDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }
  /***
* get getAccountOwnerWiseDetails
*/
  getAccountOwnerWiseDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getAccountOwnerWiseDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
   * getAccountOwnerWiseCandidateDetails
   */
  getAccountOwnerWiseCandidateDetails(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getAccountOwnerWiseCandidateDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }
  /***
* get getPMWiseDetails
*/
  getPMWiseDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getPMWiseDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
   * getPMWiseCandidateDetails
   */
  getPMWiseCandidateDetails(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getPMWiseCandidateDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
* get getHiringManagerWiseTHIDsDetails
*/
  getHiringManagerWiseTHIDsDetails(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getHiringManagerWiseTHIDsDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
  * getHiringManagerWiseCandidateDetails
  */
  getHiringManagerWiseCandidateDetails(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getHiringManagerWiseCandidateDetails';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }
  /***
 * getHiringManagerWiseCandidateDetails
 */
  getHMTHIDWiseCount(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getHMTHIDWiseCount';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
* getDUTHIDWiseCount
*/
  getDUTHIDWiseCount(data: any): Observable<any> {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getDUTHIDWiseCount';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
* getBUTHIDWiseCount
*/
  getBUTHIDWiseCount(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getBUTHIDWiseCount';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
 * getAccountTHIDWiseCount
 */
  getAccountTHIDWiseCount(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getAccountTHIDWiseCount';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

  /***
  * getAccountTHIDWiseCount
  */
  getPMTHIDWiseCount(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/getPMTHIDWiseCount';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }
   /***
 *get getOverallHiringList List
 */
 getOverallHiringList(data): Observable<any> {
  let url = `${environment.apiMainUrlNet}Dashboard/GetWeekWiseHiringViews?${data}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  return this._httpclient.get<any>(url, httpOptions);
}

 /***
 *get getOverallGenderHiringList List
 */
 getOverallGenderDiversityHiringList(data): Observable<any> {
  let url = `${environment.apiMainUrlNet}Dashboard/GetGenderDiversityOverAllHiringViews?${data}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  return this._httpclient.get<any>(url, httpOptions);
}

/***
 *get getOverallOfferToJoinList List
 */
 getOverallOfferToJoinList(data): Observable<any> {
  let url = `${environment.apiMainUrlNet}Dashboard/GetOfferToJoiningHiringViews?${data}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  return this._httpclient.get<any>(url, httpOptions);
}

/***
 *get getOverAllLocationSpecificList List
 */
 getOverAllLocationSpecificList(data): Observable<any> {
  let url = `${environment.apiMainUrlNet}Dashboard/GetLocationWiseHiringViews?${data}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  return this._httpclient.get<any>(url, httpOptions);
}

/***
 *get getOverAllSourceType List
 */
 getOverAllSourceTypeList(data): Observable<any> {
  let url = `${environment.apiMainUrlNet}Dashboard/GetSourceWiseHiringViews?${data}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })

  }
  return this._httpclient.get<any>(url, httpOptions);
}


GetApprovalCandidateListForRenuTeam(thId,paging): Observable<any> {
   let url: string =`${environment.apiMainUrlNet}Dashboard/GetApprovalCandidateListForRenuTeam?${paging}`;
   const httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
   }
   return this._httpclient.get<any>(url, httpOptions);
} 
/**
 * 
 * @param body 
 * @returns 
 */
approveProfileScreening(body:any): Observable<any> {
  let url: string =`${environment.apiMainUrlNet}Dashboard/ApproveProfileScreening`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this._httpclient.post<any>(url, body,httpOptions);
} 


getProfileApprovalStatus(id:number): Observable<any> {
  let url: string =`${environment.apiMainUrlNet}Dashboard/GetProfileApprovalStatus?Id=${id}`;
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  return this._httpclient.get<any>(url, httpOptions);
} 

  /**coomon api to get partner - for filter */
  getActivePartnerList(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Partner/getActivePartnerList`;
    return this._httpclient.post<any>(url, body,this.httpOptions);
  }

  AddMultipleProfiles(formdata: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/AddMultipleProfiles';
   
    return this._httpclient.post(url, formdata);
  }
   AddMultipleProfilesAfterAssesments(formdata: any): Observable<any> {
    let headerHttpSkipLoader = new HttpHeaders({
     SkipLoader:''
  })
    let url: string = environment.apiMainUrlNet + 'Dashboard/AddMultipleProfilesAfterAssesments';
   
    return this._httpclient.post(url, formdata,{headers:headerHttpSkipLoader});
  }

    getAssestProfileWiseCandidateList(profileId:number, thId:number, paging:any) {
    let url: string = `${environment.apiMainUrlNet}Dashboard/getAssestProfileWiseCandidateList?ProfileID=${profileId}&thid=${thId}&${paging}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }


   getAllProfilesListByThid(data: any) {
    const url: string = environment.apiMainUrlNet + '/Dashboard/GetAllProfilesListByThid';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this._httpclient.post<any>(url, data, httpOptions);
  }

    UpdateProfileDetailsById(formdata: any): Observable<any> {
    let url: string = environment.apiMainUrlNet + 'Dashboard/UpdateProfileDetailsById';
   
    return this._httpclient.post(url, formdata);
  }
}




