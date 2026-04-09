import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from '../../core/services/share.service';
import { TalentService } from '../talent.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';

@Component({
  selector: 'app-talent-approval-screen',
  templateUrl: './talent-approval-screen.component.html',
  styleUrls: ['./talent-approval-screen.component.scss']
})
export class TalentApprovalScreenComponent implements OnInit {
  public isRejectFormVisible: boolean = false;
  public rejectActionForm: UntypedFormGroup = new UntypedFormGroup({});
  public thId: number;
  constructor(
    private _activateRoute: ActivatedRoute,
    private _share: ShareService,
    private _talentServ: TalentService,
    private _fb: UntypedFormBuilder,
    private _storage: GetSetStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.rejectActionSubmitForm();
    this.getCancelTalentReasonCateg();
    let queryParam = this._activateRoute['snapshot']?.queryParams;
    let thid = queryParam?.thid;
    let action = queryParam?.action;
    this.thId = queryParam?.thid;
    if (thid && action) {

      if (action == 'A') {
        //approved api
        this.isRejectFormVisible = false;
        this._talentServ.ApprovedOrRejectThIdFromMail(this.thId, 'A', null, '').subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            // this.dialogRef.close(true);
            this.logOut();
          },
          error=>{
            this.logOut();
          }
        )
      }
      else if (action == 'R') {
        //reject  api
        this.isRejectFormVisible = true;
      }
      else {
        this._share.showAlertErrorMessage.next('Invalid Request.');
      }

    }
    else {
      this._share.showAlertErrorMessage.next('Invalid Url.');
    }
    
  }

  logOut() {
    setTimeout(() => {
      this._storage.destroyAllStorage();
      this._share.sessionExp.next(false);
      this.router.navigate(['/login']);
    }, 3000)

  }
  /**get cancel reason category */
  public reasonCategList: any = [];
  getCancelTalentReasonCateg() {
    this._talentServ.cancelTalentReasonCateg().subscribe(
      res => {
        this.reasonCategList = res['data'];
      }
    )
  }

  /**getting current id of dropdown on selection */
  // public projData: any = [];
  getReasonCategId(data: any) {
    //let reasonCategFilteredData = this.reasonCategList.filter(x => x.ProjectID === data.value);
    //this.projData = reasonCategFilteredData[0];
    this.getCancelTalentReason(data?.value);
  }
  /**get cancel reason */
  public reasonList: any = [];
  getCancelTalentReason(id) {
    this._talentServ.cancelTalentReason(id).subscribe(
      res => {
        this.reasonList = res['data'];
      }
    )
  }

  //form setup for reject
  rejectActionSubmitForm() {
    this.rejectActionForm = this._fb.group({
      reasonCategory: [null, Validators.required],
      subReason: [null, Validators.required],
      remarks: [null]
    })
  }

  getControl(name: string) {
    return this.rejectActionForm.get(name);
  }
  /**submit request */
  submitApprove(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      /**for reject */
      this._talentServ.ApprovedOrRejectThIdFromMail(this.thId, 'R', form.value.subReason ? form.value.subReason : null, form.value.remarks ? form.value.remarks : '').subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          // this.dialogRef.close(true);
          this.rejectActionForm.reset();
          this.logOut();
        },
        error=>{
          this.rejectActionForm.reset();
          this.logOut();

        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

}
