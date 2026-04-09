
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { SERVICE_CONST } from 'projects/ats-global-system/src/app/core/constant/service.const';
import { environment } from 'projects/ats-global-system/src/environments/environment'
import { GetSetStorageService } from './get-set-storage.service';
import { GlobalCommonMethodService } from '../common/global-common-method.service';
@Injectable({
  providedIn: 'root'
})
export class InterviewStatusService {
  serviceConst = SERVICE_CONST;
  serviceUrl = this.serviceConst.mainUrl;

  constructor(private _httpclient: HttpClient, private _storage: GetSetStorageService,
    private _globalCommonMethod: GlobalCommonMethodService) { }

  viewCandidateList(data, paging): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/getCandidateDetailByTHID?thid=${data}&EmpId=${getTokenEmp}&${paging}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  //
  viewCandidateListById(thId, paging): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/getCandidateListByID?${thId ? 'thid=' + thId + '&' : ''}EmpId=${getTokenEmp}&${paging}&hiringLocationId=${this._globalCommonMethod.getSetLocation().locId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /**view candidate list */
  viewCandidateListByIdNew(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    data['EmpId'] = this._storage.getUserEmpId();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(`${environment.apiMainUrlNet}Interview/getCandidateListByID`, data, httpOptions);
  }

  getAllCandidateProfileListEdit(thId, paging): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/getAllCandidateProfileList?${thId ? 'thid=' + thId + '&' : ''}EmpId=${getTokenEmp}&${paging}&hiringLocationId=${this._globalCommonMethod.getSetLocation().locId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }


  // getCandidateListByIDReport(thId, paging): Observable<any> {
  //   const getTokenEmp = this._storage.getUserEmpId();
  //   let url: string = `${environment.apiMainUrlNet}Interview/getCandidateListByIDReport?${thId ? 'thid=' + thId + '&' : ''}EmpId=${getTokenEmp}&${paging}&hiringLocationId=${this._globalCommonMethod.getSetLocation().locId}`;
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }
  //   return this._httpclient.get<any>(url, httpOptions);
  // }

  getCandidateListByIDReport(data: any): Observable<any> {
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    data['EmpId'] = this._storage.getUserEmpId();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(`${environment.apiMainUrlNet}Interview/getCandidateListByIDReport`, data, httpOptions);
  }

  transferCandidateList(thId, paging): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/getAllCandidateTransferListByID?${thId ? 'thid=' + thId + '&' : ''}EmpId=${getTokenEmp}&${paging}&hiringLocationId=${this._globalCommonMethod.getSetLocation().locId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }
  //new api method
  transferCandidateListNew(data: any): Observable<any> {
    // data.append('hiringLocationId', this._globalCommonMethod.getSetLocation().locId);
    // data.append('EmpId', this._storage.getUserEmpId());
    data['hiringLocationId'] = this._globalCommonMethod.getSetLocation().locId;
    data['EmpId'] = this._storage.getUserEmpId();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(`${environment.apiMainUrlNet}Interview/getAllCandidateTransferListByID`, data, httpOptions);
  }

  /**
   * transfer record to othet talent id
   * @param formData 
   * @returns 
   */
  updateTalentId(formData): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let resUrl = this.serviceUrl + 'infoconnect/employee/transferCandidate/' + formData.cid;
    let myDate = new Date();
    let currentDate = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + ('0' + (myDate.getMinutes())).slice(-2) + ':' + myDate.getSeconds();

    let formDataBody = new FormData();
    formDataBody.append('talent_id', formData.talendIdControl);
    formDataBody.append('remarks', formData.remarksTransfer);
    formDataBody.append('modified_on', currentDate);
    formDataBody.append('modifiedBy', getTokenEmp);
    return this._httpclient.post<any>(resUrl, formDataBody)
  }
  /**
   * feeback submission/next round schedule
   * @param formData 
   * @returns 
   */
  feedbackSubmission(formData): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/InterviewFeedback`;
    return this._httpclient.post<any>(url, formData)
  }

  /**send assesment to candidate while tech interview */
  ScheduleCoderByteInterviewByPanel(formData): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/ScheduleCoderByteInterviewByPanel`;
    return this._httpclient.post<any>(url, formData)
  }

  /**
   * get Round details
   * @param cid 
   * @returns 
   */

  getCandidateDetails(cid): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/getCurrentRoundDetailsByCid?cid=${cid}&EmpId=${getTokenEmp}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    }
    return this._httpclient.get<any>(url, httpOptions);

  }

  /**
   * 
   * @param cid 
   * @returns 
   */

  GetRoundByCid(cid): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetRoundByCid?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    }
    return this._httpclient.get<any>(url, httpOptions);

  }


  getAllUpcomingInterview(paging: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/getAllUpcomingInterview?${paging}&hiringLocationId=${this._globalCommonMethod.getSetLocation().locId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /**
   * check int
   * @param cid 
   * @returns 
   */
  checkInterviewStatus(cid: number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/CheckInterviewStatus?cid=${cid}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  reSendInviteCal(cid:number,type:string): Observable<any> {
    const getTokenEmp = this._storage.getUserEmpId();
    let url: string = `${environment.apiMainUrlNet}Interview/ResendInvite?cid=${cid}&EmpId=${getTokenEmp}&type=${type}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, httpOptions);
  }


  getJDQuestionsByThId(thid:number,round:number): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Common/getJDQuestionsByThId?thid=${thid}&roundNumber=${round}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.get<any>(url, httpOptions);
  }

  /**
   * Get panel dashboard data - interviews assigned to panel member
   * @param empId - Panel member employee ID
   */
  getPanelDashboardData(filters: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetInterviewCounts`;
    
    // Normalize filter property names to match API specification
    const body: any = {
      selectedPanel: filters.selectedPanel || '',
      search: filters.search || '',
      intStatus: filters.IntStatus || '',
      accountIDs: filters.AccountIDs || '',
      intType: filters.IntType || '',
      startDate: filters.StartDate || '',
      endDate: filters.EndDate || ''
    };
    
    // Remove empty properties
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === null || body[key] === undefined) {
        delete body[key];
      }
    });
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._httpclient.post<any>(url, body, httpOptions);
  }

  /**
   * Get interview list roundwise for panel dashboard
   * @param filterData - Filter object with page, pageSize, search, status, round
   */
  getInterviewListRoundwise(filterData: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetInterviewListRoundwise`;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    return this._httpclient.post<any>(url, filterData, httpOptions);
  }


   GetPanelMembersByInterviewDetails(): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/GetPanelMembersByInterviewDetails`;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    return this._httpclient.get<any>(url, httpOptions);
  }
}
