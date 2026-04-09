import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import * as moment from 'moment';
import 'moment-timezone';
@Component({
  selector: 'app-view-calender-history',
  templateUrl: './view-calender-history.component.html',
  styleUrls: ['./view-calender-history.component.scss']
})
export class ViewCalenderHistoryComponent implements OnInit {
  public dateControl: UntypedFormControl = new UntypedFormControl();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewCalenderHistoryComponent>,
    private _intCommon: InterviewCommonService
  ) { }
  public calenderList: any = [];
  public selectedDate: any;
  ngOnInit(): void {
    if (this.data) {
     // this.selectedDate = new Date(this.data?.fromDate);
      this.dateControl.patchValue(this.selectedDate);
      this.getCalenderView(this.data?.fromDate, this.data?.toDate, this.data?.empInfo);

    }

  }

  public calenderListInt: any = []
  getCalenderView(fromDate: string, toDate: string, empList: any) {
    let emailIds: any = [];
    if (empList.length !== 0) {
      for (let i = 0; i < empList.length; i++) {
        emailIds.push(empList[i].empMailId);
      }
    }

    this.selectedDate = fromDate+ "T01:00:00";
    let body = {
      "schedules": emailIds,
      "startTime": {
        "dateTime": fromDate+ "T01:00:00",
        "timeZone": moment.tz.guess()
      },
      "endTime": {
        "dateTime": fromDate+"T23:59:00",
        "timeZone": moment.tz.guess()
      },
      "availabilityViewInterval": 60
    }

    let v = moment.tz.guess();
    const currentUtcOffset = moment().utcOffset()
    let ff = moment(new Date).utc().toISOString()
    var timedifference = new Date().getTimezoneOffset();
    let n = GlobalMethod.getOffset();
    let g= moment.tz("Asia/Kolkata").utcOffset();
    

    this._intCommon.getUserCalenderSchFree(body).subscribe(
      res => {
        this.calenderList = res['value'];
        this.calenderListInt = res['value']
      }
    )
  }

  getEmpIdAndName(email: string) {
    let empDt = this.data?.empInfo.filter(v => v.empMailId == email);
    return empDt[0];
  }
  /***
   * change date
   */
  changeDate(type: string, event: any) {
    let date = new Date(event.value);
     this.selectedDate = date;
    // let dateAfter = new Date()
    // dateAfter.setDate(new Date(date).getDate() + 1);
    this.getCalenderView(GlobalMethod.formatDate(date), GlobalMethod.formatDate(date), this.data?.empInfo);
   // this.getCalenderView(GlobalMethod.formatDate(date), GlobalMethod.formatDate(dateAfter), this.data?.empInfo);
  }
  /***
 * close
 */
  onNoClick() {
    this.dialogRef.close(true);
  }

}
