import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../../partner.service';
import { FILE_UPLOAD, salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewTalentidDetailsPartnerComponent } from '../../modals/view-talentid-details-partner/view-talentid-details-partner.component';
import { CONSTANTS } from '../../../core/constant/constants';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
@Component({
  selector: 'app-upload-profile-form',
  templateUrl: './upload-profile-form.component.html',
  styleUrls: ['./upload-profile-form.component.scss']
})
export class UploadProfileFormComponent implements OnInit, AfterViewInit {
  public talentIdList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public currencyTypeData: any = [];
  @Input() public CountryId: number;
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() public resumeMandatory: boolean = true;
  @Input() public emailReadOnly: boolean = false;
  @Input() public CurrentSalReq: boolean = true;
  public salaryTypeList: any = [];
  public imgFile: any;
  public imgSrc: any;
  @Output() getResumeOutput = new EventEmitter<any>();
  @ViewChild('myInput') myInputVariable: ElementRef;
  public TalentData: any = [];
  public today = new Date();
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  public visaTypeList: any = [];
  public FilterCtrlWorkVisa: UntypedFormControl = new UntypedFormControl();
  public minDate: any = new Date();
  @Input() public isEditUpdateForm: boolean = false;
  constructor(
    private _partnerServe: PartnerService,
    private _globalServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private getLocInfo: GetLocationInfo

  ) { }

  public searchInputWorkVisa: string = '';
  ngOnInit(): void {
    this.showHideLocWise();
    this.getGender();
    this.getTalentIdListByPartner();
    this.getContractList();
    this.FilterCtrlWorkVisa.valueChanges.subscribe(
      val => {
        this.searchInputWorkVisa = val;
      }
    );
    this._globalServe.getVisaTypeList().subscribe(
      res => {
        this.visaTypeList = res['data'];
      }
    )
    this._globalServe.getCurrency().subscribe(
      res => {
        this.currencyTypeData = res;
      }
    );
    setTimeout(() => {
      if (this.getControl('thid')?.value && this.talentIdList?.filter(item => item.thid == this.getControl('thid')?.value).length > 0) {
        this.isViewBtnDs = false;
        
        this.updateSetVal(this.getControl('thid').value);
      } else {
        this.isViewBtnDs = true;
        this.getControl('thid').reset();
      }
    }, 1000);
  }
  

  ngAfterViewInit(): void {
    if (this.isEditUpdateForm) {
      setTimeout(() => {
        this.updateSetVal(this.getControl('thid').value);
      }, 3000);

    }
  }



  //getgender
  public genderType: any = []
  getGender() {
    this._globalServe.getGenderList().subscribe(
      res => {
        this.genderType = res['data'];
      }
    )
  }

  // location wise check

  showHideLocWise() {
    debugger
    if (this.getLocInfo.isUserLocationIndia()) {
      this.isLocationIndia = true;
      this.isLocationUS = false;
    } else if (this.getLocInfo.isUserLocationUS()) {
      this.isLocationIndia = false;
      this.isLocationUS = true;
    }

    this.formValLocationWise();
  }

  formValLocationWise() {
    debugger
    if (this.isLocationUS) {
      this.salaryTypeList = CONSTANTS.salaryType;
      this.getControl('candiDob').clearValidators();
      this.getControl('curSalary').clearValidators();
      this.CurrentSalReq = false;
      this.getControl('currentOrg').clearValidators();
      this.getControl('eduQualification').clearValidators();
      this.getControl('StateID').setValidators([Validators.required]);
      this.getControl('workVisaStatus').setValidators([Validators.required]);
      this.getControl('relocation').setValidators([Validators.required]);

    }
    else {

      this.getControl('MobileNumber').setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
      this.getControl('MobileNumber').updateValueAndValidity();
      this.salaryTypeList = CONSTANTS.salaryType?.filter(d => d?.id == 1 || d?.id == 2);
      this.getControl('candiDob').setValidators([Validators.required]);
      this.CurrentSalReq = true;
      this.getControl('curSalary').setValidators([Validators.required]);
      this.getControl('currentOrg').setValidators([Validators.required]);
      this.getControl('eduQualification').setValidators([Validators.required]);
      this.getControl('StateID').clearValidators();
      this.getControl('workVisaStatus').clearValidators();
      this.getControl('relocation').clearValidators();
    }

    this.getControl('candiDob').updateValueAndValidity();
    this.getControl('curSalary').updateValueAndValidity();
    this.getControl('currentOrg').updateValueAndValidity();
    this.getControl('StateID').updateValueAndValidity();
    this.getControl('workVisaStatus').updateValueAndValidity();
    this.getControl('relocation').updateValueAndValidity();
    this.getControl('eduQualification').updateValueAndValidity();
    this.labelChange();
  }


  public isViewBtnDs: boolean = true;
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = true;
  talentIdChange(e) {
    this.isViewBtnDs = false;
    this.updateSetVal(e.value);

  }

  updateSetVal(value: string) {
    debugger
    this.contractList = [];
    this._partnerServe.getTalentIdInfo(value).subscribe(
      res => {
        this.TalentData = res['data'][0];
        this.getControl('PrimarySkill').patchValue(parseInt(this.TalentData?.primarySkillId));
        let contractData = res['contractTypes'];
        let HybridContract = contractData.filter(item => item.ContractTypeId == 7);
        //fitering contract type based on assigned contracts
        if (contractData.length === 0) {
          this.contractList = this.contractListAll;
        }
        else {
          if (HybridContract.length > 0) {
            let listCT = this.contractListAll.filter(itemInArray => itemInArray.ID === 8 || itemInArray.ID === 3);
            this.contractList = listCT;
          }
          else {
            let filterById = [];
            for (let i = 0; i < contractData.length; i++) {
              filterById.push(contractData[i].ContractTypeId)
            }
            let filteredContType = this.contractListAll.filter(t => {
              return filterById.indexOf(t.ID) !== -1;
            });
            this.contractList = filteredContType;
          }
        }



      }
    )
  }

