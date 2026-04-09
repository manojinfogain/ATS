import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { NaukriService } from '../../../talent-module/naukri.service';

@Component({
  selector: 'app-view-applicant-details-modal',
  templateUrl: './view-applicant-details-modal.component.html',
  styleUrls: ['./view-applicant-details-modal.component.scss']
})
export class ViewApplicantDetailsModalComponent implements OnInit {
  public candData: any = [];
  constructor(
    public dialogRef: MatDialogRef<ViewApplicantDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private getLocInfo: GetLocationInfo,
    private naukriService: NaukriService
  ) { }

  ngOnInit(): void {
    this.showHideLocWise();
    this.loadApplicantDetails();
  }

  loadApplicantDetails(): void {
    if (this.data && this.data.id) {
      this.naukriService.getApplicantDetailsById(this.data.id).subscribe(
        res => {
          this.candData = res['AppicantDetails'][0];
          this.candData['EducationDetails'] = res['EducationDetails'];
          this.candData['WorkDetails'] = res['WorkDetails'];
          this.candData['QADetails'] = res['Q&ADetails'];
        },
        err => {
          this.candData = null;
        }
      );
    }
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
