import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
@Component({
  selector: 'app-view-ijp-applicant-list',
  templateUrl: './view-ijp-applicant-list.component.html',
  styleUrls: ['./view-ijp-applicant-list.component.scss']
})
export class ViewIjpApplicantListComponent implements OnInit {
  displayedColumns = ['srNo', 'empId', 'empName',  'ijpName', 'expRange',  'deignationName',
  'accountName', 'Location',
 //  'Document'
  ];
  blob: any;
  url: any;
  public candidateList: any = [];
  public searchInput: string;
  public isloader: boolean = false;
  public resumeBaseUrl: string = COMMON_CONST.cskillBaseUrl;
  public paginationData: any;
  public pazeOption: any = [9, 25, 50, 100];
  public pazeSize: any = 9;
  public actionRightUser: boolean = false;

  public ijpApplicantList: any[];
  constructor(
    public dialogRef: MatDialogRef<ViewIjpApplicantListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService: ExcelService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
   this.GetIJPApplicantList();
  }
  /**GetIJPApplicantList ijp */
  GetIJPApplicantList() {
    this._talentServ.GetIJPApplicantList(this.data?.TH_ID).subscribe(
      res => {
        this.ijpApplicantList = res['data'];
      }
    )
  }

  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
   // this.getProfileCandList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.searchInput = e;
   // this.getProfileCandList(1, this.pazeSize, e);
  }

  onNoClick() {
    this.dialogRef.close();
  }

 /***
  * download file 
  */
 dwnloadFileSingle(data) {
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.empResume)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, data.c_resume);
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }

  /**download ijp applicant list */
  exportAsXLSX(): void {
    //let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    this._talentServ.GetIJPApplicantList(this.data?.TH_ID).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        let dateFormat = 'dd-MMM-yy'
        for (var key in candidateList) {
          let selectedData = {
            'Emp Id': candidateList[key].empId,
            'Emp Name': candidateList[key].empName,
            'IJP Name': candidateList[key].ijpName,
            'Experience': candidateList[key].expRange,
            'Designation': candidateList[key].deignationName,
            'Account Name': candidateList[key].accountName,
           // 'DU Name': candidateList[key].duName,
            'Location': candidateList[key].locationName,
          //  'Location': candidateList[key].ijpName,
           // 'Referred On': this.datepipe.transform(candidateList[key].referredOn, dateFormat),
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'IJP Applicant List');
      }
    )

  }
    
   
  }



  

