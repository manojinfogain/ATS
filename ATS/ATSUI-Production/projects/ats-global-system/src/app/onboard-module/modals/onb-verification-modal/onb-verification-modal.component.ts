import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';
import { OnboardService } from '../../onboard.service';

@Component({
  selector: 'app-onb-verification-modal',
  templateUrl: './onb-verification-modal.component.html',
  styleUrls: ['./onb-verification-modal.component.scss']
})
export class OnbVerificationModalComponent implements OnInit {
  public verificationForm:UntypedFormGroup = new UntypedFormGroup({});
  public userData: any = {};
  constructor(
    public dialogRef: MatDialogRef<OnbVerificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb:UntypedFormBuilder,
    private _storage: GetSetStorageService,
    private _onboardServ: OnboardService,
    private _share:ShareService
  ) { }

  ngOnInit(): void {
   this.userData= this._storage.getSetUserData();
   
    this.verificationForm = this._fb.group({
      status:['1',Validators.required],
      remarks:[null]
    })
  }

  /**
   * getControl
   */
  //control for form
  getControl(name: string) {
    return this.verificationForm.get(name);
  }

  /***
   * on RadioChange
   */
  getValueOnStatusChange(ev:any){
    
    if(this.data?.srcType != 'ONB' && this.data?.srcType != 'DAY1'){
      if(ev.value === 0 || ev.value === '0'){
        this.getControl('remarks').addValidators([Validators.required]);
      }
      else{
        this.getControl('remarks').clearValidators();
      }
      this.getControl('remarks').updateValueAndValidity();
    }
  }

  /***
   * submit
   */
  submitVerificationForm(form:UntypedFormGroup){
    this.data
    debugger
    if(form.valid){
      let formBody = form.value;
      formBody['Candidateid']=this.data.Candidateid;
      if(this.data?.srcType === 'ONB'){
        formBody['formId'] = this.data?.formTypeId;
        if(formBody['status'] == '1'){
          formBody['status'] = 'V';
        }   
        if(formBody['status'] == '0'){
          formBody['status'] = 'R';
        }        
        this._onboardServ.verificationOnboardingFormsByHr(formBody).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        })
      }
      else if(this.data?.srcType === 'DAY1'){
        formBody['formId'] = this.data?.formTypeId;
        if(formBody['status'] == '1'){
          formBody['status'] = 'V';
        }   
        if(formBody['status'] == '0'){
          formBody['status'] = 'R';
        }        
        this._onboardServ.verificationOnboardingFormsByHr(formBody).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        })
      }
      else if(this.data?.srcType === 'EAF'){
        formBody['type'] = this.data.type;
      //   if(this.userData?.EmpNewId == this.data?.candidateData?.primaryrecruiter || 
      //     this.userData?.EmpNewId == this.data?.candidateData?.secondaryrecruiter){
      //     formBody['ActionBy']= 'R';
      //   }
      //  else 
       if(this.userData?.RoleId == 1 || this.userData?.otherRoles?.IsHRAccess == 'Y'){
          formBody['ActionBy']= 'H';
        }
        else{
          formBody['ActionBy']= 'R';
        }
        this._onboardServ.verificationOnboardingByRecHr(formBody).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
        )
      }

  /***
   * Pending Docs
   */
     else if(this.data?.srcType === 'PEN'){
        formBody['id'] = this.data?.id;
        if(formBody['status'] == '1'){
          formBody['status'] = 'V';
        }   
        if(formBody['status'] == '0'){
          formBody['status'] = 'R';
        }        
        this._onboardServ.verifyPendingDocument(formBody).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        })
      }
    }
      else{
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
    
    
  }
  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
