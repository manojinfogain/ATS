import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { PartnerService } from '../../partner.service';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';

@Component({
  selector: 'app-view-candidate-details-partner',
  templateUrl: './view-candidate-details-partner.component.html',
  styleUrls: ['./view-candidate-details-partner.component.scss']
})
export class ViewCandidateDetailsPartnerComponent implements OnInit {
  public candData: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewCandidateDetailsPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _partnerServe: PartnerService,
    private getLocInfo: GetLocationInfo
  ) { }

  ngOnInit(): void {
    this.showHideLocWise();
    this._partnerServe.getcandDetails(`id=${this.data.id}`).subscribe(
      res => {
        this.candData = res['data'][0];
      }
    )
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = true;
  showHideLocWise() {
   if (this.getLocInfo.isUserLocationIndia()) {
     this.isLocationIndia = true;
     this.isLocationUS = false;
   } else if (this.getLocInfo.isUserLocationUS()) {
     this.isLocationIndia = false;
     this.isLocationUS = true;
      }
   
 }

  closeModal(): void {
    this.dialogRef.close();
  }

}
