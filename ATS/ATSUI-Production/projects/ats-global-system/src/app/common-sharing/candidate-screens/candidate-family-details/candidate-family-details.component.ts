import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateFamilyDetailsFromModalComponent } from './candidate-family-details-from-modal/candidate-family-details-from-modal.component';

@Component({
  selector: 'app-candidate-family-details',
  templateUrl: './candidate-family-details.component.html',
  styleUrls: ['./candidate-family-details.component.scss']
})
export class CandidateFamilyDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Relationship', 'Name', 'dob','age', 'Occupation', 'Dependent', 'isMinor', 'gender', 'address', 'guardianName', 'guardianAddress', 'orgName', 'currentLocation'];
  @Input() public familyDetailsList:any=[];
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  /***
   * add Family Member
   */
  addFamilyMember(element: any = {}): void {
    element['title'] = "Add Family Member";
    const dialogRef = this.dialog.open(CandidateFamilyDetailsFromModalComponent, {
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
   //to show the age of the candidate
   calculateAge(val:any){
    if(val){
      let birthDate = new Date(val);
      let timeDiff = Math.abs(Date.now() - birthDate?.getTime());
      let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
      return `${age} years`;
    }else{      
      return `-`;
    }
  }
}