  public expectedCtcLable: string = 'Expected CTC';
  getContract(event: any) {
    if (event.value === 8) {
      if (this.isLocationIndia) {
        this.CurrentSalReq = false;
        this.getControl('curSalary').clearValidators();
        this.getControl('curSalary').updateValueAndValidity();
      }
    }
    else {
      if (this.isLocationIndia) {
        this.CurrentSalReq = true;
        this.getControl('curSalary').setValidators([Validators.required]);
        this.getControl('curSalary').updateValueAndValidity();
      }
    }

    this.labelChange();

  }
  /**
   * 
   * @param event label change based
   */
  labelChange() {
    let contractType = this.getControl('contractTypeId').value;
    let salaryType = this.getControl('SalaryType').value;
    if (this.isLocationUS) {
      this.expectedCtcLable = 'Candidate Salary';
      if (contractType == 8) {
        // this.expectedCtcLable = 'Partner Rate'+;
        if (salaryType === 1) {
          this.expectedCtcLable = 'Partner Rate (Annual)';
        }
        else if (salaryType === 2) {
          this.expectedCtcLable = 'Partner Rate (Monthly)';
        }
        else if (salaryType === 3) {
          this.expectedCtcLable = 'Partner Rate (Hourly)';
        }
      }
      else {
        if (salaryType === 1) {
          this.expectedCtcLable = 'Candidate Salary (Annual)';
        }
        else if (salaryType === 2) {
          this.expectedCtcLable = 'Candidate Salary (Monthly)';
        }
        else if (salaryType === 3) {
          this.expectedCtcLable = 'Candidate Salary (Hourly)';
        }
      }
    }
  }

  totalExp(event: any) {
    let totalExp = this.getControl('totalExp').value;
    let totalExpM = this.getControl('totalExpMonth').value;
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
    this.labelChange();
  }



  addvalidationMinMax() {
    let currentSalary = this.getControl('curSalary');
    let expectedSalary = this.getControl('expSalary');
    let currencyType = this.getControl('currencyTypeId').value;
    let salTypeCtrl = this.getControl('SalaryType').value;

    if (this.CurrentSalReq) {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin),Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin),Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin),Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin),Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }
    }
    else {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.min(this.salRange.usdMin),Validators.max(this.salRange.usdMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin),Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMin), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdMonthlyMin), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.usdHrlyMin), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.min(this.salRange.inrMin),Validators.max(this.salRange.inrMax)]);
        // expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin),Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMin), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrMonthlyMin), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(this.salRange.inrHrlyMin), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }
    }
    if (this.isLocationUS) {
      currentSalary.clearValidators();
    }
    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();

  }
  public salRange: any = salaryMinMaxLoc;
  claervalidationMinMax() {
    let currentSalary = this.getControl('curSalary');
    let expectedSalary = this.getControl('expSalary');
    let currencyType = this.getControl('currencyTypeId').value;
    let salTypeCtrl = this.getControl('SalaryType').value;
    debugger
    if (this.CurrentSalReq) {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.usdMax)]);   
        // expectedSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.inrMax)]);   
        // expectedSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }

    }
    else {
      if (currencyType == 2) {
        // currentSalary.setValidators([Validators.min(0),Validators.max(this.salRange.usdMax)]);   
        // expectedSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.usdMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.usdHrlyMax)]);
        }
      }
      else {
        // currentSalary.setValidators([Validators.min(0),Validators.max(this.salRange.inrMax)]);   
        // expectedSalary.setValidators([Validators.required, Validators.min(0),Validators.max(this.salRange.inrMax)]);
        if (salTypeCtrl == 1) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMax)]);
        } else if (salTypeCtrl == 2) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrMonthlyMax)]);
        } else if (salTypeCtrl == 3) {
          currentSalary.setValidators([Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
          expectedSalary.setValidators([Validators.required, Validators.min(0), Validators.max(this.salRange.inrHrlyMax)]);
        }
      }
    }

    if (this.isLocationUS) {
      currentSalary.clearValidators();
    }

    currentSalary.updateValueAndValidity();
    expectedSalary.updateValueAndValidity();
  }

  /***
   * get talent Id List
   */
  getTalentIdListByPartner(): void {
    this._partnerServe.getTalentIdListByPartner().subscribe(
      res => {
        this.talentIdList = res['data'];
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }

  public contractList: any = [];
  public contractListAll: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        this.contractListAll = res['data'].filter(itemInArray => itemInArray.ID === 8 || itemInArray.ID === 3);
        this.contractList = this.contractListAll;
      }
    )
  }



  public isOtherSelected: boolean = false;
  getCompany(val: string) {
    let control = this.getControl('companyName');
    if (val === 'other') {
      this.isOtherSelected = true;
      control.setValidators([Validators.required]);
    }
    else {
      this.isOtherSelected = false;
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }

  getCountry(e) {
    this.CountryId = e;
  }
  getStateId(e) {
    this.CountryId = e;
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  fileUp(event) {
    // let allowedExtensions = /(\.jpg|\.jpeg|\.tiff)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let file = event.target.files[0];
    this.imgFile = file;
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.getControl('Resume').reset();

      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.getControl('Resume').reset();
      return false;
    }
    else {
      this.getControl('Resume').patchValue('file');
      this.getResumeOutput.emit(this.imgFile);

    }
  }

  viewTalentIdDetails() {
    let data = { th_id: this.getControl('thid').value, isPartner: true }
    const dialogRef = this.dialog.open(ViewTalentidDetailsPartnerComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true
    });

  }
}
