import { Component, Inject, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from '../../../core/constant/constants';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { forkJoin } from 'rxjs';
import { InterviewStatusService } from '../../../core/services/interview-status.service';
import { OfferService } from '../../offer.service';
import { ShareService } from '../../../core/services/share.service';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ICandidateOfferListDetails } from '../../../core/models/offer-model';
import { SendPreviewOfferModalComponent } from '../send-preview-offer-modal/send-preview-offer-modal.component';
import { UsSendPreviewOfferModalComponent } from '../us-send-preview-offer-modal/us-send-preview-offer-modal.component';
import { GlobalMethod } from '../../../core/common/global-method';
import { TalentService } from '../../../talent-module/talent.service';
@Component({
  selector: 'app-us-generate-offer-modal',
  templateUrl: './us-generate-offer-modal.component.html',
  styleUrls: ['./us-generate-offer-modal.component.scss']
})
export class UsGenerateOfferModalComponent implements OnInit {

  public generateofferFormUS: UntypedFormGroup = new UntypedFormGroup({});
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public approvalData: any = [];
  public sudexoCoupenList: any = CONSTANTS.sudexoCoupen;
  public NpsList: any = CONSTANTS.npsList;
  public anaytIsHide: boolean = false;
  public shipingLaptopList: any = [];
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'FromStatus', 'ToStatus', 'remarks'];
  public minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<UsGenerateOfferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private cdr: ChangeDetectorRef,
    private _globalApiServe: GlobalApisService,
    private _talentServ: TalentService
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getCandidateDetails();
    //candidate address

    this.formInit();
  }
  ngAfterViewInit(): void {
    //this.getControl('currentAddress').get('addressLine1').patchValue('fdgfgf');
    this.generateofferFormUS.valueChanges.
      pipe(
        distinctUntilChanged(),
        debounceTime(500)
      ).subscribe(
        val => {
          if (this.isSameAsCrAddress) {
            this.getControl('permanentAddress').patchValue(this.getControl('currentAddress').value)
          }

        }
      )
    this.cdr.detectChanges();
  }

  formInit() {
    this.generateofferFormUS = this._fb.group({
      joiningLocation: [null, [Validators.required]],
      DateOfOfferResponse: [null, [Validators.required]],
      finalBasePay: [null, [Validators.required]],
      FinalJoiningBonus: [null],
      FinalInsentiveBonus: [null],
      FinalRelocationPay: [null],
      // FinalRelocationAllownces: [null],
      //FinalPerformanceBonus: [null],
      finalAnnualVariablePay: [null],
      FinalVisaCost: [null],
      startDateTentativeConfirmed: [null],
      startDate: [null],
      internEndDate: [null],
      sendOfferAddressType: ['C'],
      currentAddress: this._fb.group({
      }),
      isShippingAddrConfirm: [null],
      LaptopType: [null]
    })
  }

  setDefaultAddress(addressType: string, data: any) {
    this.getControl('sendOfferAddressType').patchValue(data?.sendOfferAddressType ? data?.sendOfferAddressType : 'C');
    this.getControl(addressType).patchValue({
      "addressLine1": addressType === 'currentAddress' ? data?.AddressLine1 : data?.pr_addressLine1,
      "addressLine2": addressType === 'currentAddress' ? data?.AddressLine2 : data?.pr_addressLine2,
      // "addressLine3": addressType === 'currentAddress' ? data?.AddressLine3 : data?.pr_addressLine3,
      "city": addressType === 'currentAddress' ? data?.cr_city : data?.pr_city,
      "state": addressType === 'currentAddress' ? data?.cr_state : data?.pr_state,
      "country": addressType === 'currentAddress' ? parseInt(data?.cr_country) : parseInt(data?.pr_country),
      "postalCode": addressType === 'currentAddress' ? data?.cr_postalCode : data?.pr_postalCode
    })
    this.cdr.detectChanges();
  }
  public isSameAsCrAddress: boolean = false;
  sameAsAddress(e: EventTarget) {
    this.isSameAsCrAddress = (<HTMLInputElement>e).checked;
    if ((<HTMLInputElement>e).checked) {
      this.getControl('permanentAddress').patchValue(this.getControl('currentAddress').value)
    }

  }

  //
  getControl(name: string) {
    return this.generateofferFormUS.get(name);
  }

  /***
* change date
*/

  public isHideConfirmAdd: boolean = false;
  changeDate(type: string, event: any) {
    // this.toDate?.reset();
    // this.toDate?.enable();
    let date: any = new Date(event.value);
    let crr: any = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate: any = new Date(event.value);
    const secondDate: any = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    // var difference = date - crr;
    this.hidesHowConfAdd(diffDays);
    this.maxOfferReturnDate = new Date(this.getControl('startDate').value);
  }

  hidesHowConfAdd(diffDays: number) {
    if (diffDays <= 7) {
      this.isHideConfirmAdd = true;
    }
    else {
      this.isHideConfirmAdd = false;
    }
  }

  /**shpining address confirmation // sho hide laptop type */
  public isShipingAddresChecked: boolean = false;
  isShippingCheckBoxvalue(val: any) {
    this.getControl('LaptopType').reset()
    this.showHideMachineLaptop(val.checked ? true : false);
  }

  showHideMachineLaptop(val: any) {
    if (val) {
      this.isShipingAddresChecked = true;
      this.getControl('LaptopType').setValidators([Validators.required]);
    } else {
      this.getControl('LaptopType').clearValidators();
      this.isShipingAddresChecked = false;
    }
    this.getControl('LaptopType').updateValueAndValidity();
  }

  public isSalaryHrsMonthly: boolean = true;
  public maxOfferReturnDate = new Date;
  public bgvDocList: any = [];
  public talentDetails: any = {};
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getCandidateApprovalDetails(this.data.cid),
      this._offerService.GetShippingLaptopList(this.data.cid),
      this._talentServ.GetTHIDDetailsByTHID(this.data?.th_id)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.bgvDocList = res[2]['BGVAtt'];
        this.approvalData = res[3]['data'];
        this.shipingLaptopList = res[4]['data'];
        this.talentDetails = res[5]['data'][0];
         this.maxOfferReturnDate = new Date(this.offerAprDt?.USStartDate);
        
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        this.hidesHowConfAdd(this.offerAprDt?.joinDateDiffInDays);
        this.setDefaultAddress('currentAddress', this.offerAprDt);
        // this.setDefaultAddress('permanentAddress', this.offerAprDt);
        // this.getControl('Nps').patchValue(this.offerAprDt.NPS);
        this.getControl('joiningLocation').patchValue(this.offerAprDt.JoiningLocationID);
        this.getControl('DateOfOfferResponse').patchValue(this.offerAprDt.DateOfOfferResponse);
        this.getControl('isShippingAddrConfirm').patchValue(this.offerAprDt?.isShippingAddrConfirm == 1 ? true : false);
        this.getControl('LaptopType').patchValue(this.offerAprDt?.LaptopMachineId ? this.offerAprDt?.LaptopMachineId : null);
        this.getControl('finalBasePay').patchValue(this.offerAprDt.USFinalBasePay ? this.offerAprDt.USFinalBasePay : null);
        this.getControl('FinalJoiningBonus').patchValue(this.offerAprDt?.USFinalJoiningBonus ? this.offerAprDt?.USFinalJoiningBonus : null);
        this.getControl('FinalInsentiveBonus').patchValue(this.offerAprDt?.USFinalIncentiveBonus ? this.offerAprDt?.USFinalIncentiveBonus : null);
        this.getControl('FinalRelocationPay').patchValue(this.offerAprDt?.USFinalRelocationPay ? this.offerAprDt?.USFinalRelocationPay : null);

        // this.getControl('FinalPerformanceBonus').patchValue(this.offerAprDt.USFinalPerformanceBonus ? this.offerAprDt.USFinalPerformanceBonus : null);
        this.getControl('finalAnnualVariablePay').patchValue(this.offerAprDt.USFinalAnnualVariablePay ? this.offerAprDt.USFinalAnnualVariablePay : null);
        this.getControl('FinalVisaCost').patchValue(this.offerAprDt.USFinalVisaCost ? this.offerAprDt.USFinalVisaCost : null);

        this.getControl('startDate').patchValue(this.offerAprDt?.USStartDate);
        this.getControl('internEndDate').patchValue(this.offerAprDt?.USInternEndDate ? this.offerAprDt?.USInternEndDate : null);

        // this.getControl('FinalRelocationAllownces').patchValue(this.offerAprDt.USRelocationAllowance ? this.offerAprDt.USRelocationAllowance : null);
        //this.getControl('DateOfJoining').patchValue(new Date(this.offerAprDt?.DateOfJoining));
        /**hide show  */

        this.setValidationForFinalCTCnOthers(this.offerAprDt);
        this.showHideFieldsEmpType();
        this.showHideMachineLaptop(this.offerAprDt?.isShippingAddrConfirm == 1 ? true : false);
      }
    )
  }

  /**show hide fields by emp type 
  
   */
  public isIntern: boolean = false;
  showHideFieldsEmpType() {
    // this.offerAprDt?.CandidateTypeID == 9
    debugger
    if (this.offerAprDt?.CandidateTypeID == 14 || this.offerAprDt?.CandidateTypeID == 1010) {
      this.isSalaryHrsMonthly = false;
      // this.getControl('FinalJoiningBonus').setValidators([Validators.required]);
      // this.getControl('FinalRelocationPay').setValidators([Validators.required]);
      // this.getControl('FinalPerformanceBonus').setValidators([Validators.required]);
      // this.getControl('FinalVisaCost').setValidators([Validators.required]);
    } else {
      // this.getControl('FinalJoiningBonus').clearValidators();
      // this.getControl('FinalRelocationPay').clearValidators();
      // this.getControl('FinalPerformanceBonus').clearValidators();
      // this.getControl('FinalVisaCost').clearValidators();
      this.isSalaryHrsMonthly = true;
      /**intern 2009 hide/show intern end date*/
      if (this.offerAprDt?.CandidateTypeID == 2009) {
        this.isIntern = true;
       this.getControl('internEndDate').setValidators([Validators.required]);
      }
      else {
       this.getControl('internEndDate').clearValidators();
        this.isIntern = false;
      }
      this.getControl('internEndDate').updateValueAndValidity();
    }
    this.getControl('FinalJoiningBonus').updateValueAndValidity();
    this.getControl('FinalRelocationPay').updateValueAndValidity();
    // this.getControl('FinalPerformanceBonus').updateValueAndValidity();
    this.getControl('FinalVisaCost').updateValueAndValidity();
  }

  setValidationForFinalCTCnOthers(data: any) {
    let finalBasePay = this.getControl('finalBasePay');
    let FinalJoiningBonus = this.getControl('FinalJoiningBonus');
    let FinalInsentiveBonus = this.getControl('FinalInsentiveBonus');
    let FinalRelocationPay = this.getControl('FinalRelocationPay');
    // let FinalPerformanceBonus = this.getControl('FinalPerformanceBonus');
    let FinalVisaCost = this.getControl('FinalVisaCost');
    let finalAnnualVariablePay = this.getControl('finalAnnualVariablePay');
    // let FinalRelocationAllownces = this.getControl('FinalRelocationAllownces');
    finalBasePay.setValidators([Validators.required, Validators.max(data.USBasePay)]);
    finalBasePay.updateValueAndValidity();

    if (data?.USjoiningBonus > 0) {
      FinalJoiningBonus.setValidators([Validators.required, Validators.max(data?.USjoiningBonus)]);
    } else {
      FinalJoiningBonus.setValidators([Validators.max(data?.joiningBonus)]);
    }
    if (data?.USIncentiveBonus > 0) {
      FinalInsentiveBonus.setValidators([Validators.required, Validators.max(data?.USIncentiveBonus)]);
    } else {
      FinalInsentiveBonus.setValidators([Validators.max(data?.USIncentiveBonus)]);
    }
    if (data?.USRelocationPay > 0) {
      FinalRelocationPay.setValidators([Validators.required, Validators.max(data?.USRelocationPay)]);
    } else {
      FinalRelocationPay.setValidators([Validators.max(data?.USRelocationPay)]);
    }

    // if (data?.USPerfomanceBonous > 0) {
    //   FinalPerformanceBonus.setValidators([Validators.required, Validators.max(data?.USPerfomanceBonous)]);
    // } else {
    //   FinalPerformanceBonus.setValidators([Validators.max(data?.USPerfomanceBonous)]);
    // }
    ///anual varial key to be added
    if (data?.USAnnualVariablePay > 0) {
      finalAnnualVariablePay.setValidators([Validators.required, Validators.max(data?.USAnnualVariablePay)]);

    } else {
      finalAnnualVariablePay.setValidators([Validators.max(data?.USAnnualVariablePay)]);
    }
    if (data?.USVisaPay > 0) {
      FinalVisaCost.setValidators([Validators.required, Validators.max(data?.USVisaPay)]);
    } else {
      FinalVisaCost.setValidators([Validators.max(data?.USVisaPay)]);
    }
    //
    // if (data?.USRelocationAllowance > 0) {
    //   FinalRelocationAllownces.setValidators([Validators.required, Validators.max(data?.USRelocationAllowance)]);
    // } else {
    //   FinalRelocationAllownces.setValidators([Validators.max(data?.USRelocationAllowance)]);
    // }
    FinalJoiningBonus.updateValueAndValidity();
    FinalInsentiveBonus.updateValueAndValidity();
    FinalRelocationPay.updateValueAndValidity();
    //FinalPerformanceBonus.updateValueAndValidity();
    FinalVisaCost.updateValueAndValidity();
    finalAnnualVariablePay.updateValueAndValidity();
    // FinalRelocationAllownces.updateValueAndValidity();
  }

  //generate offer mathod
  generateOfferHandler(form: UntypedFormGroup) {
    form.markAllAsTouched();
    if (form.valid) {
      let body = form.value;
      body['cid'] = this.data?.cid;
      this.submitBodyFormData(body);
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  //get infogain location 
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [3];
        // let ids = [];
        // if (this.data.DivisionID == 7) {
        //   ids = [1, 2, 4, 5, 16];
        // } else {
        //   ids = [1, 2, 4, 5];
        // }
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }

  /**
 * joining location on changed
 * @param event 
 */
  locChanged(event: any) {
    //this.getDGMCalcValue(0, this.getControl('gradeId').value, this.getControl('gradeBand').value);
  }

  submitBodyFormData(body: any) {
    let formData = new FormData();

    formData.append('cid', body.cid);
    //formData.append('sendOfferAddressType', body.sendOfferAddressType);
    formData.append('addressLine1', body.currentAddress.addressLine1);
    formData.append('addressLine2', body.currentAddress.addressLine2);

    // if (body['currentAddress'].addressLine3) {
    //   formData.append('crAddressLine3', body.currentAddress.addressLine3);
    // }
    formData.append('city', body.currentAddress.city);
    formData.append('state', body.currentAddress.state);
    formData.append('postalCode', body.currentAddress.postalCode);
    formData.append('country', body.currentAddress.country);

    formData.append('ApprovedBasePay', this.offerAprDt?.USBasePay);
    //formData.append('dateOfJoining', GlobalMethod.formatDate(body.DateOfJoining));
    if (body['joiningLocation']) {
      formData.append('joiningLocation', body.joiningLocation);
    }
    if (body['DateOfOfferResponse']) {
      formData.append('DateOfOfferResponse', GlobalMethod.formatDate(body.DateOfOfferResponse));
    }

    if (body['startDate']) {
      formData.append('startDate', GlobalMethod.formatDate(body.startDate));
    }
    if (body['internEndDate']) {
      formData.append('InternEndDate', GlobalMethod.formatDate(body.internEndDate));
    }

    if (body['finalBasePay']) {
      formData.append('finalBasePay', body.finalBasePay);
    }
    if (body['FinalJoiningBonus']) {
      formData.append('FinalJoiningBonus', body.FinalJoiningBonus);
    }
    if (body['FinalRelocationPay']) {
      formData.append('FinalRelocationPay', body.FinalRelocationPay);
    }
    if (body['startDateTentativeConfirmed']) {
      formData.append('isStartDateTentativeOrConfirmed', body.startDateTentativeConfirmed);
    }

    // if (body['FinalRelocationAllownces']) {
    //   formData.append('FinalRelocationAllowance', body.FinalRelocationAllownces);
    // }
    // if (body['FinalPerformanceBonus']) {
    //   formData.append('FinalPerformanceBonus', body.FinalPerformanceBonus);
    // }

    if (body['finalAnnualVariablePay']) {
      formData.append('FinalAnnualVariablePay', body.finalAnnualVariablePay);
    }
    if (body['FinalVisaCost']) {
      formData.append('FinalVisaCost', body.FinalVisaCost);
    }
    if (body['FinalInsentiveBonus']) {
      formData.append('FinalIncentiveBonus', body.FinalInsentiveBonus);
    }
    if (body['isShippingAddrConfirm']) {
      formData.append('isShippingAddrConfirm', '1');
    }
    if (body['LaptopType']) {
      formData.append('LaptopMachine', body.LaptopType);
    }

    formData.append('ModifiedOnUTC', GlobalMethod.convertToUTCDate(new Date()));
    formData.append('ModifiedOnTimeZone', GlobalMethod.getTimezone());
    formData.append('ModifiedOnOffsetDate',  GlobalMethod.getOffset().toString());


    this._offerService.usGenerateOffer(formData).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res)
        //     this.dialogRef.close(true);
        this.hrApprovalOpen(this.offerAprDt);
      }
    )
  }

  /**send for hr approval */
  hrApprovalOpen(elm: ICandidateOfferListDetails) {
    elm['title'] = 'Preview and Send Offer To HR';
    elm['actionFor'] = 'H';

    const dialogRef = this.dialog.open(UsSendPreviewOfferModalComponent, {
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: elm,
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          if (res?.type == 'A') {
            this.dialogRef.close(true);
          }
          // this.paginatorCompRef.paginator.pageIndex = 0;
          // this.getCandidateListByTalentId(1, CONSTANTS.PAGE_SIZE, null, this.sortParam);
          //this.getCandidateDetails();
        }
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
