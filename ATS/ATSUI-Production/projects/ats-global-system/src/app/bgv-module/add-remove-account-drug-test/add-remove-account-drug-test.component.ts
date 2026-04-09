import { Component, ViewChild, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
// import { AddNewCompanyModalComponent } from './modals/add-new-company-modal/add-new-company-modal.component';
// import { AdminServiceService } from '../admin-service.service';
// import { DatePipe } from '@angular/common';
import { ExcelService } from '../../core/common/excel.service';
import { BgvServiceService } from '../bgv-service.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ShareService } from '../../core/services/share.service';
import { AddNewAccountDtModalComponent } from '../modals/add-new-account-dt-modal/add-new-account-dt-modal.component';

@Component({
  selector: 'app-add-remove-account-drug-test',
  templateUrl: './add-remove-account-drug-test.component.html',
  styleUrls: ['./add-remove-account-drug-test.component.scss']
})
export class AddRemoveAccountDrugTestComponent implements OnInit {

  displayedColumns = ['srNo', 'AccountName', 'AccountOwner', 'BUName', 'DUName', 'AddedBy', 'Addedon', 'status', 'action'];
  public searchInput: string;
  public paginationData: any;
  public pazeOption: any = [10, 20, 50, 100];
  public pazeSize: any = 10;
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public accountList: any = [];
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  constructor(
    public dialog: MatDialog,
    private _bgvService: BgvServiceService,
    // public datepipe: DatePipe,
    private _excelService: ExcelService,
    private _share: ShareService,
  ) { }

  ngOnInit() {
    this.getAllAccountList(1, this.pazeSize, '');
  }
  ngAfterViewInit() {

  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  getAllAccountList(page: number, pageSize: number, name: string): void {
    // this._adminService.getCompanyListForCompanyMaster(page, pageSize, name).subscribe(

    this._bgvService.GetBGVDTAccountDetails().subscribe(
      res => {
        this.accountList = res['data'];
        this.paginationData = res['Table1'][0];
      }
    );
  }

  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getAllAccountList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    // this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getAllAccountList(1, this.pazeSize, e);
  }

  /**open modal to add new account */
  addNewAccountModal(element: any) {
    element['title'] = "Add New Account";
    const dialogRef = this.dialog.open(AddNewAccountDtModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paginatorCompRef.paginator.pageIndex = 0;
        this.getAllAccountList(1, this.pazeSize, '');
      }
    });

  }

  /***
   * export excel
   */
  exportAsXLSX(): void {
    // let queryString = `${'thId=' + this.thId}&page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}${this.sortParam ? this.sortParam : ''}${this.sortTable ? this.sortTable : ''}`;
    //let queryString = `page=1&pageSize=${this.paginationData?.Total}${this.searchInput ? '&search=' + this.searchInput : ''}`;
    // this._adminService.getCompanyListForCompanyMaster(1, this.paginationData?.Total, this.searchInput ? this.searchInput : '').subscribe(
    this._bgvService.GetBGVDTAccountDetails().subscribe(
      res => {
        let candidateList = res['data'];
        let filterDataExcel = [];
        for (var key in candidateList) {
          let selectedData = {
            'S. No.': (parseInt(key, 10) + 1),
            'Account Name': candidateList[key].AccountName,
            'Account Owner': candidateList[key].AccountOwner,
            'BU Name': candidateList[key].BUName,
            'DU Name': candidateList[key].DUName,
            'Added By': candidateList[key].AddedBy,
            'Added On': candidateList[key].AddedOn,
            'Status': candidateList[key].Status
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Account List For Drug Test');
      }
    )

  }

  removeAccountFromDTList(val: any): void {
    /***
          * confirmation dailog
          */
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to remove <b> ${val?.AccountName || '-'}</b> from the Drug Test list?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._bgvService.DeleteDTAccount(val.AccountId).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            // this.paginatorCompRef.paginator.pageIndex = 0;
            this.getAllAccountList(1, this.pazeSize, null);
            // this.dialogRef.close(true);
          }
        );
      }
    });
  }

}
