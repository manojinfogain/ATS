import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LibCandidateService } from '../../../services/lib-candidate.service';
import { LibShareService } from '../../../services/lib-share.service';
import { LibGlobalCommonMethodService } from '../../../services/lib-global-common-method.service';
import { LibCandidateEducationDetailsFormModalComponent } from './lib-candidate-education-details-form-modal/lib-candidate-education-details-form-modal.component';
import { LibConfirmationDialogComponent } from '../../../shared/components/lib-confirmation-dialog/lib-confirmation-dialog.component';

@Component({
  selector: 'lib-candidate-education-details',
  templateUrl: './lib-candidate-education-details.component.html',
  styleUrls: ['./lib-candidate-education-details.component.scss']
})
export class LibCandidateEducationDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['courseName', 'specialization', 'duration', 'collegeName', 'universityName', 'yop', 'level', 'eduType', 'grade', 'gradeValue', 'action'];
  public isFinalSumbit:boolean = false;
  @Input() public apiBaseUrlMaster:string = '';
  @Input() public apiBaseUrlCand:string = '';
  constructor(
    public dialog: MatDialog,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService,
    private _globalMethod:LibGlobalCommonMethodService
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
    this._candidateServe.getEducationDetails(this.apiBaseUrlCand).subscribe(
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
    element['apiBaseUrlCand'] = this.apiBaseUrlCand;
    element['apiBaseUrlMaster'] = this.apiBaseUrlMaster;

    const dialogRef = this.dialog.open(LibCandidateEducationDetailsFormModalComponent, {
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
    element['apiBaseUrlCand'] = this.apiBaseUrlCand;
    element['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    const dialogRef = this.dialog.open(LibCandidateEducationDetailsFormModalComponent, {
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
        this._candidateServe.deleteEducationalDetails(this.apiBaseUrlCand,element.id,).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.getEducationDetails(true);
          }
        )
      }
    });
  }

}
