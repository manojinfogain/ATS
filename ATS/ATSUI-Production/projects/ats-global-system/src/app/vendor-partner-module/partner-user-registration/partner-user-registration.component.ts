import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../partner.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-user-registration',
  templateUrl: './partner-user-registration.component.html',
  styleUrls: ['./partner-user-registration.component.scss']
})
export class PartnerUserRegistrationComponent implements OnInit,OnDestroy {
  public userRegistrationForm:UntypedFormGroup = new UntypedFormGroup({});
  public partnerList:any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    private _fb:UntypedFormBuilder,
    private _share:ShareService,
    private _partnerServe:PartnerService,
    private _storage:GetSetStorageService,
    private _router:Router,
    private getLocInfo: GetLocationInfo
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
       this.showHideLocWise();
      }
    )
  
    
  }

   // location wise check
   public isLocationUS: boolean = false;
   public isLocationIndia: boolean = false;
   showHideLocWise() {
    if (this.getLocInfo.isLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
    }

    this.formValidationLocWise();
  
  }

  /***
   * form validation location wise
   */

  formValidationLocWise(){
    if(this.isLocationIndia){
      this.getControl('ContactNo').clearValidators();
      this.getControl('ContactNo').reset();
      this.getControl('Name').reset();
      this.getControl('Name').clearValidators();
      
    }
    else if(this.isLocationUS){
      this.getControl('ContactNo').setValidators([Validators.required]);
      this.getControl('Name').setValidators([Validators.required]);
    }
    else{
      this.getControl('ContactNo').clearValidators();
      this.getControl('ContactNo').reset();
      this.getControl('Name').reset();
      this.getControl('Name').clearValidators();
    }
    this.getControl('ContactNo').updateValueAndValidity();
    this.getControl('Name').updateValueAndValidity();

  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }

  formInit(){
   this.userRegistrationForm = this._fb.group({
      Email:[null,[Validators.required,Validators.pattern(COMMON_CONST.emailregex)]],
      PartnerID:[null,[Validators.required]],
      Remarks:[null],
      ContactNo:[null],
      Name:[null]
    })
  }

  getControl(name:string){
    return this.userRegistrationForm.get(name);
  }
  /***
   * register partner
   */
  registerPartner(form:UntypedFormGroup){
    form.markAllAsTouched();
    if(form.valid){
      let formData = form.value;
      formData['AddedBy']= this._storage.getUserEmpId();
      this._partnerServe.createPartnerUser(formData).subscribe(
        res=>{
          this._share.showAlertSuccessMessage.next(res);
          this.userRegistrationForm.reset();
          this._router.navigate(['user-details']);
        }
      )
    }
    else{
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  resetForm(){
    this.userRegistrationForm.reset({ContractAvailability:'y'})
  }

  gotPartnerDetailsPage():void{
    this._router.navigate(['user-details'])
  }
}
