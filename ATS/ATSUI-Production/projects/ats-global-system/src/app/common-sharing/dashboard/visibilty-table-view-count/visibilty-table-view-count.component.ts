import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { dashboardTableKey } from 'projects/ats-global-system/src/app/core/common/enums';
import { TableUtil } from 'projects/ats-global-system/src/app/core/common/tableUtil';
import { dashTableHead } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { DashboardCommon } from 'projects/ats-global-system/src/app/dashboard-module/dashboard';
import { CandidateInfoDialogComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/candidate-info-dialog/candidate-info-dialog.component';
import { ViewTalentWiseCountComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/view-talent-wise-count/view-talent-wise-count.component';

@Component({
  selector: 'app-visibilty-table-view-count',
  templateUrl: './visibilty-table-view-count.component.html',
  styleUrls: ['./visibilty-table-view-count.component.scss']
})
export class VisibiltyTableViewCountComponent implements OnInit,OnDestroy {
  displayedColumns = dashTableHead.displayedColumns;
  public headGroup: any = [];
  @Input() reportList: any = [];
  @Input() filteredDate: any = {};
  @Input() searchInput: string;
  @Input() type: string;
  @Input() dataKeyObj: any = {};
  public dashTableLabel: any = dashboardTableKey;
  public subsDown:Subscription
  constructor(
    public dialog: MatDialog,
    private _share: ShareService
  ) {
    //showing heading in table
    for (let i = 0; i <= 4; i++) {
      this.headGroup.push('day' + i)
    }
  }

  ngOnInit(): void {
   this.subsDown= this._share.detectExcelExportPMWise.subscribe(
      get => {
        if (get) {
          this.exportAsXLSX(get?.docName);
        }

      }
    )

  }

  ngOnDestroy(): void {
    if(this.subsDown){
      this.subsDown.unsubscribe();
    }
  }

  exportAsXLSX(title: string): void {
    TableUtil.exportTableToExcel("exportTable", title);
  }

  sumTotal(data, Type) {
    let total = data.reduce((total, line) => total + line[Type], 0)
    return total
  }

  clacRowSpan(index: number) {
    let obj = {};
    if (index === 0) {
      obj['num'] = 1;
      obj['title'] = '';
      obj['class'] = 'duP';
    }
    if (index === 1) {
      obj['num'] = 2;
      obj['title'] = dashboardTableKey['TalentIDStatus'];
      obj['class'] = 'tl-st';
    }
    if (index === 2) {
      obj['num'] = 6;
      obj['title'] = dashboardTableKey['InterviewsStatus'];
      obj['class'] = 'interviewsStatus';
    }
    if (index === 3) {
      obj['num'] = 3;
      obj['title'] = dashboardTableKey['HRSelectionStatus'];
      obj['class'] = 'selectionStatus';
    }
    if (index === 4) {
      obj['num'] = 5;
      obj['title'] = dashboardTableKey['CandidatesStatus'];
      obj['class'] = 'candidatesStatus';
    }
    return obj;
  }

  labelHGroup(index: number) {
    if (index >= 0 && index <= 2) {
      return ''
    }
    else if (index >= 3 && index <= 8) {
      return 'Interviews Status'
    }
    else if (index >= 9 && index <= 11) {
      return 'HR- Selection Status'
    }
    else if (index >= 12 && index <= 14) {
      return 'Candidates Status'
    }

  }

  /**
    * open modal
    * @param data 
    * @param columnType 
    */
  openCandidateInfoModal(data: any, columnType: string, popType: string = null): void {
    data['profile_name'] = "Candidates List (BU)";
    data['columnType'] = columnType;
    data['reportType'] = this.type;
    data['colName'] = DashboardCommon.getIntType(columnType);
    data['filteredDate'] = this.filteredDate;
    // talent id info
    if (this.type === 'hm' && popType == 'TL' ||
      this.type === 'PM' && popType == 'TL' ||
      this.type === 'PM' && popType == 'TL') {
      // data['colName'] = 'Open position';
      const dialogRef = this.dialog.open(ViewTalentWiseCountComponent, {
        width: '650px',
        panelClass: ['ats-model-wrap', 'ats-model-lg'],
        data: data,
        disableClose: false
      });
    }
    else {
      const dialogRef = this.dialog.open(CandidateInfoDialogComponent, {
        width: '650px',
        panelClass: ['ats-model-wrap', 'ats-model-lg'],
        data: data,
        disableClose: true
      });
    }

  }

}
