import { Component, OnInit } from '@angular/core';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { ReportService } from '../report.service';
@Component({
  selector: 'app-delivery-wise-report',
  templateUrl: './delivery-wise-report.component.html',
  styleUrls: ['./delivery-wise-report.component.scss']
})
export class DeliveryWiseReportComponent implements OnInit {
  userName:string;
  displayedColumns = ['du','OpenPositions','NotScheduledYet', 'ScreeningRound','TechnicalRound','ManagerialRound','MgmtRound','ClientRound','HRSelected','HRRejected','HrOnHold','OfferedGiven','YTJCandidates','CandidatesJoined'];
  
  constructor(
    private _storage: GetSetStorageService,
    public _dashServe: ReportService) { }

  ngOnInit(): void {
    let userData = this._storage.getSetUserData();
    this.userName = userData.FirstName;
    this.getDeliveryWiseReport();
    let emp = [113495,12345];
    let v = emp.indexOf(1134951);
    if(v){

    }
 
  }

  public reportList:any = [];
  getDeliveryWiseReport() {
     this._dashServe.getDeliveryWiseReport().subscribe(
       res => {
         this.reportList = res['data'];
       }
     )
   }

   sumTotal(data,Type){
    let total = data.reduce((total,line) =>  total + line[Type],0)
     return total
   }

}
