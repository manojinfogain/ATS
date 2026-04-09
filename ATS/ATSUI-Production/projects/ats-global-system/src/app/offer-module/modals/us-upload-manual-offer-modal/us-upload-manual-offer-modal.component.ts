import { ChangeDetectorRef, Component, OnInit , Inject, ViewChild, ElementRef} from '@angular/core';
import { ICandidateOfferListDetails } from '../../../core/models/offer-model';
import { UsSendPreviewOfferModalComponent } from '../us-send-preview-offer-modal/us-send-preview-offer-modal.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from '../../../core/services/global-apis.service';
import { ShareService } from '../../../core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { OfferService } from '../../offer.service';
import { InterviewStatusService } from '../../../core/services/interview-status.service';
import { CONSTANTS } from '../../../core/constant/constants';
import { FILE_UPLOAD } from '../../../core/constant/common.const';
import { GlobalMethod } from '../../../core/common/global-method';

@Component({
  selector: 'app-us-upload-manual-offer-modal',
  templateUrl: './us-upload-manual-offer-modal.component.html',
  styleUrls: ['./us-upload-manual-offer-modal.component.scss']
})
export class UsUploadManualOfferModalComponent implements OnInit {

  
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
  public shipingLaptopList:any=[];
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'FromStatus', 'ToStatus', 'remarks'];
  public minDate: any = new Date();
  public BasePayLabel: string = 'Base Pay';
  constructor(
    public dialogRef: MatDialogRef<UsUploadManualOfferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private cdr: ChangeDetectorRef,
    private _globalApiServe: GlobalApisService,
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getCandidateDetails();

    this.formInit();
  }
  ngAfterViewInit(): void {
  }
  public isIntern: boolean = false;
  formInit() {
    this.generateofferFormUS = this._fb.group({
      offerNumber:[null],
      joiningLocation: [null, [Validators.required]],
      finalBasePay: [null, [Validators.required]],
      FinalJoiningBonus: [null],
      FinalInsentiveBonus: [null],
      FinalRelocationPay: [null],
      finalAnnualVariablePay: [null],
      FinalVisaCost: [null],
      startDate: [null],
      internEndDate: [null],
      DateOfOfferResponse: [null],
      sendOfferAddressType: ['C'],
      currentAddress: this._fb.group({
      }),
      isShippingAddrConfirm: [null],
      LaptopType:[null],
      fileOffer: [null,[Validators.required]],
      fileEmploymentAgreement: [null,[Validators.required]],
      startDateTentativeConfirmed: [null],   
    })
  }

  public offerLtterFile:any = {};
  selectOfferletter(event: any) {
    this.getControl('fileOffer').reset();
    this.offerLtterFile = null;
    let allowedExtensions = /(\.pdf)$/i;
    let files = event.target.files[0];
    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type pdf only.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.getControl('fileOffer').reset();
      return false;

    }
    else {
      this.offerLtterFile = files;
     this.getControl('fileOffer').patchValue('files');
    }
   
  }
  setDefaultAddress(addressType: string, data: any) {
    this.getControl('sendOfferAddressType').patchValue(data?.sendOfferAddressType ? data?.sendOfferAddressType : 'C');
    this.getControl(addressType).patchValue({
      "addressLine1": addressType === 'currentAddress' ? data?.AddressLine1 : data?.pr_addressLine1,
      "addressLine2": addressType === 'currentAddress' ? data?.AddressLine2 : data?.pr_addressLine2,
      "city": addressType === 'currentAddress' ? data?.cr_city : data?.pr_city,
      "state": addressType === 'currentAddress' ? data?.cr_state : data?.pr_state,
      "country": addressType === 'currentAddress' ? (data?.cr_country ? parseInt(data?.cr_country) : null) : (data?.pr_country ? parseInt(data?.pr_country) : null),
      "postalCode": addressType === 'currentAddress' ? data?.cr_postalCode : data?.pr_postalCode
    })
    this.cdr.detectChanges();
  }

  //
  getControl(name: string) {
    return this.generateofferFormUS.get(name);
  }
  /**shpining address confirmation // sho hide laptop type */
  public isShipingAddresChecked: boolean = false;
  isShippingCheckBoxvalue(val: any) {
    this.getControl('LaptopType').reset()
    this.showHideMachineLaptop(val.checked ? true : false);
  }

  showHideMachineLaptop(val:any){
    
    if (val) {
      this.isShipingAddresChecked = true;
      this.getControl('LaptopType').setValidators([Validators.required]);
    } else {
      this.getControl('LaptopType').clearValidators();
      this.isShipingAddresChecked = false;
    }
    this.getControl('LaptopType').updateValueAndValidity();
  }
 

  /***
* change date
*/

  public isHideConfirmAdd: boolean = false;
  changeDate(type: string, event: any) {
    let date: any = new Date(event.value);
    let crr: any = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate: any = new Date(event.value);
    const secondDate: any = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    this.hidesHowConfAdd(diffDays);
    this.maxOfferReturnDate = new Date(this.getControl('startDate').value);
  }
  public maxOfferReturnDate = new Date;
  hidesHowConfAdd(diffDays: number) {
    if (diffDays <= 7) {
      this.isHideConfirmAdd = true;
    }
    else {
      this.isHideConfirmAdd = false;
    }
  }

  public isSalaryHrsMonthly: boolean = true;
  public bgvDocList: any = [];
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getCandidateApprovalDetails(this.data.cid),
      this._offerService.GetShippingLaptopList(this.data.cid)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.bgvDocList = res[2]['BGVAtt'];
        this.approvalData = res[3]['data'];
        this.shipingLaptopList = res[4]['data'];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        this.hidesHowConfAdd(this.offerAprDt?.joinDateDiffInDays);
        this.setDefaultAddress('currentAddress', this.offerAprDt);
        this.getControl('joiningLocation').patchValue(this.offerAprDt.JoiningLocationID);
        this.getControl('isShippingAddrConfirm').patchValue(this.offerAprDt?.isShippingAddrConfirm == 1 ? true : false);
        this.getControl('LaptopType').patchValue(this.offerAprDt?.LaptopMachineId ? this.offerAprDt?.LaptopMachineId : null);
        this.getControl('finalBasePay').patchValue(this.offerAprDt.USFinalBasePay ? this.offerAprDt.USFinalBasePay : null);
        this.getControl('offerNumber').patchValue(this.offerAprDt.offerNumber ?this.offerAprDt.offerNumber :null);
        if(this.offerAprDt?.USStartDate){
          debugger
            
          //  
          this.getControl('startDate').patchValue(this.offerAprDt?.USStartDate);    
          this.maxOfferReturnDate = new Date(this.offerAprDt?.USStartDate);
          /**reset for re-generate */
          if(this.offerAprDt?.StatusID !=100){
            this.getControl('startDate').reset();
          }
        }
       
        if(this.offerAprDt?.USInternEndDate){
          this.getControl('internEndDate').patchValue(this.offerAprDt?.USInternEndDate ? this.offerAprDt?.USInternEndDate : null);
        }
        if(this.offerAprDt.DateOfOfferResponse){
          this.getControl('DateOfOfferResponse').patchValue(this.offerAprDt.DateOfOfferResponse);
        }
        
        /**hide show  */
        this.showHideFieldsEmpType();
        this.setValidationForFinalCTCnOthers(this.offerAprDt);
        this.showHideMachineLaptop(this.offerAprDt?.isShippingAddrConfirm == 1 ? true : false);
        
      }
    )
  }

  /**show hide fields by emp type 
  
   */
  public isDateOfOfferResponse: boolean = false;
  showHideFieldsEmpType() {
    if (this.offerAprDt?.CandidateTypeID == 14) {
      this.isSalaryHrsMonthly = false;
      this.getControl('DateOfOfferResponse').clearValidators();
      this.getControl('DateOfOfferResponse').reset();
      this.isDateOfOfferResponse = false;
      if(this.offerAprDt?.CandidateTypeID == 14){
        this.BasePayLabel = 'Vendor Rate';
      }
    } 
    else {
      this.isSalaryHrsMonthly = true;
      this.isDateOfOfferResponse = true;
      this.getControl('DateOfOfferResponse').setValidators([Validators.required]);
      if (this.offerAprDt?.CandidateTypeID == 16) {
        this.isIntern = true;
       this.getControl('internEndDate').setValidators([Validators.required]);
      }
      else {
       this.getControl('internEndDate').clearValidators();
        this.isIntern = false;
      }
      this.getControl('internEndDate').updateValueAndValidity();
    }

    
    this.getControl('DateOfOfferResponse').updateValueAndValidity();
  }

  setValidationForFinalCTCnOthers(data: any) {
    let finalBasePay = this.getControl('finalBasePay');
    finalBasePay.setValidators([Validators.required, Validators.max(data.USBasePay)]);
    finalBasePay.updateValueAndValidity();
    if(this.offerAprDt?.CandidateTypeID != 14 && this.isSalaryHrsMonthly == true){     
      let FinalJoiningBonus = this.getControl('FinalJoiningBonus');
      FinalJoiningBonus.setValidators([Validators.required, Validators.max(data.USjoiningBonus)]);
      FinalJoiningBonus.updateValueAndValidity();
      let FinalInsentiveBonus = this.getControl('FinalInsentiveBonus');
      FinalInsentiveBonus.setValidators([Validators.required, Validators.max(data.USIncentiveBonus)]);
      FinalInsentiveBonus.updateValueAndValidity();
      let FinalRelocationPay = this.getControl('FinalRelocationPay');
      FinalRelocationPay.setValidators([Validators.required, Validators.max(data.USRelocationPay)]);
      FinalRelocationPay.updateValueAndValidity();
      let finalAnnualVariablePay = this.getControl('finalAnnualVariablePay');
      finalAnnualVariablePay.setValidators([Validators.required, Validators.max(data.USAnnualVariablePay)]);
      finalAnnualVariablePay.updateValueAndValidity();    
      let FinalVisaCost = this.getControl('FinalVisaCost');
      FinalVisaCost.setValidators([Validators.required, Validators.max(data.USVisaPay)]);
      FinalVisaCost.updateValueAndValidity(); 
    }
  }

  get currentAddressForm() { return this.generateofferFormUS.get('currentAddress') }
  
  get countryCtrl() { return this.currentAddressForm.get('country') }

  //generate offer mathod
  generateOfferHandler(form: UntypedFormGroup) {
    debugger
    form.markAllAsTouched();
    this.currentAddressForm.markAsTouched()    
    this.countryCtrl.markAsTouched();
    console.log(this.countryCtrl);
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
  }

  submitBodyFormData(body: any) {
    let formData = new FormData();

    formData.append('cid', body.cid);
    formData.append('addressLine1', body.currentAddress.addressLine1);
    formData.append('addressLine2', body.currentAddress.addressLine2);
    formData.append('city', body.currentAddress.city);
    formData.append('state', body.currentAddress.state);
    formData.append('postalCode', body.currentAddress.postalCode);
    formData.append('country', body.currentAddress.country);

    formData.append('ApprovedBasePay', this.offerAprDt?.USBasePay);
    if (body['joiningLocation']) {
      formData.append('joiningLocation', body.joiningLocation);
    }
    if (body['finalBasePay']) {
      formData.append('finalBasePay', body.finalBasePay);
    }
    if (body['finalAnnualVariablePay']) {
      formData.append('FinalAnnualVariablePay', body.finalAnnualVariablePay);
    }
    if (body['FinalRelocationPay']) {
      formData.append('FinalRelocationPay', body.FinalRelocationPay);
    }
    if (body['FinalVisaCost']) {
      formData.append('FinalVisaCost', body.FinalVisaCost);
    }
    if (body['FinalInsentiveBonus']) {
      formData.append('FinalIncentiveBonus', body.FinalInsentiveBonus);
    }
    if (body['FinalJoiningBonus']) {
      formData.append('FinalJoiningBonus', body.FinalJoiningBonus);
    }
    if (body['offerNumber']) {
      formData.append('offerNumber', body.offerNumber);
      const OfferSeqNumber = /[^/]*$/.exec(body.offerNumber)[0];
      formData.append('OfferSeqNumber', OfferSeqNumber);
      // alert(OfferSeqNumber)
      
    }

    if (body['isShippingAddrConfirm']) {
      formData.append('isShippingAddrConfirm', '1');
    }
    if (body['LaptopType']) {
      formData.append('LaptopMachine', body.LaptopType);
    }
    if (body['startDateTentativeConfirmed']) {
      formData.append('isStartDateTentativeOrConfirmed', body.startDateTentativeConfirmed);
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

    this.uploadOfferletter(formData);
  }

  uploadOfferletter(formData:FormData){
    formData.append('OfferLetter', this.offerLtterFile);
    formData.append('fileAgr', this.employmentAgreementFile);
    formData
    debugger
    console.log(formData);
    this._offerService.USuploadOffer(formData).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
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
        }
      }
    );
  }

  //selectEmploymentAgreement
  public employmentAgreementFile:any = {};
  // @ViewChild('fileEmploymentAgreement') fileEmploymentAgreement: ElementRef;
  selectEmploymentAgreement(event: any){
    this.getControl('fileEmploymentAgreement').reset();
    this.employmentAgreementFile = null;
    let allowedExtensions = /(\.pdf)$/i;
    let files = event.target.files[0];
    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type pdf only.');
      event.target.value = "";
      this.getControl('fileEmploymentAgreement').reset();
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.getControl('fileEmploymentAgreement').reset();
      return false;

    }
    else {
      this.employmentAgreementFile = files;
     this.getControl('fileEmploymentAgreement').patchValue('files');
    }
   
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}
