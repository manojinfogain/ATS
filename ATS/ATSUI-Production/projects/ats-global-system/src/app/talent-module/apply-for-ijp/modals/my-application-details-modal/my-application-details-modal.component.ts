import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TalentService } from '../../../talent.service';

@Component({
  selector: 'app-my-application-details-modal',
  templateUrl: './my-application-details-modal.component.html',
  styleUrls: ['./my-application-details-modal.component.scss']
})
export class MyApplicationDetailsModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MyApplicationDetailsModalComponent>,
    private _talentServ: TalentService
  ) { }

  ngOnInit(): void {
    this.getIjpApplicationDetails();
  }
  public applicationDetails: any;
  aboutText: string = `I have strong expertise in Angular, building responsive and dynamic web applications. I am skilled in Angular Material, forms, routing, and component-based architecture. My experience includes integrating REST APIs and optimizing performance for scalable apps. I write clean, maintainable code following best practices and reusable design patterns. I am comfortable working with TypeScript, RxJS, and modern front-end tooling. I collaborate well with teams, understand business requirements, and deliver on deadlines. My focus is always on creating user-friendly, high-quality solutions that add value.`;

getParagraphs() {
  return this.aboutText.split(',').map(line => line.trim());
}

  /***
    * get Details
    */
  getIjpApplicationDetails() {
    if (this.data) {
      this._talentServ.getMyApplicationDetails(this.data.thId, this.data.selectedEmployeeId).subscribe(
        res => {
          this.applicationDetails = res['data'][0];
        }
      )
    }

  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
