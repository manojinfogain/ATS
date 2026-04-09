import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { GetLocationInfo } from 'projects/ats-global-system/src/app/core/common/getLocationInfo';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { BgvServiceService } from 'projects/ats-global-system/src/app/bgv-module/bgv-service.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from 'projects/ats-global-system/src/app/talent-module/talent.service';
import { forkJoin } from 'rxjs';
import { OnboardService } from '../../../onboard.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { G5AboveCpmmon } from 'projects/ats-global-system/src/app/core/common/g5AboveCommon';
import { VideoUploadGuidelineComponent } from 'projects/ats-global-system/src/app/common-sharing/modals/video-upload-guideline/video-upload-guideline.component';
import { PreviewMediaFileModalComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/preview-media-file-modal/preview-media-file-modal.component';

@Component({
  selector: 'app-add-leadership-modal',
  templateUrl: './add-leadership-modal.component.html',
  styleUrls: ['./add-leadership-modal.component.scss']
})
export class AddLeadershipModalComponent implements OnInit {

  public formAppearance: string = 'outline';
  public formClass: string = 'form-fill-ats';
  public formClassCol: string = 'ats-form-col';
  public addiSkillMulti: boolean = true;
  public isSpecialBidTypeAndProjectDateVisi: boolean = false;
  public user: any = [];
  public today = new Date();
  public submitLeadersAdditionForm: UntypedFormGroup = new UntypedFormGroup({});
  public maxDate = new Date(this.today.getFullYear() - 10, this.today.getMonth(), this.today.getDate());
  minDate = new Date();
  public salaryTypeList: any = this.getSalaryTypeListLocationWise();
  public minLettersAllow: number = 2;
  public maxLettersAllow: number = 20;
  public isEditMethod: boolean = false;
  public isEditDisabled: boolean = false;
  public RehireList: any = CONSTANTS.RehireList;
 public bgvPackageList: any[] = [];
  public FilterCtrlDu: UntypedFormControl = new UntypedFormControl();
  public searchInputDu: string;

  public FilterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchInputAccount: string;
  public accountList: any = [];
  // commonConst = COMMON_CONST;
  // public minDate: any = new Date(new Date().setDate(new Date().getDate() - 6));
  imgFile: any;
  imgSrc: any;
  public minDatebilling: any = new Date();
  public BillingTypeList: any = [];
  public isInitCallAPISubSkill: boolean = false;
  public locationData: any = {};
  public isGradeBandVisi: boolean = true;
  // editor: Editor;

  constructor(
    public dialogRef: MatDialogRef<AddLeadershipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalServe: GlobalApisService,
    private _talentServ: TalentService,
    private _storage: GetSetStorageService,
    private _GlobCommon: GlobalCommonMethodService,
    private _getLocInfo: GetLocationInfo,
    private _intCommonServe: InterviewCommonService,
    private _onboard: OnboardService,
    private _bgvServe: BgvServiceService

  ) {
  }

  ngOnDestroy(): void {
    // this.editor.destroy();

  }

  ngOnInit(): void {
    this.locationData = this._getLocInfo;
    this.callApis();
    this.formInit();
    // this.excuteAllAPI();
    this.user = this._storage.getSetUserData();

  }

  /**form  init */
  formInit() {
    this.submitLeadersAdditionForm = this._fb.group({
      fName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null],
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      employeeEmail: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      candidateGender: [null, [Validators.required]],
      candiDob: [null, [Validators.required]],
      candidateHiringType: [null, [Validators.required]],
      qualification: [null, [Validators.required]],
      skills: [null, [Validators.required]],
      totalExp: [null, [Validators.required]],
      totalExpMonth: [null, [Validators.required]],
      totalRelExp: [null, [Validators.required]],
      totalRelExpMonth: [null, [Validators.required]],
      currCompany: [null, [Validators.required]],
      tentativeJoinningDate: [null, [Validators.required]],
      CountryID: [null, [Validators.required]],
      CityID: [null, [Validators.required]],
      currentAddress: [null, [Validators.required]],
      profileName: [null, [Validators.required]],
      candidateType: [null, [Validators.required]],
      JoiningLocationID: [null, [Validators.required]],
      gradeId: [null, [Validators.required]],
      gradeBand: [null],
      designationId: [null, [Validators.required]],
      rehireId: [null, [Validators.required]],
      isConversion: [null, [Validators.required]],
      practiceId: [null, [Validators.required]],
      deliveryUnitId: [null, [Validators.required]],
      accountId: [null, [Validators.required]],
      divisionId: [null, [Validators.required]],
      bgvPackageId: [null, [Validators.required]],
      uploadCv: [null],
      fileVideo: [null],
      uploadPicture: [null],
    })
    debugger
    /**for edit case some fields are optional */
    if (this.data?.type === 'E') {
      this.isEditMethod = true;
      this.getControl('uploadCv').clearValidators();

      this.getCandidateFullDetails({});
      /** editable only on draft stage */
      if (this.data?.CandidateSubmissionStatus != 'D') {
        this.isEditDisabled = true;
      } else {
        this.isEditDisabled = false;
      }
    } else {
      this.isEditMethod = false;
      this.isEditDisabled = false;
      this.getControl('uploadCv').setValidators([Validators.required]);
    }
    this.getControl('uploadCv').updateValueAndValidity();

  }
  get mobileNumberControl() { return this.submitLeadersAdditionForm.get('phone'); }
  @ViewChild('select') select: MatSelect;

  /** when edit - showing default value */
  setDefaultValueMethod(data: any) {
    this.submitLeadersAdditionForm.patchValue({
      fName: data?.CandidateFirstName ? data?.CandidateFirstName : '',
      middleName: data?.CandidateMiddleName ? data?.CandidateMiddleName : '',
      lastName: data?.CandidateLastName ? data?.CandidateLastName : '',
      phone: data?.CandidateMobile ? data?.CandidateMobile : null,
      employeeEmail: data?.CandidateMailid ? data?.CandidateMailid : '',
      candidateGender: data?.GenderId ? data?.GenderId : null,
      candiDob: data?.DOb ? data?.DOb : null,
      candidateHiringType: data?.candidateHiringType ? data?.candidateHiringType : null,
      qualification: data?.EduID ? data?.EduID : null,
      skills: data?.SkillId ? data?.SkillId : null,
      totalExp: data?.totalExp ? data?.totalExp : null,
      totalExpMonth: data?.totalExpMonth ? data?.totalExpMonth : null,
      totalRelExp: data?.releventExp ? data?.releventExp : null,
      totalRelExpMonth: data?.releventExpMonth ? data?.releventExpMonth : null,
      currCompany: data?.OrgID ? data?.OrgID : null,
      tentativeJoinningDate: data?.DateofJoining ? data?.DateofJoining : null,
      CountryID: data?.countryId ? data?.countryId : null,
      CityID: data?.cityId ? data?.cityId : null,
      currentAddress: data?.currentAddress ? data?.currentAddress : null,
      profileName: data?.ProfileId ? data?.ProfileId : null,
      candidateType: data?.candidateTypeId ? data?.candidateTypeId : null,
      JoiningLocationID: data?.JoiningLocationId ? data?.JoiningLocationId : null,
      gradeId: data?.gradeId ? data?.gradeId : null,
      gradeBand: data?.gradeBandId ? data?.gradeBandId : null,
      designationId: data?.DesignationId ? data?.DesignationId : null,
      bgvPackageId: data?.bgvPackageId ? data?.bgvPackageId : null,
      rehireId: data?.ReHireID ? data?.ReHireID : null,
      isConversion: data?.isConversion !== undefined ? data?.isConversion : null,
      practiceId: data?.PracticeID ? data?.PracticeID : null,
      deliveryUnitId: data?.DeliveryUnitID ? data?.DeliveryUnitID : null,
     // accountId: data?.AccountID ? data?.AccountID : null,
      divisionId: data?.DivisionID ? data?.DivisionID : null,
    })
    this.gradeBandValidation(data?.gradeId);
    this.g7AndAboveValidation(data?.gradeId);
    let body = {
      DUIds: data.DeliveryUnitID?.toString()
    }
    debugger
    this.getAccountListsByDuID(body);
    this.getControl('accountId').patchValue(data?.AccountID ? data?.AccountID : null);
  }

  getValFromControl(data: any, i: number) {

    // if (data == 'other') {
    //   this.addValidator('currCompany');
    // }
    // else {
    //   this.clearValidators('currCompany');
    // }
    //ctrl.updateValueAndValidity();
  }
  callApis() {
    // Old sequential API calls (commented):
    // this.getGender();
    // this.getCurrencyType();
    // this.getProfileSource({});
    this.getEmpType();
    this.getLocation();
    // this.getAllPractices();
    // this.getDivisionList();
    // this.getDULists();

    // New: Use forkJoin for parallel API calls
    forkJoin({
      gender: this._globalServe.getGenderList(),
      currency: this._globalServe.getCurrency(),
      profileSource: this._intCommonServe.getProfileName(),
      //  empType: this._intCommonServe.getCandidateType(),
    //  location: this._globalServe.getLocationList(),
      practices: this._globalServe.getAllPractices(),
      division: this._globalServe.getDivisionList(),
      du: this._globalServe.getDUList()
    }).subscribe(results => {
      this.genderType = results.gender['data'];
      this.currencyTypeData = results.currency['data'];
      this.profileNameData = results.profileSource['data'];
      this. practiceList = results.practices['data'];
      this.divisionList = results.division['data'];
      this.duList = results.du['data'];
      this.FilterCtrlDu.valueChanges.subscribe(val => { this.searchInputDu = val; });
    });
  }

    locChanged(event: any) {
    let id = event?.value;
    this.getBGVPackageList(id);
  }

   /**
   * Get BGV Package List
   */
  getBGVPackageList(joiningLocationId?: number) {
    // You may want to use a location ID here if needed
    //const joiningLocationId = this.submitLeadersAdditionForm?.get('JoiningLocationID')?.value || null;
    if (joiningLocationId) {
      this._bgvServe.GetPackagesList(joiningLocationId).subscribe(
        res => {
          this.bgvPackageList = res['data'] || [];
        }
      );
    }
  }
  /**reset first 0 in phone */
  onPhoneKeyup() {
    const control = this.submitLeadersAdditionForm.get('phone');
    const value = control?.value;
    if (value && value.length === 1 && value === '0') {
      this.getControl('phone').reset();
    }
  }


  /**getting data from apis */
  public genderType: any = []
  getGender() {
    this._globalServe.getGenderList().subscribe(
      res => {
        this.genderType = res['data'];
      }
    )
  }

  // public accountList: any = [];
  // getAccountList(reqType: number, duId: number, empUnitId: number) {
  //   this._talentServ.getAccountList(reqType, duId, empUnitId).subscribe(
  //     res => {
  //       this.accountList = res['data'];

  //     }

  //   );
  // }

  //get division list
  public divisionList: any = [];
  getDivisionList() {
    this._globalServe.getDivisionList().subscribe(
      res => {
        this.divisionList = res['data'];
      }
    );
  }

  public duList: any = [];
  getDULists(): void {
    this._globalServe.getDUList().subscribe(
      res => {
        this.duList = res['data'];
        this.FilterCtrlDu.valueChanges.subscribe(
          val => {
            this.searchInputDu = val;
            // this.allSelcount = false;   
          }
        )


      }
    );
  }

  getDuId(e: any) {
    let body = {
      DUIds: e.value?.toString()
    }
    this.getAccountListsByDuID(body);
  }
  getAccountListsByDuID(body): void {
    debugger
    this._intCommonServe.getAccountListByDuIds(body).subscribe(
      res => {
        this.accountList = res['data'];
        this.FilterCtrlAccount.valueChanges.subscribe(
          val => {
            this.searchInputAccount = val;
            // this.allSelcount = false;
          }
        )
      }
    );
  }

  public filterCtrlAccount: UntypedFormControl = new UntypedFormControl();
  public searchCtrlAccount: string;
  /**getting full details by id */
  public candidateFullDetails: any = [];
  getCandidateFullDetails(data: any) {
    //get Profile Name
    this._onboard.getLeadershipOnboardCandidatelDetailsMethod(this.data?.CandidateId).subscribe(
      res => {
        //this.loadIndiaProfileSource(data, res);

        this.candidateFullDetails = res['data'];
        this.getGradeBand(this.candidateFullDetails[0]?.gradeId ? this.candidateFullDetails[0]?.gradeId : null);
        this.setDefaultValueMethod(this.candidateFullDetails[0]);
      }
    );
  }

  /**
    * getProfileSource
    */
  getProfileSource(data: any) {
    //get Profile Name
    this._intCommonServe.getProfileName().subscribe(
      res => {
        this.loadIndiaProfileSource(data, res);
      }
    );
  }
  public gradeBandList: any = [];
  getGradeBand(id: number) {
    this._globalServe.getGradeBandList(id).subscribe(
      res => {
        this.gradeBandList = res['data']
      }
    );
  }
  public profileNameData: any = [];
  loadIndiaProfileSource(data: any, res: any) {
    this.profileNameData = this._GlobCommon.getProfileRenuTeamG5Above(data, res);
  }
  public candidateTypeData: any = [];
  getEmpType() {
    //get cand type
    this._intCommonServe.getCandidateType().subscribe(
      res => {
        let filterById: any = [];

        filterById = [1, 2];

        this.candidateTypeData = res.filter(t => {
          return filterById.indexOf(t.typeId) !== -1;
        });
      }
    );
  }
  /**joining state list */
  public filterCtrlJoinState: UntypedFormControl = new UntypedFormControl();
  public searchCtrlJoinState: string;
  getStateList(stateId: number) {
    /**search */
    this.filterCtrlJoinState.valueChanges.subscribe(
      val => {
        this.searchCtrlJoinState = val;
      }
    )
    this._talentServ.getStateNameList(stateId).subscribe(
      res => {
        // this.stateList = res['data'];
      }
    )
  }

  //get grade Id
  public isGradeBandRequired: boolean = false;
  getGradeId(e: any, index: number) {
    this.getControl('gradeBand').reset();
    this.getGradeBand(e);
    this.gradeBandValidation(e);
    this.g7AndAboveValidation(e);
  }

  /** grade band field requred above grade g6 */
  // public isGrade7andAbove: boolean = false;
  public isPictureUpload: boolean = false;
  public isVideoUpload: boolean = true;
  g7AndAboveValidation(e: any) {
    let a = G5AboveCpmmon.validationGradeAboveG7AndAbove(e)
    debugger
    this.getControl('fileVideo').reset();
    this.getControl('uploadPicture').reset();
    if (G5AboveCpmmon.validationGradeAboveG7AndAbove(e)) {
      //  this.isGrade7andAbove = true;
      this.isPictureUpload = true;
      this.isVideoUpload = false;
      this.getControl('fileVideo').clearValidators();
      this.getControl('uploadPicture').setValidators([Validators.required]);
    } else {
      this.isVideoUpload = true;
      this.getControl('fileVideo').setValidators([Validators.required]);
      this.getControl('uploadPicture').clearValidators();
      this.isPictureUpload = false;
      //  this.isGrade7andAbove = false;
    }
    if (this.data?.type == 'E') {
      this.getControl('uploadPicture').clearValidators();
      this.getControl('fileVideo').clearValidators();
    }
    this.getControl('fileVideo').updateValueAndValidity();
    this.getControl('uploadPicture').updateValueAndValidity();
  }

  /** grade band field requred below grade g6  */
  gradeBandValidation(e: any) {

    if (!G5AboveCpmmon.validationGradeAboveG6AndAbove(e)) {
      this.isGradeBandRequired = true;
    } else {
      this.isGradeBandRequired = false;
    }
  }

  public CountryId: number;
  getCountry(e) {
    this.CountryId = e;
  }

  /** date filter exclude sat/sun */
  // myFilterDate = (d: Date): boolean => {
  //   const day = d?.getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // }

  /**control */
  getControl(name: string) {
    return this.submitLeadersAdditionForm.get(name);
  }

  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    //  ctrl.setValidators([Validators.required]);
    // ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }

  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.clearValidators();
    ctrl?.updateValueAndValidity();
  }

  //get company location
  public locationList: any = [];
  getLocation() {
    this._globalServe.getLocationList().subscribe(
      res => {
        let ids = [];

        ids = [1, 2, 4, 5, 16, 23];

        // ids = [1, 2, 4, 5];

        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }

  /**method for add min and max length validators */
  minLengthMaxLengthValidator(name: string, type?: string, min: number = 0, max: number = 0) {
    let ctrl = this.getControl(name);
    if (type == 'min') {
      // ctrl.setValidators([Validators.required, Validators.minLength(min)]);
    }
    ctrl.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }
  //  get currencyTypeData
  public currencyTypeData: any = [];
  getCurrencyType() {
    this._globalServe.getCurrency().subscribe(
      res => {
        this.currencyTypeData = res;
      }
    );
  }

  public practiceList: any = [];
  getAllPractices() {
    //get cand type
    this._globalServe.getAllPractices().subscribe(
      res => {
        this.practiceList = res['data'];
      }
    );
  }

  TotalExp(index: number) {
    //const formGroupControl = this.formSchRowGroup['controls'];
    let totalExp = this.getControl('totalExp').value;
    let totalExpM = this.getControl('totalExpMonth').value;

    if (totalExp == 0) {
      if (totalExpM > 1) {
        // this.addvalidationMinMax(index)
      }
      else {
        //  this.claervalidationMinMax(index);
      }
    }
    else {
      //this.addvalidationMinMax(index)
    }
  }
  //get Salary Type List LocationWise
  getSalaryTypeListLocationWise() {
    if (this._getLocInfo.isLocationIndia()) {
      return CONSTANTS.salaryType?.filter(d => d?.id == 1 || d?.id == 2);
    } else {
      return CONSTANTS.salaryType;
    }
  }
  get resumeControl() { return this.submitLeadersAdditionForm.get('uploadCv'); };
  //cv resume 
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
      this.resumeControl.patchValue(null);
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.imgFile = '';
      this.imgSrc = '';
      this.resumeControl.patchValue(null);
      return false;
    }
    else {
      this.resumeControl.patchValue(this.imgFile);

    }
  }

  get fileUploadCtrl() { return this.submitLeadersAdditionForm.get('fileUpload'); }
  get pictureControl() { return this.submitLeadersAdditionForm.get('uploadPicture'); };
  //cv resume 

  candidatePictureFile: any;
  candidatePictureSrc: any;
  fileUpPicUpload(event) {
    // let allowedExtensions = /(\.jpg|\.jpeg|\.tiff)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    let file = event.target.files[0];
    this.candidatePictureFile = file;
    let fileName = file.name;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  jpeg/jpg/png.');
      event.target.value = "";
      this.candidatePictureFile = '';
      this.imgSrc = '';
      this.pictureControl.patchValue(null);
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.candidatePictureFile = '';
      this.imgSrc = '';
      this.pictureControl.patchValue(null);
      return false;
    }
    else {
      this.pictureControl.patchValue(this.candidatePictureFile);

    }
  }

  /***
    * video upload
    */
  public canVidName: any;
  public canVidSrc: any;
  public vidFile: any;
  public fileSize: number;
  async videoUpload(event) {
    let allowedExtensions = /(\.mp4|\.MP4|\.mp4)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.canVidName = fileName;
    this.fileSize = file.size;
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type  MP4 only.');
      event.target.value = "";
      this.canVidSrc = '';
      this.getControl('fileVideo').reset();
      return false;
    }
    if (file.size > FILE_UPLOAD.VIDEO_FILE_SIZE) {
      this._share.showAlertErrorMessage.next('File  cannot be greater than 50MB.');
      event.target.value = "";
      this.canVidSrc = '';
      this.getControl('fileVideo').reset();
      return false;
    }
    else {
      const video = document.createElement('video');
      video.src = window.URL.createObjectURL(file);
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        let videoDurtion: number = parseInt(video.duration.toFixed(0));
        if (videoDurtion > 60 * 5) {
          this._share.showAlertErrorMessage.next('Video duration cannot be greater than 5 minutes.');
        }
        else {
          this.canVidSrc = file;
          this.vidFile = file;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.canVidSrc = reader.result.toString().replace(/^data:.+;base64,/, '');
            let data = {
              fileName: fileName,
              fileType: 'V',
              interviewType: '',
              isUpload: true,
              file: reader.result,
              srcType: 3
            }
            this.previewImageVideo(data);
          }
        }
      }
    }
  }

  /***
   * 
   */
  previewImageVideo(data: any = {}) {
    let pClass: any = [];
    if (data?.fileType == 'P') {
      pClass = ['ats-model-wrap', 'ats-preview-media-model', 'ats-preview-media-model-img']
    }
    else {
      pClass = ['ats-model-wrap', 'ats-preview-media-model']
    }

    const dialogRef = this.dialog.open(PreviewMediaFileModalComponent,
      {
        data: data,
        width: '500px',
        height: 'auto',
        panelClass: pClass,
        backdropClass: 'mop-image-crop-modal-overlay'
      }
    );
  }

  // download trim guidelines
  dwnloadTrimGuideline(element: any = {}) {
    // let link = document.createElement("a");
    //   link.target = '_blank';
    //   link.href = 'assets/docs/trim-video.pdf';
    //   document.body.appendChild(link);
    //   link.download = 'trim-video-guideline.pdf';
    //   link.click();
    //   document.body.removeChild(link);
    element['title'] = "View video Trim & Upload guidelines";
    element['docName'] = "View video Trim & Upload guidelines";
    element['path'] = "\\\\ipagfileserver\\photos\\ATS\\ImpDocs\\ats-user-guideline\\trim-video-guideline.pdf";
    const dialogRef = this.dialog.open(VideoUploadGuidelineComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: element,
      disableClose: true
    });
  }
  /***
     * VideoUploadGuideline
     */

  VideoUploadGuideline(element: any = {}) {
    element['title'] = "Video Recording Guidelines";
    element['docName'] = "Video Recording Guidelines";
    element['path'] = "\\\\ipagfileserver\\photos\\ATS\\ImpDocs\\ats-user-guideline\\Video-Guidelines.pdf";
    const dialogRef = this.dialog.open(VideoUploadGuidelineComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
      data: element,
      disableClose: true
    });
  }



  /* submit form */
  submitFormHandler(form: any, actionType: string) {
    form.markAllAsTouched();
    this.resumeControl.markAsTouched();
    let totalExps = (parseInt(this.getControl('totalExp')?.value) * 12) + parseInt(this.getControl('totalExpMonth')?.value);
    let relExps = (parseInt(this.getControl('totalRelExp')?.value) * 12) + parseInt(this.getControl('totalRelExpMonth')?.value);
    if (relExps > totalExps) {
      this._share.showAlertErrorMessage.next(`Total Experience can not be less than Relevant Experience for Candidate`);
      return false;
    }

    //   }
    let formData = form;
    //this.addRemoveAllValidatorsForDraft(type);
    if (form.valid) {
      // this.addRemoveAllValidatorsForDraft(type);
      // this.submitFormTalentToServer(formData, type);
      /**actionType s for submit and CandidateSubmissionStatus D for drat or type N for new candidate */
      if ((actionType == 'S') && (this.data?.CandidateSubmissionStatus == 'D' || this.data?.type == 'N')) {
        this.confirmAdditionCandidate(formData, actionType);
      } else {
        this.submitFormTalentToServer(formData, actionType);
      }
    }
    // else if (type == 'D') {
    //   this.addRemoveAllValidatorsForDraft(type);
    //   this.submitFormTalentToServer(formData, type);
    // } 
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');

    }
  }

  confirmAdditionCandidate(formData: any, actionType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Credentials will be shared with the candidate via email upon addition. <br> Do you want to proceed?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitFormTalentToServer(formData, actionType)
      }
    });
  }


  /**submit form for talent creation */
  submitFormTalentToServer(form: any, actionType: string) {
    let formData = form.value;

    //let bodyFormData = new FormData();
    this.data['CandidateLCid'] = this.candidateFullDetails[0]?.CandidateLCid;
    this.data['actionType'] = actionType;
    // this.data['canVidSrc'] = this.canVidSrc ? this.canVidSrc : null;
    // this.data['FileNameVideo'] = this.canVidName;
    // this.data['fileSize'] = this.fileSize ;
    this.data['video'] = this.vidFile ? this.vidFile : null;
    this.data['candidatePicture'] = this.candidatePictureFile ? this.candidatePictureFile : null;
    this._onboard.addLeadership(formData, this.imgFile, this.data).subscribe(
      res => {
        this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(true);
      }
    )

  }


  /***
   * download file 
   */
  // dwnloadFileSingle(data) {
  //   this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadFile?filelocation=${data.Path}`, { responseType: 'blob' }).subscribe(
  //     res => {
  //       saveAs(res, data.testAttachment);
  //     }
  //   )
  // }
  dwnloadFileSingle(data: any) {
    this._GlobCommon.downloadFileCommon(data?.AttachmentPath, data?.ATTACHMENT);
  }


  closeModal(): void {
    this.dialogRef.close();
  }
}
