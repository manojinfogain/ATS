import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin, pipe } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../offer.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
@Component({
  selector: 'app-send-for-approval-modal',
  templateUrl: './send-for-approval-modal.component.html',
  styleUrls: ['./send-for-approval-modal.component.scss']
})
export class SendForApprovalModalComponent implements OnInit, AfterViewInit {
  //
  public sendForApprovalForm: UntypedFormGroup = new UntypedFormGroup({});
  gotSendApprovalSubmit: any
  //
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public gradeBandList: any = [];
  public jobFamilyList: any = [];
  public offerAprDt: any = [];
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public salaryTypeList: any = CONSTANTS.salaryType;
  public billingHours: any = [8, 9];
  public billingRateControl: UntypedFormControl = new UntypedFormControl();
  public projectBufferControl: UntypedFormControl = new UntypedFormControl();
  public billableHoursDayControl: UntypedFormControl = new UntypedFormControl(8);
  public billingCurrencyControl: UntypedFormControl = new UntypedFormControl();
  public minDate: any = new Date();
  public minDateEnd: any = new Date();
  public JfCategList: any = CONSTANTS.JfCategList;
  public RehireList: any = CONSTANTS.RehireList;
  constructor(
    public dialogRef: MatDialogRef<SendForApprovalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _globalApi: GlobalApisService,
    private _fb: UntypedFormBuilder,
    private _offerService: OfferService,
    private _globalApiServe: GlobalApisService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    //
    this.getCurrency();
    this.getTagHeadApproverList(this.divisionID);
    this.getLocation();
    this.getContractList();
    this.sendApprovalForm()
    this.getCandidateDetails();
    this.getGrade();
    this.getCTC();
    this.getjobFamily(this.divisionID);
    this.remaarkValidation();
    this.getDivisionList();
    // this.billableHoursDayControl.patchValue(8);
    // console.log("AR", this.dgmData?.variance)

  }



  ngAfterViewInit(): void {
    this.inputValueChangedFunc();
  }

  public isRemarkReq: boolean = false;
  remaarkValidation() {
    let remarkCtrl = this.getControl('remarks');
    if (this.dgmData?.variance > 0 ||
      this.data.OfferStatusID === 120 ||
      this.data.OfferStatusID === 140 ||
      this.data.OfferStatusID === 160 ||
      this.data.OfferStatusID === 180) {
      this.isRemarkReq = true;
      remarkCtrl.setValidators(Validators.required);
    }
    else {
      remarkCtrl.clearValidators();

      this.isRemarkReq = false;

    }

    remarkCtrl.updateValueAndValidity();

  }

  public currencyTypeData: any = [];
  getCurrency() {
    //get cand type
    this._globalApi.GetCurrencyList().subscribe(
      res => {
        this.currencyTypeData = res['data'];
      }
    );
  }
  public tagHeadList: any = [];
  getTagHeadApproverList(divisionID:number) {
    this._globalApiServe.getTagHeadApproverList(divisionID).subscribe(
      res => {
        this.tagHeadList = res['data']
        this.FilterCtrl.valueChanges.subscribe(
          val => {
            this.searchInput = val;
          }
        )
      }
    )
  }

  getGrade() {
    this._globalApiServe.getGradeList().subscribe(
      res => {
        this.gradeList = res['data']
      }
    );
  }
  getGradeBand(id: number) {
    this._globalApiServe.getGradeBandList(id).subscribe(
      res => {
        this.gradeBandList = res['data']
      }
    );
  }

  getjobFamily(id:number) {
    this._globalApiServe.getJobFamilyList(id).subscribe(
      res => {
        this.jobFamilyList = res['data']
      }
    );
  }

  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [1, 2, 4, 5];
        let filterLocation = res['data'].filter(loc =>{
           return ids.indexOf(loc.LocID)!== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }

  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._globalApiServe.getDivisionList().subscribe(
      res => {
        this.divisionList = res['data'];
      }
    );
  }

