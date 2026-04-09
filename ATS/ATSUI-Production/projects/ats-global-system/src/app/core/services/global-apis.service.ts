import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpMethodsService } from './http-methods.service';
import { SkipLoader } from 'projects/ats-global-system/src/app/core/interceptors/loader-interceptor';
import { GetSetStorageService } from './get-set-storage.service';
import { INotificationListParam } from '../models/notification-model';
@Injectable({
  providedIn: 'root'
})
export class GlobalApisService {
  constructor(private httpMethod: HttpMethodsService, private _http: HttpClient, private _storage: GetSetStorageService) { }

  public headerHttp = new HttpHeaders({
    'Content-Type': 'application/json',
    SkipLoader: ''
  })
  public httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getAllOpenRequisition(empId, pagination, limit, text): Observable<any> {

    this.headerHttp[SkipLoader] = '';

    let url = `${environment.apiMainUrlNet}Dashboard/getAllOpenRequisition?pagination=${pagination}${empId ? `&empid=${empId}` : ''}${limit ? `&limit=${limit}` : ''}${text ? `&searchText=${text}` : ''}`
    return this._http.get(url, { headers: this.headerHttp });

  }

  getAllSelectedRequisition(empId, pagination, limit, text): Observable<any> {

    this.headerHttp[SkipLoader] = '';

    let url = `${environment.apiMainUrlNet}Dashboard/getAllSelectedRequisition?pagination=${pagination}${empId ? `&empid=${empId}` : ''}${limit ? `&limit=${limit}` : ''}${text ? `&searchText=${text}` : ''}`
    return this._http.get(url, { headers: this.headerHttp });

  }

  getAllOpenRequisitionForTransfer(empId, pagination, limit, text): Observable<any> {

    this.headerHttp[SkipLoader] = '';

    let url = `${environment.apiMainUrlNet}Dashboard/getAllOpenRequisitionForTransfer?pagination=${pagination}${empId ? `&empid=${empId}` : ''}${limit ? `&limit=${limit}` : ''}${text ? `&searchText=${text}` : ''}`
    return this._http.get(url, { headers: this.headerHttp });

  }

  getEmployeeList(empId, pagination, limit, text): Observable<any> {
    this.headerHttp[SkipLoader] = '';
    let url = `${environment.apiMainUrlNet}master/getInterviewerList?EmpId=${empId}&pagination=${pagination}${limit ? `&limit=${limit}` : ''}${text ? `&searchText=${text}` : ''}`
    return this._http.get(url, { headers: this.headerHttp });

  }

  getApproverList(empId: number, type: number, divisionID: number, cid: number = null, ReqTypeId: number = null): Observable<any> {
    this.headerHttp[SkipLoader] = '';
    let url = `${environment.apiMainUrlNet}master/getApproverList?Division=${divisionID}&EmpId=${empId}&type=${type}&cid=${cid}&reqType=${ReqTypeId}`;
    return this._http.get(url, { headers: this.headerHttp });

  }

