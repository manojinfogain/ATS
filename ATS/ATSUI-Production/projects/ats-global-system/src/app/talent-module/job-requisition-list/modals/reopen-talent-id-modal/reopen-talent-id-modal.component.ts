import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { TalentService } from '../../../talent.service';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
import { SelectedCandidateTransferWithTcModalComponent } from 'projects/ats-global-system/src/app/offer-module/modals/selected-candidate-transfer-with-tc-modal/selected-candidate-transfer-with-tc-modal.component';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { SendForApprovalModalUsComponent } from 'projects/ats-global-system/src/app/offer-module/modals/send-for-approval-modal-us/send-for-approval-modal-us.component';
import { SendForApprovalModalComponent } from 'projects/ats-global-system/src/app/offer-module/modals/send-for-approval-modal/send-for-approval-modal.component';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { SelectedCandidateTransferModalComponent } from 'projects/ats-global-system/src/app/offer-module/modals/selected-candidate-transfer-modal/selected-candidate-transfer-modal.component';
import { JoinedCandidateReopenTransferModalComponent } from '../joined-candidate-reopen-transfer-modal/joined-candidate-reopen-transfer-modal.component';


@Component({
  selector: 'app-reopen-talent-id-modal',
  templateUrl: './reopen-talent-id-modal.component.html',
  styleUrls: ['./reopen-talent-id-modal.component.scss']
})
export class ReopenTalentIdModalComponent implements OnInit {
  statius: boolean = true;
  reopenTalentIdForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public statusList: any = [];
  imgFile: any;
  imgSrc: any;
  public isloader: boolean = false;
  public minDate: any = new Date();
  public reasonList: any = [];
  public TalentData: any = [];
  public joinedCandData: any = [];
  constructor(
    public dialogRef: MatDialogRef<ReopenTalentIdModalComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _talentServe:TalentService,
    private _globalCommonMethod: GlobalCommonMethodService,
  ) { }

  ngOnInit() {
    this.getDetails();
    this.getJoinedCandidateDetails(this.data.TH_ID);
    this.formInit();
    this.isloader = true;
  }

  /***
   * get Details
   */
  getDetails() {
    if (this.data) {
      this._dashServe.getTalentIdInfo(this.data.TH_ID).subscribe(
        res => {
          let data = res;
          this.TalentData = data[0];
        }
      )
    }

  }




  getRecEmpId(e: any) {

  }



  /***
   * update talentid form submit
   */

  formInit() {
    this.reopenTalentIdForm = this._fb.group({
      prRecEmpId: [null],
      srRecEmpId: [null]
    })

  }


  //control for form
  getControl(name: string) {
    return this.reopenTalentIdForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  /***
   * submit details  Data to server
   */
  reopenTalentIdHandler(form: UntypedFormGroup) {
      let element = {};
        element['title'] = "Transfer to Other Talent ID";
        element['cid'] = this.joinedCandData?.Cid;
        // element['cid'] = 12470;
        //call type 1 = from offer module, 2 = FROM TALENT MODULE
        element['callType'] = 2;
        element['Name'] = this.joinedCandData?.CandidateName;
        element['email'] = this.joinedCandData?.CandidateEmail;
        
        // if (this.isTransEnableForIndia && element?.isSupportHiring == 'N') {
        if ((this.data?.LocationID == 1 || this.data?.LocationID == 2 ||  this.data?.LocationID == 4 || this.data?.LocationID == 5 || this.data?.LocationID == 16 || this.data?.LocationID == 21 || this.data?.LocationID == 11 || this.data?.LocationID == 10)
        && this.data?.isSupportHiring == 'N' && this.data?.IsRenuTeam == 'N') {
          // const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {        
          const dialogRef = this.dialog.open(JoinedCandidateReopenTransferModalComponent, {
            panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: element,
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.dialogRef.close(true);
            }
          });
        } else {
          //call type 1 = from offer module, 2 = FROM TALENT MODULE
          element['callType'] = 2;
          element['prevthid'] = this.data.TH_ID;
          const dialogRef = this.dialog.open(SelectedCandidateTransferModalComponent, {
            panelClass: ['ats-model-wrap', 'update-interview-feedback', 'talent-transfers', 'talent-transfers-mod'],
            data: element,
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.dialogRef.close(true);
            }
          });
        }
  }

  /**
 * get new val
 * @param cg 
 */
  getDirtyValues(cg: any) {
    const dirtyValues = {};
    Object.keys(cg.controls).forEach(c => {
      const currentControl = cg.get(c);
      if (currentControl.dirty) {
        dirtyValues[c] = currentControl.value;
      }
    });
    return dirtyValues;
  }

  public joinedEmpList: any = [];
  getJoinedCandidateDetails(th_id:number) {
    this._talentServe.getJoinedCandidateDetails(th_id).subscribe(
      res => {
        if(res){
          this.joinedEmpList = res['data'];
          this.joinedCandData = res['data'][0];
        }
      }
    )
  }

    //confirmation to re-initiate offer right now
  confirmReinitiationDialogBox(elm:any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Do you want to Re-Initiate Offer Approval right now ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {       
        this.sendForApproval(elm);
      }
    });
  }

  
/***
 * send approval by recruiter
 */
sendForApproval(elm: any) {       
        const locId = this._globalCommonMethod.getSetLocation().locId;
        let dialogRef: any;
        if (locId == 3) {
          dialogRef = this.dialog.open(SendForApprovalModalUsComponent, {
            panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
            data: elm,
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
          });
        }
        else {
          // if(res['talent'][0].isSupportHiring == 'Y'){
          //   dialogRef = this.dialog.open(SendForApprovalModalSupportComponent, {
          //     panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
          //     data: elm,
          //     maxWidth: '100vw',
          //     maxHeight: '100vh',
          //     height: '100%',
          //     width: '100%'
          //   });

          // }
          // else{
            dialogRef = this.dialog.open(SendForApprovalModalComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });         
        }

        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {      
            }
          }
        )

      }

}