  /**
   * Division on changed
   * @param event 
   */
  public gradeBandReq: boolean = true;
  public isNNT:boolean = false;
  public divisionID:number = 1;
   divisionChanged(event: any) {
     this.divisionID = event.value;
    if(event.value == 2){
      this.isNNT = true;
      this.gradeBandReq = false;
      this.getControl('gradeBand').clearValidators();
      this.getControl('gradeBand').reset();
    }else{
      this.isNNT = false;
      this.gradeBandReq = true;
      if( this.offerAprDt){
        this.getControl('gradeBand').patchValue(this.offerAprDt.gradeBandId);
      } 
      this.getControl('gradeBand').setValidators([Validators.required]);
    }
    this.getControl('gradeBand').updateValueAndValidity();
    this.getTagHeadApproverList(event.value);
    this.getjobFamily(event.value);
    this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value,this.divisionID);
  }

  public contactList: any = [];
  getContractList() {
    this._globalApiServe.GetContractTypes().subscribe(
      res => {
        let filterById = [1, 2, 3, 6]
        let filterByStatus = res['data'].filter(t => {
          return filterById.indexOf(t.ID) !== -1;
        });
        this.contactList = filterByStatus;
      }
    )
  }

  // upload multiple  documents 
  public isFileReq: boolean = false;
  uploadButtonValidation(bgvDocList: any) {
    let fileControl = this.getControl('fileBGV');
    if (bgvDocList.length === 0) {
      fileControl.setValidators(Validators.required);
      this.isFileReq = true;
    }
    else {
      this.previewFileExist(bgvDocList);
      fileControl.clearValidators();
      this.isFileReq = false;
    }

    fileControl.updateValueAndValidity();

  }
  public existFilesBgv: any = [];
  previewFileExist(files: any = []) {
    if (files.length != 0) {
      for (let x in files) {
        this.existFilesBgv.push({ name: files[x].FileName, type: 'e' })
      }
      this.allFiles = this.existFilesBgv;
    }


  }


  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getOfferApprovalAttachaments(`cid=${this.data.cid}&ActionTakenBy=R`)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.previewFileExist(res[3]['data']);
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        // console.log(this.allRoundList);
        // console.log(this.candData);
        // console.log(this.offerAprDt);
        // console.log(this.selectedList);
        if (this.offerAprDt.OfferID === null) {
          this.setDefaultValue(this.selectedList[0]);
          this.getGradeBand(this.candData.gradeId);
          // this.DefaulDGMCalc();
          // this.getApproverCont(this.candData.gradeId, this.selectedList[0].CTC, this.candData.skillId, this.candData.totalExpYear, this.candData.totalExpMonth);
        }
        else {
          this.getGradeBand(this.offerAprDt.gradeId);
          this.getApproverCont(this.offerAprDt.gradeId, this.offerAprDt.gradeBandId, this.offerAprDt.CTC, this.offerAprDt.JobFamilyID || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.offerAprDt.CandidateTypeID, this.divisionID);
          setTimeout(() => {
            this.setDefaultValue(this.offerAprDt);
            this.hideVandOtherContract(this.offerAprDt?.CandidateTypeID);
            this.getDGMCalcValue(1, this.offerAprDt.gradeId, this.offerAprDt.gradeBandId);
          }, 1000);

        }

      }
    )
  }



  /***
   * hide for contractor
   */
  public isHideVarience: boolean = true;
  hideVandOtherContract(id: number) {
    if (id == 1 || id == 2) {
      this.isHideVarience = false;
    }
    else {
      this.isHideVarience = true;
    }
  }


  public allFiles: any = [];
  public allFilesBGV: any = [];
  @ViewChild('fileBGV') fileBGV: ElementRef;
  fileUp(event: any) {
    this.getControl('fileBGV').reset();
    this.allFiles = [];
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf|\.msg|\.xlsx)$/i;
    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let fileName = files[i].name;
      if (!allowedExtensions.exec(fileName)) {
        this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf/msg/xlsx only.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;
      }
      else if (files[i].size > FILE_UPLOAD.FILE_SIZE) {
        this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
        event.target.value = "";
        this.allFiles = [];
        this.getControl('fileBGV').reset();
        return false;

      }
      else {
        this.getControl('fileBGV').patchValue('files');
        this.allFiles.push(files[i]);
        this.allFilesBGV.push(files[i]);
      }

    }

    this.allFiles = [...this.allFiles, ...this.existFilesBgv];
  }

  //
  sendApprovalForm() {
    this.sendForApprovalForm = this._fb.group({
      SalaryType: [1, [Validators.required]],
      JoiningLocationID: [null, [Validators.required]],
      DateOfJoining: [null, [Validators.required]],
      CandidateTypeID: [null, [Validators.required]],
      DesignationId: [null, [Validators.required,]],
      gradeId: [null, [Validators.required]],
      gradeBand: [null, Validators.required],
      JobFamilyID: [null, [Validators.required]],
      JfCateg: [null],
      reHire: ['N', [Validators.required]],
      ctc: [null, [Validators.required]],
      joiningBonus: [null, [Validators.max(300000)]],
      NoticeBuyOut: [null, [Validators.max(200000)]],
      TravelExp: [null, [Validators.max(50000)]],
      RelocationExp: [null, [Validators.max(100000)]],
      RetentionBonus: [null, [Validators.max(300000)]],
      // offerGivenBy: [null, [Validators.required]],
      TAGLead_Approver: [null, [Validators.required]],
      DH_Approver: [null],
      SVP_Approver: [null],
      PartnerID: [null],
      ContractCompletionDate: [null],
      lwdDate: [null],
      ServiceAndMarkup: [null],
      fileBGV: [null],
      DivisionID: [null, [Validators.required]],
      /** DGM Control */
      billingRateHrCurrency: [null],
      billingCurrencyId: [2],
      NonReimbursableTravelCost: [null],
      projectSpecificCost: [null],
      projectBuffer: [null],
      billableHoursDay: [8],
      remarks: [null]

    })

  }

  myFilterDate = (d: Date): boolean => {
    const day = d?.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  /***
   * defaul dgm calc value
   */
  DefaulDGMCalc() {
    let body = {
      cid: this.data.cid,
      billingCurrencyId: '2',
      billableHoursDay: 8,
      JoiningLocationId: '1',
      billingRate: this.candData?.billingRateHrCurrency,
      gradeId: this.candData.gradeId
    }
    this.dgmCallAPI(body);
  }
  /***
   * get DGM calc value
   */
  public localCurrency: string;
  public localCurrencyId: string;
  public dgmData: any;
  getDGMCalcValue(type: number, gradeId: number, GradeBand: number) {

    let formValue = this.sendForApprovalForm.value;
    let localCurrencyId = this.locationList.filter(v => v.LocID === parseInt(type === 1 ? this.offerAprDt?.JoiningLocationID : formValue['JoiningLocationID']))
    let body = {
      cid: this.data.cid,
      billingRate: type === 1 ? this.offerAprDt?.billingRateHrCurrency : formValue['billingRateHrCurrency'],
      billingCurrencyId: type === 1 ? this.offerAprDt?.billingCurrencyID : formValue['billingCurrencyId'],
      billableHoursDay: type === 1 ? this.offerAprDt?.billableHoursDay : formValue['billableHoursDay'],
      projectBuffer: type === 1 ? this.offerAprDt?.projectBufferInPercent : formValue['projectBuffer'],
      NonReimbursableTravelCost: type === 1 ? this.offerAprDt?.nonReimbursableTravelCostUsd : formValue['NonReimbursableTravelCost'],
      projectSpecificCost: type === 1 ? this.offerAprDt?.projectSpecificCostUsd : formValue['projectSpecificCost'],
      JoiningLocationId: type === 1 ? this.offerAprDt?.JoiningLocationID : formValue['JoiningLocationID'],
      cadidateTypeId: type === 1 ? this.offerAprDt?.CandidateTypeID : formValue['CandidateTypeID'],
      annualCTC: type === 1 ? this.offerAprDt?.CTC : formValue['ctc'],
      joiningBonus: type === 1 ? this.offerAprDt?.joiningBonus : formValue['joiningBonus'],
      localCurrencyId: localCurrencyId[0]?.CurrencyId ? localCurrencyId[0]?.CurrencyId : 0,
      gradeId: gradeId,
      GradeBand: GradeBand,
      JobFamilyID: type === 1 ? this.offerAprDt?.JobFamilyID : formValue['JobFamilyID'],
      JfCategory: type === 1 ? this.offerAprDt?.JobFamilyCategory : formValue['JfCateg']
    }
    this.localCurrency = localCurrencyId[0]?.CurName;
    this.dgmCallAPI(body);

  }

  /***
   * api call for dgm calc 
   */
  dgmCallAPI(body: any) {
    this._offerService.getDgmCalc(body).subscribe(
      res => {
        this.dgmData = res['data'][0];
        this.remaarkValidation();
      }
    )
  }
  /**
   * joining location on changed
   * @param event 
   */
  locChanged(event: any) {
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
  }
  /***
   * Method for input control
   */
  inputValueChangedFunc() {
    //joiningBonus
    this.getControl('joiningBonus').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      );
    this.getControl('billingRateHrCurrency').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('projectBuffer').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('NonReimbursableTravelCost').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )

    this.getControl('projectSpecificCost').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
        }
      )
  }

  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }


  public showSelectedValueOfferBy: boolean = false;
  public SelectedValueOfferBy: string = '';
  public showSelectedValuePMAppr: boolean = false;
  public SelectedValuePMAppr: string = '';
  public showSelectedValueDHAppr: boolean = false;
  public SelectedValueDHAppr: string = '';
  public showSelectedValueSVPAppr: boolean = false;
  public SelectedValueSVPAppr: string = '';
  public isVisiblePartner: boolean = false;
  public isReqPartner: boolean = false;
  setDefaultValue(data: any) {
    this.showSelectedValueOfferBy = true;
    this.showSelectedValuePMAppr = true;
    this.showSelectedValueDHAppr = true;
    this.showSelectedValueSVPAppr = true;
    this.SelectedValueOfferBy = this.offerAprDt.OfferID === null ? data.offeredby.Id : data.offeredBy;
    this.SelectedValuePMAppr = data.PM_Approver ? data.PM_Approver : null;
    // this.SelectedValueDHAppr = data.DH_Approver ? data.DH_Approver : null;
    // this.SelectedValueSVPAppr = data.SVPApprover ? data.SVPApprover : null;
    this.CountryId = this.candData?.countryId;
    this.billingCurrencyControl.patchValue(this.candData?.CurrencyId);
    this.sendForApprovalForm.patchValue({
      DesignationId: this.offerAprDt.OfferID === null ? data._designation.Id : data.designationId,
      JobFamilyID: this.offerAprDt.OfferID === null ? null : data.JobFamilyID,
      gradeId: this.offerAprDt.OfferID === null ? parseInt(this.candData?.gradeId) : data.gradeId,
      gradeBand: this.offerAprDt.OfferID === null ? this.candData?.gradeBandId : data.gradeBandId,
      ctc: data.CTC,
      RelocationExp: parseInt(data.RelocationExp) ? data.RelocationExp : null,
      TravelExp: parseInt(data.TravelExp) ? data.TravelExp : null,
      joiningBonus: parseInt(data.joiningBonus) ? data.joiningBonus : null,
      NoticeBuyOut: parseInt(data.NoticeBuyOut) ? data.NoticeBuyOut : null,
      RetentionBonus: parseInt(data.RetentionBonus) ? data.RetentionBonus : null,
      TAGLead_Approver: data.PM_Approver ? data.PM_Approver : null,
      DH_Approver: data.DH_Approver ? data.DH_Approver : null,
      SVP_Approver: data.SVPApprover ? data.SVPApprover : null,
      DateOfJoining: this.offerAprDt.OfferID === null ? new Date(this.candData.doj) : new Date(data.DateOfJoining),
      CandidateTypeID: this.offerAprDt.OfferID === null ? null : data.CandidateTypeID,
      SalaryType: this.offerAprDt.OfferID === null ? 1 : data.SalaryType,
      JoiningLocationID: this.offerAprDt.OfferID === null ? null : data.JoiningLocationID,
      DivisionID: this.divisionID,
      billingCurrencyId: this.offerAprDt.OfferID === null ? 2 : data.billingCurrencyID,
      billingRateHrCurrency: this.offerAprDt.OfferID === null ? this.candData?.billingRateHrCurrency : data.billingRateHrCurrency,
      billableHoursDay: this.offerAprDt.OfferID === null ? 8 : data.billableHoursDay,
      projectBuffer: this.offerAprDt.OfferID === null ? null : data.projectBufferInPercent || null,
      NonReimbursableTravelCost: this.offerAprDt.OfferID === null ? null : data.nonReimbursableTravelCostUsd || null,
      projectSpecificCost: this.offerAprDt.OfferID === null ? null : data.projectSpecificCostUsd || null,
      reHire: this.offerAprDt.OfferID === null ? null : data.reHire,
      remarks: this.offerAprDt.OfferID === null ? null : data.Remarks
    }, { emitEvent: false });

    this.minDateEnd = this.offerAprDt.OfferID === null ? new Date(this.candData.doj) : new Date(data.DateOfJoining);
    //contract to hire
    if (data.CandidateTypeID == 2) {
      let PartnerID = this.getControl('PartnerID');
      let ContractCompletionDate = this.getControl('ContractCompletionDate');
      let ServiceAndMarkup = this.getControl('ServiceAndMarkup');
      this.isVisiblePartner = true;
      this.isReqPartner = true;
      PartnerID.setValidators([Validators.required]);
      ContractCompletionDate.setValidators([Validators.required]);
      ServiceAndMarkup.setValidators([Validators.required]);
      PartnerID.patchValue(data?.PartnerID);
      ContractCompletionDate.patchValue(new Date(data?.ContractCompletionDate));
      ServiceAndMarkup.patchValue(data?.ServiceAndMarkup)
    }
    // independent freelancer
    if (data.CandidateTypeID == 6 || data.CandidateTypeID == 1) {
      let lwdDate = this.getControl('lwdDate');
      this.isLwdDate = true;
      this.isReqLwdDate = true;
      lwdDate.setValidators([Validators.required]);
      lwdDate.patchValue(new Date(data?.ContractCompletionDate));
      lwdDate.updateValueAndValidity();
    }
    //if development
    if (data.JobFamilyID === 4) {
      this.jfCategHide = true;
      this.getControl('JfCateg').patchValue(data.JobFamilyCategory);
    }
  }
  /***
   * get Designation Id
   */
  getDesignation(e: string) {
    this.getControl('gradeId').patchValue(parseInt(e));
  }
  /*
  get control Method*/
  getControl(name: string) {
    return this.sendForApprovalForm.get(name);
  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }
  public isLwdDate: boolean = false;
  public isReqLwdDate: boolean = false;
  getCandidateTypeId(e: any) {
    let id = e.value;
    let PartnerID = this.getControl('PartnerID');
    let ContractCompletionDate = this.getControl('ContractCompletionDate');
    let ServiceAndMarkup = this.getControl('ServiceAndMarkup');
    let lwdDate = this.getControl('lwdDate');
    //Contract to hire
    if (id === 2) {
      this.isVisiblePartner = true;
      this.isReqPartner = true;
      PartnerID.setValidators([Validators.required]);
      ContractCompletionDate.setValidators([Validators.required]);
      ServiceAndMarkup.setValidators([Validators.required]);
      lwdDate.clearValidators();
      this.isLwdDate = false;
      this.isReqLwdDate = false;
    }
    //Independent Consultant(freelancer)/Contracter
    else if (id === 6 || id === 1) {
      this.isVisiblePartner = false;
      this.isReqPartner = false;
      PartnerID.clearValidators();
      ContractCompletionDate.clearValidators();
      ServiceAndMarkup.clearValidators();
      this.isLwdDate = true;
      this.isReqLwdDate = true;
      lwdDate.setValidators([Validators.required]);
      // if(id===1){
      //   this.hideVandOtherContract(id);
      // }
    }
    else {
      this.isVisiblePartner = false;
      this.isReqPartner = false;
      this.isLwdDate = false;
      this.isReqLwdDate = false;
      PartnerID.clearValidators();
      ContractCompletionDate.clearValidators();
      ServiceAndMarkup.clearValidators();
      lwdDate.clearValidators();
    }

    PartnerID.updateValueAndValidity();
    ContractCompletionDate.updateValueAndValidity();
    ServiceAndMarkup.updateValueAndValidity();
    lwdDate.updateValueAndValidity();
    if(!this.isNNT){
      this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, e.value, this.divisionID);
    }
      this.hideVandOtherContract(id);
  }



  /**
   * get Grade Id
   * @param e 
   */
  getGradeId(e): void {
    this.getApproverCont(e.value, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value,this.divisionID);
    if(!this.isNNT){
      this.getGradeBand(e.value);
    }else{
      this.getDGMCalcValue(0, this.getControl('gradeId').value, 0);
    }
  }

  getGradeBandId(e: any) {
    if(!this.isNNT){
      this.getApproverCont(this.getControl('gradeId').value || 0, e.value, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value,this.divisionID);
      this.getDGMCalcValue(0, this.getControl('gradeId').value, e.value);
    }
  }

  /**
   * get job Family Id
   * @param e 
   */
  public jfCategHide: boolean = false;
  public jfCategReq: boolean = false;
  getJobFamilyId(e): any {
    this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, this.getControl('ctc').value, e.value, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID);
      if (e.value === 4 && !this.isNNT) {
        this.jfCategHide = true;
        this.jfCategReq = true;
        this.getControl('JfCateg').setValidators([Validators.required]);
      }
      else {
        this.jfCategReq = false;
        this.jfCategHide = false;
        this.getControl('JfCateg').clearValidators();
      }

    this.getControl('JfCateg').updateValueAndValidity();
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
  }

  getJfCateg(e: any) {
    this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
    if(!this.isNNT){
      this.getApproverCont(this.getControl('gradeId').value || 0, this.getControl('gradeBand').value || 0, this.getControl('ctc').value, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value,this.divisionID);
    }
  }

  /***
   * get CTC
   */
  getCTC() {
    this.getControl('ctc').valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        get => {
          if (get && this.getControl('gradeId').valid) {
            if(!this.isNNT){
              this.getApproverCont(this.getControl('gradeId').value, this.getControl('gradeBand').value, get, this.getControl('JobFamilyID').value || 0, this.candData.totalExpYear, this.candData.totalExpMonth, this.getControl('CandidateTypeID').value, this.divisionID);
            }
            this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
          }
        }
      )
  }
  /***
   * get Approver Count
   */
  public gradeID: number;
  public ctc: number;
  public isTag_ApproverReq: boolean = false;
  public isTag_ApproverShow: boolean = false;
  public isDH_ApproverReq: boolean = false;
  public isDH_ApproverShow: boolean = false;
  public isSvp_ApproverReq: boolean = false;
  public isSvp_ApproverShow: boolean = false;
  public approverMsgMissing: string = '';
  public approverLength: number = 0;
  public aprvCountDataList: any = [];
  getApproverCont(gradeID: number, gradeBand: number, ctc: number, jobFamilyId: number, ExpYear: number, ExpMonth: number, CandidateTypeID: string, divisionID:number) {
    let DH_Approver = this.getControl('DH_Approver');
    let SVP_Approver = this.getControl('SVP_Approver');
    let JFCategory = this.getControl('JfCateg').value;
    //let CandidateTypeID = this.getControl('CandidateTypeID').value;
    this._offerService.getApprovalCount(gradeID, gradeBand, ctc, jobFamilyId, ExpYear, ExpMonth, JFCategory, CandidateTypeID,divisionID).subscribe
      (
        res => {
          let data = res['data'][0];
          this.aprvCountDataList = data;
          this.approverMsgMissing = '';
          this.approverLength = data.NumberOfApprover;
          if (data.NumberOfApprover === 0) {
            DH_Approver.clearValidators();
            SVP_Approver.clearValidators();
            DH_Approver.reset();
            SVP_Approver.reset();
            this.isTag_ApproverShow = false;
            this.isDH_ApproverShow = false;
            this.isSvp_ApproverShow = false;
            this.approverMsgMissing = data.Msg;
            this._share.showAlertErrorMessage.next(data.Msg)
          }
          else {
            if (data.NumberOfApprover === 1) {
              this.isTag_ApproverShow = true;
              DH_Approver.clearValidators();
              SVP_Approver.clearValidators();
              DH_Approver.reset();
              SVP_Approver.reset();
              this.isDH_ApproverShow = false;
              this.isSvp_ApproverShow = false;
            }
            else if (data.NumberOfApprover === 2) {
              this.isTag_ApproverShow = true;
              this.isDH_ApproverShow = true;
              SVP_Approver.clearValidators();
              SVP_Approver.reset();
              this.isSvp_ApproverShow = false;
            }

            else if (data.NumberOfApprover === 3) {
              this.isTag_ApproverShow = true;
              this.isDH_ApproverShow = true;
              this.isSvp_ApproverShow = true;
            }

            DH_Approver.updateValueAndValidity();
            SVP_Approver.updateValueAndValidity();
          }
        }
      )
  }




  //submit sendapproval
  sendApprovalSubmit(form: UntypedFormGroup, action: string) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let empId = this._storage.getUserEmpId();
      let formValue = form.value;
      // formValue['DivisionID'] = this.divisionID;
      formValue['cid'] = this.data.cid;
      formValue['OfferID'] = this.offerAprDt.OfferID === null ? 0 : this.offerAprDt.OfferID;
      formValue['Action'] = action;
      formValue['offerGivenBy'] = empId;
      if (formValue['DateOfJoining']) {
        formValue['DateOfJoining'] = GlobalMethod.formatDate(formValue['DateOfJoining']);
      }
      if (formValue['ContractCompletionDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(formValue['ContractCompletionDate']);
      }

      if (formValue['lwdDate']) {
        formValue['ContractCompletionDate'] = GlobalMethod.formatDate(formValue['lwdDate']);
      }
      if (this.offerAprDt.StatusID === 120 || this.offerAprDt.StatusID === 140|| this.offerAprDt.StatusID === 180 ) {
        formValue['IsRevisedOffer'] = 'Y';
      }
      if (formValue['RelocationExp'] == '') {
        formValue['RelocationExp'] = null;
      }
      if (formValue['RetentionBonus'] == '') {
        formValue['RetentionBonus'] = null;
      }
      if (formValue['TravelExp'] == '') {
        formValue['TravelExp'] = null;
      }
      if (formValue['NoticeBuyOut'] == '') {
        formValue['NoticeBuyOut'] = null;
      }
      if (formValue['joiningBonus'] == '') {
        formValue['joiningBonus'] = null;
      }
      if (this.dgmData['BillingRateHr']) {
        formValue['billingRateHrInUSD'] = this.dgmData['BillingRateHr'];
      }
      if (this.dgmData['AnnualBillableHours']) {
        formValue['annualBillableHours'] = this.dgmData['AnnualBillableHours'];
      }
      if (this.dgmData['AnnualRevenue']) {
        formValue['annualRevenueUsd'] = this.dgmData['AnnualRevenue'];
      }
      if (this.dgmData['AnnualSalaryCost']) {
        formValue['annualSalaryCostUsd'] = this.dgmData['AnnualSalaryCost'];
      }
      if (this.dgmData['JoiningBonus']) {
        formValue['joiningBonusUsd'] = this.dgmData['JoiningBonus'];
      }
      if (this.dgmData['Benefits']) {
        formValue['benefitsUsd'] = this.dgmData['Benefits'];
      }
      if (this.dgmData['ProjectBuffer']) {
        formValue['ProjectBufferUsd'] = this.dgmData['ProjectBuffer'];
      }
      if (this.dgmData['dgmCost']) {
        formValue['dgmCostUsd'] = this.dgmData['dgmCost'];
      }
      if (this.dgmData['dgmCostPercent']) {
        formValue['dgmPercentUsd'] = this.dgmData['dgmCostPercent'];
      }
      // if (this.dgmData['remarks']) {
      //   formValue['remarks'] = this.dgmData['remarks'];
      // }

      this._offerService.addUpdateOfferApproval(formValue).subscribe(
        res => {
          let formData = new FormData();
          if (this.allFilesBGV.length != 0) {
            formData.append('cid', this.data.cid);
            formData.append('ActionTakenBy', 'R');
            formData.append('ActionID', res.ActionID);
            for (let i = 0; i < this.allFilesBGV.length; i++) {
              formData.append('File', this.allFiles[i]);
            }
            this._offerService.uploadDocumnetByRecApprover(formData).subscribe(
              doc => {
                this._share.showAlertSuccessMessage.next(res.Message);
                this.dialogRef.close(true);
              }
            )

          } else {
            this._share.showAlertSuccessMessage.next(res.Message);
            this.dialogRef.close(true);
          }

        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  /**
  * show interview round details
  * @param data 
  */
  openfeedbackInfoModal(data: any) {
    const dialogRef = this.dialog.open(FeedbackRoundDetailsComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'update-interview-feedback'],
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
