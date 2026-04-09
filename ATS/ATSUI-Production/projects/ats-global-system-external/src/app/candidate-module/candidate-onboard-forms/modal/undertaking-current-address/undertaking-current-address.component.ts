import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system-external/src/app/common-sharing/modal/signature-capture/signature-capture.component';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';


@Component({
  selector: 'app-undertaking-current-address',
  templateUrl: './undertaking-current-address.component.html',
  styleUrls: ['./undertaking-current-address.component.scss']
})
export class UndertakingCurrentAddressComponent implements OnInit {
  public currAddUndertakingForm: UntypedFormGroup = new UntypedFormGroup({});
  public todayDate = new Date();
  public fullName: string = `${(this.data?.candidatePersonalDetails?.FirstName ? this.data?.candidatePersonalDetails?.FirstName : '')} ${(this.data?.candidatePersonalDetails?.MiddleName ? this.data?.candidatePersonalDetails?.MiddleName : '')} ${(this.data?.candidatePersonalDetails?.LastName ? this.data?.candidatePersonalDetails?.LastName : '')}`;
  // public name:string = `${(this.data?.candidatePersonalDetails?.FirstName ? this.data?.candidatePersonalDetails?.FirstName : '')} ${(this.data?.candidatePersonalDetails?.MiddleName ? this.data?.candidatePersonalDetails?.MiddleName : '') (this.data?.candidatePersonalDetails?.LastName ? this.data?.candidatePersonalDetails?.LastName : '')}`
  public addressLine1: string = `${(this.data?.candidatePersonalDetails?.AddressLine1 ? this.data?.candidatePersonalDetails?.AddressLine1 : '')},
  ${(this.data?.candidatePersonalDetails?.AddressLine2 ? this.data?.candidatePersonalDetails?.AddressLine2 : '')},${(this.data?.candidatePersonalDetails?.AddressLine3 ? this.data?.candidatePersonalDetails?.AddressLine3 : '')}`;
  public addressLine2: string = `${(this.data?.candidatePersonalDetails?.cr_city ? this.data?.candidatePersonalDetails?.cr_city : '')},
  ${(this.data?.candidatePersonalDetails?.cr_state ? this.data?.candidatePersonalDetails?.cr_state : '')},${(this.data?.candidatePersonalDetails?.cr_countryName ? this.data?.candidatePersonalDetails?.cr_countryName : '')},${(this.data?.candidatePersonalDetails?.cr_postalCode ? this.data?.candidatePersonalDetails?.cr_postalCode : '')}`;
  public candSign: any = {};
  constructor(
    public dialogRef: MatDialogRef<UndertakingCurrentAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.data;
    debugger
    this._candidateServe.getCandidateSignature(this.data?.candidateId).subscribe(
      res => {
        this.candSign = res['data'];
      }
    );
    this.getSignatureIfExist();
  }

  ngAfterViewInit() {
  }

  getSignatureIfExist() {
    let signType= 'C'
    if(this.data?.SignatureFilePath){
      debugger
      // Candidate/Downloadfiles?filePath=${this.data?.SignatureFilePath}
      this.http.get(`${environment.apiMainUrlNet}Candidate/downloadSignature?id=${this.data?.id}&signType=${signType}`, { responseType: 'blob' }).subscribe(
        res => {
          let reader = new FileReader();
          let imgUrl
          reader.readAsDataURL(res);
          reader.onload = () => {
            imgUrl = reader.result;
            this.signImage = imgUrl.replace('data:application/octet-stream;base64,', 'data:image/png;base64,');       
            this.signFileName = this.data?.SignatureFileName;
            this.signFilePath = this.data?.SignatureFilePath;
          }
        },
        (error) => {
          // this._share.showAlertErrorMessage.next('Something went wrong');
        }
      )
    }
  }

  //init form
  formInit() {
    this.currAddUndertakingForm = this._fb.group({
    })
  }

  //get control name
  getControl(name: string) {
    return this.currAddUndertakingForm.get(name);
  }

  /***
   * submit personal info form
   */
   submitCurrAddUndertakingForm(form: any) {
    
        form.markAllAsTouched();
        // this.currAddUndertakingForm.markAllAsTouched();
        if (this.currAddUndertakingForm.valid) {
          if(this.signImage){
            let body = {};
            // body['cid'] = this.data?.candidatePersonalDetails?.cid;
            body['Candidateid'] = this.data?.candidateId;
            body['FormId'] = this.data?.formTypeId;
            body['signFileName'] = this.signFileName;
            body['signFilePath'] = this.signFilePath;
            body['JoiningReportFillDate'] = GlobalMethod.formatDate(this.todayDate);
            body['status'] = 'D';
            this._candidateServe.updateUndertakingCurrentAddressProofForm(body).subscribe(
              res => {
                this._share.showAlertSuccessMessage.next(res);
                this.dialogRef.close(true);
              }
            );
          }else{
            this._share.showAlertErrorMessage.next('Please sign this document.');  
          }    
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
        }
  }

  public signFileName:string = '';
  public signFilePath:string = '';
  signImage:any;
  signt(element: any = {}): void {
    element['titleSignModal'] = " Add Signature";

    const dialogRef = this.dialog.open(SignatureCaptureComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result?.signImage) {
          this.signImage = result?.signImage;
          this.signFileName = result?.signFileName;
          this.signFilePath = result?.signFilePath;
        }
      }
    )
  }

   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close();
  }

}
