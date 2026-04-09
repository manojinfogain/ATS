import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { Router } from '@angular/router';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { PartnerService } from '../partner.service';
import { NotMessageComponent } from './not-message/not-message.component';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { CONSTANTS } from '../../core/constant/constants';
@Component({
  selector: 'app-talent-id-assigned-partner',
  templateUrl: './talent-id-assigned-partner.component.html',
  styleUrls: ['./talent-id-assigned-partner.component.scss']
})
export class TalentIdAssignedPartnerComponent implements OnInit,OnDestroy {
  public assignTalentForm: UntypedFormGroup = new UntypedFormGroup({});
  public partnerList: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl([]);
  public searchInput: string;
  public reasonForAssingList: any = []
  @Input() public allSelected: boolean = false;
  @ViewChild('select') select: MatSelect;
  @Input() public parentIdControl: UntypedFormControl = new UntypedFormControl();
  public multiSelectedVal: any = [];
  @Output() getDataSource = new EventEmitter<any>();
  private refreshSubscription: Subscription = new Subscription();
  public accountTypeCtrl:UntypedFormControl = new UntypedFormControl();
  public salaryTypeList: any = CONSTANTS.salaryType;
  public remoteStatusList: any = [];
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _partnerServe: PartnerService,
    private _router: Router,
    private _globalServe: GlobalApisService,
    public dialog: MatDialog,
    private getLocInfo: GetLocationInfo,
  ) { }

  public FilterCtrlTalentList: UntypedFormControl = new UntypedFormControl();
  public searchInputTalent: string;
  public IsDropdownLoaderSearch:boolean = false;
  ngOnInit(): void {
    this.formInit();
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )
   
    this.getContractList();
    this.getOpenTalentIdList({});
    this._globalServe.getRemoteStatusList().subscribe(
      res=>{
        this.remoteStatusList = res['data'];
      }
    )
    

    this.FilterCtrlTalentList.valueChanges.
      pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(
        val => {
          this.IsDropdownLoaderSearch = true;
          this.searchInputTalent = val;
          this.getOpenTalentIdList({ searchText: val });
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

    this.locationWiseContracList();
    this.getReasonForAssignList();
    this.getTagHeadApproverList();
    this.formValidationLocWise();
    
  }

   /***
   * form validation location wise
   */

   formValidationLocWise(){
    if(this.isLocationIndia){
      this.getControl('SalaryType').reset();
      this.getControl('basePay').reset();
      this.getControl('workingRemoteStatus').reset();
      this.getControl('SalaryType').clearValidators();
      this.getControl('basePay').clearValidators();
      this.getControl('workingRemoteStatus').clearValidators();
      
    }
    else if(this.isLocationUS){
      this.getControl('SalaryType').setValidators([Validators.required]);
      this.getControl('basePay').setValidators([Validators.required]);
      this.getControl('workingRemoteStatus').setValidators([Validators.required]);
    }
    else{
      this.getControl('SalaryType').reset();
      this.getControl('basePay').reset();
      this.getControl('workingRemoteStatus').reset();
      this.getControl('SalaryType').clearValidators();
      this.getControl('basePay').clearValidators();
      this.getControl('workingRemoteStatus').clearValidators();
    
    }
    this.getControl('SalaryType').updateValueAndValidity();
    this.getControl('basePay').updateValueAndValidity();
    this.getControl('workingRemoteStatus').updateValueAndValidity();

  }

  /***
   * get Talent Id List
   */

  public talentIdList: any = [];
  getOpenTalentIdList(body:any) {

    this._partnerServe.getOpenTalentIdListAssignToPartner(body).subscribe(
      res=>{
           this.talentIdList = res['data'];
      }
    )
  }

  getDataSourcePartner(data: any) {
    debugger
    if (data && data.length !== 0) {
      let Ids = data.filter(n => n);
      this.getOpenTalentIdList({
        searchText: '',
        AccountId: Ids.toString(),
       });
    }
    else{
      this.getOpenTalentIdList({ searchText: '' });
    }
    
  }

  public BasePayLabel:string = 'Max Rate';
  selectSalaryType(e: any) {
    let val = e.value;
    if(val === 1){
      this.BasePayLabel = 'Max Rate (Annual)';
    }
    else if(val === 2){
      this.BasePayLabel = 'Max Rate (Monthly)';
    }
    else if(val === 3){
      this.BasePayLabel = 'Max Rate (Hourly)';
    }
  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }
  public FilterCtrlTAG: UntypedFormControl = new UntypedFormControl();
  public tagHeadList: any = [];
  getTagHeadApproverList() {
    let locId:number = 0;
    if(this.isLocationUS){
      locId = 3;
    }
    else{
      locId = 1;
    }
    this._partnerServe.getPartnerTagLeadApproverByLoc(locId).subscribe(
      res => {
        this.tagHeadList = res['data']
        this.FilterCtrlTAG.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }

  formInit() {
    this.assignTalentForm = this._fb.group({
      PartnerIDs: [[], [Validators.required]],
      reasonid: [null, [Validators.required]],
      thid: [null, [Validators.required]],
      candidateType: [[], [Validators.required]],
      Remarks: [null],
      TAGLeadID: [[], [Validators.required]],
      SalaryType:[null],
      basePay:[null],
      workingRemoteStatus:[null]
    })
  }

  getControl(name: string) {
    return this.assignTalentForm.get(name);
  }

  getPartnerList(e: any) {
    this.partnerList = e;
  }
  /***
   * get selected partner id's
   */
  public filterByExpiryList: any = [];
  getDataIdsPartners(e: any) {
    let maptoListVendor = this.partnerList.filter(t => {
      return e.indexOf(t.PartnerID) !== -1;
    });

    this.filterByExpiryList = maptoListVendor.filter(m => m.IsContractExpired === 1);
    if (this.filterByExpiryList.length != 0) {
      this.openMessageModal(this.filterByExpiryList);
      this.getControl('reasonid').disable();
      this.getControl('Remarks').disable();

    }
    else {
      this.getControl('reasonid').enable();
      this.getControl('Remarks').enable();
    }



  }


  openMessageModal(data: any) {
    const dialogRef = this.dialog.open(NotMessageComponent, {
      width: '650px',
      panelClass: ['ats-model-wrap', 'ats-msg-modal'],
      data: data,
      //  disableClose: true
    });
  }




  /**
   * 
   * @param e 
   */
  public contractTypeID: string = '';
  getcontractTypeID(e) {
    this.partnerIDControl.reset();
    this.contractTypeID = e.value.toString();
  }

  get partnerIDControl() { return this.assignTalentForm.get('PartnerIDs') }
  /***
   * register partner
   */
  submitForm(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      formData['PartnerIDs'] = formData.PartnerIDs.toString();
      formData['candidateType'] = formData.candidateType.toString();
      //   console.log("arTest1",form.value)
      this._partnerServe.assignTalentIdToPartner(formData).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.assignTalentForm.reset();
          // this._router.navigate(['user-details']);
        }
      )
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  resetForm() {
    this.assignTalentForm.reset()
  }

  gotPartnerDetailsPage(): void {
    this._router.navigate(['user-details'])
  }

  //get connect person
  getReasonForAssignList() {
    this._partnerServe.getReasonAssingList().subscribe((res) => {
      if(this.isLocationUS){
        this.reasonForAssingList = res.data;
      }
      else{
        this.reasonForAssingList = res.data.filter((item: any) => (item.ReasonId != '5' || item.ReasonId != 5));
      }
     
    });
  }
  public contactList: any = [];
  public prContactList: any = [];
  getContractList() {
    this._globalServe.GetContractTypes().subscribe(
      res => {
        this.prContactList = res['data'];
        this.locationWiseContracList();
      }
    )
  }
  locationWiseContracList(){
    if(this.isLocationUS){
      this.contactList = this.prContactList.filter((item: any) => item.ID == '3' || item.ID == '7' || item.ID == '8');
    }
    else{
     
      const filterContType = this.prContactList.filter(itemInArray => itemInArray.ID === 8 || itemInArray.ID === 3);
      this.contactList = filterContType;
    
    }
  }

  ///
  // public candidateTypeData: any = [];

  // getEmpType() {
  //   //get cand type
  //   this._intCommonServe.getCandidateType().subscribe(
  //     res => {
  //       this.contactList = res;
  //     }
  //   );
  // }

}
