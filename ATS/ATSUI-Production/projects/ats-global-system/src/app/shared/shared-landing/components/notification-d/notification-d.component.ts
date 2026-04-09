import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationCommonService } from 'projects/ats-global-system/src/app/core/services/notification-common.service';
import { NotificationService } from 'projects/ats-global-system/src/app/core/services/notification.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-notification-d',
  templateUrl: './notification-d.component.html',
  styleUrls: ['./notification-d.component.scss']
})
export class NotificationDComponent implements OnInit,OnDestroy {
  @Input() public allNotificationCount:number = 0;
  public notificationCountSubs: Subscription;
  public selectedTabIndex : number = 0;
  constructor(
    private _share: ShareService,
    private _NotificationCommonServe:NotificationCommonService,
    private _NotificationApiserve: NotificationService
  ) { }

  ngOnInit(): void {
     /***
     * Notification
     */
      this.updateNotification();

  }

  /** tab switch */
  onTabChanged(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
  }

   /***
   * update Notification
   */
    updateNotification(){
      this.notificationCountSubs = this._share.notificationCount.subscribe(
        get=>{
          if(get){
            this.allNotificationCount = get;
          }
        }
      )
    }

    RefreshCount(event:any){
     // this.updateNotification();
      this._NotificationCommonServe.getNotificationCount();

    }

    marlAllAsRead(){
      this._NotificationApiserve.readAllNotificstion().subscribe(
        res => {
          this._NotificationCommonServe.getNotificationCount();
          this.selectedTabIndex = 0;
          if(this.selectedTabIndex == 1 || this.selectedTabIndex == 2){
            this.selectedTabIndex =0;
          }
          else{
            this.selectedTabIndex =1;
          }
        }
      )
    }

    

    ngOnDestroy(): void {
      if(this.notificationCountSubs){
        this.notificationCountSubs.unsubscribe();
      }
    }

}





 