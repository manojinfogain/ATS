import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { NaukriService } from '../../../naukri.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
// import { ShareService } from '../../../../services/share.service';

@Component({
  selector: 'app-view-posted-job-details-modal',
  templateUrl: './view-posted-job-details-modal.component.html',
  styleUrls: ['./view-posted-job-details-modal.component.scss']
})
export class ViewPostedJobDetailsModalComponent implements OnInit {
  public jobDetails: any = null;
  public isLoading: boolean = true;
  public errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ViewPostedJobDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _naukriService: NaukriService,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    if (this.data && this.data.jobId) {
      this.loadJobDetails(this.data.jobId);
    } else {
      this.isLoading = false;
      this.errorMessage = 'Job ID not provided. Cannot fetch job details.';
    }
  }

  loadJobDetails(jobId: number): void {
    this.isLoading = true;
    this._naukriService.getJobDetails(jobId).subscribe(
      response => {
        this.isLoading = false;
        if (response) {
          this.jobDetails = response;
        } else {
          this.errorMessage = response.message || 'Failed to load job details';
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error fetching job details:', error);
        this.errorMessage = 'An error occurred while fetching job details';
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  showCourseType(val:any){
    return (val.map(eq => eq.courseType).filter((value, index, self) => value && self.indexOf(value) === index).join(', '))
  }
  showQualification(val:any){
    return (val.map(eq => eq.qualification).filter((value, index, self) => value && self.indexOf(value) === index).join(', '))
  }
  showPostingLocations(val:any){
    return (val.map(loc => loc.city).filter((city, idx, arr) => city && arr.indexOf(city) === idx).join(', '));
  }
}