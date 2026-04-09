import { Component, Input, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LibCandidateService } from '../../../services/lib-candidate.service';
import { LibShareService } from '../../../services/lib-share.service';
import { LibGlobalCommonMethodService } from '../../../services/lib-global-common-method.service';
import { LibEmploymentDetailsFormModalComponent } from './lib-employment-details-form-modal/lib-employment-details-form-modal.component';
import { LibConfirmationDialogComponent } from '../../../shared/components/lib-confirmation-dialog/lib-confirmation-dialog.component';

@Component({
  selector: 'lib-employment-details',
  templateUrl: './lib-employment-details.component.html',
  styleUrls: ['./lib-employment-details.component.scss']
})
export class LibEmploymentDetailsComponent implements OnInit {

  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  displayedColumns = ['Category','location','city', 'employerType','industry','Designation','functionName','skilName', 'projectName','projectDescription', 'duration','clientName','joiningCtc','leavingCtc','reasonForLeaving','action'];
  candidateList = [
  ]
  public employmentDetailsList:any=[];
  @Input() public apiBaseUrlMaster:string = '';
  @Input() public apiBaseUrlCand:string = '';
  constructor(
    public dialog: MatDialog,
    private _candidateServe: LibCandidateService,
    private _share:LibShareService,
    private _globalMethod:LibGlobalCommonMethodService
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
    this._candidateServe.getEmploymentDetails(this.apiBaseUrlCand).subscribe(
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
    element['apiBaseUrlCand'] = this.apiBaseUrlCand;
    element['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    const dialogRef = this.dialog.open(LibEmploymentDetailsFormModalComponent, {
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
    elm['apiBaseUrlCand'] = this.apiBaseUrlCand;
    elm['apiBaseUrlMaster'] = this.apiBaseUrlMaster;
    const dialogRef = this.dialog.open(LibEmploymentDetailsFormModalComponent, {
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
          this._candidateServe.deleteEmploymentDetails(this.apiBaseUrlCand,element.id).subscribe(
            res => {
              this._share.showAlertSuccessMessage.next(res);
              this.getEmploymentDetails(true);
            }
          )
        }
      });
    }
}
