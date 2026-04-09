import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from 'projects/ats-global-system/src/app/vendor-partner-module/partner.service';

@Component({
  selector: 'app-reason-for-drop-modal',
  templateUrl: './reason-for-drop-modal.component.html',
  styleUrls: ['./reason-for-drop-modal.component.scss']
})
export class ReasonForDropModalComponent implements OnInit {
  public reasonDropDown:any=[];
  public offerDropReason:any =[];
  public statusList:any =[];
  public isDropTypeSelected:boolean =false;
  public reasonForDropForm: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<ReasonForDropModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
   private _intervServ:InterviewCommonService,
   private _partnerServ:PartnerService,
   private globalApiServ: GlobalApisService,
  ) { }
 
  ngOnInit(): void {
    this.getApiStatusReasonDetails();
    this.formInit()
      this._intervServ.getReasonDropList().subscribe((res) => {
        this.reasonDropDown = res.data;
      });
  }


  //forkjoin get Api's
   //get offer drop Reasons and offer status organisation & candidate drop 
   public allCandidateReason: any = [];
   getApiStatusReasonDetails() {
     forkJoin([
       this.globalApiServ.getOfferDropReason(),
       this.globalApiServ.getAllOfferStatus(),
     ]).subscribe((res) => {
       this.allCandidateReason = res[0]['data'];
       //filtering status by id
       let filterById = [240, 260]
       let filterByStatus = res[1]['data'].filter(t => {
         return filterById.indexOf(t.statusId) !== -1;
       });
       this.statusList = filterByStatus;
     });
   }

    //filtering dropdown reason list accourding to candidate and organisation drop
    filteredReasonList(id: number) {
      this.offerDropReason = this.allCandidateReason.filter(d => d.parentId == id);
    }
   changeStatus(e) {
    let dropReasonCn = this.getControl('dropReason');
    dropReasonCn.reset();
    if(e.value){
      this.isDropTypeSelected = true;
    }else{
      this.isDropTypeSelected = false;
    }
    if (e.value == 240) {
     this.filteredReasonList(240);
    // dropReasonCn.clearValidators();
    }
  else if(e.value == 260){
    this.filteredReasonList(260);
      //rescheduleReasonCn.clearValidators();
     // dropReasonCn.setValidators([Validators.required]);
    }

  }
  //formInit
  formInit() {
    this.reasonForDropForm = this._fb.group({
      remark: [null],
      dropReason:[null,[Validators.required]],
      statusType:[null,[Validators.required]]
    })
  }

  //submit/ update reasons
  submitDropReasonForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    console.log('form data',form.value)
    this.data.cid;
    let formData = form.value
    if (form.valid) {
      
      formData['Cid'] =this.data.cid
      this._intervServ.submitReasonFordrop(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  //control for form
  getControl(name: string) {
    return this.reasonForDropForm.get(name);
  }

  /***/

  closeModal(): void {
    this.dialogRef.close();
  }

}
