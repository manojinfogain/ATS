import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { ONB_FILE_UPLOAD } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../../candidate.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system-external/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-upload-document-modal',
  templateUrl: './upload-document-modal.component.html',
  styleUrls: ['./upload-document-modal.component.scss']
})
export class UploadDocumentModalComponent implements OnInit {

  public uploadDocumentForm: UntypedFormGroup;

  public disablePastDate: any = new Date(new Date().setDate(new Date().getDate()));
  constructor(
    public dialogRef: MatDialogRef<UploadDocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    public dialog: MatDialog,
    private _commonMethodServe: GlobalCommonMethodService,
    private _candidateServe: CandidateService,
  ) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.uploadDocumentForm = this._fb.group({
      uploadForm: [null, [Validators.required]],
    })
  }

  getControl(name: string) {
    return this.uploadDocumentForm.get(name);
  }

  public uploadForm: any;
  // public base64File: any;
  fileUpload(event) {
    this.uploadForm = '';
    let allowedExtensions = /(\.doc|\.DOC|\.dot|\.DOT|\.PDF|\.pdf|\.DOCX|\.docx|\.xlsx)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.getControl('uploadForm').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type .doc\.DOC\.dot\.DOT\.PDF\.pdf\.DOCX\.docx\.xlsx only.');
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else if (file.size > ONB_FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 5MB.');
      event.target.value = "";
      this.uploadForm = '';
      return false;
    }
    else {
      this.uploadForm = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const blob = this._commonMethodServe.base64toBlob(reader.result);
      }
    }
  }

  
  confirmAlertSubmit(form: UntypedFormGroup) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: `Are you sure and want to submit? Please verify the document carefully then submit. <br>Once submitted, it cannot to be changed.`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.uploadDocumentHandler(form);
      }
    });

  }
  /***
  * submit upload doc Form
  */
  uploadDocumentHandler(form: any) {
    form.markAllAsTouched();
    if (this.uploadDocumentForm.valid) {
      let body = new FormData();
      debugger
      // if (this.data?.cid) {
      //   body.append('cid', this.data.cid);
      // }
      if (this.data?.candidateId) {
        body.append('Candidateid', this.data.candidateId);
      }
      if (this.data?.id) {
        body.append('ID', this.data.id);
      }
      if (this.data?.DocId) {
        body.append('DocID', this.data.DocId);
      }
      body.append('ActionTaken', 'S');
      // body.append('ConcentSignOff', '1');
      if (this.uploadForm) {
        body.append('file', this.uploadForm);
      }
      this._candidateServe.SaveOrSubmitPendingDocument(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          //this.uploadDocumentForm.reset();
          this.dialogRef.close(true);

        }
      );
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill the required fields.');
    }
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

}
