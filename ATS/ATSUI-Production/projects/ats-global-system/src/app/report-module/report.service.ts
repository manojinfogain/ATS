import { Injectable } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IpanelDetailsReq } from '../core/models/panel-report-model';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private _http: HttpClient) { }

  //get panel wise
  getPanelWiseReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Interview/GetPanelWiseReport`, data, httpOptions);
  }

  //get panel wise new
  getPanelWiseReportNew(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Report/GetPanelWiseReportNew`, data, httpOptions);
  }

  //get panel wise details
  getPanelWiseReportDetails(data: IpanelDetailsReq): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Interview/GetReportDetailByPanel`, data, httpOptions);
  }

  //get recruiter wise
  getRecWiseReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Interview/GetRecruiterWiseReport?${data}`, httpOptions);
  }

  //get recruiter wise details
  getRecWiseReportDetails(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get(`${environment.apiMainUrlNet}Interview/GetReportDetailsByRecruiterId?${data}`, httpOptions);
  }

  //get delivery wise report
  getDeliveryWiseReport(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}dashboard/getDeliveryWiseReport`, httpOptions);
  }

  //employee referred
  getEmployeReferalReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetReferralCandidateReport?${data}`, httpOptions);
  }

  //open position
  getOpenPositionReport(data: any, url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${url}`, data, httpOptions);
  }

  //get open position details    
  getOpenPositionReportDetails(data: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get(`${environment.apiMainUrlNet}Report/GetOpenPositionCandidateDetails?` + data, httpOptions);
  }

  //recruiter productivity report
  RecruiterProductivityReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetRecruiterProductivityReport?${data}`, httpOptions);
  }

  //Week Wise recruiter productivity report
  GetWeekWiseRecruiterProductivityReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetWeekWiseRecruiterProductivityReport?${data}`, httpOptions);
  }

  //salary deviation report
  // getSalaryDeviationReport(data: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }
  //   return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetSalaryDeviationReport?${data}`, httpOptions);
  // }

  getSalaryDeviationReport(data: any, apiUrl: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${apiUrl}`, data, httpOptions);
  }
  CandidateUSSalaryDeviationReport(data: any, apiUrl: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${apiUrl}`, data, httpOptions);
  }

  //get candidate offer
  // getCandidateOfferReport(data: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }
  //   return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetCandidateOfferReport?${data}`, httpOptions);
  // }

  getCandidateOfferReport(data: any, url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${url}`, data, httpOptions);
  }

  // get hiring tracking data
  getHiringDetailsReport(data: any, url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${url}`, data, httpOptions);
  }

  //
  GetCandidateAddresConfirmationStatus(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Offer/GetCandidateAddresConfirmationStatus?${data}`, httpOptions);
  }

  //GetInterview ProcesssReport details
  GetInterviewProcesss(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetInterviewProcesssReport`, data, httpOptions);
  }

  //GetInterview Processs Report details by cid
  GetInterviewProcesssReportDetailsByCid(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetInterviewProcessReportDetailsByCid?${'cid=' + data}`, httpOptions);
  }


  // export excel for interview process report 
  downloadInterviewProcesssReport(thId, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Report/ExportToExcelInterviewProcesssReport?${data}&thid=${thId}`, httpOptions);
  }

  //GetEmployee Referral Report details
  getEmployeeReferralReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetReferralReport`, data, httpOptions);
  }

  // export excel for Employee Referral report 
  downloadEployeeReferralReport(thId, data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.get<any>(`${environment.apiMainUrlNet}Report/ExportToExcelReferralReport?${data}&thid=${thId}`, httpOptions);
  }

  //Get candidates onboarding Report 
  getOnboardReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetOnboardReport`, data, httpOptions);
  }
  // get candidate wise report renu data
  GetCandidateWiseReport(data: any, url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}${url}`, data, httpOptions);
  }
  //get ijp report
  // GetIJPTalentReport11(data: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json'
  //     })
  //   }
  //   return this._http.get<any>(`${environment.apiMainUrlNet}Report/GetIJPTalentReport?${data}`, httpOptions);
  // }
  GetIJPTalentReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetIJPTalentReport`, data, httpOptions);
  }
  /** Get count of total ijp application*/
  GetTotalIjpApplictionCount(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let canUrl = `${environment.apiMainUrlNet}/Talent/GetIJPCounts`;
    return this._http.get<any>(canUrl, httpOptions)
  }

   //GetInterview ProcesssReport details
   CandidateInterviewToOnboardingVideoCompReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/CandidateInterviewToOnboardingVideoCompReport`, data, httpOptions);
  }

  GetTalentPolandLocationReport(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post<any>(`${environment.apiMainUrlNet}Report/GetTalentPolandLocationReport`, data, httpOptions);
  }
  
}


