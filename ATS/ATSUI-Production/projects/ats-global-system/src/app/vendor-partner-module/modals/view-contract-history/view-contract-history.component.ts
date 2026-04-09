import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from '../../../core/services/share.service';
import { TalentService } from '../../../talent-module/talent.service';
import { ExcelService } from '../../../core/common/excel.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-view-contract-history',
  templateUrl: './view-contract-history.component.html',
  styleUrls: ['./view-contract-history.component.scss']
})
export class ViewContractHistoryComponent implements OnInit {
  displayedColumns = ['srNo', 'contractTypeName', 'contractAvailabitily',
    'startDate', 'endDate', 'approverName', 'status'];
  blob: any;
  url: any;
  public isloader: boolean = false;

  public talentHistoryList: any[];
  constructor(
    public dialogRef: MatDialogRef<ViewContractHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _excelService: ExcelService,
    private _globalServe: GlobalApisService


  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.getPartnerContractsList(this.data?.PartnerID);
  }


  onNoClick() {
    this.dialogRef.close();
  }
  /**getting contracts history of partner */
  public partnerContracts: any = [];
  getPartnerContractsList(partnerID: number) {
    let queryString = `partnerId=${partnerID}&isForApproval=${0}`;
    this._globalServe.getAllContractbyPartner(queryString).subscribe(
      res => {
        this.partnerContracts = res['data'];
      }
    )
  }

  //export history excel

  exportAsXLSX(): void {
    let queryString = `partnerId=${this.data?.PartnerID}&isForApproval=${0}`;
    this._globalServe.getAllContractbyPartner(queryString).subscribe(
      res => {
        let partnerContract = res['data'];
        let filterDataExcel = [];
        for (var key in partnerContract) {
          let selectedData = {
            'Contract Type Name': partnerContract[key]?.contractTypeName,
            'Contract Availabitily': partnerContract[key].contractAvailabitily == 'Y' || partnerContract[key].contractAvailabitily == 'y' ? 'Yes' : 'No',
            'Start Date': GlobalMethod.formatDate(partnerContract[key]?.startDate) ,
            'End Date': GlobalMethod.formatDate(partnerContract[key]?.endDate) ,
            'Approver Name': partnerContract[key]?.ApproverName,
            'Status': partnerContract[key]?.statusName
          };
          filterDataExcel.push(selectedData);
        }

        this._excelService.exportAsExcelFile(filterDataExcel, 'Partner Contract History');
      }
    )

  }

}
