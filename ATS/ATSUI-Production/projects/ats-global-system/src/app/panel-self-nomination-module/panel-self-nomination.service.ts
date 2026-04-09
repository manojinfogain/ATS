import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalCommonMethodService } from '../core/common/global-common-method.service';

@Injectable({
  providedIn: 'root'
})
export class PanelSelfNominationService {

  constructor(private _http: HttpClient,private _globalCommonMethod:GlobalCommonMethodService) { }
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

/**
 * add update PAnel Details
 * @param body 
 * @returns 
 */
  addUpdatePanelDetails(body:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}NominationPanel/addUpdatePanelDetails`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

  changePanelStatus(body:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}NominationPanel/ChangePanelStatus`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

   /**Panel List */
   getPanelList(data: any): Observable<any> {
    data['LocationId'] = this._globalCommonMethod.getSetLocation().locId;
    return this._http.post<any>(`${environment.apiMainUrlNet}NominationPanel/getPanelList`, data, this.httpOptions);
  }

  /**
 * job posting
 * @param body 
 * @returns 
 */
  jobPosting(body:any): Observable<any> {
    let url: string = `${environment.apiMainUrlNet}NominationPanel/postJob`;
    return this._http.post<any>(url, body, this.httpOptions);
  }

   /**getPublishJobStatus */
   getPublishJobStatus(thid: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/getPublishJobStatus?thid=${thid}`,this.httpOptions);
  }

  
   /**Panel List */
   getPublishedJobList(data: any): Observable<any> {
    data['LocationId'] = this._globalCommonMethod.getSetLocation().locId;
    return this._http.post<any>(`${environment.apiMainUrlNet}NominationPanel/getPublishedJobList`, data, this.httpOptions);
  }

    /**
 * job posting
 * @param body 
 * @returns 
 */
    addPanelJobSlotTime(body:any): Observable<any> {
      let url: string = `${environment.apiMainUrlNet}NominationPanel/AddPanelJobSlotTime`;
      return this._http.post<any>(url, body, this.httpOptions);
    }

    /**slt bypanel */
    getPanelSlotDetails(PanelEmpId: string,thid:string,date:string,page:number=1,pageSize:number=5000): Observable<any> {
      let params = `PanelEmpId=${PanelEmpId}&thid=${thid}&date=${date}&Page=${page}&Pagesize=${pageSize}`;
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/getPanelSlotDetails?${params}`,this.httpOptions);
  }

   /**emp List */
   getEmpListForPanelAddition(data: any): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/GetEmpListForPanelAddition?page=${data?.page}&pageSize=${data?.pageSize}${data?.search?'&search'+data?.search:''}`,this.httpOptions);
  }
  /**emp List */
  getEmpDetails(empId: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/GetEmpDetails?empId=${empId}`,this.httpOptions);
  }

  getPanelSlotsCountByTHID(thid: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/getPanelSlotsCountByTHID?thid=${thid}`,this.httpOptions);
  }


   /**Panel List */
   getPanelSlotsByTHID(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiMainUrlNet}NominationPanel/getPanelSlotsByTHID`, data, this.httpOptions);
  }

    /**getPublishJobStatus */
    deleteSlot(id: number): Observable<any> {
      return this._http.delete<any>(`${environment.apiMainUrlNet}NominationPanel/DeletePanelSlot?SlotId=${id}`,this.httpOptions);
    }

      /** Panel List by thid*/
     getPanelListBySlotThid(thid: string): Observable<any> {
    return this._http.get<any>(`${environment.apiMainUrlNet}NominationPanel/GetPanelListBySlotThid?thid=${thid}`, this.httpOptions);
  }


}
