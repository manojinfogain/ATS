import { Injectable } from '@angular/core';
import { GetSetStorageService } from './get-set-storage.service';
import { NotificationService } from './notification.service';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationCommonService {

  constructor(
    private _storage: GetSetStorageService,
    private _NotificationApiserve:NotificationService,
    private _share: ShareService
  ) { }

  /**** get User Info */
  getNotificationCount() {
    const token = this._storage.getToken();
    if (token) {
      let user = this._storage.getSetUserData();
      if(user.RoleId == 5 ||
        user.RoleId == 2 ||
        user.RoleId == 6 ||
        user?.otherRoles?.IsInterviewer === 'Y'){
          this._NotificationApiserve.getNotificationCount().subscribe(
            res=>{
              let count = res['data'][0];
              this._share.notificationCount.next(count);

            }
          )

      }
     

    }
  }
}
