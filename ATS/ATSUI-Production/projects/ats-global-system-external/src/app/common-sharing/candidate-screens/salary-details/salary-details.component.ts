import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { salaryMinMaxLoc } from '../../../core/constant/common.const';
import { ExternalUserGlobalApiService } from '../../../core/services/external-user-global-api.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public updateSalDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public salaryDetails: any = {};
  public today = new Date();
  @Input() public candidatePersonalDetails: any = {};
  public salRange: any = salaryMinMaxLoc;
  private candidateId =  this._storage.getCandidateId();
  constructor(
    private _fb: UntypedFormBuilder,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateServe: CandidateService,
    public _storage: GetSetStorageService,
    public _globalMethod: GlobalCommonMethodService
  ) { }

  public isMandatoryControl: boolean = true;
  public isFinalSumbit: boolean = false;
  ngOnInit(): void {
    console.log(this.candidatePersonalDetails);
    this.getCurrencyList();
    this.formInit();
    if (this._globalMethod.isCandidateFresher()) {
      this.getControl('salaryAmount').reset();
      this.getControl('salaryAmountPay').reset();
      this.getControl('salaryMonthlyInhand').reset();
      this.getControl('currentCTC').reset();
      this.getControl('currencyType').clearValidators();
      this.getControl('currentCTC').clearValidators();
      this.getControl('currentSalaryType').clearValidators();
      this.getControl('salaryAmount').clearValidators();
      this.getControl('salaryAmountPay').clearValidators();
      this.getControl('salaryMonthlyInhand').clearValidators();

      this.getControl('currencyType').updateValueAndValidity();
      this.getControl('currentCTC').updateValueAndValidity();
      this.getControl('currentSalaryType').updateValueAndValidity();
      this.getControl('salaryAmount').updateValueAndValidity();
      this.getControl('salaryAmountPay').updateValueAndValidity();
      this.getControl('salaryMonthlyInhand').updateValueAndValidity();
      this.getControl('currentSalaryType').disable();
      this.getControl('currentCTC').disable();
      this.getControl('salaryAmount').disable();
      this.getControl('salaryMonthlyInhand').disable();
      this.getControl('bonus').disable();
      this.claervalidationMinMax();
    }
    else{
      this.addvalidationMinMax();
    }
    if (this._globalMethod.isFinalSubmit()) {
      this.isFinalSumbit = true;
    }

    // this._candidateServe.getCandidatePersonalDetails().subscribe(
    //   res=>{
    //     this.candidatePersonalDetails =res['data'][0];
    //     

    //   }
    // )
    this._candidateServe.getCandidateSalaryDetails().subscribe(
      res => {
        this.salaryDetails = res['data'][0];
      }
    )
  }

  public currencyList: any = [];
  getCurrencyList() {
    this._exGlobal.GetCurrencyList().subscribe(
      res => {
        this.currencyList = res['data'];
        this.setFormValue();
      }
    )
  }
  /***
   * current salary type changed
   */
  public amountLabel: string = 'Amount (Fixed)';
  public variableTypeDrop: boolean = false;
  currentSalTypeChange(e: any) {

    this.getControl('variableType').reset();
   // this.getControl('salaryAmount').reset();
    this.getControl('salaryAmountPay').reset();
    if (e?.value == 'V') {
      this.variableTypeDrop = true;
      this.getControl('variableType').setValidators([Validators.required]);
      this.getControl('salaryAmountPay').setValidators([Validators.required,Validators.max(this.salRange.inrMax)]);
      //this.amountLabel = 'Amount';
      this.getLabel(this.getControl('variableType').value);
    } else {
    //  this.amountLabel = 'Amount';
      this.getControl('variableType').clearValidators();
      this.getControl('salaryAmountPay').clearValidators();
      this.variableTypeDrop = false;
    }
    this.getControl('variableType').updateValueAndValidity();
    this.getControl('salaryAmountPay').updateValueAndValidity();
  }

  /**
   * get Control
   */

  getControl(name: string) {
    return this.updateSalDetailsForm.get(name);
  }

  setFormValue() {
    this.updateSalDetailsForm.patchValue({
      currencyType: this.salaryDetails?.CurrencyId ? this.salaryDetails?.CurrencyId : null,
      currentCTC: this.salaryDetails?.CurrentCtc ? this.salaryDetails?.CurrentCtc : null,
      currentSalaryType: this.salaryDetails?.currentSalaryType ? this.salaryDetails?.currentSalaryType : 'F',
      variableType: this.salaryDetails?.variableType ? this.salaryDetails?.variableType : null,
      salaryAmount: this.salaryDetails?.salaryAmount !== null ? this.salaryDetails?.salaryAmount : null,
      salaryAmountPay: this.salaryDetails?.salaryAmountPay !== null ? this.salaryDetails?.salaryAmountPay : null,
      bonus: this.salaryDetails?.bonus ? this.salaryDetails?.bonus : null,
      salaryMonthlyInhand: this.salaryDetails?.salaryMonthlyInhand !== null ? this.salaryDetails?.salaryMonthlyInhand : null,
      salaryExpected: this.salaryDetails?.salaryExpected ? this.salaryDetails?.salaryExpected : null,
      expectedJoiningDate: this.salaryDetails?.expJoiningDate ? new Date(this.salaryDetails?.expJoiningDate) : null,
      noticePeriod: this.salaryDetails?.noticePeriod ? this.salaryDetails?.noticePeriod : null
    });
    this.getLabel(this.salaryDetails?.variableType);
  }

  formInit() {
    let dd = /^[1-9][0-9]*$/
    this.updateSalDetailsForm = this._fb.group({
      currencyType: [null, [Validators.required]],
      currentCTC: [null, [Validators.required]],
      currentSalaryType: ['F', [Validators.required]],
      variableType: [null],
      salaryAmount: [null, [Validators.required]],
      salaryAmountPay: [null],
      bonus: [null],
      salaryMonthlyInhand: [null, [Validators.required]],
      salaryExpected: [null, [Validators.required,]],
      expectedJoiningDate: [null, [Validators.required]],
      noticePeriod: [, [Validators.required]]
    });
    this.getLabel(this.getControl('variableType').value);
    
  }

  get currencyTypeControl() { return this.updateSalDetailsForm.get('currencyType'); }
  get currentCTCControl() { return this.updateSalDetailsForm.get('currentCTC'); }
  get currSalTypeControl() { return this.updateSalDetailsForm.get('currSalType'); }
  get variableTypeControl() { return this.updateSalDetailsForm.get('variableType'); }
  get variableAmountControl() { return this.updateSalDetailsForm.get('salaryAmount'); }
  get variableAmountPayControl() { return this.updateSalDetailsForm.get('salaryAmountPay'); }
  get incentiveControl() { return this.updateSalDetailsForm.get('incentive'); }
  get monthlyInHandControl() { return this.updateSalDetailsForm.get('monthlyInHand'); }
  get salExpectedControl() { return this.updateSalDetailsForm.get('salaryExpected'); }
  get expJoinDateControl() { return this.updateSalDetailsForm.get('expJoinDate'); }
  get noticePeriodControl() { return this.updateSalDetailsForm.get('noticePeriod'); }

  public variableType: string = '';
  selectVariableType(e: any) {
    this.getLabel(e.value);

  }

  /***
   * label
   */
  getLabel(val: string) {
    
    if (val == 'M') {
      this.amountLabel = 'Variable Pay Amount (Monthly)';
    } else if (val == 'Q') {
      this.amountLabel = 'Variable Pay  (Quarterly)';
    } else if (val == 'B') {
      this.amountLabel = 'Variable Pay  (Biannual)';
    } else if (val == 'A') {
      this.amountLabel = 'Variable Pay  (Annual)';
    }
    else {
      this.amountLabel = 'Amount';
    }
  }

  TotalExp() {
    let totalExp = this.candidatePersonalDetails?.totalExp;
    let totalExpM = this.candidatePersonalDetails?.totalExpMonth;

    if (totalExp == 0) {
      if (totalExpM > 1) {
        this.addvalidationMinMax()
      }
      else {
        this.claervalidationMinMax();
      }
    }
    else {
      this.addvalidationMinMax()
    }
  }

  addvalidationMinMax() {
    let currentSalary = this.getControl('currentCTC');
    let expectedSalary = this.getControl('salaryExpected');
    let monthlySalaryInHand = this.getControl('salaryMonthlyInhand');
    let currencyType = this.getControl('currencyType').value;
      if (currencyType == 2) {       
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);  
          this.getControl('salaryAmount').setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
         // this.getControl('salaryAmountPay').setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);  
          
      }
      else {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
          this.getControl('salaryAmount').setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
         // this.getControl('salaryAmountPay').setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
      }
      let monthlySalFromAnnual = parseInt(currentSalary?.value) / 12;
      monthlySalaryInHand.setValidators([Validators.required, Validators.min(0), Validators.max(monthlySalFromAnnual)]);
      currentSalary.updateValueAndValidity();
      expectedSalary.updateValueAndValidity();
      monthlySalaryInHand.updateValueAndValidity();
      this.getControl('salaryAmount').updateValueAndValidity();
      this.getControl('salaryAmountPay').updateValueAndValidity();

  }
  // public salRange: any = salaryMinMaxLoc;
  claervalidationMinMax() {
    let currentSalary = this.getControl('currentCTC');
    let expectedSalary = this.getControl('salaryExpected');
    let monthlySalaryInHand = this.getControl('salaryMonthlyInhand');
    let currencyType = this.getControl('currencyType').value;
      if (currencyType == 2) {
        this.getControl('salaryAmount').setValidators([ Validators.min(0), Validators.max(this.salRange.usdMax)]);
        this.getControl('salaryAmountPay').setValidators([ Validators.min(0), Validators.max(this.salRange.usdMax)]);
        this.getControl('salaryMonthlyInhand').setValidators([ Validators.min(0), Validators.max(this.salRange.usdMax)]);
        currentSalary.setValidators([ Validators.min(0), Validators.max(this.salRange.usdMax)]);
        expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        
      }
      else {
        currentSalary.setValidators([ Validators.min(0), Validators.max(this.salRange.inrMax)]);
        expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        this.getControl('salaryMonthlyInhand').setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        this.getControl('salaryAmount').setValidators([ Validators.min(0), Validators.max(this.salRange.inrMax)]);
        this.getControl('salaryAmountPay').setValidators([ Validators.min(0), Validators.max(this.salRange.inrMax)]);
       
      }   
    
    let monthlySalFromAnnual = parseInt(currentSalary?.value) / 12;
    monthlySalaryInHand.setValidators([ Validators.min(0), Validators.max(monthlySalFromAnnual)]);
    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();
    monthlySalaryInHand.updateValueAndValidity();
    this.getControl('salaryAmount').updateValueAndValidity();
    this.getControl('salaryAmountPay').updateValueAndValidity();
  }

}
