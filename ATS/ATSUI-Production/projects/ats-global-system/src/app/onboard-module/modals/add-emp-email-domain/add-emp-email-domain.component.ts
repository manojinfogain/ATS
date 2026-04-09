import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { OnboardService } from '../../onboard.service';

@Component({
  selector: 'app-add-emp-email-domain',
  templateUrl: './add-emp-email-domain.component.html',
  styleUrls: ['./add-emp-email-domain.component.scss']
})
export class AddEmpEmailDomainComponent implements OnInit {
  public minDate: any = new Date();
  public joineeStatus: any = CONSTANTS.CandidateJoinStatusList;
  public joineeStatusForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<AddEmpEmailDomainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onBoardServe: OnboardService
  ) { }

  ngOnInit(): void {
    this.formInit();
  }

 public formControlValueChanged:number = 0;
  //formInit
  formInit() {
    let getUserName:string ='';
    let getEmailUserID:string = '';
    let OrgEmailPattern = /^[A-Za-z0-9.]*$/;
    if(this.data['domainId']){
      getUserName = /[^\\]*$/.exec(this.data['domainId'])[0];
    }
    if(this.data['orgEmail']){
      getEmailUserID = this.data['orgEmail'].substr(0, this.data['orgEmail'].indexOf('@'));
    }
    this.joineeStatusForm = this._fb.group({
      emailId: [this.data['key'] ===1?this.data['orgEmail']:null, [Validators.required,Validators.email]],
      domainId: [this.data['key'] ===1?getUserName:null, [Validators.required,Validators.pattern(OrgEmailPattern)]]
    });
    
     
    this.joineeStatusForm.valueChanges.subscribe(
      v=>{
        this.formControlValueChanged = Object.keys(this.getDirtyValues(this.joineeStatusForm)).length;
      }
    )
    
    
  }


  /**
   * blur
   * @param e 
   */
  blurEmail(e:any){
    let val = e.target.value;
    if(val){
      this.getControl('emailId').patchValue(val.replace(/\s/g, ''));
    }
  
  }

  //submit 
  submitJoineeStatusForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    let formData = form.value;
    if (form.valid) {
      // formData['cid'] = this.data.cid;
      formData['Candidateid'] = this.data.candidateId;
      if(this.data.updateByIssCount >= 1){
        this.confirmAlert(formData); 
      }
      else{
        this.saveRecord(formData);
      }
      
    //  this.confirmAlert(formData);

    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  /**
 * get new val
 * @param cg 
 */
   getDirtyValues(cg) {
    const dirtyValues = {};
    Object.keys(cg.controls).forEach(c => {
      const currentControl = cg.get(c);
  
      if (currentControl.dirty) {
        dirtyValues[c] = currentControl.value;
      }
    });
    return dirtyValues;
  }
  /**
   * save
   * @param data 
   * @param event 
   */
  saveRecord(data: any) {
    if(this.data['key'] === 1){
      this._onBoardServe.updateJoineeCandidateDetails(data).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else{
      this._onBoardServe.addJoineeCandidateDetails(data).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    
  }

  /***
   * confirmation before sumbit
   */

  confirmAlert(data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: `This is last chance to the update record. <br>Once updated, cannot to be changed.`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveRecord(data);
      }
    });
  }

  //control for form
  getControl(name: string) {
    return this.joineeStatusForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }
}
