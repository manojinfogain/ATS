import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { INotificationListParam } from 'projects/ats-global-system/src/app/core/models/notification-model';
import { NotificationService } from 'projects/ats-global-system/src/app/core/services/notification.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { InterviewFeedbackStatusComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/interview-feedback-status/interview-feedback-status.component';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, AfterViewInit {
  @Input() public type: string = "";
  @Output() public RefreshCount = new EventEmitter<any>();
  @Input() public realodList: string = "";
  public userData: any = {};
  constructor(
    private _share: ShareService,
    private _NotificationApiserve: NotificationService,
    private _interviewStatus: InterviewStatusService,
    private _storage: GetSetStorageService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadNotification();
  }

  ngAfterViewInit(): void {
    this.userData = this._storage.getSetUserData();
  }

  /***
     * load Notification
     */
  public notificationList: any = [];
  public IsNoRecord: boolean = false;
  loadNotification() {
    let body: INotificationListParam = {
      page: 1,
      pageSize: 100
    };
    if (this.type) {
      body['type'] = this.type;
    }
    this._NotificationApiserve.getNotificationList(body).subscribe(
      res => {
        this.notificationList = res['data'];
        if (res['data'].length === 0) {
          this.IsNoRecord = true;
        }
      }
    )

  }
  /**
   * read Notification
   * @param data 
   */

  readNotificstion(data: any, i: number): void {
    if (data?.IsRead === 'N') {
      this._NotificationApiserve.readNotificstion(data?.id).subscribe(
        res => {
          this.notificationList[i].IsRead = 'Y';
          this.RefreshCount.emit(true);
        }
      )
    }
    if ((data?.interviewStatusId == 1 || data?.interviewStatusId == 3) && data?.interviewerEmpId == this.userData?.EmpNewId) {
      this.feedbackAndListOpenMethod(data);
    }

  }

  /**
   * auto open feedback form check
   */
  feedbackAndListOpenMethod(element: any) {
    if (element?.cid) {
      this._interviewStatus.checkInterviewStatus(element?.cid).subscribe(
        res => {
          let data = res['data'][0];
          if ((data?.statusId == 1 || data?.statusId == 3) && data?.interviewerEmpId == this.userData?.EmpNewId) {
            this.modalforFeedbackAndSchedule(element);
          }
        }
      )

    }
  }


  /**
   * Modal For interview feedback
   * @param data 
   */
  modalforFeedbackAndSchedule(data: any) {
    const dialogRef = this.dialog.open(InterviewFeedbackStatusComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadNotification();
      }
    });
  }

}
