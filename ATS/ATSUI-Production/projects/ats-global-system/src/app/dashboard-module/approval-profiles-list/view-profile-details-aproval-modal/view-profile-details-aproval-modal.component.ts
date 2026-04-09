import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { PartnerService } from '../../../vendor-partner-module/partner.service';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-view-profile-details-aproval-modal',
  templateUrl: './view-profile-details-aproval-modal.component.html',
  styleUrls: ['./view-profile-details-aproval-modal.component.scss']
})
export class ViewProfileDetailsAprovalModalComponent implements OnInit {

  public candData: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewProfileDetailsAprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getProfileDetailsById(this.data.ID);
  }
  public profileDetails: any = {};
  getProfileDetailsById(id:number){
    this._dashboardService.getProfileApprovalStatus(id).subscribe(
      res=>{
       this.profileDetails = res['data'][0];
       }
    )
  }


  

  closeModal(): void {
    this.dialogRef.close();
  }


}
