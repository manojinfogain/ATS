import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OnboardService } from '../../../onboard.service';

@Component({
  selector: 'app-leadership-upload-offer-details-modal',
  templateUrl: './leadership-upload-offer-details-modal.component.html',
  styleUrls: ['./leadership-upload-offer-details-modal.component.scss']
})
export class LeadershipUploadOfferDetailsModalComponent implements OnInit {

  public uploadOfferForm: UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  imgFile: any;
  imgSrc: any;
  constructor(
    public dialogRef: MatDialogRef<LeadershipUploadOfferDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _globalApiServe: GlobalApisService,
    public _globalApi: GlobalApisService,
    public _share: ShareService,
    private _storage: GetSetStorageService,
    private _onboard: OnboardService
  ) { }

  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    this.updateForm();

  }


  public minDate: any = new Date();
  public maxDate: any = new Date();
  //form control
  updateForm() {
    this.uploadOfferForm = this._fb.group({
      fileOffer: [null, Validators.required],
      uploadAcceptanceFile: [null],
      offerNumber: [null, Validators.required]
    })
  }


  //control for form
  getControl(name: string) {
    return this.uploadOfferForm.get(name);
  }


  public offerLetterFile: any = {};
  selectOfferletter(event: any) {
    this.getControl('fileOffer').reset();
    this.offerLetterFile = null;
    let allowedExtensions = /(\.pdf)$/i;
    let files = event.target.files[0];
    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type pdf only.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;

    }
    else {
      this.offerLetterFile = files;
      this.getControl('fileOffer').patchValue('files');
    }

  }

  get resumeControl() { return this.uploadOfferForm.get('uploadAcceptanceFile'); };
  fileUpAcceptance(event) {
    // let allowedExtensions = /(\.jpg|\.jpeg|\.tiff)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let file = event.target.files[0];
    this.imgFile = file;
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.resumeControl.patchValue(null);
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.resumeControl.patchValue(null);
      return false;
    }
    else {
      this.resumeControl.patchValue(this.imgFile);

    }
  }

  //update  submit 
  public offerNumber: string = '';
  updateOfferHandler(form: UntypedFormGroup) {
    if (form.valid) {
      let formData = form.value;
      let formOffer = new FormData();
      formOffer.append('CandidateId', this.data?.CandidateId);
      formOffer.append('CandidateName', this.data?.Name);
      formOffer.append('OfferDocument', this.offerLetterFile);
     
      if(formData.offerNumber){
        formOffer.append('OfferNumber', formData.offerNumber);
      }
      
      if (this.imgFile) {
        formOffer.append('OfferAcceptanceDocument', this.imgFile);
      }
      // formOffer.append('ModifiedOnUTC', GlobalMethod.convertToUTCDate(new Date()));
      // formOffer.append('ModifiedOnTimeZone', GlobalMethod.getTimezone());
      // formOffer.append('ModifiedOnOffsetDate', GlobalMethod.getOffset().toString());
      this._onboard.upploadOfferLeadership(formOffer).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      );
    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Offer letter is required.");
    }
  }


  closeModal(): void {
    this.dialogRef.close();
  }



}