  getFunctionHeadApproverList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/getFunctionHeadApproverList`;
    return this._http.get(url, { headers: this.headerHttp });
  }

  getDelegatorList(): Observable<any> {
    this.headerHttp[SkipLoader] = '';
    let url = `${environment.apiMainUrlNet}master/getDelegatorList`
    return this._http.get(url, { headers: this.headerHttp });

  }

  getRequisitionTHID(thid): Observable<any> {
    let url = `Dashboard/getRequisitionTHID?THID=${thid}`
    return this.httpMethod.get(2, url);

  }

  getIntType(): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url = `master/getInterviewTypes?EmpId=${getTokenEmp}`
    return this.httpMethod.get(2, url);

  }

  getSkill(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getSkills`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  /**
  * get practice list
  */
  getAllPractices(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getAllPractices`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  /**
* get cskill country list
*/
  getcSkillCountryList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/getcSkillCountryList`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  /**
 * get variable pay list
 */
  getVariablePayList(cid: number, cubeId: number, grade: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetVariablePayPercentageMaster?cid=${cid}&cubeId=${cubeId}&gradeId=${grade}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  /**
 * get sub practice list
 */
  getSubPracticeListByID(id: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetSubPractice?practice=${id}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  /**
  * get practice community list
  */
  getPracticeCommunityListByID(id: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetPracticeCommunities?practice=${id}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  getDesignation(): Observable<any> {
    let url: string = `master/getDesignation`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.httpMethod.get(2, url, headers);

  }

  getCountryListCode(): Observable<any> {
    let url: string = `master/getCountryList`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.httpMethod.get(2, url, headers);

  }

  getCityList(contryId: number = null, stateId: number = null): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}master/getCityList?EmpId=${getTokenEmp}&${contryId ? `CountryId=${contryId}` : ''}${stateId ? `StateId=${stateId}` : ''}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  getStateList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getStateList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getCurrency(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}master/getAllCurrency`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  GetCurrencyList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCurrencyList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getRecruiter(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getRecruiterList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getHiringManagerList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetHiringManager`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getDUList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDeliveryUnits`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  GetContractTypes(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetContractTypes`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getCompanyList(name: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCompanyList?name=${name}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }
  getCompanyListPaging(param: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCompanyList?${param}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  /**
  * CandidateOfferDropReasonSubset 
  */
  getCandidateOfferDropReason(id: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/CandidateOfferDropReasonSubset?id=${id}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }
  /**
   * get Education List
   * @returns 
   */
  getEducationList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetEducationList`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  addCompany(name: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}partner/addComapnyList?name=${name}`, httpOptions);
  }

  /***
   * get Grade master list
   */
  getGradeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetGradeMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /***
   * get Grade band list
   */
  getGradeBandList(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetGradeBandList?GradeID=${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /***
  * get JobFamilyList
  */
  getJobFamilyList(PracticeID?: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetJobFamilyList?PracticeID=${PracticeID}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getLocationList(locId: number = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getInfogainLocations${locId ? `?locationId=${locId}` : ''}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getAllOnboardStatus(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getAllOnboardStatus`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getDivisionList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDivisionMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getTzList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetOutlooksupportedTimeZones`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(canUrl, null, httpOptions)
  }

  getTagHeadApproverList(divisionID?: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getTagHeadApproverList${divisionID ? '?Division=' + divisionID : ''}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**tag head list api ind */
  getTagHeadList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getTagHeadList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
/*GetJustification_BucketList*/
GetJustificationBucketList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Offer/GetJustification_BucketList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  getAllOfferStatus(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getAllOfferStatus`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getFullfillmentDelayReason(type:number = 1): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getFullfillmentDelayReason?type=${type}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //update talent id
  UpdateTalentIdDetails(body: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}/Dashboard/updateRequisitionDetail`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(url, body, httpOptions);
  }

  checkTalentIdStatus(talentId: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}/interview/CheckTalentIdStatus?thId=${talentId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(url, httpOptions);
  }

  getAllHiringManagerList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetAllHiringManager`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getAllAccountHeadList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getAccountOwner`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getTalentSubStatusList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetAllTalentSubStatus`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get gender

  getGenderList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetAllGender`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get candidate reason
  // getCandidateReasonList(): Observable<any> {
  //   let url: string = `${environment.apiMainUrlNet}CandidateConnect/CandidateConnectReason`;
  //   return this._http.get<any>(url, this.httpOptions);
  // }
  getOfferDropReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/CandidateOfferDropReasonSubset`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  //getting external agency list
  // getExternalAgencyList(): Observable<any> {
  //   this.headerHttp[SkipLoader] = '';
  //   let url = `${environment.apiMainUrlNet}master/getExternalAgencyList`
  //   return this._http.get(url, { headers: this.headerHttp });

  // }

  getExternalAgencyList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getExternalAgencyList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  /**assement interview type change reason  */
  GetAssessmentReasonMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetAssessmentReasonMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getInterviewCancelReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getRescheduleCanelReason`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get screen reject reason */
  getScreenRejectReasonList(data: any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getScreenRejectReason?id=${data.id ? data.id : ''}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get joined candidate list */
  getJoinedCandidateList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getJoinedEmployeeList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get joined candidate list */
  getCandidateListByTalentId(thid: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Offer/GetCandidateListByTalentId?thid=${thid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get year

  getYearList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetFinicialYear`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**
  * get employee unit list
  */
  getEmployeeUnitList(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetEmployeeUnit`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  /**
  * get GetOnboardingFormMaster list
  */
  GetOnboardingFormMaster(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}master/GetOnboardingFormMaster`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }

  GetDepartments(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetDepartments`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- visa type master list
  getVisaTypeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetVisaTypes`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- I9 Representative  master list
  getI9RepresentativeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetI9RepresentativeList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getTalentCubeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetAllTalentCubeList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getRoleByTalentCube(talentCubeCode: number = null, gradeId: number = null): Observable<any> {
    let parmaString = '';
    if (talentCubeCode && gradeId) {
      parmaString = `TalentCubeCode=${talentCubeCode}&GradeId=${gradeId}`;
    }
    else if (gradeId) {
      parmaString = `GradeId=${gradeId}`;
    }
    else {
      parmaString = `TalentCubeCode=${talentCubeCode}`;
    }
    let canUrl = `${environment.apiMainUrlNet}/master/GetRoleByTalentCube?${parmaString}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getSkillByTalentCube(talentCubeCode: number = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetSkillByTalentCube?TalentCubeCode=${talentCubeCode}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getTalentCubeBySkilla(PrimarySkillId: number = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentCubeBySkill?PrimarySkillId=${PrimarySkillId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }


  getTalentCubeBySkill(PrimarySkillId: number = null, SkillIds: string = null): Observable<any> {
    let parmaString = '';
    if (PrimarySkillId && SkillIds) {
      parmaString = `PrimarySkillId=${PrimarySkillId}&SkillIds=${SkillIds}`;
    }
    else if (PrimarySkillId) {
      parmaString = `PrimarySkillId=${PrimarySkillId}`;
    }
    else {
      parmaString = `SkillIds=${SkillIds}`;
    }
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentCubeBySkill?${parmaString}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  /**getting talent cube based on subskill ids multi */
  getTalentCubeBySubSkill(skillIdsAnd:number, skillsIDs:number, primarySkillId:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetTalentCubeBySubSkill?SkillIds2=${skillIdsAnd ? skillIdsAnd : ''}&SkillIds=${skillsIDs?skillsIDs:''}&PrimarySkillId=${primarySkillId ? primarySkillId : null}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getJDByTCAndRole(TalentCubeCode: number, TCRole: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetJDByTCAndRole?TalentCubeCode=${TalentCubeCode}&TCRole=${TCRole}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- legal entity master list
  getLegalEntityList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetLegalEntity`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- offer type master list
  getOfferTypeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetUSOfferTypeMasterList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- Department code master list
  getDepertmentCodeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetDepartmentList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- hire rehire master list
  getHireRehireList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetHireVsRehireList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- remote status master list
  getRemoteStatusList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetRemoteStatusList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get US Offer- FLSA Classification master list
  getFLSAClassificationList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetFLSAClassificationList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get contract types For US
  GetContractTypesForUS(LocationID: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetContractTypes?LocationID=${LocationID}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  //get talent cube code list For US
  getTalentCubeListUS(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetTalentCubeList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  GetVenderRefree(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetVender`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  //getTagHead Approver List For US
  getTagHeadApproverListUS(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/getTagHeadApproverList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  /**get Approver List for US */
  getApproverListUS(type: number, cid: number = null, ReqTypeId: number = null): Observable<any> {
    this.headerHttp[SkipLoader] = '';
    let url = `${environment.apiMainUrlNet}USOffer/getApproverList?type=${type}&cid=${cid}&reqType=${ReqTypeId}`;
    return this._http.get(url, { headers: this.headerHttp });

  }
  // Division=${divisionID}&EmpId=${empId}
  GetUSHRList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/USOffer/GetUSHRList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  getTalentTCAdditionalSkillByThId(thid: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Interview/GetTalentTCAdditionalSkillByThId?thid=${thid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**talent tech 1 assesment 
   * GetTech1InterviewByMaster
   */
  GetTech1InterviewByMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetTech1InterviewByMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**Get Online Assesment AgencyMaster */

  GetOnlineAssesmentAgencyMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetOnlineAssesmentAgencyMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get coder byte assessments */
  getCoderByteAssessments(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Common/getCoderByteAssessmentList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**GetReasonForNotOptOnlineExternalAssessment */

  GetReasonForNotOptOnlineExternalAssessment(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetReasonForNotOptOnlineExternalAssessment?id=${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  /**getCoderByteDetails */
  getCoderByteDetails(id: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getCoderByteDetails?id=${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  GetCompRangeBucketMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetCompRangeBucketMaster`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
  /**get Resign ReplamentEmp */
  getResignReplamentEmp(type:number = 0): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getEmpListForReplacement?ReplacementType=${type}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get Employee Allotment Details */
  getEmployeeAllotmentDetails(THID: number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Offer/getEmployeeAllotmentDetails?thid=${THID}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  
   /**get Billing type list */
   getBillingTypeList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetBillingTypeList`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get reason to reopen thid */
  GetTalentReopenningRemarksList(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/GetTalentReopenningRemarks`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**get dp approvers list */
  getDPApproverList(body:any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Master/getTalentDPApproverList?thid=${body?.thid ? body?.thid : ''}&reqType=${body?.reqType ? body?.reqType : ''}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**getting contract of the partner */
  getAllContractbyPartner(param: string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Partner/getAllContractbyPartner?${param}`;
    return this._http.get<any>(canUrl, this.httpOption)
  }

  getRatingLevelMaster(locId: number = null): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetRatingLevelMaster`;
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     }
     return this._http.get<any>(canUrl, httpOptions)
   }

   getSkillProficiencyLevelMaster(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/GetSkillProficiencyLevelMaster`;
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     }
     return this._http.get<any>(canUrl, httpOptions)
   }

   /**
 * Fetches the AI Resume Rating based 
 * ***/
   getAIResumeRatingByCid(param:string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/interview/GetAIResumeRatingByCid?${param}`;
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     }
     return this._http.get<any>(canUrl, httpOptions)
   }

   getPracticeByPrimarySkill(PrimarySkill: number = null): Observable<any> {
    let parmaString = '';
    parmaString = `PrimarySkill=${PrimarySkill}`;
    let canUrl = `${environment.apiMainUrlNet}/master/GetPracticeByPrimarySkill?${parmaString}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  
   /**get Emp */
  getEmpListForRoation(type:number = 0): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Talent/getEmpListForRoation?ReplacementType=${type}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }

  /**
 * get variable pay list
 */
  getCompensationVariableByGrade(grade: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Offer/GetCompensationVariableByGrade?gradeId=${grade}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this._http.get(url, { headers: headers });

  }
   

}