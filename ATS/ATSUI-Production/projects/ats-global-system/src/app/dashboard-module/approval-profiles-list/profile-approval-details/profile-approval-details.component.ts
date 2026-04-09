import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../../core/services/share.service';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ApproveProdileModalComponent } from '../approve-prodile-modal/approve-prodile-modal.component';
import { ViewProfileDetailsAprovalModalComponent } from '../view-profile-details-aproval-modal/view-profile-details-aproval-modal.component';

@Component({
  selector: 'app-profile-approval-details',
  templateUrl: './profile-approval-details.component.html',
  styleUrls: ['./profile-approval-details.component.scss']
})
export class ProfileApprovalDetailsComponent implements OnInit {
  public userData: any = {};
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _dashboardService: DashboardService,
    private _storage: GetSetStorageService,
    private http: HttpClient,
    private _share: ShareService,
    public dialog: MatDialog,
    private route:Router
  ) { }

  public profileDetails: any = {};
  public paramId: number;
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    const paramId = this._activatedRoute.snapshot.params.id;
    if(paramId){
       this.getProfileDetailsById(paramId);
       this.paramId = paramId;
    }
  }

 back(){
    this.route.navigate(['/Profile/approval']);
  }
  getProfileDetailsById(id:number){
    this._dashboardService.getProfileApprovalStatus(id).subscribe(
      res=>{
       this.profileDetails = res['data'][0];
       }
    )
  }
  approveCandidateHandler(data: any) {
    data['title'] = "Approve Request";
    const dialogRef = this.dialog.open(ApproveProdileModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screenss', 'request-transfers-candidate',],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProfileDetailsById(this.paramId);
      }
    });
  }

   /***
   * download file 
   */
   dwnloadFileSingle(data) {
    this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${encodeURIComponent(data.ResumePathFull)}`, { responseType: 'blob' }).subscribe(
      res => {
        saveAs(res, data.resume);
      }
    )
  }

  viewDetails(elm: any) {
    const dialogRef = this.dialog.open(ViewProfileDetailsAprovalModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'view-cand-part-dt', 'ats-model-lg'],
      data: elm,
      disableClose: true
    });
  }

 

}
