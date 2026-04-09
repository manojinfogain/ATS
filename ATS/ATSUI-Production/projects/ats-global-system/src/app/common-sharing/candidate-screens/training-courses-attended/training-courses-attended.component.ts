import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateEducationDetailsFormModalComponent } from '../candidate-education-details/candidate-education-details-form-modal/candidate-education-details-form-modal.component';
import { TrainingCoursesAttendedFormModalComponent } from './training-courses-attended-form-modal/training-courses-attended-form-modal.component';

@Component({
  selector: 'app-training-courses-attended',
  templateUrl: './training-courses-attended.component.html',
  styleUrls: ['./training-courses-attended.component.scss']
})
export class TrainingCoursesAttendedComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Category', 'duration', 'institudeOrganuzation', 'WhetherCerticateAward'];
  candidateList = [
  ]
  @Input() public trainingCoursesList: any = [];
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  /***
   * add Family Member
   */
  addEducationDetails(element: any = {}): void {
    element['title'] = "Training Courses Attended";
    const dialogRef = this.dialog.open(TrainingCoursesAttendedFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
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
