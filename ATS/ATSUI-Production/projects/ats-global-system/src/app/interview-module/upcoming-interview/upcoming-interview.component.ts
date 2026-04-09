import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { saveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { JobDescriptionComponent } from './modals/job-description/job-description.component';
import * as moment from 'moment';
import 'moment-timezone';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-upcoming-interview',
  templateUrl: './upcoming-interview.component.html',
  styleUrls: ['./upcoming-interview.component.scss']
})
export class UpcomingInterviewComponent implements OnInit {
  public userData: any = {};
  public searchInput: string;
  public paginationData: any;
  public candidateList: any = [];
  private refreshSubscription: Subscription;
  constructor(
    private _interviewStatus: InterviewStatusService,
    private http: HttpClient,
    private _share: ShareService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {

    this.getCandidateListByTalentId(1, 10000, '');
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.getCandidateListByTalentId(1, 10000, '');
      }
    )
    let v = moment.tz.guess();
    const currentUtcOffset = moment().utcOffset()
    let ff = moment(new Date).utc().toISOString()

    let vv = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    var timedifference = new Date().getTimezoneOffset();
    let n = GlobalMethod.timeIntoUTC(new Date('2022-06-20 00:06:47.447'));
    var date1 = new Date(1655665512000);
    let dateTime1 = moment(date1).format('dddd MMMM D YYYY, h:mm:ss a');
    let g = moment.tz().utcOffset();
    let nb = moment.tz();
    var b = moment.tz.names();
    var abbr = moment.tz("US/Hawaii").isDST();
    let localTime1 = moment.tz('Asia/Kolkata')
    ff = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let startTimeDate = GlobalMethod.timeIntoUTC(new Date());
    var ggggg = moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss")
    var date = "2017-03-13";
    var mdf = GlobalMethod.timeIntoUTC(new Date());
    var time = "18:00";
    let oos = new Date();
    var ggggg11 = moment.utc().format()
    var timeAndDate = moment(date + ' ' + time).toString();
    let nvs = new Date('2022-06-26 01:56:39.940').toUTCString();
    const today = new Date()
    let tomorrow =  new Date()
tomorrow.setDate(today.getDate() + 1)
   let smbb = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(oos)+' '+'00:00:00')
   let tmr = GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(tomorrow)+' '+'00:00:00')
    let nbbb = GlobalMethod.convertToUTCDateTime('2022-06-29 04:20:00')



  }

  getdayName(date: string) {
    let d = new Date(date);
    let dateNum = d.getDate();
    return dateNum;
  }


  getCandidateListByTalentId(page: number, pageSize: number, search: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}`;
    this._interviewStatus.getAllUpcomingInterview(queryString).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  /**
  * view talent id details
  * @param data
  */
  viewTalentIdDetails(data) {

    const dialogRef = this.dialog.open(JobDescriptionComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true
    });
  }

  /***
   * download file
   */
  dwnloadFileSingle(data) {
    if(data.cid){
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?cid=${data.cid}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.c_resume);
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
   else{
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadResume?id=${data.id}`, { responseType: 'blob' }).subscribe(
        res => {
          saveAs(res, data.c_resume);
        },
        (error) => {
          this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }

  }


  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
