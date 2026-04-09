import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
@Component({
  selector: 'app-add-more-talent-details-modal',
  templateUrl: './add-more-talent-details-modal.component.html',
  styleUrls: ['./add-more-talent-details-modal.component.scss']
})
export class AddMoreTalentDetailsModalComponent implements OnInit {
  public addTalentDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  public selectedEmployeeDetails: any[];
  public employeeList: any[];
  public priSkillList: any = [];
  public primarySkillsList: any = [];
  public departmentList: any = [];
  public filterCtrlPrimarySkill: UntypedFormControl = new UntypedFormControl();
  public searchInputPrimarySkill: string;
  public formAppearance: string = 'outline';
  public filterParam: any = {};
  public user: any = [];
  public formClassCol: string = 'ats-form-col';

  public filterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchCtrlAccount: string;
  public minDatebilling: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<AddMoreTalentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _globalServe: GlobalApisService,
  ) { }

  ngOnInit(): void {
    this.getRequirementTypeList(1);
    this.getBillingTypeList();
    this.FormInit();
    this.setDefault();
    /**accouny search */
    this.filterCtrlAccount.valueChanges.subscribe(
      val => {
        this.searchCtrlAccount = val;
      }
    )
  }

  //call on load
  setDefault() {
    if (this.data?.SFDCAccountId) {
      this.getSfdcClientList(this.data?.SFDCAccountId);
    }
    if (this.data?.AccountID) {
      this.getProjectsList(this.data?.AccountID);
    }

    this.showHideBilableFileds(this.data);

    // let data: any = [];
    // data['value'] = this.data?.IsBillableID;
    // this.showHideBillableFields(data);

    // this.getControl('Billable').patchValue(this.data?.IsBillableID ? this.data?.IsBillableID : null);
  }



  FormInit() {
    this.addTalentDetailsForm = this._fb.group({
      requirementType: [null, [Validators.required]],
      accountId: [null, [Validators.required]],
      opportunityId: [null, [Validators.required]],
      projectNameId: [null],
      SFDCClient: [null],
      Billable: [null, [Validators.required]],
      BillingType: [null],
      billableRates: [null],
      // expectedMargin:[],
      BillableHours: [null],
      plannedBillingStartDate: [null],
      remarks: [null]
    })
  }

  /** hide bilable for pipeline because piple halready contain them */
  public showHideBillable: boolean = false;
  showHideBilableFileds(data: any) {
    if (data?.ReqTypeID == 1) {
      this.clearValidators('Billable');
      this.showHideBillable = false;

    } else {
      this.showHideBillable = true;
      this.addValidator('Billable');
    }
    // this.getControl('requirementType').patchValue(this.data?.ReqTypeID);
  }
  /**get requrement type list */
  public requirementType: any = [];
  public requirmentTypeFiltered: any = [];
  getRequirementTypeList(empUnitId: number) {
    this._talentServ.getRequirementTypeList(empUnitId).subscribe(
      res => {
        /**showing two requirement type in dropdown -> pipeline and new addition for exsiting project when changing from proactive*/
        // showing two requirement type in dropdown ->new addition  when changing from pipeline
        // var filterReqType = res['data'].filter(user => user.ID == 1 || user.ID == 2);
        // this.requirementType = filterReqType;
        if (this.data?.ReqTypeID == 1) {
          this.requirementType = res['data'].filter(user => user.ID == 2);
        } else if (this.data?.ReqTypeID == 5) {
          this.requirementType = res['data'].filter(user => user.ID == 1 || user.ID == 2);
        }
      }
    )
  }

  /** date filter exclude sat/sun */
  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  //userInput: string = ''; // 
  blockDeleteBelowLimit(e: KeyboardEvent, el: HTMLInputElement | HTMLTextAreaElement) {
    const minLength = 26;
    const keysToBlock = ['Backspace', 'Delete'];
    // If input has less than or equal to 15 characters and delete key is pressed
    if (el.value.length <= minLength && keysToBlock.includes(e.key)) {
      e.preventDefault();
    }
  }

  /**get account list */
  public filteredThidAcciuntId: any;
  public accountList: any = [];
  getAccountList(reqType: number, duId: number, empUnitId: number) {
    this._talentServ.getAccountList(reqType, duId, empUnitId).subscribe(
      res => {
        this.accountList = res['data'];
        this.filteredThidAcciuntId = this.accountList.filter(x => x.SFDCAccountID == this.data?.SFDCAccountId);
        /**requirement type 1 piplline for sfdc account other all from aspire */
        if (this.requirementTypeID == 1) {
          this.getControl('accountId').patchValue(this.data?.SFDCAccountId ? this.data?.SFDCAccountId : null);
        } else {
          this.getControl('accountId').patchValue(this.data?.SFDCAccountId ? this.data?.SFDCAccountId : null);
        }

        /**calling project here - filtering  AccountID using sfdcAccount */
        this.getProjectsList(this.filteredThidAcciuntId[0]?.AccountID);
      }

    );
  }




  /**opportunity data */
  public opportunitiyList: any = [];
  public filteredOpportunityList: any = [];
  public filterCtrlOpportunity: UntypedFormControl = new UntypedFormControl();
  public searchCtrlOppurtunity: string;
  getOpportunityList(accountId: string, reqType: number) {
    /**search */
    this.filterCtrlOpportunity.valueChanges.subscribe(
      val => {
        this.searchCtrlOppurtunity = val;
      }
    )
    this._talentServ.GetOpportunityDetailsForMapping(accountId, reqType, this.data?.TH_ID).subscribe(
      res => {
        this.opportunitiyList = res['data'];
        //this.opportunityData =res['data'][0];
      }
    )
  }


  /**get project list */
  public projectList: any = [];
  // public opportunitiyList: any = [];
  public filterProjectCtrl: UntypedFormControl = new UntypedFormControl();
  public searchProjectCtrl: string;
  getProjectsList(accountId: number) {
    /**search */
    this.filterProjectCtrl.valueChanges.subscribe(
      val => {
        this.searchProjectCtrl = val;
      }
    )
    if (this.requirementTypeID == 2 || this.requirementTypeID == 3 || this.requirementTypeID == 4 || this.requirementTypeID == 6) {
      this._talentServ.getProjectsList(accountId).subscribe(
        res => {
          this.projectList = res['data'];
        }
      )
    }

  }

  /** get sfdc clent list*/
  public SfdcClientList: any = [];
  getSfdcClientList(accountId: string) {
    this._talentServ.getSfdcClientList(accountId).subscribe(
      res => {
        this.SfdcClientList = res['data'];

        this.getControl('SFDCClient').patchValue(this.SfdcClientList[0]?.AccountId);
      }
    )
  }
  /***
   * get Recuirment Type base on emp unit
   */
  public employeeUnitCont: UntypedFormControl = new UntypedFormControl([Validators.required]);
  getReqTypeIdByEmpUnit() {
    /**if emp unit support then we are sending hard coded requrement id for account list  */
    let requirementTypeID = this.employeeUnitCont.value === 1 ? this.requirementTypeID : 2;

    return requirementTypeID;
  }


  public projectNameIdCtrl: boolean = false;
  public SFDCClientCtrl: boolean = false;
  public offshoreHMctrl: boolean = false;

  /**getting requrement type id*/
  public requirementTypeID: number;
  /**get reqTypeId on change */
  getReqTypeId(e: any) {
    this.requirementTypeID = e.value;
    this.resetControl('SFDCClient');
    this.resetControl('projectNameId');
    this.resetControl('accountId');
    this.isOpportunityActive = false;
    this.accountList = [];
    this.opportunitiyList = [];
    this.opportunityData = [];
    this.projectList = [];
    this.projData = [];
    /**account , opportunity, sfdcClient and project api calling on change of reqrequirement type */
    this.getAccountList(this.requirementTypeID, 0, 1);
    this.getOpportunityList(this.data?.SFDCAccountId, this.getControl('requirementType').value);
    this.getSfdcClientList(this.data?.SFDCAccountId);

    if (this.data?.AccountID) {
      this.getProjectsList(this.data?.AccountID);
    }

    /**requirement type 2 for new addition and else 1 for pipeline */
    if (e.value == 2) {
      this.SFDCClientCtrl = true;
      this.addValidator('SFDCClient');
      this.projectNameIdCtrl = true;
      this.addValidator('projectNameId');
      this.offshoreHMctrl = true;
    } else {
      this.clearValidators('SFDCClient');
      this.SFDCClientCtrl = false;
      this.clearValidators('projectNameId');
      this.projectNameIdCtrl = false;
      this.offshoreHMctrl = false;
    }

  }

  /**get account details on change */
  /**getting accountid */
  public filteredAccountList: any = [];
  public filteredSfdcAccount: string;
  getAccountId(data: any) {
    const accountId = data.value;
    this.getControl('opportunityId').reset();
    this.getControl('projectNameId').reset();
    this.getControl('SFDCClient').reset();
    this.projData = [];
    this.opportunityData = [];
    /**filtering data for accoutnt  sfdc */
    this.filteredAccountList = this.accountList.filter(x => x.AccountID === data.value);
    this.filteredSfdcAccount = this.filteredAccountList[0]?.SFDCAccountID;
    this.getProjectsList(accountId);
    this.getOpportunityList(this.filteredSfdcAccount, this.requirementTypeID);
    this.getSfdcClientList(this.filteredSfdcAccount);


  }

  /**getting project data onchange offshore onshore etc */
  public projData: any = [];
  getProject(data: any) {
    let projFilteredData = this.projectList.filter(x => x.ProjectID === data.value);
    this.projData = projFilteredData[0];
  }
  public isOpportunityActive: boolean = false;
  /**for opportunity data */
  public opportunityData: any = [];
  getOpportunity(data: any) {
    this.filteredOpportunityList = this.opportunitiyList.filter(x => x.OppID === data.value);
    this.opportunityData = this.filteredOpportunityList[0];
    if (this.getControl('opportunityId').valid) {
      setTimeout(() => {
        this.isOpportunityActive = true;
      }, 300)
    } else {
      this.isOpportunityActive = true
    }

  }

  /**to reset dropdowns */
  resetEployeListDropAndTableList() {
    this.getControl('referEmployees').reset();
    // this.currentSelectedEmployeeList = [];
  }

  //control for form
  getControl(name: string) {
    return this.addTalentDetailsForm.get(name);
  }
  /**to prevent greater than 100 - expected margin */
  keyUp(event) {
    if (event.target.value > 100 || event.target.value < 1) {
      // let length = event.target.value.length;
      // event.target.value = event.target.value.slice(0, length - 1);
      //this.resetControl('expectedMargin')
      return false;
    }
  }

  /**reset all filters including table data */
  clearAllHandler() {
    //this.resetEployeListDropAndTableList();
    this.getControl('requirementType').reset();
    this.getControl('accountId').reset();
    this.getControl('opportunityId').reset();
    this.resetControl('SFDCClient');
    this.resetControl('projectNameId');
    this.resetControl('Billable');
    this.resetControl('BillingType');
    this.resetControl('billableRates');
    this.resetControl('BillableHours');
    this.resetControl('plannedBillingStartDate');
    this.resetControl('remarks');
    this.projData = [];
    this.opportunityData = [];
    this.opportunitiyList = [];
    this.accountList = [];
    this.isOpportunityActive = false;
  }
  /**billable val - show/hide based on billable field*/
  public isBillableYes: boolean = false;
  //public isAttechmentRequired: boolean = false;
  //public isBillingDateVisib: boolean = false;
  getBilableVal(data: any) {
    this.showHideBillableFields(data);
  }

  showHideBillableFields(data: any) {
    //this.resetControl('expectedMargin');
    this.resetControl('BillingType');
    this.resetControl('billableRates');
    this.resetControl('BillableHours');
    this.resetControl('plannedBillingStartDate');
    if (data?.value == 'Y') {
      this.isBillableYes = true;
      this.addValidator('BillingType');
      this.addValidator('billableRates');
      this.addValidator('plannedBillingStartDate');
      // this.addValidator('expectedMargin');
      this.addValidator('BillableHours');

    } else {
      this.clearValidators('BillingType');
      this.clearValidators('billableRates');
      this.clearValidators('plannedBillingStartDate');
      // this.clearValidators('expectedMargin');
      this.clearValidators('BillableHours');
      this.isBillableYes = false;
    }
  }
  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }
  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }
  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }


  /**zero is prevent for bill rates */
  keyUpBillRate(event) {
    if (event.target.value < 1) {
      // this.getControl('billableRates').reset();
      this.resetControl('billableRates')
      return false;
    }
  }
  //  submit form for refer
  submitFormHandler(form: UntypedFormGroup) {
    this.addTalentDetailsForm.markAllAsTouched();
    if (form.valid) {
      let data = form.value;
      let body = {}
      body['THID'] = this.data?.TH_ID;

      if (data.requirementType) {
        body['ReqTypeID'] = data.requirementType;
      }
      if (data.opportunityId) {
        body['OppID'] = data.opportunityId;
      }
      debugger
      //new addition
      // if (data.requirementType == 2) {
      //   body['AccountID'] = data?.accountId;
      // }
      //pipeline
      if (data.requirementType == 1 || data.requirementType == 2) {
        body['SFDCAccountID'] = this.getControl('accountId').value;
      }
      if (data.projectNameId) {
        body['ProjectID'] = data.projectNameId;
      }
      if (data.Billable) {
        body['IsBillable'] = data.Billable;
      }
      if (data.billableRates) {
        body['BillableRate'] = data.billableRates;
      }
      if (data.plannedBillingStartDate) {
        // body['pBillingStartDate'] = data.plannedBillingStartDate;
        body['pBillingStartDate'] = GlobalMethod.formatDate(data.plannedBillingStartDate);
      }

      if (data.BillableHours) {
        body['BillingHour'] = data.BillableHours;
      }
      if (data.BillingType) {
        body['BillingType'] = data.BillingType;
      }
      if (this.opportunityData?.BidTypeID) {
        body['BidType'] = this.opportunityData?.BidTypeID;
      }
      if (data.remarks) {
        body['Remarks'] = data.remarks;
      }
      this._talentServ.MappingOppIDtoTHID(body).subscribe(

        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      form.markAllAsTouched();
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }

  public BillingTypeList: any = [];
  getBillingTypeList() {
    this._globalServe.getBillingTypeList().subscribe(
      res => {
        this.BillingTypeList = res['data'];
      }
    )
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
