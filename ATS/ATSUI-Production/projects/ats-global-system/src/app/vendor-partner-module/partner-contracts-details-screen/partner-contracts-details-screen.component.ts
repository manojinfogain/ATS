import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSort } from '@angular/material/sort';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';
import { ShareService } from '../../core/services/share.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { Subscription } from 'rxjs';
import { CONSTANTS } from '../../core/constant/constants';
import { AddNewContractsModalComponent } from '../modals/add-new-contracts-modal/add-new-contracts-modal.component';
import { ApprovRejectMultiContractsModalComponent } from '../modals/approv-reject-multi-contracts-modal/approv-reject-multi-contracts-modal.component';
import { GlobalMethod } from '../../core/common/global-method';
import { ExcelService } from '../../core/common/excel.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-partner-contracts-details-screen',
  templateUrl: './partner-contracts-details-screen.component.html',
  styleUrls: ['./partner-contracts-details-screen.component.scss'],
  providers: [DatePipe]
})
export class PartnerContractsDetailsScreenComponent implements OnInit {
  displayedColumns = ['select', 'PartnerName', 'ContractType', 'ContractAvailability', 'startDate', 'endDate', 'TagheadApproverName', 'status', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public contractList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: any;
  public sortTable: any = [];
  public isPendingWithHead: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  public approveContractsForm: UntypedFormGroup = new UntypedFormGroup({});
  selection = new SelectionModel<any>(true, []);
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _excelService: ExcelService,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    public datepipe: DatePipe
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

    this.getPartnerContractList(1, CONSTANTS.PAGE_SIZE, null, null);
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
    this.getPartnerContractList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getPartnerContractList(1, CONSTANTS.PAGE_SIZE, e, this.sortParam);
  }

  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.selection.clear();
    this.getPartnerContractList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }
  /***
* filter form Init
*/
  filterFormInit() {
    this.sortFormFilter = this._fb.group({
      dateFrom: [null],
      dateTo: [{ value: null, disabled: true }],
      pendingWithMe: [null],
      partnerContractStatusID: [null],
      ContractType: [[]],
      PartnerID: [[]],
    })
  }
  public contrcatType: any = [];
  public partnerList: any = [];
  public bodyParam: any = {};
  getPartnerContractList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }

    if (search) {
      body['search'] = search;
    }
    if (sortParam?.dateFrom) {
      body['startDate'] = GlobalMethod.formatDate(sortParam?.dateFrom);
    }
    if (sortParam?.dateTo) {
      body['endDate'] = GlobalMethod.formatDate(sortParam?.dateTo);
    }
    if (sortParam?.partnerContractStatusID && sortParam?.partnerContractStatusID.length !== 0) {
      let Ids = sortParam?.partnerContractStatusID.filter(n => n);
      body['statusId'] = Ids.toString();
    }
    if (sortParam?.pendingWithMe == true) {
      body['pendingWithMe'] = 1;
    }
    if (sortParam?.ContractType && sortParam?.ContractType.length !== 0) {
      let contractIds = sortParam?.ContractType.filter(n => n);
      body['ContractTypeID'] = contractIds.toString();
    }
    if (sortParam?.PartnerID && sortParam?.PartnerID.length !== 0) {
      let Ids = sortParam?.PartnerID.filter(n => n);
      body['PartnerID'] = Ids.toString();
    }
    this.bodyParam = body;

    this._partnerserve.getAllPartnerContractList(body).subscribe(
      res => {
        this.contractList = res['data'];
        this.paginationData = res['pagination'][0];
        this.enableCheckbox();
        /** showing pending with me filter only to tag head approver login-  */
        if (this.contractList[0]?.TagheadApprover == this.userData?.EmpNewId) {
          this.isPendingWithHead = true;
        } else {
          this.isPendingWithHead = false;
        }
      }
    )
  }

  public disableCheckbox: boolean = true;
  enableCheckbox() {
    if (this.sortParam?.pendingWithMe == 1) {
      this.disableCheckbox = false;
    } else {
      this.disableCheckbox = true;
    }

  }
  masterToggle() {
    // if (this.isAllSelected()) {
    //   this.selection.clear();
    //   return;
    // }
    // this.candidateList?.forEach((row: any) => {
    //   this.selection.select(row);
    // });
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection?.select(...this.contractList);
  }

  /*getting selected list by checkbox */
  checkIfSelected(data: any) {
    let selectedIds = this.selection.selected.map((data: any) => data.ContractId);
    return selectedIds.includes(data.ContractId);
  }

  isAllSelected() {
    //  return this.selection.selected.length == this.candidateList.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.contractList.length;
    return numSelected === numRows;
  }

  /**submit to approve/reject   multi contract */
  multiApproveRejectAllHandler(form: any, type: string) {
    let body = {}
    let ids = this.selection.selected.map((data: any) => data.ContractId);
    body['ids'] = ids.toString();
    body['status'] = type == 'A' ? 2 : 3;
    body['Action'] = type
    body['type'] = type
    this.openAprRejectAllPopup(body);
  }

  /***
  /**approve/ reject/ resend for approval new contract   modal */
  approveRejectContracModal(elm: any, type: string) {
    //elm['title'] = type == 'P' ? 'Approve' : 'Reject';
    elm['type'] = type
    const dialogRef = this.dialog.open(AddNewContractsModalComponent, {
      maxWidth: '47vw',
      minHeight: '150px',
      panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      res => {
        this.selection.clear();
        if (res) {
          this.getPartnerContractList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
        }
      }
    );
  }

  clearCheckbox() {
    this.selection.clear();
  }

  /**approve multi contract */
  openAprRejectAllPopup(data: any) {
    const dialogRef = this.dialog.open(ApprovRejectMultiContractsModalComponent, {
      maxWidth: '47vw',
      minHeight: '150px',
      panelClass: ['ats-model-wrap', 'add-contract-partner-popup'],
      data: data,
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.onSubmitAll(result)
        }
      }
    );
  }

  /**approve reject multi api */
  onSubmitAll(formDataFinal: any) {
    let queryString = `ids=${formDataFinal?.ids}&Action=${formDataFinal?.Action}`;
    this._partnerserve.approveRejectPartnerContractMulti(queryString).subscribe((res: any) => {
      if (res) {
        this._share.showAlertSuccessMessage.next(res);
        this.selection.clear();
        this.getPartnerContractList(1, CONSTANTS.PAGE_SIZE, '', this.sortParam);
      }
    });
  }

  /***
   * export excel
   */

  exportAsXLSX(): void {
    let bodyData = {
      ...this.bodyParam,
      page: 1,
      pageSize: this.paginationData?.Total,
    }
    this._partnerserve.getAllPartnerContractList(bodyData).subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'Partner Name': candidateList[key].PartnerName,
            ' Contract Type': candidateList[key].ContractType,
            'Contract Availability': candidateList[key].ContractAvailability == 'Y' ? 'Yes' : 'No',
            'Start Date': this.datepipe.transform(candidateList[key].StartDate, 'dd-MMM-yy'),
            'End Date': this.datepipe.transform(candidateList[key].EndDate, 'dd-MMM-yy'),
            'Approver Name': candidateList[key].TagheadApproverName,
            // 'Remarks ': candidateList[key].Remarks,
            'Contract Status': candidateList[key].Status,
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Contract Report');
      }
    )

  }

}
