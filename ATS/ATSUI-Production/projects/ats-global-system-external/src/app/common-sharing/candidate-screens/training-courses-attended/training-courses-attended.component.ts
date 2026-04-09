import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { TrainingCoursesAttendedFormModalComponent } from './training-courses-attended-form-modal/training-courses-attended-form-modal.component';

@Component({
  selector: 'app-training-courses-attended',
  templateUrl: './training-courses-attended.component.html',
  styleUrls: ['./training-courses-attended.component.scss']
})
export class TrainingCoursesAttendedComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['courseName', 'duration','instituteOrgName','certificateAward','action'];
  public candidateTrainingList:any = [];
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share:ShareService,
    private _globalMethod:GlobalCommonMethodService

  ) { }
  public isFinalSumbit:boolean = false;
  ngOnInit(): void {
    this.getTrainingDetails();
    if(this._globalMethod.isFinalSubmit()){
      this.isFinalSumbit= true;
      this.displayedColumns.pop();
    }
  }

  /***
     * get Taring Details
     */
   getTrainingDetails(){
   
     this._candidateServe.getTrainingDetails().subscribe(
      res=>{
         this.candidateTrainingList = res['data'];
      }
    )
  }

  /***
   * add Training Member
   */
  addTainingDetails(element: any = {},type:string = 'A'): void {
    element['type'] = type;
    if(type == 'A'){
      element['title'] = "Training Courses Attended";
    }
    else{
      element['title'] = "Training Courses Attended";
    }
    
    const dialogRef = this.dialog.open(TrainingCoursesAttendedFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getTrainingDetails();
        }
      }
    )
  }

  /***
   * Delete training
   */
   deleteTraining(element:any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
     panelClass: 'ats-confirm',
     data: {
       headerText: 'Alert',
       message: ` Are you sure you want to delete?`,
       buttonText: {
         ok: "Yes",
         cancel: "No"
       },
     }
   });
   dialogRef.afterClosed().subscribe(result => {
     if (result) {
        this._candidateServe.deleteTrainingDetails(element.id).subscribe(
         res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.getTrainingDetails();
         }
        )
     }
   });
}


}
