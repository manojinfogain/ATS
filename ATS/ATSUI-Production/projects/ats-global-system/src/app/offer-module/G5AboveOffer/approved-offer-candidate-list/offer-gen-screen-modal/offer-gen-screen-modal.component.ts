import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';
import { forkJoin } from 'rxjs';
import { FeedbackRoundDetailsComponent } from 'projects/ats-global-system/src/app/interview-module/interview-feedback/modals/feedback-round-details/feedback-round-details.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { OfferService } from '../../../offer.service';
import { G5OfferService } from '../../g5-offer.service';


@Component({
  selector: 'app-offer-gen-screen-modal',
  templateUrl: './offer-gen-screen-modal.component.html',
  styleUrls: ['./offer-gen-screen-modal.component.scss']
})
export class OfferGenScreenModalComponent implements OnInit {
  public generateofferForm: UntypedFormGroup = new UntypedFormGroup({});
  public candData: any = [];
  public allRoundList: any = [];
  public selectedList: any = [];
  public gradeList: any = [];
  public offerAprDt: any = [];
  public approvalData: any = [];
  public sudexoCoupenList: any = CONSTANTS.sudexoCoupen;
  public NpsList: any = CONSTANTS.npsList;
  displayedColumns = ['approverType', 'approverName', 'ActionTaken', 'ActionTakenOn', 'ActionTakenBy', 'FromStatus', 'ToStatus', 'remarks'];
  public minDate: any = new Date();
  constructor(
    public dialogRef: MatDialogRef<OfferGenScreenModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _interviewStatus: InterviewStatusService,
    private _offerService: OfferService,
    private _offerServiceG5: G5OfferService,
    public dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private cdr: ChangeDetectorRef,
    private _globalApiServe: GlobalApisService,
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getCandidateDetails();
    //candidate address
    this.generateofferForm = this._fb.group({
      SudexoCoupen: [null],
      Nps: [null],
      joiningLocation: [null, [Validators.required]],
      finalctc: [null, [Validators.required]],
      FinalJoiningBonus: [null],
      FinalNoticeBuyOut: [null],
      FinalTravelExp: [null],
      FinalRelocationExp: [null],
      FinalRetentionBonus: [null],
      sendOfferAddressType: ['C'],
      currentAddress: this._fb.group({
      }),
      permanentAddress: this._fb.group({
      }),
      fileBGV: [null],
      DateOfJoining: [null, Validators.required],
      isShippingAddrConfirm: [null]
      // DesignationId:[null,Validators.required]
    })

  }
  ngAfterViewInit(): void {
    //this.getControl('currentAddress').get('addressLine1').patchValue('fdgfgf');
    this.generateofferForm.valueChanges.
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

  setDefaultAddress(addressType: string, data: any) {
    this.getControl('sendOfferAddressType').patchValue(data?.sendOfferAddressType ? data?.sendOfferAddressType : 'C');
    this.getControl(addressType).patchValue({
      "addressLine1": addressType === 'currentAddress' ? data?.AddressLine1 : data?.pr_addressLine1,
      "addressLine2": addressType === 'currentAddress' ? data?.AddressLine2 : data?.pr_addressLine2,
      "addressLine3": addressType === 'currentAddress' ? data?.AddressLine3 : data?.pr_addressLine3,
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

    return this.generateofferForm.get(name);
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
  }

  hidesHowConfAdd(diffDays: number) {
    if (diffDays <= 7) {
      this.isHideConfirmAdd = true;
    }
    else {
      this.isHideConfirmAdd = false;
    }
  }

  public sudCoupHide: boolean = false;
  public bgvDocList: any = [];
  getCandidateDetails() {
    forkJoin([
      this._interviewStatus.getCandidateDetails(this.data.cid),
      this._offerService.getSelectedCandidateDetails(this.data.cid),
      this._offerService.getCandidateOfferAprDetails(this.data.cid),
      this._offerService.getCandidateApprovalDetails(this.data.cid)
    ]).subscribe(
      res => {
        this.allRoundList = res[0];
        this.candData = res[1]['data'][0];
        this.offerAprDt = res[2]['data'][0];
        this.bgvDocList = res[2]['BGVAtt'];
        this.approvalData = res[3]['data'];
        this.selectedList = this.allRoundList.roundList.filter(d => d?.interviewType?.Id === 4 && d?.InterViewStatus?.Id === 4);
        this.hidesHowConfAdd(this.offerAprDt?.joinDateDiffInDays);
        this.setDefaultAddress('currentAddress', this.offerAprDt);
        this.setDefaultAddress('permanentAddress', this.offerAprDt);
        this.uploadButtonValidation(this.bgvDocList);
        this.getControl('Nps').patchValue(this.offerAprDt.NPS);
        this.getControl('joiningLocation').patchValue(this.offerAprDt.JoiningLocationID);
        this.getControl('isShippingAddrConfirm').patchValue(this.offerAprDt?.isShippingAddrConfirm == 1 ? true : false);
        this.getControl('finalctc').patchValue(this.offerAprDt.FinalCTC);
        this.getControl('FinalJoiningBonus').patchValue(this.offerAprDt.FinalJoiningBonus);
        this.getControl('FinalNoticeBuyOut').patchValue(this.offerAprDt.FinalNoticeBuyOut);
        this.getControl('FinalTravelExp').patchValue(this.offerAprDt.FinalTravelExp);
        this.getControl('FinalRelocationExp').patchValue(this.offerAprDt.FinalRelocationExp);
        this.getControl('FinalRetentionBonus').patchValue(this.offerAprDt.FinalRetentionBonus);
        this.getControl('DateOfJoining').patchValue(new Date(this.offerAprDt?.DateOfJoining));
        this.setValidationForFinalCTCnOthers(this.offerAprDt);
        if (this.offerAprDt?.JoiningLocationID == 1 || this.offerAprDt?.JoiningLocationID == 4 || this.offerAprDt?.JoiningLocationID == 2 || this.offerAprDt?.JoiningLocationID == 5 || this.offerAprDt?.JoiningLocationID == 16) {
          this.sudCoupHide = true;
        }
        else {
          this.sudCoupHide = false;
        }
      }
    )
  }


  setValidationForFinalCTCnOthers(data: any) {
    let finalCtc = this.getControl('finalctc');
    let FinalJoiningBonus = this.getControl('FinalJoiningBonus');
    let FinalNoticeBuyOut = this.getControl('FinalNoticeBuyOut');
    let FinalTravelExp = this.getControl('FinalTravelExp');
    let FinalRelocationExp = this.getControl('FinalRelocationExp');
    let FinalRetentionBonus = this.getControl('FinalRetentionBonus');
    finalCtc.setValidators([Validators.required, Validators.max(data.CTC)]);
    finalCtc.updateValueAndValidity();
      if(data?.joiningBonus > 0){
        FinalJoiningBonus.setValidators([Validators.required,Validators.max(data?.joiningBonus)]);
      }else{
        FinalJoiningBonus.setValidators([Validators.max(data?.joiningBonus)]);
      }
      if(data?.NoticeBuyOut > 0){
        FinalNoticeBuyOut.setValidators([Validators.required,Validators.max(data?.NoticeBuyOut)]);
      }else{
        FinalNoticeBuyOut.setValidators([Validators.max(data?.NoticeBuyOut)]);
      }
      if(data?.TravelExp > 0){
        FinalTravelExp.setValidators([Validators.required,Validators.max(data?.TravelExp)]);
      }else{
        FinalTravelExp.setValidators([Validators.max(data?.TravelExp)]);
      }
      if(data?.RelocationExp > 0){
        FinalRelocationExp.setValidators([Validators.required,Validators.max(data?.RelocationExp)]);
      }else{
        FinalRelocationExp.setValidators([Validators.max(data?.RelocationExp)]);
      }
      if(data?.RetentionBonus > 0){
        FinalRetentionBonus.setValidators([Validators.required,Validators.max(data?.RetentionBonus)]);
      }else{
        FinalRetentionBonus.setValidators([Validators.max(data?.RetentionBonus)]);
      }
    FinalJoiningBonus.updateValueAndValidity();
    FinalNoticeBuyOut.updateValueAndValidity();
    FinalTravelExp.updateValueAndValidity();
    FinalRelocationExp.updateValueAndValidity();
    FinalRetentionBonus.updateValueAndValidity();
  }

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
  previewFileExist(files: any) {

    for (let x in files) {
      this.existFilesBgv.push({ name: files[x].fileName, type: 'e' })
    }
    this.allFiles = this.existFilesBgv;
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

  //generate offer mathod
  generateOfferHandler(form: UntypedFormGroup) {

    form.markAllAsTouched();
    if (form.valid) {
      let body = form.value;
      body['cid'] = this.data.cid;
      // if (body['SudexoCoupen'] == null) {
      //   delete body['SudexoCoupen']
      // }
      this.submitBodyFormData(body);

      // this._offerService.generateOffer(body).subscribe(
      //   res => {
      //     this._share.showAlertSuccessMessage.next(res)
      //     this.dialogRef.close(true);
      //   }
      // )
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
        // let ids = [1, 2, 4, 5];
        let ids = [];
        if(this.data.DivisionID == 7){
          ids = [1, 2, 4, 5, 16];
        }else{
          ids = [1, 2, 4, 5];
        }
     let filterLocation = res['data'].filter(loc =>{
      return ids.indexOf(loc.LocID)!== -1;
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
    formData.append('sendOfferAddressType', body.sendOfferAddressType);
    formData.append('crAddressLine1', body.currentAddress.addressLine1);
    formData.append('crAddressLine2', body.currentAddress.addressLine2);

    if (body['currentAddress'].addressLine3) {
      formData.append('crAddressLine3', body.currentAddress.addressLine3);
    }
    formData.append('crCity', body.currentAddress.city);
    formData.append('crState', body.currentAddress.state);
    formData.append('crPostalCode', body.currentAddress.postalCode);
    formData.append('crCountry', body.currentAddress.country);

    formData.append('prAddressLine1', body.permanentAddress.addressLine1);
    formData.append('prAddressLine2', body.permanentAddress.addressLine2);

    if (body['permanentAddress'].addressLine3) {
      formData.append('prAddressLine3', body.permanentAddress.addressLine3);
    }
    formData.append('prCity', body.permanentAddress.city);
    formData.append('prState', body.permanentAddress.state);
    formData.append('prPostalCode', body.permanentAddress.postalCode);
    formData.append('prCountry', body.permanentAddress.country);
    formData.append('CTC', this.offerAprDt?.CTC);
    formData.append('dateOfJoining', GlobalMethod.formatDate(body.DateOfJoining));

    if (body['SudexoCoupen']) {
      formData.append('SudexoCoupen', body.SudexoCoupen);
    }
    if (body['Nps']) {
      formData.append('Nps', body.Nps);
    }
    if (body['joiningLocation']) {
      formData.append('joiningLocation', body.joiningLocation);
    }

    if (body['finalctc']) {
      formData.append('finalctc', body.finalctc);
    }
    if (body['FinalJoiningBonus']) {
      formData.append('FinalJoiningBonus', body.FinalJoiningBonus);
    }
    if (body['FinalNoticeBuyOut']) {
      formData.append('FinalNoticeBuyout', body.FinalNoticeBuyOut);
    }
    if (body['FinalRelocationExp']) {
      formData.append('FinalRelocationExp', body.FinalRelocationExp);
    }
    if (body['FinalTravelExp']) {
      formData.append('FinalTravelExp', body.FinalTravelExp);
    }
    if (body['FinalRetentionBonus']) {
      formData.append('FinalRetentionBonus', body.FinalRetentionBonus);
    }

    if (body['isShippingAddrConfirm']) {
      formData.append('isShippingAddrConfirm', '1');
    }
    if (this.allFilesBGV.length != 0) {
      for (let i = 0; i < this.allFilesBGV.length; i++) {
        formData.append('file', this.allFiles[i]);
      }
    }

    this._offerServiceG5.generateOfferG5Above(formData).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res)
        this.dialogRef.close(true);
      }
    )
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


  closeModal(): void {
    this.dialogRef.close();
  }
}
