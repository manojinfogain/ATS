import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute } from '@angular/router'
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CandidateService } from '../candidate.service';
import { OtpVerificationVideoMatchComponent } from '../modals/otp-verification-video-match/otp-verification-video-match.component';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';

@Component({
  selector: 'app-video-match-screen',
  templateUrl: './video-match-screen.component.html',
  styleUrls: ['./video-match-screen.component.scss']
})
export class VideoMatchScreenComponent implements OnInit {

  public VideoSubmitFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  public submit: boolean = false;
  public hideFormControl: boolean = false;
  public isVideoMatch: boolean = false;
  constructor(private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _activateRoute: ActivatedRoute,
    private _candServe: CandidateService,
    private _dialog: MatDialog,
       private _storage: GetSetStorageService
  ) {


  }


  public hiddenEmail: string = '';
  ngOnInit(): void {
    this._share.hideTopRightMenu.next(true);
    this._share.hideSideBar.next(true);
    document.body.classList.add("auth-page-main");
    this.AuithenticateCandidate();
    this.offerSubmitForm();
  }

  AuithenticateCandidate() {
    this._candServe.getToken().subscribe(
      res => {
        this._storage.saveTokenEx(res.access_token);
        this.getData();
      }
    )
  }
  /***
   * open otp modal
   */
  openOtpModal(elm: any) {
    const dialogRef = this._dialog.open(OtpVerificationVideoMatchComponent, {
      panelClass: ['ats-model-wrap', 'otp-modal'],
      data: elm,
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.hideFormControl = false;
          this.isVideoUpdate = true
        }
      }
    )
  }

  /****
   * 
   */
  public invalidUrl: boolean = false;
  public queryParam:string;
  getData(): void {
    this.queryParam = this._activateRoute['snapshot']?.queryParams?.param;
    if (this.queryParam) {
      this.getVideoMatchDetails(this.queryParam);
      this.getVideoMatchUserAccess(this.queryParam);

    }
    else {
      this._share.showAlertErrorMessage.next('Invalid Url.');
      this.invalidUrl = true;
    }
  }
  public videoMatchUserAccess: any = [];
  getVideoMatchUserAccess(queryParam:string) {
    this._candServe.getVideoMatchUserAccess(queryParam).subscribe(
      res => {
        this.videoMatchUserAccess = res['data'];
      }
    )
  }

  /***
   * get candidate
   */
  public candidateData: any = [];
  public videoMatchDetails: any = {};
  public isVideoUpdate:boolean = false;
  getVideoMatchDetails(queryParam:string) {
    this._candServe.getVideoMatchDetails(queryParam.trim()).subscribe(
      res => {
        this.videoMatchDetails = res['data'][0];
         if(this.videoMatchDetails.IsVideoScoreUpdated == 1){
          this.hideFormControl = false;
          this.isVideoMatch = true;
        }
        else {
          this.hideFormControl = true;
          this.isVideoMatch = false
        }
      }
    )
  }
  

  ngAfterViewInit(): void {
  }

  /***
  *  password form Init
  */
  offerSubmitForm() {
    this.VideoSubmitFormGroup = this._fb.group({
      // item: this._fb.array([]),
      userEmpId: [null, Validators.required]
    })
  }

  /***  get sort controls ***/
  get t() { return <UntypedFormArray>this.VideoSubmitFormGroup.controls['item'] }
  initItemRow(data) {
    return this._fb.group({
      otpInput: [data, [Validators.required]]
    })
  }

  getControl(name: string) {
    return this.VideoSubmitFormGroup.get(name);
  }

  
  /**
   * submit password
   * @param form 
   */

  submitForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    this.submit = true;
    if (form.valid) {
      let formData = form.value;
      let filterEmpList = this.videoMatchUserAccess.filter(r=>r.EmployeeId == formData?.userEmpId)[0];
      formData['queryParam']=this.queryParam;
      formData['userEmail']=filterEmpList?.EmployeeEmail
      this.openOtpModal(formData);
    }
  }

  /**
   * reset form
   */
  resetForm() {
    this.VideoSubmitFormGroup.reset();
  }


}
