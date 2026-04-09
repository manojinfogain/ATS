import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { BgvEmploymentDetailsFormModalComponent } from './bgv-employment-details-form-modal/bgv-employment-details-form-modal.component';
import { MultipleDocPreviewModalComponent } from '../../modal/multiple-doc-preview-modal/multiple-doc-preview-modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bgv-employment-details',
  templateUrl: './bgv-employment-details.component.html',
  styleUrls: ['./bgv-employment-details.component.scss']
})
export class BgvEmploymentDetailsComponent implements OnInit {

  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  @Input() candidateEmploymentDetailsEAF: any = {};
  @Input() candidatePersonalDetails: any = {};
  displayedColumns = ['employerName', 'employerType', 'employeeId', 'Doj', 'currentWorking', 'Designation', 'RMNameDesig', 'RMContact', 'RMEmail', 'HRNameDesig', 'HRContact', 'HREmail', 'action'];
  candidateList = [
  ]
  public employmentDetailsList: any = [];
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _globalMethod: GlobalCommonMethodService,
    private _http: HttpClient
  ) { }
  public isFinalSumbit: boolean = false;
  ngOnInit(): void {
    this.getEmploymentDetails();
    if (this._globalMethod.isBGVFinalSubmit()) {
      this.isFinalSumbit = true;
      //  this.displayedColumns.pop();
    }
  }

  /**get emp details */
  public isCurrentEmployerAdded: boolean = false;
  public isPrev1EmployerAdded: boolean = false;
  public isPrev2EmployerAdded: boolean = false;
  getEmploymentDetails(page: boolean = false) {
    this._candidateServe.GetBGVEmploymentDetails().subscribe(
      res => {
        this.employmentDetailsList = res['data'];
        this.isCurrentEmployerAdded = res['data']?.filter((elm: any) => elm.CompanyType == 'C')?.length > 0 ? true : false;
        this.isPrev1EmployerAdded = res['data']?.filter((elm: any) => elm.CompanyType == 'P1')?.length > 0 ? true : false;
        this.isPrev2EmployerAdded = res['data']?.filter((elm: any) => elm.CompanyType == 'P2')?.length > 0 ? true : false;
        if (page == true) {
          this._share.activeTabDetection.next(true);
        }
      }
    )
  }
  /***
   * add  employment details
   */
  addEmploymentDetails(element: any = {}): void {
    element['title'] = " Add  Employment Details";
    element['type'] = 1
    element['isCurrentEmployerAdded'] = this.isCurrentEmployerAdded;
    element['isPrev1EmployerAdded'] = this.isPrev1EmployerAdded;
    element['isPrev2EmployerAdded'] = this.isPrev2EmployerAdded;
    element['candidateEmploymentDetailsEAF'] = this.candidateEmploymentDetailsEAF;
    element['employmentDetailsList'] = this.employmentDetailsList;
    const dialogRef = this.dialog.open(BgvEmploymentDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: element,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getEmploymentDetails(true);

        }
      }
    )
  }

  /**update emp details modal */
  UpdateEmplymentDetailsModal(elm: any) {

    elm['title'] = "Update Employment Details"
    elm['type'] = 2
    elm['isCurrentEmployerAdded'] = this.isCurrentEmployerAdded;
    elm['isPrev1EmployerAdded'] = this.isPrev1EmployerAdded;
    elm['isPrev2EmployerAdded'] = this.isPrev2EmployerAdded;
    elm['candidateEmploymentDetailsEAF'] = this.candidateEmploymentDetailsEAF;
    elm['employmentDetailsList'] = this.employmentDetailsList;
    const dialogRef = this.dialog.open(BgvEmploymentDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmploymentDetails(true);
      }
    });
  }
  /***
* Delete details
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
        this._candidateServe.deleteEmploymentDetails(element.id).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.getEmploymentDetails(true);
          }
        )
      }
    });
  }

  public docDetails: any[] = [];
  previewEmpDetDoc(element: any) {
    if (!element?.DocumentTypeId) {
      this._share.showAlertErrorMessage.next("Please update the details first.");
      return;
    } else {
      this._candidateServe.GetBGVFilePaths(element?.DocumentTypeId, element?.OrgId).subscribe(
        res => {
          this.docDetails = res['data'] || [];
          if (this.docDetails?.length > 1) {
            element['docList'] = this.docDetails
            const dialogRef = this.dialog.open(MultipleDocPreviewModalComponent, {
              panelClass: ['ats-model-wrap', 'bgv-modal'],
              data: element,
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
              }
            });
          } else {
            if (this.docDetails?.length === 1) {
              let elm = {};
              elm['documentName'] = this.docDetails[0].documentName?.replace(/\.(dat|enc)$/i, '') || this.docDetails[0].documentName;
              elm['filePath'] = this.docDetails[0]?.DocumentPath;
              elm['fileName'] = this.docDetails[0]?.documentName?.replace(/\.(dat|enc)$/i, '') || this.docDetails[0]?.documentName;
              elm['type'] = 'path';
              elm['cid'] = element?.CID;
              this._globalMethod.downloadPrevDocuments(elm, this._http, this.dialog, this._share);
            } else {
              this._share.showAlertErrorMessage.next("No document found");
            }
          }
        }
      )
    }
  }
}
