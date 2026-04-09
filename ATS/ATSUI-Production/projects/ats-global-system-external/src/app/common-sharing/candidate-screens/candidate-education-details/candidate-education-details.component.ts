import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateEducationDetailsFormModalComponent } from './candidate-education-details-form-modal/candidate-education-details-form-modal.component';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';

@Component({
  selector: 'app-candidate-education-details',
  templateUrl: './candidate-education-details.component.html',
  styleUrls: ['./candidate-education-details.component.scss']
})
export class CandidateEducationDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  @Input() isLeadershipOnboard:boolean = false;
  private candidateId =  this._storage.getCandidateId();
  displayedColumns = ['courseName', 'specialization', 'duration', 'collegeName', 'universityName', 'yop', 'level', 'eduType', 'grade', 'gradeValue', 'action'];
  public isFinalSumbit:boolean = false;
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _globalMethod:GlobalCommonMethodService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.getEducationDetails();
    if(this._globalMethod.isFinalSubmit()){
      this.isFinalSumbit= true;
      this.displayedColumns.pop();
    }
  }

  // get education details 
  public isMatric:boolean = false;
  public educationDetailsList: any = [];
  getEducationDetails(page:boolean = false) {
    this._candidateServe.getEducationDetails(this.candidateId).subscribe(
      res => {
        this.educationDetailsList = res['data'];
        this.educationDetailsList?.forEach(element => {
          if(element?.courseId == 12){
            this.isMatric = true;
          }
        });
        if(page == true){
          this._share.activeTabDetection.next(true);
        }
      }
    )
  }

  /***
   * add Education Details
   */
  addEducationDetails(element: any = {}): void {
    element['title'] = " Add Education Details";
    element['type'] = 1;
    element['isMatric'] = this.isMatric;
    element['educationList'] = this.educationDetailsList;
    element['isLeadershipOnboard'] = this.isLeadershipOnboard;
debugger
    const dialogRef = this.dialog.open(CandidateEducationDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getEducationDetails(true);
        }
      }
    )
  }

  /***
   * update Education Details
   */
  updateEducationDetails(element: any = {}): void {
    element['title'] = " Update Education Details";
    element['type'] = 2;
    const dialogRef = this.dialog.open(CandidateEducationDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getEducationDetails(true);
        }
      }
    )
  }

  /***
   * Delete Education details
   */
  deleteEducationDetails(element: any) {
    
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
        this._candidateServe.deleteEducationalDetails(element.id,).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.getEducationDetails(true);
          }
        )
      }
    });
  }

}
