import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-interal-available-resource-modal',
  templateUrl: './interal-available-resource-modal.component.html',
  styleUrls: ['./interal-available-resource-modal.component.scss']
})
export class InteralAvailableResourceModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InteralAvailableResourceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
   displayedColumns: string[] = [
    'EmpID',
    'Name',
    //'TotalExperience',
    'Grade',
    'TotalExperience',
    'EmployeePrimarySkill',
    'EmployeeSecondarySkill',
   // 'EmployeeLocation',
    //'Th_ID',
   // 'DemandPrimarySkill',
    //'DemandMandatorySkill',
    //'DemandExperience',
   // 'DemandGrade'
  ];
  public dataResource =  [];
  ngOnInit(): void {
    this.dataResource = this.data?.EmployeeData || [];
    debugger
  
  }

 

  closeModal(): void {
    this.dialogRef.close();
  }

}
