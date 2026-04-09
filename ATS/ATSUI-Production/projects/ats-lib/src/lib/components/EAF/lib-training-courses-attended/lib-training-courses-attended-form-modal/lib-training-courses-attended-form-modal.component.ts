import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { LibCandidateService } from 'projects/ats-lib/src/lib/services/lib-candidate.service';
import { LibGlobalMethod } from 'projects/ats-lib/src/lib/services/lib-global-method';
import { LibShareService } from 'projects/ats-lib/src/lib/services/lib-share.service';

@Component({
  selector: 'lib-training-courses-attended-form-modal',
  templateUrl: './lib-training-courses-attended-form-modal.component.html',
  styleUrls: ['./lib-training-courses-attended-form-modal.component.scss']
})
export class LibTrainingCoursesAttendedFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public trainingFormGroup:UntypedFormGroup = new UntypedFormGroup({});
  public today = new Date();
  public apiBaseUrlCand:string = '';
  public apiBaseUrlMaster:string = '';
  constructor(
    public dialogRef: MatDialogRef<LibTrainingCoursesAttendedFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:UntypedFormBuilder,
    private _share:LibShareService,
    private _candidateServe: LibCandidateService
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.apiBaseUrlCand = this.data?.apiBaseUrlCand;
      this.apiBaseUrlMaster = this.data?.apiBaseUrlMaster;
      if(this.data.type === 'A'){
        this.trainingFormGroup = this.fb.group({
          courseName:[null,[Validators.required]],
          fromDate:[null,[Validators.required]],
          toDate:[null,[Validators.required]],
          instituteOrgName:[null,[Validators.required]],
          certificateAward:[null],
        })
      }
      else{
        let dataRow:any = this.data;
        this.trainingFormGroup = this.fb.group({
          courseName:[dataRow?.courseName?dataRow?.courseName:null,[Validators.required]],
          fromDate:[dataRow?.fromDate?new Date(dataRow?.fromDate):null,[Validators.required]],
          toDate:[dataRow?.toDate? new Date(dataRow?.toDate):null,[Validators.required]],
          instituteOrgName:[dataRow?.instituteOrgName?dataRow?.instituteOrgName:null,[Validators.required]],
          certificateAward:[dataRow?.certificateAward?dataRow?.certificateAward:null],
        })
      }
    }
   
  }

   //control for form
   getControl(name: string) {
    return this.trainingFormGroup.get(name);
  }

  /***
   * submit Form
   */

  formSubmit(form:UntypedFormGroup){
    if(form.valid){
       let formValue = form.value;
       if(formValue['fromDate']){
        formValue['fromDate']= LibGlobalMethod.formatDate(formValue['fromDate']);
       }
       if(formValue['toDate']){
        formValue['toDate']= LibGlobalMethod.formatDate(formValue['toDate']);
       }
       if(this.data.type === 'A'){
        this._candidateServe.addTrainingDetails(this.data?.apiBaseUrlCand,formValue).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
         )
       }
       else{
        this._candidateServe.updateTrainingDetails(this.data?.apiBaseUrlCand,formValue,this.data.id).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
         )
       }
      
    }
    else{
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      form.markAllAsTouched();
    }

  }

  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
