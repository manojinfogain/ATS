import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { HttpMethodsService } from './http-methods.service';
import { SkipLoader } from 'projects/ats-global-system-external/src/app/core/interceptors/loader-interceptor';
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

  getApproverList(empId: number, type: number, divisionID:number): Observable<any> {
    this.headerHttp[SkipLoader] = '';
    let url = `${environment.apiMainUrlNet}master/getApproverList?Division=${divisionID}&EmpId=${empId}&type=${type}`;
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

  getCityList(contryId:number = null,stateId:number = null): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}master/getCityList?EmpId=${getTokenEmp}&${contryId?`CountryId=${contryId}`:''}${stateId?`StateId=${stateId}`:''}`;
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
   getGradeBandList(id:number): Observable<any> {
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
    getJobFamilyList(divID?:number): Observable<any> {
      let canUrl = `${environment.apiMainUrlNet}/master/GetJobFamilyList${divID ? '?division='+divID : ''}`;
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
    return this._http.post<any>(canUrl,null,httpOptions)
  }

  getTagHeadApproverList(divisionID?:number): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getTagHeadApproverList${divisionID ? '?Division='+divisionID : ''}`;
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

  getFullfillmentDelayReason(): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getFullfillmentDelayReason`;
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
    return this._http.get<any>(url,httpOptions);
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

  /**get screen reject reason */
  getScreenRejectReasonList(data:any): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/master/getScreenRejectReason?id=${data.id ? data.id:''}`;
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
   getCandidateListByTalentId(thid:string): Observable<any> {
    let canUrl = `${environment.apiMainUrlNet}/Offer/GetCandidateListByTalentId?thid=${thid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(canUrl, httpOptions)
  }
}