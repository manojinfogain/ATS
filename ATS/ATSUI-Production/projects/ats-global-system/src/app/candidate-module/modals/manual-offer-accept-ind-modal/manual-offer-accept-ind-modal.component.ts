import { Component, Inject, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../candidate.service';
import { SignatureCaptureComponent } from '../../../common-sharing/modals/signature-capture/signature-capture.component';
import { SignatureGlobalCComponent } from '../../../common-sharing/modals/signature-global-c/signature-global-c.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { ShareService } from '../../../core/services/share.service';
import { FormControModalComponent } from '../form-contro-modal/form-contro-modal.component';
import { DatePipe } from '@angular/common';
import { FILE_UPLOAD, ONB_FILE_UPLOAD } from '../../../core/constant/common.const';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver";
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Component({
  selector: 'app-manual-offer-accept-ind-modal',
  templateUrl: './manual-offer-accept-ind-modal.component.html',
  styleUrls: ['./manual-offer-accept-ind-modal.component.scss']
})
export class ManualOfferAcceptIndModalComponent implements OnInit {

  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public offerLetterForm: UntypedFormGroup = new UntypedFormGroup({});
  public isHideAll: boolean = true;
  public offerTemplates: any = [];
  constructor(
    public dialogRef: MatDialogRef<ManualOfferAcceptIndModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _candServe: CandidateService,
    private elRef: ElementRef, private renderer: Renderer2,
    public dialog: MatDialog,
    private _share: ShareService,
    private fb:UntypedFormBuilder,
    private http: HttpClient
  ) {
  }

  


  ngOnInit(): void {
    this.offerLetterForm = this.fb.group({
      iConfirmedCheckBox: [null, [Validators.required]],
      fileOffer: [null, [Validators.required]],
    })
  }

 
  public offerLtterFile:any = {};
  selectOfferletter(event: any) {
    this.getControl('fileOffer').reset();
    this.offerLtterFile = null;
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
     // this.offerLtterFile = null;
      this.getControl('fileOffer').reset();
      return false;

    }
    else {
      this.offerLtterFile = files;
     this.getControl('fileOffer').patchValue('files');
    }
   
  }
  
  

  getControl(name: string) {
    return this.offerLetterForm.get(name);
  }


  /***
 * downloadOfferletter
 */
downloadOfferletter() {
  let today = new Date();
  let todayDate = GlobalMethod.formatDate(today);
  this.http.get(`${environment.apiMainUrlNet}Candidate/DownloadOfferInd?param=${this.data.paramCid}&authKey=${this.data.AuthKey}`, { responseType: 'blob' }).subscribe(
    res => {
      saveAs(res, 'offer_letter_' + this.data?.candidateDetails?.Name + '_' + todayDate + '.pdf');
      this._share.showAlertSuccessMessage.next('Offer letter  downloaded successfully.')
    }
  )
}

  /**
   * final submit 
   */
  submitRequest(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let body = new FormData();
      body.append('param', this.data.paramCid);
      body.append('JoiningDate', GlobalMethod.formatDate(this.data.joiningDate));
      body.append('AuthKey', this.data.AuthKey);
      if (this.offerLtterFile) {
        body.append('file', this.offerLtterFile);
      }
      this._candServe.uploadOfferLetter(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close({type:'A'});
        }
      );
    }
    else {
        if(form.get('fileOffer').invalid){
          this._share.showAlertErrorMessage.next('Please upload offer letter.');
        }
        else if(form.get('iConfirmedCheckBox').invalid){
          this._share.showAlertErrorMessage.next('Please check the confirmation checkbox.');
        }
        else{
          this._share.showAlertErrorMessage.next('Please fill the required fields.');
        }
    }  
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
