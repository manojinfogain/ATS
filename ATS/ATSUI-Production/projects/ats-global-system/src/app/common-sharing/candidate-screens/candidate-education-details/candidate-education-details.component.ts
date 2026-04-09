import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateEducationDetailsFormModalComponent } from './candidate-education-details-form-modal/candidate-education-details-form-modal.component';

@Component({
  selector: 'app-candidate-education-details',
  templateUrl: './candidate-education-details.component.html',
  styleUrls: ['./candidate-education-details.component.scss']
})
export class CandidateEducationDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Category', 'specialization', 'duration', 'collegeName', 'universityName', 'passingYear',
    'educationLevel', 'educationType', 'Grade', 'gradeValue'];
  candidateList = [{}
  ]
 @Input() public candidateEducationDetails: any = []
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  /***
   * add Family Member
   */
  addEducationDetails(element: any = {}): void {
    element['title'] = " Add Education Details";
    const dialogRef = this.dialog.open(CandidateEducationDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
        }
      }
    )
  }

}
