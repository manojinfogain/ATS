import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ExcelService } from 'projects/ats-global-system/src/app/core/common/excel.service';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from '../offer.service';
import { DelegateRightsFormModalComponent } from './Modals/delegate-rights-form-modal/delegate-rights-form-modal.component';
import { RevokeDelegateRightsModalComponent } from './Modals/revoke-delegate-rights-modal/revoke-delegate-rights-modal.component';

@Component({
  selector: 'app-delegate-rights',
  templateUrl: './delegate-rights.component.html',
  styleUrls: ['./delegate-rights.component.scss']
})
export class DelegateRightsComponent implements OnInit {
  displayedColumns = ['empName','DelegateToName','FromDate','ToDate','AddedByName','AddedOn','isActive','Remarks','Actions'];
  public delegationRightsList: any = [];
  public paginationData: any;
  public userData: any = {};
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public searchInput: string;
  constructor(   private _storage: GetSetStorageService,
    private _offer: OfferService,
    public dialog: MatDialog,
    private _excelService: ExcelService,
    public _share: ShareService
    ) {
    
   }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    // if (this.userData) {
    // }
    this.getDeligationRightsList(1, CONSTANTS.PAGE_SIZE, null);
  }
  
  getDeligationRightsList(page: number, pageSize: number, search: any) {
    let queryString = `page=${page}&pageSize=${pageSize}&search=${this.searchInput ? this.searchInput.trim() : ''}`;
    this._offer.getDelegationRightsList(queryString).subscribe(
      res => {
        this.delegationRightsList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  AddDelegatoin() {
    let element={};
    element['title'] = "Delegate Approver";
    const dialogRef = this.dialog.open(DelegateRightsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'upd-int-modal'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.jumpFirstPage = true;
        this.getDeligationRightsList(1, CONSTANTS.PAGE_SIZE, this.searchInput);
      }
    });
  }

  revokeDelegatoin(elem:any) {
    let element={};
    element['title'] = "Are you sure to Revoke Delegation Rights From";
    element['id'] = elem.ID;
    element['toName'] = elem.DelegateToName;
    const dialogRef = this.dialog.open(RevokeDelegateRightsModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback', 'revoke-delegation-dialog'],
      data: element,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.jumpFirstPage = true;
        this.getDeligationRightsList(1, CONSTANTS.PAGE_SIZE, this.searchInput);
      }
    });
  }

   /**
  * pagination method
  * @param pageEvent 
  */
    getPagingData(pageEvent: any) {
      this.getDeligationRightsList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null);
    }

    /***
   * search
   */
  getSearchValueKey(e: any) {
    // this.isResetFilter = true;
    this.isResetSearch = false;
    // this.sortParam = '';
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getDeligationRightsList(1, CONSTANTS.PAGE_SIZE, e);
  }

  exportAsXLSX() {
    let queryString = `page=1&pageSize=${this.paginationData?.Total}&search=${this.searchInput ? this.searchInput.trim() : ''}`;
    this._offer.getDelegationRightsList(queryString).subscribe(
      res => {
        let deliRightList = res['data'];
        let filterDataExcel = [];
        for (var key in deliRightList) {
            let selectedData = {
              'Approver Name': deliRightList[key]?.empName || '-',
              'Delegate To': deliRightList[key]?.DelegateToName || '-',
              'From Date': deliRightList[key]?.FromDate || '-',
              'To Date': deliRightList[key]?.ToDate || '-',
              'Added By': deliRightList[key]?.AddedByName || '-',
              'Added On': deliRightList[key]?.AddedOn || '-',
              'Delegation Status': deliRightList[key]?.IsActive ? 'Active' : 'Inactive',
              'Remarks': deliRightList[key]?.Remarks || '-',
            };
            filterDataExcel.push(selectedData);        
          }
          let sn = filterDataExcel;
          this._excelService.exportAsExcelFile(filterDataExcel, 'Delegation Rights');
      }
    );
  }
}
