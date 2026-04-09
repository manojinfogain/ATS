import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from '../../offer.service';

@Component({
  selector: 'app-offer-reason-for-drop',
  templateUrl: './offer-reason-for-drop.component.html',
  styleUrls: ['./offer-reason-for-drop.component.scss']
})
export class OfferReasonForDropComponent implements OnInit {

  public reasonDropDown:any=[]
  public offerDropReason:any =[];
  public isDropTypeSelected:boolean=false;
  public reasonForDropForm: UntypedFormGroup = new UntypedFormGroup({});
  public statusList:any =[];
 
  constructor(
    public dialogRef: MatDialogRef<OfferReasonForDropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private globalApiServ: GlobalApisService,
    private _offerServe: OfferService,
  ) { }
 
  ngOnInit(): void {
    this.getApiStatusReasonDetails();
  //  this.getOfferDropReasonList();
  //  this.GetAllOfferStatus();
    this.formInit();
  }


  //formInit
  formInit() {
    this.reasonForDropForm = this._fb.group({
      remark: [null],
      statusType:[null, [Validators.required]],
      dropReason:[null,[Validators.required]]
    })
  }

  //submit data
  submitOfferDropReasonForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    console.log('form data',form.value)
    this.data.cid;
    if (form.valid) {
      let formData = form.value
      formData['Cid'] =this.data.cid
      this._offerServe.updateDropOfferReason(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

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


  //control for form
  getControl(name: string) {
    return this.reasonForDropForm.get(name);
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

  closeModal(): void {
    this.dialogRef.close();
  }


}
