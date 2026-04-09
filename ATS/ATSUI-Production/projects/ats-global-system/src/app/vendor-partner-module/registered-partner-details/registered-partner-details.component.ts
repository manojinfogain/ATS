import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';
import { UpdatePartnerDetailsComponent } from '../modals/update-partner-details/update-partner-details.component';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { UserActiveDeactiveComponent } from '../modals/user-active-deactive/user-active-deactive.component';
import { Router } from '@angular/router';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver";
import { ParnerStatusFormModalComponent } from './parner-status-form-modal/parner-status-form-modal.component';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GlobalMethod } from '../../core/common/global-method';
import { MatSort } from '@angular/material/sort';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../core/services/share.service';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { ViewContractHistoryComponent } from '../modals/view-contract-history/view-contract-history.component';
import { AddNewContractsModalComponent } from '../modals/add-new-contracts-modal/add-new-contracts-modal.component';

@Component({
  selector: 'app-registered-partner-details',
  templateUrl: './registered-partner-details.component.html',
  styleUrls: ['./registered-partner-details.component.scss']
})
export class RegisteredPartnerDetailsComponent implements OnInit, OnDestroy {
  displayedColumns = ['PartnerName', 'contact', 'email', 'location', 'ContractType', 'ContractAvailability', 'startDate', 'endDate', 'TagheadApproverName', 'remark', 'approvalStatus', 'status', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public sortTable: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _router: Router,
    private _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private http: HttpClient,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo
  ) {
  }
  private refreshSubscription: Subscription = new Subscription();
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )

    this.filterFormInit();
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
    }

    this.getVenderList(1, CONSTANTS.PAGE_SIZE, null, null);
    this.showHideTableCol();
  }

  /**
   * show table Coulmn location wise
   */
  showHideTableCol() {
    if (this.isLocationIndia) {
      this.displayedColumns = ['PartnerName', 'contact', 'email', 'location', 'ContractType', 'ContractAvailability', 'startDate', 'endDate', 'TagheadApproverName', 'remark', 'status', 'action'];
    }
    else if (this.isLocationUS) {
      this.displayedColumns = ['PartnerName', 'contact', 'email', 'locationUS', 'ContractType', 'ContractAvailability', 'startDate', 'endDate', 'TagheadApproverName', 'remark', 'status', 'action'];
    }
    else {
      this.displayedColumns = ['PartnerName', 'contact', 'email', 'location', 'ContractType', 'ContractAvailability', 'startDate', 'endDate', 'TagheadApproverName', 'remark', 'status', 'action'];
    }

  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
  }



  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getVenderList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }
  /***
* filter form Init
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      // statusAssignId: ['all'],
      pendingWithMe: [null],
      resiteredPartnerStatusID: [null]
    })
  }
  // getVenderList(page: number, pageSize: number, search: any) {
  //   let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}`;
  //   this._partnerserve.getVenderList(queryString).subscribe(
  //     res => {
  //       this.candidateList = res['data'];
  //       this.paginationData = res['pagination'][0];
  //     }
  //   )
  // }

  // togglePipe: boolean = true;
  // showMore: boolean = true;
  // showMoreText() {
  //   this.togglePipe = !this.togglePipe;

  // }


  /**showing see more details of the columns */
  public dtData: any = '';
  public title: string = '';
  openPop(data: any, title: string): void {
    if (data) {
      this.title = title;
      this.dtData = data;
    }

  }
  public contrcatType: any = [];
  public partnerList: any = [];
  public bodyParam: any = {};
  getVenderList(page: number, pageSize: number, search: any, sortParam: any) {
    //  let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }

    if (search) {
      body['search'] = search;
    }

    if (sortParam?.resiteredPartnerStatusID && sortParam?.resiteredPartnerStatusID.length !== 0) {
      let Ids = sortParam?.resiteredPartnerStatusID.filter(n => n);
      body['statusId'] = Ids.toString();
    }
    /**0 for unassign / 1 for assign  */
    // if (sortParam?.statusAssignId =='0' || sortParam?.statusAssignId =='1') {
    //   body['statusID'] = sortParam?.statusAssignId;
    // }

    if (sortParam?.pendingWithMe == true) {
      body['pendingWithMe'] = 1;
    }

    this.bodyParam = body;

    this._partnerserve.getAllPartnerList(body).subscribe(
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
        this.candidateList.sort = this.sort;
        debugger
        let a = res['data']

        // for (let i=0; i < a.length; i++){
        //   this.contrcatType.push(a[i]);
        //  this.bb = this.contrcatType[i].ContractTypeMultiple?.split(", ")

        // }
        for (let i = 0; i < a.length; i++) {
          this.partnerList.push(a[i]);
          this.bb
          let splitData: any = [];
          this.partnerList[i]['contractTypeSplit'] = this.partnerList[i]?.ContractTypeMultiple?.split(", ");
          // /this.partnereList = new MatTableDataSource(splitData)
          //this.contrcatType[i].push();

        }
        // // = a[i].ContractTypeMultiple.split(", ");
        this.contrcatType
        this.bb;
        debugger

      }
    )
  }

  contractDetailsSplit(contractType: string) {
    return contractType.split(", ");
  }
  public bb: any = [];



  // edit/update info
  editUpdate(elm: any, type: string): void {
    elm['title'] = "Update Partner"
    elm['type'] = type
    const dialogRef = this.dialog.open(UpdatePartnerDetailsComponent, {
      width: '100%',
      maxWidth: '100%',
      // height: 'fit-content',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'update-partner-details-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        // this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput,  this.sortParam, '');
        this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
      }
    });
  }


  // edit/update info
  updatePartnerStatus(elm: any): void {
    elm['title'] = "Update Partner Status"
    const dialogRef = this.dialog.open(ParnerStatusFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'partner-update-modal', 'partner-status-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        //this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput);
        this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
      }
    });
  }

  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.status == '1' ? 'deactivate' : 'activate'} <span class='u-name'>${data?.PartnerName}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeStatusUser(data, event)
      }
      else {
        event.source.checked = data?.status === '1';
      }
    });
  }
  /***
   * open modal for status remark
   */
  changeStatusUser(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Active' : 'Deactive';
    elm['statusForUpdate'] = event.source.checked === true ? 1 : 0;
    elm['type'] = 2;
    const dialogRef = this.dialog.open(UserActiveDeactiveComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.jumpFirstPage = true;
        this.paginatorCompRef.paginator.pageIndex = 0;
        //  this.getVenderList(1, CONSTANTS.PAGE_SIZE, this.searchInput);
        this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
      }
      else {
        event.source.checked = elm?.status === '1';
      }
    });
  }


  /**add new contract   modal */
  // addNewContractHistoryModal(elm: any, type: string) {
  //   elm['title'] = ""
  //   elm['type'] = type
  //   const dialogRef = this.dialog.open(AddNewContractsModalComponent, {
  //     maxWidth: '90vw',
  //     // max-height: '250px',
  //     panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
  //     data: elm,
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     res => {
  //       if (res) {
  //         this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
  //       }
  //     }
  //   );
  // }
  /**add new contract   modal */
  addNewContractHistoryModal(elm: any, type: string) {
    elm['title'] = ""
    elm['type'] = type
    const dialogRef = this.dialog.open(AddNewContractsModalComponent, {
      maxWidth: '47vw',
      // max-height: '250px',
      minHeight: '150px',
      panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getVenderList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
        }
      }
    );
  }

  /**view contract  history modal */
  viewContractHistoryModal(elm: any) {
    elm['title'] = ""
    const dialogRef = this.dialog.open(ViewContractHistoryComponent, {
      width: '650px',
      // max-height: '250px',
      panelClass: ['ats-model-wrap', 'view-offered-candidate-popup',],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
        }
      }
    );
  }

  gotPartnerPage(): void {
    this._router.navigate(['partner-registration'])
  }


  /***
   * export excel
   */
  // exportAsXLSX(): void {
  //   //let queryString = `page=1&pageSize=10000&search=`;
  //   let queryString = `EmpID=${this._storage.getUserEmpId()}&page=1&pageSize=10000&search=`;
  //   this._partnerserve.getVenderList(queryString).subscribe(
  //     res => {
  //       let candidateList = res['data'];
  //       let filterDataExcel = [];
  //       for (var key in candidateList) {
  //         let selectedData = {
  //           'Partner Name': candidateList[key].PartnerName,
  //           'Contact No. ': candidateList[key].ContactNo,
  //           'Email Id': candidateList[key].Email,
  //           'Contract Type': candidateList[key].ContractType
  //         }
  //         filterDataExcel.push(selectedData);
  //       }
  //       this._excelService.exportAsExcelFile(filterDataExcel, 'partner-records');
  //     }
  //   )

  // }

  /**export to excel by API  */
  exportExcelServerSide() {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this.http.post(`${environment.apiMainUrlNet}Partner/ExportToExcelPartnerDetailsReport`, bodyData, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, 'Partner-Details-List.xls');
      },
      (error) => {
        this._share.showAlertErrorMessage.next('Something went wrong');
      }
    )
  }
}
