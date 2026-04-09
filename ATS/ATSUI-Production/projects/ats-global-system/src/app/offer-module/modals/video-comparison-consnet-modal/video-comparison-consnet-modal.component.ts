import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from '../../offer.service';

@Component({
  selector: 'app-video-comparison-consnet-modal',
  templateUrl: './video-comparison-consnet-modal.component.html',
  styleUrls: ['./video-comparison-consnet-modal.component.scss']
})
export class VideoComparisonConsnetModalComponent implements OnInit {
   public videoComConsentGroup: UntypedFormGroup = new UntypedFormGroup({});
  
   constructor(
     public dialogRef: MatDialogRef<VideoComparisonConsnetModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public dialog: MatDialog,
     public _fb: UntypedFormBuilder,
     public _share: ShareService,
     private _offerServe: OfferService,
   ) { }
  
   ngOnInit(): void {
     this.formInit();
   }
 
 
   //formInit
   formInit() {
     this.videoComConsentGroup = this._fb.group({
      IsConsent:[null, [Validators.required]]
     })
   }

   //control for form
   getControl(name: string) {
    return this.videoComConsentGroup.get(name);
  }
 
   //submit data
   submitvideoComConsent(form: UntypedFormGroup) {
     form.markAllAsTouched();
     console.log('form data',form.value)
     this.data.cid;
     if (form.valid) {
       let formData = form.value;
       this.dialogRef.close(true);
       this._offerServe.updateConsetnByRecForVideoCompare(this.data.cid).subscribe(
         res => {
          // this._share.showAlertSuccessMessage.next(res);
           this.dialogRef.close(true);
         }
       )
     } else {
       this._share.showAlertErrorMessage.next('Please provide consent.');
     }
 
   }
 
   closeModal(): void {
     this.dialogRef.close();
   }

}
