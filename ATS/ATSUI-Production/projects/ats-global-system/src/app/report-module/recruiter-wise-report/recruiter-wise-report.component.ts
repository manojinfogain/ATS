import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { IdataModal, IpanelDetailsReq, IpanelReportList } from 'projects/ats-global-system/src/app/core/models/panel-report-model';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { PanelWiseReportDetailsComponent } from '../panel-wise-report/modals/panel-wise-report-details/panel-wise-report-details.component';
import { ReportService } from '../report.service';
import { RecruiterWiseReportDetailsComponent } from './modal/recruiter-wise-report-details/recruiter-wise-report-details.component';
import { saveAs } from "file-saver";
@Component({
  selector: 'app-recruiter-wise-report',
  templateUrl: './recruiter-wise-report.component.html',
  styleUrls: ['./recruiter-wise-report.component.scss']
})
export class RecruiterWiseReportComponent implements OnInit {
  displayedColumns = ['SNum', 'recEmpId', 'recName', 'recLocation', 'intLenTaken', 'talentIdAssign', 'THIDAssignedBefore30daysCount', 'candAddAgainstTalent', 'sechInterviewCount', 'reschInterviewCount', 'canceldInterview', 'screeningRoundFeedBack', 'hrFinalRoundFeedback', 'screenRejctCountSkil', 'screenRejctCountReferal', 'profAddCountNaukri', 'profAddCountLinkedin', 'profAddCountSocialMedia'];
  public userData: any = {};
  public searchInput: string = '';
  public sortParam: string = '';
  public paginationData: any;
  public RecruiterList: any = [];
  public jumpFirstPage: boolean = false;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public maxDate: any = new Date();
  public todayDate: any = new Date();
  constructor(
    private _storage: GetSetStorageService,
    private _fb: UntypedFormBuilder,
    private _reportServe: ReportService,
    public dialog: MatDialog,
    private http: HttpClient,
    private _share: ShareService
  ) {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    this.maxDate = new Date(year + 1, month, day);
  }

  ngOnInit() {
    /**remove transfer option */
    this.userData = this._storage.getSetUserData();
    this.getPanelReport(`startdate=${this.getPastdate()}`);
    this.filterFormInit();
    const yearsArray = GlobalMethod.generateYearsListBetween(2007, 2014);
    this.selectedDate['startDate'] = new Date(this.getPastdate());

  }

  /***
   * get PAst Date
   */
  getPastdate() {
    let currentDate = new Date();
    // let pastDate = new Date(currentDate);
    /**
     * 8 days before
     */
    // pastDate.setDate(pastDate.getDate() - 7);
    let firstDayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let dateParse = GlobalMethod.formatDate(firstDayMonth);
    return dateParse;
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
    this.sortParam = '';
  }
  /**
* get filter value
* @param data
*/
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    if(data){
      this.sortParam = data;
    }
    else{
      this.sortParam =`startdate=${this.getPastdate()}`
    }
    
    this.getPanelReport(this.sortParam);
  }

  /**date  */
  public selectedDate: any = {};
  getDateRange(data: any) {
    if (data.startDate || data.endDate) {
      this.selectedDate['startDate'] = data.startDate ? data.startDate : new Date(this.getPastdate());
      this.selectedDate['endDate'] = data.endDate;
    }
    else {
      this.selectedDate['startDate'] = new Date(this.getPastdate());
      this.selectedDate['endDate'] = null;
    }
  }

  /***
* filter form Init here
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }]
    })
  }


  /* getting panel wise data */
  getPanelReport(sortParam: any) {
    let queryString = `${sortParam ? sortParam : ''}`;
    this.sortParam = queryString;
    this._reportServe.getRecWiseReport(queryString).subscribe(
      res => {
        this.RecruiterList = res['data'];
      }
    )
  }

  /***
 * search
 */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
  }

  /**
   *  
   */
  openDetailsPanelWise(data: any, flag: string, status: number, profileId: number, title: string): void {
    data['startDate'] = GlobalMethod.formatDate(this.selectedDate['startDate'])
    data['endDate'] = this.selectedDate['endDate'] ? GlobalMethod.formatDate(this.selectedDate['endDate']) : '';
    data['flag'] = flag;
    data['statusNum'] = status;
    data['profileIds'] = profileId;
    data['title'] = title

    const dialogRef = this.dialog.open(RecruiterWiseReportDetailsComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'panel-report-popup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  /***
* download report excel api
*/
  downloadReportAsExel() {
    this.http.post(`${environment.apiMainUrlNet}Interview/ExportToExcelRecruiterWiseReport?search=${this.searchInput}&${this.sortParam}`, null, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Tag_Team_Report.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

}
