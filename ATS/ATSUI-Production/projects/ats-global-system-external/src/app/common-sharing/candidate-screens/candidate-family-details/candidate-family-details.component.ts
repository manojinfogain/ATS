import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { CandidateFamilyDetailsFromModalComponent } from './candidate-family-details-from-modal/candidate-family-details-from-modal.component';
import { ShareService } from '../../../core/services/share.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { AlertMsgPopupComponent } from '../../modal/alert-msg-popup/alert-msg-popup.component';
@Component({
  selector: 'app-candidate-family-details',
  templateUrl: './candidate-family-details.component.html',
  styleUrls: ['./candidate-family-details.component.scss']
})
export class CandidateFamilyDetailsComponent implements OnInit, AfterViewInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public familyDetailsList: any = [];
  @Output() getFamilyValid = new EventEmitter<boolean>();
  displayedColumns = ['Relationship', 'Name', 'dob', 'age', 'Occupation', 'Dependent', 'isMinor', 'gender', 'address', 'guardianName', 'guardianAddress', 'orgName', 'currentLocation', 'action'];
  @Input() public candidatePersonalDetails: any = {};
  @Input() public candidateTabConfig: any = {};
  public getIds: any[];
  @Input() isLeadershipOnboard: boolean = false;
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _globalMethod: GlobalCommonMethodService
  ) { }
  public isFinalSumbit: boolean = false;
  ngOnInit(): void {
    debugger
    if (this.isLeadershipOnboard) {
      this.openAlertModal();
    }
    this.getCandidateFamilyDetailsList();
    if (this._globalMethod.isFinalSubmit()) {
      this.isFinalSumbit = true;
      this.displayedColumns.pop();
    }

  }
  ngAfterViewInit(): void {
    this.getFamilyValid.next(true);
  }
  getCandidateFamilyDetailsList(page: boolean = false) {
    this._candidateServe.getCandidateFamilyDetails().subscribe(
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
    element['relationshipId'] = this.getIds
    const dialogRef = this.dialog.open(CandidateFamilyDetailsFromModalComponent, {
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
    elm['type'] = 2
    const dialogRef = this.dialog.open(CandidateFamilyDetailsFromModalComponent, {
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
        this._candidateServe.deleteFamilyDetails(element.id).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.getCandidateFamilyDetailsList(true);
          }
        )
      }
    });
  }

  //to show the age of the candidate
  calculateAge(val: any) {
    if (val) {
      let birthDate = new Date(val);
      let timeDiff = Math.abs(Date.now() - birthDate?.getTime());
      let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      return `${age} years`;
    } else {
      return `-`;
    }
  }

  /***
    * alert msg modal
    */
  openAlertModal() {
    const dialogRef = this.dialog.open(AlertMsgPopupComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Note',
        message: ` Please ensure to update complete family details - Parents, Spouse, Kids , <br> to avail benefits (as applicable).`,
        buttonText: {
          // ok: "Yes",
          cancel: "Ok"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //this.validationCheckBeforeSubmit(form);
      }
    });
  }
}
