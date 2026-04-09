import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { SignatureCaptureComponent } from 'projects/ats-global-system-external/src/app/common-sharing/modal/signature-capture/signature-capture.component';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { CandidateService } from '../../../candidate.service';
import { environment } from 'projects/ats-global-system-external/src/environments/environment';
import { COMMON_CONST, COMPANY_LOC } from 'projects/ats-global-system-external/src/app/core/constant/common.const';


@Component({
  selector: 'app-sudexo-form',
  templateUrl: './sudexo-form.component.html',
  styleUrls: ['./sudexo-form.component.scss']
})
export class SudexoFormComponent implements OnInit {
  public todayDate = new Date();
  public currTime = this.todayDate.getHours()+':'+this.todayDate.getMinutes();
  public sodexoForm: UntypedFormGroup = new UntypedFormGroup({});
  public joinLocAddr:string = '';
  constructor(
    public dialogRef: MatDialogRef<SudexoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _candidateServe: CandidateService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getSignatureIfExist();
    this.getCompanyAddr();
  }

  ngAfterViewInit() {

  }

  getCompanyAddr(){
    if(this.data?.candidatePersonalDetails?.JoiningLocationID == 4){
      this.joinLocAddr = COMPANY_LOC.ADDR_BANGLORE;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 1){
      this.joinLocAddr = COMPANY_LOC.ADDR_NOIDA;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 5){
      this.joinLocAddr = COMPANY_LOC.ADDR_MUMBAI;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 2){
      this.joinLocAddr = COMPANY_LOC.ADDR_PUNE;
    }else if(this.data?.candidatePersonalDetails?.JoiningLocationID == 16){
      this.joinLocAddr = COMPANY_LOC.ADDR_GURUGRAM_ADT;
    }
    else{

    }
  }

// check if sign exist for this form
  getSignatureIfExist() {
    if(this.data?.SignatureFilePath){
      this.http.get(`${environment.apiMainUrlNet}Candidate/Downloadfiles?filePath=${this.data?.SignatureFilePath}`, { responseType: 'blob' }).subscribe(
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
    this.sodexoForm = this._fb.group({
      SudexoBenefit: [this.data?.SudexoBenefit ? this.data?.SudexoBenefit : null,[Validators.required]],
      SudexoAmount: (this.data?.SudexoAmount ? this.data?.SudexoAmount.toString() : null),
      paytmNumberForSodexo: [this.data?.PaytmMobileNumber ? this.data?.PaytmMobileNumber :null, [Validators.minLength(10), Validators.maxLength(10)]]
    });
    if(this.data?.SudexoBenefit){
      this.selectIsSodexo(this.data?.SudexoBenefit);
    }
  }


  public isAmountVisible:boolean = true;
  selectIsSodexo(e:string){
    let SudexoAmountCtrl = this.getControl('SudexoAmount');
    if(e == 'Y'){
      this.isAmountVisible = true;
      SudexoAmountCtrl.setValidators([Validators.required]);
    }else{
      SudexoAmountCtrl.clearValidators();
      SudexoAmountCtrl.reset();
      this.isAmountVisible = false;
    }
    SudexoAmountCtrl.updateValueAndValidity();
  }

  //get control name
  getControl(name: string) {
    return this.sodexoForm.get(name);
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
   * submit sudexo form
   */
  
   submitSodexoForm(form: any) {
    
        form.markAllAsTouched();
        if (this.sodexoForm.valid) {
          if(this.signImage){
            let body = form.value;
         //   body['cid'] = this.data?.candidatePersonalDetails?.cid;
            body['Candidateid'] = this.data?.candidateId;
            body['FormId'] = this.data?.formTypeId;
            body['signFileName'] = this.signFileName;
            body['signFilePath'] = this.signFilePath;
            if(body['SudexoAmount']){
              body['SudexoAmount'] = parseInt(body['SudexoAmount']);
            }
            if(body['paytmNumberForSodexo']){
              body['PaytmMobileNumber'] = body['paytmNumberForSodexo'];
            }
            body['status'] = 'D';
            this._candidateServe.UpdateSudexoForm(body).subscribe(
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

   /***
   * close modal
   */
   closeModal(): void {
    this.dialogRef.close();
  }


}

