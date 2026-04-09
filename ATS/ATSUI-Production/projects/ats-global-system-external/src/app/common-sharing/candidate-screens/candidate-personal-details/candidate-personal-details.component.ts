import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { forkJoin } from 'rxjs';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CANDIDATE_COMMON } from 'projects/ats-global-system-external/src/app/core/constant/candidate-common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal/update-address-candidate-modal.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
// import { COMMON_CONST } from '../../../core/constant/common.const';

@Component({
  selector: 'app-candidate-personal-details',
  templateUrl: './candidate-personal-details.component.html',
  styleUrls: ['./candidate-personal-details.component.scss']
})
export class CandidatePersonalDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public isRequired: boolean = true;
  @Input() public personalDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public candidatePersonalDetails: any = {};
  public bloodGroupList: any = CANDIDATE_COMMON.bloodGroup;
  public bloodGroupListRh: any = CANDIDATE_COMMON.bloodGroupRh;
  public FilterCtrlNationality: UntypedFormControl = new UntypedFormControl();
  public searchInputNationality: string;
  public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
  public searchInputSkills: string;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 15, this.today.getMonth(), this.today.getDate());
  private candidateId =  this._storage.getCandidateId();
  constructor(
    private _fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _globalMethod:GlobalCommonMethodService,
    private _storage: GetSetStorageService
  ) { }
  public isFinalSumbit:boolean = false;
  ngOnInit(): void {
    this.callMasterAPI();
    this.InitPersonalForm();
    this.getPersonalDetails();
    // setTimeout(()=>{
    //   if(this._globalMethod.isFinalSubmit()){
    //     this.isFinalSumbit= true;
    //   }
    // },500);
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      if(this._globalMethod.isFinalSubmit()){
        this.isFinalSumbit= true;
      }
    },1000);
  }

  /**
   * get PAersonal
   */
  getPersonalDetails(type:string = 'N'){
    this._candidateServe.getCandidatePersonalDetails(this.candidateId).subscribe(
      res => {
        this.candidatePersonalDetails = res['data'][0];
        if(type == 'N'){
          this.setValueToForm(this.candidatePersonalDetails);
        }
        else{
          this.setValueToFormAddress(this.candidatePersonalDetails);
        }
        
      }
    )
  }

  /***
   *  call master API
   */
  public nationalityList: any = [];
  public maritalStatusList: any = [];
  public skillsList:any = [];
  // public genderList:any = [];
  callMasterAPI() {
    forkJoin([
      this._exGlobal.getNationalityMaster(),
      this._exGlobal.getMaritalStatusMaster(),
      this._exGlobal.getSkillsList(),
      // this._exGlobal.getGenderList()
    ]).subscribe(
      res => {
        this.nationalityList = res[0]['data'];
        this.maritalStatusList = res[1]['data'];
        this.skillsList = res[2]['data'];        
        // this.genderList = res[3]['data'];        
        this.FilterCtrlNationality.valueChanges.subscribe(
          val => {
            this.searchInputNationality = val;
          }
        ); 
        this.FilterCtrlSkills.valueChanges.subscribe(
          val => {
            this.searchInputSkills = val;
          }
        );
      }
    )
  }

  /***
   * 
   */
  validVisa(e: MatRadioChange) {
    let val = e.value;
    if (val == 'Y') {
      this.getControl('VisaValidUpto').setValidators([Validators.required])
    }
    else {
      this.getControl('VisaValidUpto').clearValidators();
      this.getControl('VisaValidUpto').reset();
    }

    this.getControl('VisaValidUpto').updateValueAndValidity();
  }
  /***
   * set value form 
   */
  setValueToForm(data: any) {
    let presentAddress:string = `${data?.AddressLine1?data?.AddressLine1+',':''}${data?.AddressLine2?data?.AddressLine2+',':''}
    ${data?.AddressLine3?data?.AddressLine3+',':''}${data?.cr_city?data?.cr_city+',':''}${data?.cr_state?data?.cr_state+',':''}
    ${data?.cr_postalCode?data?.cr_postalCode+',':''}${data?.cr_countryName?data?.cr_countryName:''}`
    let PermanentAddress:string = `${data?.pr_addressLine1?data?.pr_addressLine1+',':''}${data?.pr_addressLine2?data?.pr_addressLine2+',':''}
    ${data?.pr_addressLine3?data?.pr_addressLine3+',':''}${data?.pr_city?data?.pr_city+',':''}${data?.pr_state?data?.pr_state+',':''}
    ${data?.pr_postalCode?data?.pr_postalCode+',':''}${data?.pr_countryName?data?.pr_countryName:''}`
    let ContactAddressEmr:string = `${data?.em_addressLine1?data?.em_addressLine1+',':''}${data?.em_addressLine2?data?.em_addressLine2+',':''} ${data?.em_addressLine3?data?.em_addressLine3+',':''}${data?.em_city?data?.em_city+',':''}${data?.em_state?data?.em_state+',':''}
    ${data?.em_postalCode?data?.em_postalCode+',':''}${data?.em_countryName?data?.em_countryName:''}`;

    this.personalDetailsForm.patchValue({
      
      "FirstName": data?.FirstName ? data?.FirstName : null,
      "MiddleName": data?.MiddleName ? data?.MiddleName : null,
      "LastName": data?.LastName ? data?.LastName : null,
      "FatherName": data?.FatherName ? data?.FatherName : null,
      "MobileNumber": data?.phone ? data?.phone : null,
      "LandlineNumber": data?.LandlineNumber ? data?.LandlineNumber : null,
      "dob": data?.dob ? new Date(data?.dob) : null,
      // "MaritalStatus": data?.maritalStatus ? data?.maritalStatus : null,
      "MaritalStatus": data?.maritalStatus ? parseInt(data?.maritalStatus) : null,
      // "candidateGender": data?.GenderId ? data?.GenderId : null,
      "Nationality": data?.Nationality != null && data?.Nationality != '' ? data?.Nationality : null,
      "NationalityName": data?.Nationality == 0 && data?.NationalityName ? data?.NationalityName : null,
      "TotalExpYear": data?.totalExp ? data?.totalExp : null,
      "TotalExpMonth": data?.totalExpMonth ? data?.totalExpMonth : null,
      "RelevantExpyear": data?.releventExp ? data?.releventExp : null,
      "RelevantExpMonth": data?.releventExpMonth ? data?.releventExpMonth : null,
      "ITExpyear": data?.ITExpYear ? data?.ITExpYear : null,
      "ITExpMonth": data?.ITExpMonth ? data?.ITExpMonth : null,
      "BloodGroup": data?.BloodGroup ? data?.BloodGroup : null,
      "BloodGroupRh": data?.BloodGroupRh ? data?.BloodGroupRh : null,
      "PassportNo": data?.PassportNo ? data?.PassportNo : null,
      "ValidVisa": data?.ValidVisa ? data?.ValidVisa : 'N',
      "VisaValidUpto": data?.VisaValidUpto ? new Date(data?.VisaValidUpto) : null,
      "OverseasExp": data?.OverseasExp ? data?.OverseasExp : null,
      "Email": data?.email ? data?.email : null,
      "PresentAddress": data?.AddressLine1?presentAddress.replace(/ /g,''):null,
      "PermanentAddress":data?.pr_addressLine1?PermanentAddress.replace(/ /g,''):null,
      "ContactAddressEmr":data?.em_addressLine1?ContactAddressEmr.replace(/ /g,''):null,
      // "secondarySkill": data?.AddtionalSkillId != null && data?.AddtionalSkillId != '' ? data?.AddtionalSkillId.split(",") : null,
    });
    if (data?.ValidVisa == 'Y') {
      this.getControl('VisaValidUpto').setValidators([Validators.required]);
      this.getControl('VisaValidUpto').updateValueAndValidity();
    }
    if (data?.Nationality == 0) {
      this.getControl('Nationality').setValue(data?.Nationality);
      this.getNationalityId(data?.Nationality);
    }
    if(data?.AddtionalSkillId){
      let  splitId = data?.AddtionalSkillId?.split(",").map(Number);
      this.getControl('secondarySkill').setValue(splitId);
    }
  }


  /***
   * set value form 
   */
  setValueToFormAddress(data: any) {
    let presentAddress:string = `${data?.AddressLine1?data?.AddressLine1+',':''}${data?.AddressLine2?data?.AddressLine2+',':''}
    ${data?.AddressLine3?data?.AddressLine3+',':''}${data?.cr_city?data?.cr_city+',':''}${data?.cr_state?data?.cr_state+',':''}
    ${data?.cr_postalCode?data?.cr_postalCode+',':''}${data?.cr_countryName?data?.cr_countryName:''}`
    let PermanentAddress:string = `${data?.pr_addressLine1?data?.pr_addressLine1+',':''}${data?.pr_addressLine2?data?.pr_addressLine2+',':''}
    ${data?.pr_addressLine3?data?.pr_addressLine3+',':''}${data?.pr_city?data?.pr_city+',':''}${data?.pr_state?data?.pr_state+',':''}
    ${data?.pr_postalCode?data?.pr_postalCode+',':''}${data?.pr_countryName?data?.pr_countryName:''}`
    let ContactAddressEmr:string = `${data?.em_addressLine1?data?.em_addressLine1+',':''}${data?.em_addressLine2?data?.em_addressLine2+',':''} ${data?.em_addressLine3?data?.em_addressLine3+',':''}${data?.em_city?data?.em_city+',':''}${data?.em_state?data?.em_state+',':''}
    ${data?.em_postalCode?data?.em_postalCode+',':''}${data?.em_countryName?data?.em_countryName:''}`;
  
    this.personalDetailsForm.patchValue({
      "PresentAddress": data?.AddressLine1?presentAddress.replace(/ /g,''):null,
      "PermanentAddress":data?.pr_addressLine1?PermanentAddress.replace(/ /g,''):null,
      "ContactAddressEmr":data?.em_addressLine1?ContactAddressEmr.replace(/ /g,''):null
    });
  }
  /***
   * Personal Form
   */

  InitPersonalForm() {
    this.personalDetailsForm = this._fb.group({
      FirstName: [null],
      MiddleName: [null],
      LastName: [null],
      FatherName: [null, Validators.required],
      Email: [null, Validators.required],
      MobileNumber: [null, Validators.required],
      LandlineNumber: [null],
      dob: [null],
      MaritalStatus: [null, Validators.required],
      // candidateGender: [null, Validators.required],
      Nationality: [null, Validators.required],
      secondarySkill: [null],
      NationalityName: [null],
      TotalExpYear: [null, Validators.required],
      TotalExpMonth: [null, Validators.required],
      RelevantExpyear: [null, Validators.required],
      RelevantExpMonth: [null, Validators.required],
      ITExpyear: [null, Validators.required],
      ITExpMonth: [null, Validators.required],
      BloodGroup: [null, Validators.required],
      BloodGroupRh: [null, Validators.required],
      PassportNo: [null],
      ValidVisa: ['0', Validators.required],
      VisaValidUpto: [null],
      OverseasExp: [null],
      PresentAddress: [null, Validators.required],
      PermanentAddress: [null, Validators.required],
      ContactAddressEmr: [null, Validators.required]
    })
  }

  getControl(name: string) {
    return this.personalDetailsForm.get(name);
  }

  /***
   * add address
   */
  addUpdateAddress(type: string = ''): void {
    if(!this.isFinalSumbit){
      let element: any = { title: '' };
      if (type === 'C') {
        element['title'] = "Current Address";
      }
      if (type === 'P') {
        element['title'] = " Permanent Address";
      }
      if (type === 'E') {
        element['title'] = "Emergency Contact Address";
      }
      element['type'] =type;

      element['personalDetails']= this.candidatePersonalDetails;
      element['candidateId'] = this.candidateId;
      const dialogRef = this.dialog.open(UpdateAddressCandidateModalComponent, {
        width: '500px',
        panelClass: ['ats-model-wrap', 'add-family-modal', 'add-edu-modal'],
        data: element,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(
        result => {
          if (result) {
            this.getPersonalDetails('A');
          }
        }
      )
    }
   
  }

  public manualNatReq:boolean = false;
  getNationalityId(id:number){
    //for others
    // console.log(id)
    if (id == 0) {
      this.manualNatReq = true;
      this.getControl('NationalityName').setValidators([Validators.required])
    } else {
      this.manualNatReq = false;
      this.getControl('NationalityName').clearValidators();
    }
    this.getControl('NationalityName').updateValueAndValidity();
  }

  //
  triggerFuncAddlCandi(id: any) {
    let names = this.skillsList?.filter(d => d.SkillId == id)[0];
    return names?.SKillName;
  }

  //to show the age of the candidate
  // calculateAge(val:any){
  //   let birthDate = new Date(val);
  //   let timeDiff = Math.abs(Date.now() - birthDate?.getTime());
  //   let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  //   return `${age} years`;
  // }
}
