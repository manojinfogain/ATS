import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { EmploymentDetailsFormModalComponent } from './employment-details-form-modal/employment-details-form-modal.component';

@Component({
  selector: 'app-employment-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss']
})
export class EmploymentDetailsComponent implements OnInit {

  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Category','location','city', 'employerType','industry','Designation','functionName','skilName', 'projectName','projectDescription', 'duration','clientName','joiningCtc','leavingCtc','reasonForLeaving','action'];
  candidateList = [
  ]
  @Input() isLeadershipOnboard:boolean;
  public employmentDetailsList:any=[];
  
  constructor(
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _share:ShareService,
    private _globalMethod:GlobalCommonMethodService
  ) { }
  public isFinalSumbit:boolean = false;
  ngOnInit(): void {
    this.getEmploymentDetails();
    if(this._globalMethod.isFinalSubmit()){
      this.isFinalSumbit= true;
      this.displayedColumns.pop();
    }
  }

 /**get emp details */ 
 public isCurrentEmployerAdded:boolean = false;
 public currEmployerFromDate = new Date(); 
 getEmploymentDetails(page:boolean = false) {
    this._candidateServe.getEmploymentDetails().subscribe(
      res => {
        this.employmentDetailsList = res['data'];
        this.isCurrentEmployerAdded = res['data']?.filter((elm:any)=>elm.employerType == 'C')?.length > 0 ? true : false;
        this.currEmployerFromDate = res['data']?.filter((elm:any)=>elm.employerType == 'C')?.length > 0 ? new Date(res['data']?.filter((elm:any)=>elm.employerType == 'C')[0]?.fromDate) : new Date();
        if(page == true){
          this._share.activeTabDetection.next(true);
        }
      }
    )
  }
  /***
   * add  employment details
   */
  addEducationDetails(element: any = {}): void {
    element['title'] = " Add  Employment Details";
    element['type'] = 1
    element['isCurrentEmployerAdded'] = this.isCurrentEmployerAdded;    
    element['currEmployerFromDate'] = this.currEmployerFromDate;
    element['isLeadershipOnboard'] = this.isLeadershipOnboard;
    const dialogRef = this.dialog.open(EmploymentDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal','add-edu-modal'],
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
    elm['currEmployerFromDate'] = this.currEmployerFromDate;
    elm['isLeadershipOnboard'] = this.isLeadershipOnboard;
    const dialogRef = this.dialog.open(EmploymentDetailsFormModalComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-family-modal','add-edu-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEmploymentDetails();
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
}
