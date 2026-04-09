import { Component, OnInit } from '@angular/core';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss']
})
export class ReportDashboardComponent implements OnInit {
  userName:string;
  displayedColumns = ['du','OpenPositions','NotScheduledYet', 'ScreeningRound','TechnicalRound','ManagerialRound','MgmtRound','ClientRound','HRSelected','HRRejected','HrOnHold','OfferedGiven','YTJCandidates','CandidatesJoined'];
  
  constructor(
    private _storage: GetSetStorageService,
    public _dashServe: ReportService) { }

  ngOnInit(): void {
    let userData = this._storage.getSetUserData();
    this.userName = userData.FirstName;
    this.getDeliveryWiseReport();
 
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
