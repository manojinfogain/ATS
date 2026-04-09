import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { forkJoin } from 'rxjs';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { CANDIDATE_COMMON } from 'projects/ats-global-system-external/src/app/core/constant/candidate-common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
// import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal/update-address-candidate-modal.component';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
// import { COMMON_CONST } from '../../../core/constant/common.const';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnChanges {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public isRequired: boolean = true;
  @Input() public personalDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public candidatePersonalDetails: any = {};
  public FilterCtrlNationality: UntypedFormControl = new UntypedFormControl();
  public searchInputNationality: string;
  public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
  public searchInputSkills: string;
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  constructor(
    private _fb: UntypedFormBuilder,
    public dialog: MatDialog,
    private _candidateServe: CandidateService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _globalMethod:GlobalCommonMethodService
  ) { }
  public isFinalSumbit:boolean = false;
  public isFresherCandidate: boolean = false;
  
  ngOnInit(): void {
    this.callMasterAPI();
    this.InitPersonalForm();
    this.markRequiredFieldsAsTouched();
    this.isFresherCandidate = this._globalMethod.isCandidateFresherBGV();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if candidatePersonalDetails has changed and has a value
    if (changes['candidatePersonalDetails'] && 
        changes['candidatePersonalDetails'].currentValue && 
        Object.keys(changes['candidatePersonalDetails'].currentValue).length > 0) {
      // Only call if form is already initialized
      if (this.personalDetailsForm && Object.keys(this.personalDetailsForm.controls).length > 0) {
        this.getPersonalDetails();
      }
    }
  }

  private markRequiredFieldsAsTouched(): void {
    setTimeout(() => {
      Object.keys(this.personalDetailsForm.controls).forEach(key => {
        const control = this.personalDetailsForm.get(key);
        if (control?.validator) {
          const validator = control.validator({} as UntypedFormControl);
          if (validator && validator['required']) {
            control.markAsTouched();
          }
        }
      });
    }, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
      if(this._globalMethod.isBGVFinalSubmit()){
        this.isFinalSumbit= true;
      }
    },500);
  }

  /**
   * Get Personal Details - fetches BGV personal details from API
   */
  public addedPersonalInfo: any = [];
  getPersonalDetails(): void {
    this._candidateServe.GetBGVPersonalDetails().subscribe(
      res => {
        this.addedPersonalInfo = res['data'][0];
        if(this.addedPersonalInfo?.Id){
          this.setAddedValueToForm(this.addedPersonalInfo);
        }
        else{
          this.setValueToForm(this.candidatePersonalDetails);
        }
        
      }
    )
  }

  /***
   *  call master API
   */
  public titleList: any = [];
  public idTypeList:any = [];
  // public genderList:any = [];
  callMasterAPI() {
    forkJoin([
      this._exGlobal.GetCourtesyTitle(),
      this._exGlobal.GetDocumentType('I')
    ]).subscribe(
      res => {
        this.titleList = res[0]['data'];
        this.idTypeList = res[1]['data'];   
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
   * set value form 
   */
  setValueToForm(data: any) {

    this.personalDetailsForm.patchValue({
      
      "titleId": data?.GenderName ? this.patchTitle(data?.GenderName) : null,      
      "uanNumber": data?.uanNumber ? data?.uanNumber : null,
      "documentNumber": data?.documentNumber ? data?.documentNumber : null,
      "documentTypeId": 14, // data?.documentTypeId ? data?.documentTypeId : null,
      "dateOfBirth": data?.DOB ? data?.DOB : null,
      "mobileNumber": data?.MobileNumber ? data?.MobileNumber : null,
      "emailId":data?.Email ? data?.Email : null,
      "candidateName":data?.CandidateName ? data?.CandidateName : null,
      // "secondarySkill": data?.AddtionalSkillId != null && data?.AddtionalSkillId != '' ? data?.AddtionalSkillId.split(",") : null,
    });
    
  }
  /***
   * set value form 
   */
  setAddedValueToForm(data: any) {

    this.personalDetailsForm.patchValue({
      "Id": data?.Id ? data?.Id : null,
      "titleId": data?.TitleId ? data?.TitleId : null,      
      "uanNumber": data?.UANNumber ? data?.UANNumber : null,
      "documentNumber": data?.DocumentNumber ? data?.DocumentNumber : null,
      "documentTypeId": data?.DocumentTypeId ? data?.DocumentTypeId : null,
      "dateOfBirth": data?.DateOfBirth ? data?.DateOfBirth : null,
      "mobileNumber": data?.MobileNumber ? data?.MobileNumber : null,
      "emailId":data?.EmailId ? data?.EmailId : null,
      "candidateName":data?.CandidateName ? data?.CandidateName : null,
      // "secondarySkill": data?.AddtionalSkillId != null && data?.AddtionalSkillId != '' ? data?.AddtionalSkillId.split(",") : null,
    });
    
  }

  patchTitle(genderName: string): number {
    
    if(genderName == 'Male'){
      return 1;
    }else if(genderName == 'Female'){
      return 3;
    }else{
      return null;
    }
  }

  /***
   * Personal Form
   */

  InitPersonalForm() {
    this.personalDetailsForm = this._fb.group({
      Id: [null],
      titleId: [null, Validators.required],
      candidateName: [null, Validators.required],
      emailId: [null],
      mobileNumber: [null],
      dateOfBirth: [null, Validators.required],
      documentTypeId: [null, Validators.required],
      documentNumber: [null, Validators.required],
      uanNumber: [null, (!this._globalMethod.isCandidateFresherBGV() ? Validators.required : [])],
    })
  }

  getControl(name: string) {
    return this.personalDetailsForm.get(name);
  }
}
