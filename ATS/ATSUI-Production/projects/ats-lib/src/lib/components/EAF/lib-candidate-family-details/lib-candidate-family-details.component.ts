import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LibCandidateService } from '../../../services/lib-candidate.service';
import { LibShareService } from '../../../services/lib-share.service';
import { LibGlobalCommonMethodService } from '../../../services/lib-global-common-method.service';
import { LibCandidateFamilyDetailsFromModalComponent } from './lib-candidate-family-details-from-modal/lib-candidate-family-details-from-modal.component';
import { LibConfirmationDialogComponent } from '../../../shared/components/lib-confirmation-dialog/lib-confirmation-dialog.component';
@Component({
  selector: 'lib-candidate-family-details',
  templateUrl: './lib-candidate-family-details.component.html',
  styleUrls: ['./lib-candidate-family-details.component.scss']
})
export class LibCandidateFamilyDetailsComponent implements OnInit, AfterViewInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public familyDetailsList: any = [];
  @Output() getFamilyValid = new EventEmitter<boolean>();
  displayedColumns = ['Relationship', 'Name', 'dob','age', 'Occupation', 'Dependent', 'isMinor', 'gender', 'address', 'guardianName', 'guardianAddress', 'orgName', 'currentLocation', 'action'];
  @Input() public candidatePersonalDetails: any = {};
  @Input() public candidateTabConfig: any = {};
  @Input() public apiBaseUrlMaster:string = '';
  @Input() public apiBaseUrlCand:string = '';
  public getIds: any[];
  constructor(
    public dialog: MatDialog,
    private _candidateServe: LibCandidateService,
    private _share: LibShareService,
    private _globalMethod:LibGlobalCommonMethodService
  ) { }
   public isFinalSumbit:boolean = false;
  ngOnInit(): void {
    this.getCandidateFamilyDetailsList();
    if(this._globalMethod.isFinalSubmit()){
      this.isFinalSumbit= true;
      this.displayedColumns.pop();
    }

  }
  ngAfterViewInit(): void {
    this.getFamilyValid.next(true);
  }
  getCandidateFamilyDetailsList(page: boolean = false) {
    this._candidateServe.getCandidateFamilyDetails(this.apiBaseUrlCand).subscribe(
      res => {
        this.familyDetailsList = res['data'];
        /**filtering father and mother details - only one record will be saved for mother or father - 
         *
         */
        let filterFam = this.familyDetailsList.filter(a => a.relationship == 6 || a.relationship == 9);
        this.getIds = filterFam.map(a => a.relationship);
        if (page == true) {
          this._share.activeTabDetection.next(true);
        }
      }
    )
  }
  /***
   * add Family Member
   */

  addFamilyMember(element: any = {}): void {
    element['title'] = "Add Family Member";
    element['type'] = 1
    /**sending relation ids for filter */
    element['relationshipId'] = this.getIds;
    element['apiBaseUrlCand'] = this.apiBaseUrlCand;
    element['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    debugger

    const dialogRef = this.dialog.open(LibCandidateFamilyDetailsFromModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getCandidateFamilyDetailsList(true);
        }
      }
    )
  }

  /**update family details modal */
  openUpdateFamilyDetailsModal(elm: any) {
    elm['title'] = "Update Details"
    elm['type'] = 2;
    elm['apiBaseUrlCand'] = this.apiBaseUrlCand;
    elm['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    const dialogRef = this.dialog.open(LibCandidateFamilyDetailsFromModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCandidateFamilyDetailsList();
      }
    });
  }

  /***
 * Delete family method
 */
  deleteDetails(element: any) {
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
        this._candidateServe.deleteFamilyDetails("",element.id).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.getCandidateFamilyDetailsList(true);
          }
        )
      }
    });
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
