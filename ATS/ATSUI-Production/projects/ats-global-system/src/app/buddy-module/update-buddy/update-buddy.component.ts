import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { OnboardService } from '../../onboard-module/onboard.service';
import { ShareService } from '../../core/services/share.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { COMMON_CONST } from '../../core/constant/common.const';
import { DashboardService } from '../../dashboard-module/dashboard.service';
import { TalentService } from '../../talent-module/talent.service';
import { BuddyService } from '../buddy.service';
import { AnyAaaaRecord } from 'dns';

@Component({
  selector: 'app-update-buddy',
  templateUrl: './update-buddy.component.html',
  styleUrls: ['./update-buddy.component.scss']
})
export class UpdateBuddyComponent implements OnInit {
  statius: boolean = true;
  updateBuddyForm: UntypedFormGroup;
  commonConst = COMMON_CONST;
  public statusList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public buddyList:any = [];
  public filterCtrlJoiningLocation: UntypedFormControl = new UntypedFormControl();
  public searchCtrlJoiningLocation: string;
 
  public isloader: boolean = false;
  public minDate: any = new Date();
  public reasonList: any = [];
  public buddyData: any = [];
  get buddyControl() { return this.updateBuddyForm.get('buddyEmpID') };
  constructor(
    public dialogRef: MatDialogRef<UpdateBuddyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    public _dashServe: DashboardService,
    private _share: ShareService,
    private _buddyServe: BuddyService
  ) { }

  ngOnInit() {
    console.log(this.data)
    this.getbuddyList();
    this.formInit();
    this.isloader = true;
    this.filterCtrlJoiningLocation.valueChanges.subscribe(
      val => {
        this.searchCtrlJoiningLocation = val;
      }
    )
    this.updateBuddyForm.controls['buddyName'].patchValue(this.data.BuddyEmpId)
  }


  /***
   * update talentid form submit
   */

  formInit() {
    this.updateBuddyForm = this._fb.group({
      buddyName: [null,[Validators.required]],
     
    })
    // if (this.data.type == 'U') {
    //   this.updateBuddyForm.patchValue({
    //     buddyEmpId: [this.data]
    //   })

    // }

  }


  //control for form
  getControl(name: string) {
    return this.updateBuddyForm.get(name);
  }

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  getBuddyName(e: any) {

  }

  /***
   * submit details  Data to server
   */
  AddUpdateBuddy(form: UntypedFormGroup) {
    this.updateBuddyForm.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      let body = {};
      body['buddyEmpId'] =form.value["buddyName"];
      body['cid'] =this.data.cid;
      this._buddyServe.AddUpdateBuddy(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }
  
  getbuddyList() {
    this.data.cid
    this._buddyServe.GetEmployeeListToAssign(this.data.cid)
    .subscribe(
      res => {
        this.buddyList =  res['data'];

        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )

      }
    );
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

}
