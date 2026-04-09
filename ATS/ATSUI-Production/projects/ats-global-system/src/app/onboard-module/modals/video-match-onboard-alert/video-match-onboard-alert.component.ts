import { Component, Inject, OnInit,ViewChild,ElementRef } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from 'projects/ats-global-system/src/app/onboard-module/onboard.service';


@Component({
  selector: 'app-video-match-onboard-alert',
  templateUrl: './video-match-onboard-alert.component.html',
  styleUrls: ['./video-match-onboard-alert.component.scss']
})
export class VideoMatchOnboardAlertComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<VideoMatchOnboardAlertComponent>,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
   
  }

  
  

  /***
   * close Modal
   */
  closeModal(): void {
    this.dialogRef.close(false);
   
  }


}
