 import { Component, OnInit, Inject } from '@angular/core';
 import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
 import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
 import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
 import { TalentService } from '../../../talent.service';
 import { DashboardService } from 'projects/ats-global-system/src/app/dashboard-module/dashboard.service';
 import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
 import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';
 
 
 @Component({
  selector: 'app-update-joined-declined-details-modal',
  templateUrl: './update-joined-declined-details-modal.component.html',
  styleUrls: ['./update-joined-declined-details-modal.component.scss']
})
export class UpdateJoinedDeclinedDetailsModalComponent implements OnInit {
 
   joindetailsForm: UntypedFormGroup;
   public TalentData: any = {};
   public statusList: any;
   public minDateForDecline: any = new Date(this.data?.OfferedDate);
   public maxDateForDecline: any = new Date(this.data?.DateOfJoining);
   constructor(
     public dialogRef: MatDialogRef<UpdateJoinedDeclinedDetailsModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private _fb: UntypedFormBuilder,
     public _dashServe: DashboardService,
     public _talentServe: TalentService,
     private _share: ShareService,
     public _globalApi: GlobalApisService,
         private _offerService: OfferService,
   ) { }
 
   ngOnInit() {
     this.getJoinedCandidateList();
     this.formInit();
     this.GetInterviewStatus();
     this.getDeclineCategoryList();
   }
 
 
   public FilterCtrlCandidateJoined: UntypedFormControl = new UntypedFormControl();
   public candidateJoinedList: any = [];
   public searchJoinedCandidate: string = '';
   /**get joined candidate list */
   getJoinedCandidateList() {
     this._globalApi.getJoinedCandidateList().subscribe(
       res => {
         this.candidateJoinedList = res['data']
       }
     )
     this.FilterCtrlCandidateJoined.valueChanges.subscribe(
       get => {
         this.searchJoinedCandidate = get;
         // this.allSelcount = false;   
       }
     )
   }
 
   /***
    * update talentid form submit
    */
 
   formInit() {
     this.joindetailsForm = this._fb.group({
       EmpId: [null, [Validators.required]],
       dateOfJoing: [null],
       Remarks: [null],
       DateOfDecline: [null],
       DeclineCategory  : [null],
       DeclineRemarks: [null],
       OfferStatus: [null],
     })
 
   }
 
   public filteredEmpList: any = {};
   JoinedEmployeeListChange(elm: any) {
     let selectedCandidate = this.candidateJoinedList.filter(x => x.EmplyeeID === elm.value);
     this.filteredEmpList = selectedCandidate[0];
     this.getControl('dateOfJoing').patchValue(this.filteredEmpList.EMP_DATEOFJOINING ? new Date(this.filteredEmpList.EMP_DATEOFJOINING) : null);
 
   }
 
 
   //control for form
   getControl(name: string) {
     return this.joindetailsForm.get(name);
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
   updateTalentIdHandler(form: UntypedFormGroup) {
     this.joindetailsForm.markAllAsTouched();
     if (form.valid) {
       let formData = form.value;
       formData['OfferId'] = this.data.OfferId;
       formData['IsExceptionCandidateJoin'] = this.data?.IsExceptionCandidateJoin == 'Y' ? 1: 0;
       if(formData['EmpId']){       
        formData['EmpId'] = formData['EmpId'];
       }else{
        delete formData['EmpId'];
       }
       if(formData['Remarks']){       
        formData['Remarks'] = formData['Remarks'];
       }else{
        delete formData['Remarks'];
       }
        if(formData['DeclineCategory']){       
          formData['DeclineCategory'] = formData['DeclineCategory'];
        } else{
          delete formData['DeclineCategory'];
        } 
        if(formData['DeclineRemarks']){       
          formData['DeclineRemarks'] = formData['DeclineRemarks'];
        } else{
          delete formData['DeclineRemarks'];
        }         
       if(formData['dateOfJoing']){       
        formData['dateOfJoing'] = GlobalMethod.formatDate(formData['dateOfJoing']);
       }else{
        delete formData['dateOfJoing'];
       }    
        if(formData['DateOfDecline']){
          formData['DeclineDate'] = GlobalMethod.formatDate(formData['DateOfDecline']);
        }else{
          delete formData['DeclineDate'];
        }
        if(formData['DateOfDecline']){
          formData['DeclineDateUtc'] = GlobalMethod.convertToUTCDate(formData['DateOfDecline']);
        }
        delete formData['DateOfDecline'];
       this._talentServe.CloseTHIDForPoland(formData).subscribe(
         res => {
           this._share.showAlertSuccessMessage.next(res);
           this.dialogRef.close(formData?.OfferStatus);
         }
       )
     }
     else {
       this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
     }
   }

   GetInterviewStatus(): void {
    this._globalApi.getAllOfferStatus().subscribe(
      res => {

        let filterById = [160, 200]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.statusId) !== -1;
        });
        this.statusList = filterByStatus;
      }
    );
  }

  public isOfferDeclined: boolean = false;
  offerStatusChange(elm: any) {
    // let selectedStatus = this.statusList.filter(x => x.statusId === elm.value);
    // this.joindetailsForm.get('remarks').patchValue(selectedStatus[0].statusName);
    if(elm?.value == 200){
      this.isOfferDeclined = false;
      this.joindetailsForm.get('EmpId').setValidators([Validators.required]);
      this.joindetailsForm.get('dateOfJoing').setValidators([Validators.required]);
      this.joindetailsForm.get('EmpId').reset();
      this.joindetailsForm.get('dateOfJoing').reset();
      this.joindetailsForm.get('DateOfDecline').clearValidators();
      this.joindetailsForm.get('DeclineCategory').clearValidators();
      this.joindetailsForm.get('DeclineRemarks').clearValidators();
      this.joindetailsForm.get('DateOfDecline').reset();
      this.joindetailsForm.get('DeclineCategory').reset();
      this.joindetailsForm.get('DeclineRemarks').reset();
    }else if(elm?.value == 160){
      this.isOfferDeclined = true;
      this.joindetailsForm.get('DateOfDecline').setValidators([Validators.required]);
      this.joindetailsForm.get('EmpId').reset();
      this.joindetailsForm.get('dateOfJoing').reset();
      this.joindetailsForm.get('EmpId').clearValidators();
      this.joindetailsForm.get('dateOfJoing').clearValidators();
    }else{

    }
    this.joindetailsForm.get('EmpId').updateValueAndValidity();
    this.joindetailsForm.get('dateOfJoing').updateValueAndValidity();
    this.joindetailsForm.get('DateOfDecline').updateValueAndValidity();
    this.joindetailsForm.get('DeclineCategory').updateValueAndValidity();
    this.joindetailsForm.get('DeclineRemarks').updateValueAndValidity();
  }
  //get Decline CategoryList
  public declineCategoryList: any = [];
  getDeclineCategoryList() {
    this._offerService.getDeclineCategory().subscribe(
      res => {
        this.declineCategoryList = res.data;
      }
    )
  }
 
 
 }
 