import { Injectable } from '@angular/core';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InrerviewsService {

  constructor(private _http: HttpClient) { }

  reschedulingInterview(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Interview/updateInterview`, data, httpOptions);
  }

  updateCandidateRecord(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this._http.post(`${environment.apiMainUrlNet}Interview/updateCandidateDetailsByCid`, data);
  }

  bulkSchedule(data: any): Observable<any> {
    return this._http.post(`${environment.apiMainUrlNet}Interview/ScheduleBulkInterviews`, data);
  }


  /***
* transfer talent id
*/
  shifttoTalentId(data): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/transferCandidateByTalentId`;
    return this._http.post<any>(url, data);
  }

  /***
* UpdatePrimaryInterviewer
*/
  UpdatePrimaryInterviewer(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/UpdatePrimaryInterviewer?RoundID=${data.RoundID}&InterviewerID=${data.InterviewerID}`;
    return this._http.get<any>(url, data);
  }


    /***
* transfer talent id
*///Interview/CandidateTransferRequest?cid=1&toThId=1'
requestTransferCandidate(data: any): Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Interview/CandidateTransferRequest`;
  return this._http.post<any>(url, data);
}

/**requestTransferCandidate */
// requestTransferCandidate(data): Observable<any> {
//   let url: string = `${environment.apiMainUrlNet}Interview/CandidateTransferRequest`;
//   return this._http.post<any>(url, data);
// }


UnattendedCandidateTransferRequest(data: any): Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Interview/UnattendedCandidateTransferRequest?id=${data.id}&toThId=${data.toThId}&remarks=${data.remarks}&IsFromNaukriAPI=${data?.IsFromNaukriAPI}`;
  return this._http.post<any>(url,null);
}

UnattendedProfileTransfer(data: any): Observable<any> {
  let url: string = `${environment.apiMainUrlNet}Interview/UnattendedProfileTransfer?id=${data.id}&toThId=${data.telentId}&remarks=${data.remarksTransfer}&IsFromNaukriAPI=${data?.IsFromNaukriAPI}`;
  return this._http.post<any>(url,null);
}


  /***
* approve transfered candidate
*/
  //i/Interview/UpdateCandidateTransferDetails?cid=1&transferStatus=R'

  approveTransferedCandidate(cid: number, transferStatus: string, remark: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/UpdateCandidateTransferDetails?cid=${cid}&transferStatus=${transferStatus}&remark=${remark}`;
    return this._http.post<any>(url, httpOptions);
  }


  ApproveUnAttendentTransferProfile(id: number, transferStatus: string, remark: string, IsFromNaukriAPI:string='N'): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/ApproveUnAttendentTransferProfile?id=${id}&transferStatus=${transferStatus}&remark=${remark}&IsFromNaukriAPI=${IsFromNaukriAPI}`;
    return this._http.post<any>(url, httpOptions);
  }

  addProfilePicture(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/AddProfilePicture`;
    return this._http.post<any>(url,data);
  }

  addCandVideo(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/uploadDocVid`;
    return this._http.post<any>(url,data);
  }

  uplaodVideoToSharePointInt(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/uplaodVideoToSharePointInt`;
    return this._http.post<any>(url,data);
  }
  uplaodVideoToSharePointIntf(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/uplaodVideoToSharePointIntF`;
    return this._http.post<any>(url,data);
  }

  getVideoComparisonInfoByRoundId(cid: number, roundId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/GetVideoComparisonInfoByRoundId?cid=${cid}&roundId=${roundId}`;
    return this._http.get<any>(url, httpOptions);
  }
  /**save detailed intervieew feedback - quesionnaire */
  submitIntervFeedbackQuesionnaire(data: any = {}): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/SaveTechnicalQuestionnnaires`;
    return this._http.post<any>(url, data);
  }
  /** get detailed intervieew feedback - quesionnaire */
  getFeedbackQuesionnaire(cid: number, roundId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/GetTechnicalQuestionnnaire?cid=${cid}&roundId=${roundId}`;
    return this._http.get<any>(url, httpOptions);
  }

    /**save detailed intervieew feedback - quesionnaire */
    addUpdateQuestionList(data: any = {}): Observable<any> {
      let url: string = `${environment.apiMainUrlNet}Interview/AddUpdateQuestionList`;
      return this._http.post<any>(url, data);
    }

     /** get GetTehRoundCountByCid */
     getTehRoundCountByCid(cid: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/GetTehRoundCountByCid?cid=${cid}`;
    return this._http.get<any>(url, httpOptions);
  }
  uplaodTranscriptToSharePointIntf(data: any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}Interview/uplaodTranscriptToSharePointIntF`;
    return this._http.post<any>(url,data);
  }
  /***
   * update candidate source dobs
   */
    updateCandidateSourceDob(data:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let url: string = `${environment.apiMainUrlNet}Interview/updateCandidateSourceDob`;
    return this._http.post<any>(url, data, httpOptions);
  }


}

