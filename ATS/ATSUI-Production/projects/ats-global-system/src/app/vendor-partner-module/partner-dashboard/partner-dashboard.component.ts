import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';

@Component({
  selector: 'app-partner-dashboard',
  templateUrl: './partner-dashboard.component.html',
  styleUrls: ['./partner-dashboard.component.scss']
})
export class PartnerDashboardComponent implements OnInit {
   PartnerName:string;
   partnerId: any;
   fullName: any;
   userData: any;
   totalPositions: any = 0;
   positionInProgress: number = 0;
   positionYetToStart: number = 0;
   inProgressPer: any = 0;
   yetToStartPer: any = 0;
   constructor( 
    private _storage: GetSetStorageService, 
    private router: Router, 
    private partnerServe: PartnerService
    ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    let LocID=this.userData.LocationID;
    this.PartnerName = this.userData.FirstName;
    this.partnerId = this.userData.partnerId;
    if(LocID == 3){ 
      this.fullName = 'Welcome';    
   // this.fullName = 'Welcome' + ' ' + this.userData.FirstName;
    }else{
      this.fullName = 'Welcome';
    }
    // this.fullName = 'Welcome' + ' ' + this.userData.FirstName;
    this.partnerServe.getPartnerDashboard(this.partnerId).subscribe({ 
      next: (res) =>{
        this.totalPositions = res.data[0].TotalCount;
        this.positionInProgress = res.data[0].UtilizedCount;
        this.positionYetToStart = res.data[0].NotUtilizedCount;
        this.inProgressPer =  Math.round(res.data[0].UtilizedPercentage);
        this.yetToStartPer =  Math.round(res.data[0].NotUtilizedPercentage);
      },
      error: (error) => {
        console.warn(error.error.message);
      }
    });
  }

  showAllPosition(type:string) {
    this.router.navigate(['assigned-talentId-list-partner'], { queryParams: { action: type } });
  }
}
