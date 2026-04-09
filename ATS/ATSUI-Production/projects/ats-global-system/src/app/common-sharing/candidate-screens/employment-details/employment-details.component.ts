import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { EmploymentDetailsFormModalComponent } from './employment-details-form-modal/employment-details-form-modal.component';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss']
})
export class EmploymentDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Category', 'Location','city', 'EmployerType', 'Industry', 'Designation', 'FunctionName', 'Skill', 'ProjectName', 'ProjectDescription',
    'duration', 'ClientName', 'JoiningCTC', 'leavingCTC', 'ReasonForLeaving'];
 @Input() public employmentList: any = [];
  candidateList = [
  ]
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
   
  }

  /***
   * add Family Member
   */
  addEducationDetails(element: any = {}): void {
    element['title'] = " Add  Employment Details";
    const dialogRef = this.dialog.open(EmploymentDetailsFormModalComponent, {
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
