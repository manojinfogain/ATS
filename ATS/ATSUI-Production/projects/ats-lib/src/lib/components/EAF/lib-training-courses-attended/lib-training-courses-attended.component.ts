import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LibCandidateService } from '../../../services/lib-candidate.service';
import { LibShareService } from '../../../services/lib-share.service';
import { LibGlobalCommonMethodService } from '../../../services/lib-global-common-method.service';
import { LibTrainingCoursesAttendedFormModalComponent } from './lib-training-courses-attended-form-modal/lib-training-courses-attended-form-modal.component';
import { LibConfirmationDialogComponent } from '../../../shared/components/lib-confirmation-dialog/lib-confirmation-dialog.component';

@Component({
  selector: 'lib-training-courses-attended',
  templateUrl: './lib-training-courses-attended.component.html',
  styleUrls: ['./lib-training-courses-attended.component.scss']
})
export class LibTrainingCoursesAttendedComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['courseName', 'duration','instituteOrgName','certificateAward','action'];
  public candidateTrainingList:any = [];
  @Input() public apiBaseUrlMaster:string = '';
  @Input() public apiBaseUrlCand:string = '';
  constructor(
    public dialog: MatDialog,
    private _candidateServe: LibCandidateService,
    private _share:LibShareService,
    private _globalMethod:LibGlobalCommonMethodService

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
   
     this._candidateServe.getTrainingDetails(this.apiBaseUrlCand).subscribe(
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
    element['apiBaseUrlCand'] = this.apiBaseUrlCand;
    element['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    
    const dialogRef = this.dialog.open(LibTrainingCoursesAttendedFormModalComponent, {
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
    const dialogRef = this.dialog.open(LibConfirmationDialogComponent, {
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
        this._candidateServe.deleteTrainingDetails(this.apiBaseUrlCand,element.id).subscribe(
         res=>{
            this._share.showAlertSuccessMessage.next(res);
            this.getTrainingDetails();
         }
        )
     }
   });
}


}
