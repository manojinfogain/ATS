import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { DashboardService } from '../dashboard.service';
import { UnmapProfilesCountComponent } from '../modal/unmap-profiles-count/unmap-profiles-count.component';
import { UnmapProfilesListComponent } from '../modal/unmap-profiles-list/unmap-profiles-list.component';
import { UnusedCskillProfileListComponent } from '../modal/unused-cskill-profile-list/unused-cskill-profile-list.component';
import { ITotal } from 'projects/ats-global-system/src/app/core/models/common-model';
import { CommonRepoModalComponent } from '../modal/common-repo-modal/common-repo-modal.component';
import { FullfillmentdatelapseTalentModalComponent } from '../../common-sharing/modals/fullfillmentdatelapse-talent-modal/fullfillmentdatelapse-talent-modal.component';
import { ResumeAssesmentModalComponent } from '../modal/resume-assesment-modal/resume-assesment-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, AfterViewInit {
  fullName: any;
  emailId: any;
  public billingCount="Billing loss count"
  public fullFillmentDateAvaialbe: any;
  public totalOpenPositionData: any;
  public totalAssignTalentData: any;
  public userData: any = {};
  public unmapProfileCount: any = [];
  public unUsedCkillProfileCount: any = [];
  public unUsedCkillProfileCountTotal: any = {};
  constructor(
    private router: Router,
    private _dasboardDetails: DashboardService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService) { }

  public convertPercentMethod(total, from) {
    let result = Math.round(parseFloat(from) / parseFloat(total) * 100);
    return result;
    //  let result = parseFloat(from) / parseFloat(total) * 100;
    //  let num =Number.isInteger(result);
    //  if(num){
    //   return result;
    //  }
    //  else{
    //   return result.toFixed(1);
    //  }
  }

  public ProfileCountByClosedTalentIdTotal: ITotal = {};
  ngOnInit() {

    // const dialogRef = this.dialog.open(FullfillmentdatelapseTalentModalComponent, {
    //   width: '650px',
    //   panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'unused-cskill-profile-poup'],
    //   data: {},
    //   disableClose: true
    // });
    this.userData = this._storage.getSetUserData();
    this.fullName = 'Welcome' + ' ' + this.userData.FirstName;
    this.emailId = this.userData.empMailId;
    //get total open position
    forkJoin([
      this._dasboardDetails.gettotalOpenposition(),
      this._dasboardDetails.gettalentidAssigned(),
      this._dasboardDetails.fullfillmentDateAvailable(),
      this._dasboardDetails.getTotalUnmapProfile(),
      this._dasboardDetails.getTotalUnusedProfile(1),
      this._dasboardDetails.getTotalUnusedProfile(0),
     // this._dasboardDetails.getAllProfileCountByClosedTalentId(),
    ]).subscribe(
      res => {
        this.totalOpenPositionData = res[0];
        this.totalAssignTalentData = res[1];
        this.fullFillmentDateAvaialbe = res[2];
        this.unmapProfileCount = res[3];
        this.unUsedCkillProfileCount = res[4];
        this.unUsedCkillProfileCountTotal = res[5];
      //  this.ProfileCountByClosedTalentIdTotal = res[6];
      },
      (error) => {
        console.warn(error.error.message);
      }
    )

  }

  ngAfterViewInit() {
     //this.openResumeAssesmentModal();
  }
  openResumeAssesmentModal(data:any ={}): void {
    const dialogRef = this.dialog.open(ResumeAssesmentModalComponent, {
    //  width: '650px',
      panelClass: ['ats-model-wrap','resume-assesment-popup', 'ats-model-full-screen'],
      data: data,
      //disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
  }

  navigateToInfoPage(type) {
    this.router.navigate(['assigned-talentid'], { queryParams: { offshore: type } });
  }
  showAllPosition(type) {
    if (this.userData.RoleId === 5 || this.userData.RoleId === 6 || this.userData.RoleId === 2 ||
      this.userData?.RoleId == 10) {
      this.router.navigate(['total-open-position'], { queryParams: { offshore: type } });
    }

  }
  /**
   * unmap profile
   */
  openUnassinedProf(): void {
    let data = {
      candidateCount: 107,
      id: 4,
      profile_name: "Employee referrals"
    }
    const dialogRef = this.dialog.open(UnmapProfilesListComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'unused-cskill-profile-poup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._dasboardDetails.getTotalUnmapProfile().subscribe(
          res => {
            this.unmapProfileCount = res;
          }
        )
      }
    });
  }

  /***
   * unused CSkill profile modal open
   */

  openUnUsedCkillProf(): void {
    let data = {
      profile_name: "Unused CSkill Profile List",

    }
    const dialogRef = this.dialog.open(UnusedCskillProfileListComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'unused-cskill-profile-poup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        forkJoin([
          this._dasboardDetails.getTotalUnusedProfile(1),
          this._dasboardDetails.getTotalUnusedProfile(0)
        ]).subscribe(
          res => {
            this.unUsedCkillProfileCount = res[0];
            this.unUsedCkillProfileCountTotal = res[1];
          }
        )
      }
    });
  }

  /***
   * unused CSkill profile modal open
   */

  openCommonRepoModal(): void {
    let data = {
      profile_name: "Unused Candidate Repository",

    }
    const dialogRef = this.dialog.open(CommonRepoModalComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'view-profile-popup', 'add-profile-popup', 'unused-cskill-profile-poup'],
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        forkJoin([
          this._dasboardDetails.getAllProfileCountByClosedTalentId()
        ]).subscribe(
          res => {
            this.ProfileCountByClosedTalentIdTotal = res[0]
          }
        )
      }
    });
  }

  

}


