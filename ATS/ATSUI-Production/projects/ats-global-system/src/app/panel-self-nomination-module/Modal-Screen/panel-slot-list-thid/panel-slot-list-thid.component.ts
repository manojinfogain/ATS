import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AtsCommonPrefix } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { PanelSelfNominationService } from '../../panel-self-nomination.service';
import { GlobalMethod } from '../../../core/common/global-method';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';

@Component({
  selector: 'app-panel-slot-list-thid',
  templateUrl: './panel-slot-list-thid.component.html',
  styleUrls: ['./panel-slot-list-thid.component.scss'],
  providers: [DatePipe]
})
export class PanelSlotListThidComponent implements OnInit, AfterViewInit {

  public displayedColumns = ['thid', 'Panel', 'slotDate', 'slotRange'];

  public candidateList: MatTableDataSource<any>;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public isResetSearch: boolean = false;
  public searchInput: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public userData: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PanelSlotListThidComponent>,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private _PanelServe: PanelSelfNominationService,
    private _storage: GetSetStorageService
  ) { }


  ngOnInit(): void {
    //sending flag to core api
    this.userData = this._storage.getSetUserData();
    this.filterFormInit();
    if (this.data?.type == 'C') {
      this.displayedColumns = ['Panel', 'slotCount', 'FirstSlotDate', 'LastSlotDate', 'action'];
    }
    else {
      // this.displayedColumns = ['Panel','slotDate', 'slotRange', 'slotTimeZone', 'slotDateUser', 'slotRangeUser'];
      this.displayedColumns = ['Panel','slotDate', 'slotRange',];
    }
  }

  /**
    * open modal
    * @param data 
    * @param columnType 
    */
  openSlotListModal(data: any): void {
    data['title'] = "Slot List" + ' - ' + data?.PanelName;
    data['type'] = 'S';

    const dialogRef = this.dialog.open(PanelSlotListThidComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-slot-modal-five', , 'view-slot-modal-six'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  /***
   * 
   */
  initMatSource(data: any) {
    this.candidateList = new MatTableDataSource(data);
    this.candidateList.paginator = this.paginator;
    this.candidateList.sort = this.sort;
  }

  public body: any = {};
  ngAfterViewInit() {

    this.getData();
  }

  getData() {
    if (this.data) {
    
      if (this.data?.type == 'P') {
        this.body = {
          page: 1,
          pageSize: 5000,
          thid: this.data.thid,
          PanelEmpId: this.data?.PanelEmpId
        }
        this.executeAllApi(this.body);
       
      }
      else {
        this.body = {
          page: 1,
          pageSize: 5000,
          thid: this.data.thid
        }
        this.executeAllApi(this.body);
      }

    }
  }

  //
  public panelList: any = [];
  public isPanelCtrl:boolean = true;
  executeAllApi(body: any) {
    // if (this.data?.type == 'C') {
    //   this.isPanelCtrl = false;
    //   this._PanelServe.getPanelSlotsCountByTHID(body).subscribe(
    //     res => {
    //       this.initMatSource(res?.data);
    //     }
    //   )
    // }
    // else {
    //   this._PanelServe.getPanelSlotsByTHID(body).subscribe(
    //     res => {
    //       this.initMatSource(res?.data);
    //     }
    //   )
    // }

      this._PanelServe.getPanelSlotsByTHID(body).subscribe(
        res => {
          this.initMatSource(res?.data);
        }
      )

    this._PanelServe.getPanelListBySlotThid(this.data.thid).subscribe(
      res=>{
        this.panelList = res?.data;
      }
    )

    // this._dashServe.getAccountOwnerWiseCandidateDetails(this.obj).subscribe(
    //   res => {
    //     this.initMatSource(res?.data);
    //   }
    // )
  }



  //  //form for filter
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      panelId: [[]],
      startTime: [null],
      endTime: [null],
    })
  }

  public isResetFilter: boolean = false;
  public sortParam: string = '';
  getSortData(data: any) {
    debugger
    this.body['SlotStartDate']=null;
    this.body['SlotEndDate']=null;
    this.body['SlotStartTime']=null;
    this.body['SlotEndTime']=null;
    this.body['PanelEmpId']='';
    
    let timezone =GlobalMethod.getTimezone();
    if (this.candidateList.paginator) {
      this.candidateList.paginator.firstPage();
    }
    debugger
    if (data?.dateFrom) {
      this.body['SlotStartDate'] = GlobalMethod.convertToUTCDateTime(data?.dateFrom);
    }

    if (data?.dateTo) {
      this.body['SlotEndDate'] = GlobalMethod.convertToUTCDateTime(data?.dateTo);
    }

    if (data?.startTime) {
      this.body['SlotStartTime'] = data?.startTime
    }
    if (data?.startTime) {
      this.body['SlotEndTime'] = data?.endTime
    }
    if (data?.panelId) {
     // this.body['PanelEmpId'] = data?.panelId
      let Ids = data?.panelId?.filter(n => n);
      this.body['PanelEmpId']  = Ids.toString();
    }
    debugger
    this.executeAllApi(this.body);

  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.candidateList.filter = e.trim().toLowerCase();
    if (this.candidateList.paginator) {
      this.candidateList.paginator.firstPage();
    }
  }

  /**
   * show interview round details
   * @param data 
   */
  openfeedbackInfoModal(data: any) {

  }

  /***
* close
*/
  onNoClick() {
    this.dialogRef.close(null);
  }

  exportAsXLSX(): void {


  }

}
