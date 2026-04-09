import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { ShareService } from '../../../core/services/share.service';
import { OnboardService } from '../../onboard.service';
@Component({
  selector: 'app-upload-send-appointment-letter-modal',
  templateUrl: './upload-send-appointment-letter-modal.component.html',
  styleUrls: ['./upload-send-appointment-letter-modal.component.scss']
})
export class UploadSendAppointmentLetterModalComponent implements OnInit {
  public upladFilesForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<UploadSendAppointmentLetterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onboard: OnboardService,
  ) { }

  ngOnInit(): void {   
    /***
     * FormInit
     */

    this.upladFilesForm = this._fb.group(
      {
        fileControl: [null, Validators.required],
      }
    )
  }

  /***
  * upload option
  */
   public canApptLtr: any;
   fileUpload(event) {
     this.canApptLtr = '';
     let allowedExtensions = /(\.PDF|\.pdf)$/i;
     let file = event.target.files[0];
     let fileName = file?.name;
 
     this.upladFilesForm.markAllAsTouched();
     if (!allowedExtensions.exec(fileName)) {
       this._share.showAlertErrorMessage.next('Please upload file type .pdf only.');
       event.target.value = "";
       this.canApptLtr = '';
       this.getControl('fileControl').reset();
       return false;
     }
     else if (file.size > FILE_UPLOAD.FILE_SIZE) {
       this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
       event.target.value = "";
       this.canApptLtr = '';
       this.getControl('fileControl').reset();
       return false;
     }
     else {
       this.canApptLtr = file; 
     }
   }



  getControl(name: string) {
    return this.upladFilesForm.get(name);
  }

  /**
   * submit
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    
    if (form.valid) {
      let body = new FormData();
      if(this.data?.cid){
        // body.append('cid',this.data.cid) ;
        body.append('Candidateid',this.data?.Candidate_Id) ;
      }
      if(this.canApptLtr){
        body.append('file',this.canApptLtr) ;
      }
        this._onboard.SaveAndSentAppoimentLetter(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
        )
    }
    else {
      if (this.getControl('fileControl').invalid) {
        this._share.showAlertErrorMessage.next('Please upload candidate Appointment Letter.')
      }
      else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    }

  }
  closeModal(): void {
    this.dialogRef.close();
  } 

}

