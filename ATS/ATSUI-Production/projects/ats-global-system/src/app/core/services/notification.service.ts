import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpMethodsService } from './http-methods.service';
import { GetSetStorageService } from './get-set-storage.service';
import { INotificationListParam } from '../models/notification-model';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
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

 
  /***
   * get Notification Count
   */
  getNotificationCount(type:string = null):Observable<any>{
    const url = `${environment.apiMainUrlNet}/Common/getUnreadNotificationCount${type?'?type='+type:''}`;
      return this._http.get<any>(url, { headers: this.headerHttp })
  }

  /***
   * get Notification Count
   */
   getNotificationList(data:INotificationListParam):Observable<any>{
    const url = `${environment.apiMainUrlNet}/Common/getAllNotificationList?page=${data.page}&pageSize=${data.pageSize}${data?.type?'&type='+data?.type:''}`;
      return this._http.get<any>(url, { headers: this.headerHttp })
  }

   /***
   * get Notification Count
   */
    readNotificstion(id:number):Observable<any>{
      const url = `${environment.apiMainUrlNet}/Common/readNotification?id=${id}`;
        return this._http.post<any>(url,null, { headers: this.headerHttp })
    }

     /***
   * read Notification 
   */
      readAllNotificstion():Observable<any>{
        const url = `${environment.apiMainUrlNet}/Common/readAllNotification`;
          return this._http.post<any>(url,null, { headers: this.headerHttp })
      }
}