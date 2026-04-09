import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-training-courses-attended-form-modal',
  templateUrl: './training-courses-attended-form-modal.component.html',
  styleUrls: ['./training-courses-attended-form-modal.component.scss']
})
export class TrainingCoursesAttendedFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public trainingFormGroup:UntypedFormGroup = new UntypedFormGroup({});
  public today = new Date();
  private candidateId =  this._storage.getCandidateId();
  constructor(
    public dialogRef: MatDialogRef<TrainingCoursesAttendedFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:UntypedFormBuilder,
    private _share:ShareService,
    private _candidateServe: CandidateService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    if(this.data){
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
        formValue['fromDate']= GlobalMethod.formatDate(formValue['fromDate']);
       }
       if(formValue['toDate']){
        formValue['toDate']= GlobalMethod.formatDate(formValue['toDate']);
       }
       formValue['Candidateid']= this.candidateId ? this.candidateId : '';
       if(this.data.type === 'A'){
        this._candidateServe.addTrainingDetails(formValue).subscribe(
          res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);
          }
         )
       }
       else{
        this._candidateServe.updateTrainingDetails(formValue,this.data.id).subscribe(
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
