import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, Form } from '@angular/forms';
import { NewInterviewService } from 'projects/ats-global-system/src/app/core/services/new-interview.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ViewInfoTalentidComponent } from 'projects/ats-global-system/src/app/dashboard-module/modal/view-info-talentid/view-info-talentid.component';
declare var $: any;
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
@Component({
  selector: 'app-schedule-candidate-interview',
  templateUrl: './schedule-candidate-interview.component.html',
  styleUrls: ['./schedule-candidate-interview.component.scss']
})
export class ScheduleCandidateInterviewComponent implements OnInit {
  setTalentId: any;
  talentId = new UntypedFormControl();
  newEmpData: any = [];
  errorMsg: string;
  isAlertDanger: boolean;
  isUpdate: boolean;
  emails: any;
  talentVal: any;
  saveNewEmp: UntypedFormGroup;
  forceEditFrom: UntypedFormGroup;
  time = { hour: 13, minute: 30 };
  panelData: any;
  candidateTypeData: any;
  profileNameData: any;
  intModeData: any;
  getAllEmp: any;
  idTypeData: any;
  successMsg: string;
  errorSvMsg: string;
  isExistAlert: string;
  isSuccessAlert: string;
  isAlertFileType: boolean;
  isFooterHide: boolean;
  isLoading: boolean;
  editPopup: boolean;
  IsDropdownLoader: boolean;
  errorArray = [];
  isAlertSucess: boolean;
  isPanelTop: boolean;
  SuccessMsg: string;
  talentIdAyat: any;
  talentIdVal: any;
  custmsg: string;
  filteredOptions: Observable<any>;
  filteredInt: Observable<any>;
  filteredIntForce: Observable<any>;
  autoAyat = new UntypedFormControl();
  autoInt = new UntypedFormControl();
  fileInput: any;
  idTypeNum: number;
  selectNum: number;
  selectNo: string;
  inputBlank: string;
  minDate = new Date();
  isTimeZero: boolean;
  currencyTypeData: any;
  interviewTypeData: any = [];
  ScheduleFormGroup: UntypedFormGroup;
  public panelIdControl: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  public panelResetVal: string;
  public primarySkillDataList: any = [];
  public c_profileUniqId:number;
  constructor(
    private _newInterviewServe: NewInterviewService,
    private _fb: UntypedFormBuilder,
    private acttive: ActivatedRoute,
    private _globalApi: GlobalApisService,
    public dialog: MatDialog,
    private _globalMethodServe: GlobalCommonMethodService,
    private _intCommonServe: InterviewCommonService,
    private _storage: GetSetStorageService

  ) {
    this.isAlertDanger = false;
    this.editPopup = false;
    this.isAlertSucess = false;
    this.isUpdate = false;
    this.isPanelTop = false;
    this.isTimeZero = true;
    this.saveNewEmp = new UntypedFormGroup({
      candidateName: new UntypedFormControl(''),
      email: new UntypedFormControl(''),
      phone: new UntypedFormControl(''),
      candidateType: new UntypedFormControl(''),
      idType: new UntypedFormControl(''),
      idNo: new UntypedFormControl(''),
      intDate: new UntypedFormControl(''),
      timeHours: new UntypedFormControl(''),
      timeMint: new UntypedFormControl(''),
      joinDate: new UntypedFormControl(''),
      // files: new FormControl(''),
      //  jdFiles: new FormControl(''),
      currentSalary: new UntypedFormControl(''),
      expectedSalary: new UntypedFormControl(''),
      currencyType: new UntypedFormControl(''),
      offLetter: new UntypedFormControl(''),
      modeInterview: new UntypedFormControl(''),
      intPanel: new UntypedFormControl(''),
      additionalPanel: new UntypedFormControl(''),
      talentVal: new UntypedFormControl(''),
      talentIds: new UntypedFormControl(''),
      remarkTd: new UntypedFormControl(''),
      interviewDetails: new UntypedFormControl(''),
      //newly added column
      toexpNo: new UntypedFormControl(''),
      totrelevantExpNo: new UntypedFormControl(''),
      primarySkillNo: new UntypedFormControl(''),
      currCompanyNo: new UntypedFormControl(''),
      CityID: new UntypedFormControl(''),
      educaQualification: new UntypedFormControl(''),
      currOrganisation: new UntypedFormControl(''),
      interviewType: new UntypedFormControl(''),
      CountryID: new UntypedFormControl('')

    });
    this.forceEditFrom = this._fb.group({
      candidateNames: new UntypedFormControl('', [Validators.required, Validators.minLength(4)]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      phone: new UntypedFormControl('', Validators.required),
      candidateType: new UntypedFormControl('', Validators.required),
      idType: new UntypedFormControl('', Validators.required),
      idNumber: new UntypedFormControl('', Validators.required),
      interviewDate: new UntypedFormControl('', Validators.required),
      interviewTimeHours: new UntypedFormControl('', Validators.required),
      interviewTimeMint: new UntypedFormControl('', Validators.required),
      joinDate: new UntypedFormControl('', Validators.required),
      fileUpload: new UntypedFormControl('', Validators.required),
      IntModeType: new UntypedFormControl('', Validators.required),
      interviewer: new UntypedFormControl('', Validators.required),
      remarks: new UntypedFormControl('',),
      thid: new UntypedFormControl(''),
      talentIdFull: new UntypedFormControl(''),
      panel: new UntypedFormControl(''),

    });


    //this.adapter.setLocale('en-GB');
    this.isExistAlert = 'false';
    this.isSuccessAlert = "false";
    this.isFooterHide = false;
    this.isLoading = false;
    this.isAlertFileType = false;

    this.formInit();

  }



  public cityListData: any = [];
  public CountryId: any = [];
  getCountry(e) {
    this.CountryId = e;
  }

  viewTalentIdDetails(data) {
    const dialogRef = this.dialog.open(ViewInfoTalentidComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true
    });
  }
  /*** dynamic control for form */
  initItemRow(data) {
    return this._fb.group({
      profileName: [{ disabled: data?.addExist, value: data ? data.profileid : '-1' }, [Validators.required]],
      appliedid: [data ? data.appliedid : null],
      addExist: [data ? data.addExist : false],
      candidateName: [data ? data.name : null, [Validators.required]],
      email: [{ disabled: data?.addExist, value: data ? data.email : null }, [Validators.required]],
      phone: [data ? data.mobile : null, [Validators.required]],
      candidateType: ['-1', [Validators.required]],
      //  idType:['-1',[Validators.required]],
      //  idNo:[null],
      intDate: [null, [Validators.required]],
      timeHours: ['-1', [Validators.required]],
      timeMint: ['-1', [Validators.required]],
      joinDate: [null, [Validators.required]],
      currentSalary: [data ? data.currentCtc : null, [Validators.required]],
      expectedSalary: [data ? data.expCtc : null, [Validators.required]],
      currencyType: [data?.currencyType ? data.currencyType :'-1', [Validators.required]],
      offLetter: ['false', [Validators.required]],
      modeInterview: ['-1', [Validators.required]],
      intPanel: [null],
      additionalPanel: [null],
      talentVal: [null],
      talentIds: [null],
      remarkTd: [null],
      interviewDetails: [null],
      //newly added column
      toexpNo: [data ? data.totalExp : null, [Validators.required]],
      toexpNoMonth: [data ? data.totalExpMonth : null, [Validators.required]],
      totrelevantExpNo: [data ? data.realExp : null, [Validators.required]],
      totrelevantExpNoMonth: [data ? data.releventExpMonth : null, [Validators.required]],
      primarySkillNo: [data ? parseInt(data.primary_skill) : '-1', [Validators.required]],
      currCompanyNo: [data ? data.currentCompany : null, [Validators.required]],
      CityID: [data?.cityId ? data?.cityId:null, [Validators.required]],
      educaQualification: [null, [Validators.required]],
      currOrganisation: [null],
      interviewType: ['1', [Validators.required]],
      CountryID: [data?.countryId ? data?.countryId:null, [Validators.required]],
      filesUpload: [{ disabled: data?.addExist, value: null }],
    })
  }

  /***
   * form Init Schedule interview
   */
  formInit() {
    this.ScheduleFormGroup = this._fb.group(
      {
        formSchRowGroup: this._fb.array([])
      }
    )
  }


  //get formSchRowGroup() { return <FormArray> this.ScheduleFormGroup['controls'].formSchRowGroup; };
  get formSchRowGroup() {
    return (this.ScheduleFormGroup.get('formSchRowGroup') as UntypedFormArray);
  }
  get formGroupControls() {
    return this.formSchRowGroup['controls']
  }
  /***
   * get talend id detais and init form /add control
   */
  getThDetails(event, type) {
    const control = this.formSchRowGroup;
    let thId;
    if (type == null) {
      this.talentIdAyat = event.source.value;
      thId = event.source.id
    }
    else {
      this.talentIdAyat = event.talent_Id;
      thId = event.thId
    }
    this.talentVal = this.talentIdAyat;
    this.talentIdVal = thId;
    this._globalApi.getRequisitionTHID(thId).subscribe(
      resPanel => {
        this.isPanelTop = true;
        this.panelData = resPanel[0];
        this.isFooterHide = true;
      }
    )
    if (event.data) {
      setTimeout(() => {
        control.push(this.initItemRow(event.data));
      }, 1000);
    }
    else {
      setTimeout(() => {
        if (control.length === 0) {
          control.push(this.initItemRow(null));
        }

      }, 1000);
    }

  }
  /***
* add row
*/
  addMoreRow() {
    const control = this.formSchRowGroup;
    let talentValue = this.talentIdAyat;
    if (talentValue == null || talentValue == "") {
      this.isAlertDanger = true;
      this.errorMsg = "Please Select Talent Id";
    }
    else if (control.length > 10) {
      this.isAlertDanger = true;
      this.errorMsg = "You can not add more than Ten rows";
    }
    else {
      control.push(this.initItemRow(null));
      this.isFooterHide = true;
      // this.FilterCtrl.reset();
      const formGroupControl = this.formSchRowGroup['controls'];
      let numLen = formGroupControl.length - 1;
      setTimeout(() => {
        formGroupControl[numLen]['controls'].intPanel.patchValue(this.panelIdControl.value);
      }, 500);
    }

  }
  /***
   * on mode change 
   */
  onSelectModeInt(event: any, i: number): void {
    let id = event.target.value;
    const formGroupControl = this.formSchRowGroup['controls'];
    formGroupControl[i]['controls'].interviewDetails.reset();
    if (id == "6" || id == '3') {
      formGroupControl[i]['controls'].interviewDetails.disable();
    }
    else {
      formGroupControl[i]['controls'].interviewDetails.enable();
    }
  }

  /***
   * remove control
   */
  removeRow(index) {
    const control = this.formSchRowGroup;
    control.removeAt(index);
    if (control.length == 0) {
      this.isFooterHide = false;
    }

  }
  /***
   * reset form
   */
  resetSn() {
    this.ScheduleFormGroup.reset();
    this.resetSpecificControl();
    this.panelIdControl.reset();
    this.FilterCtrl.reset();
  }

  resetSpecificControl() {
    const formGroupControl = this.formSchRowGroup['controls'];
    for (let i = 0; i < formGroupControl.length; i++) {
      formGroupControl[i]['controls'].candidateType.patchValue('-1');
      formGroupControl[i]['controls'].profileName.patchValue('-1');
      // formGroupControl[i]['controls'].idType.patchValue('-1');
      formGroupControl[i]['controls'].timeHours.patchValue('-1');
      formGroupControl[i]['controls'].timeMint.patchValue('-1');
      formGroupControl[i]['controls'].modeInterview.patchValue('-1');
      formGroupControl[i]['controls'].interviewType.patchValue('-1');
      formGroupControl[i]['controls'].currencyType.patchValue('-1');
      formGroupControl[i]['controls'].primarySkillNo.patchValue('-1');
      formGroupControl[i]['controls'].offLetter.patchValue('false');
      formGroupControl[i]['controls'].primarySkillNo.reset();
    }
  }

  /***
   * submit form method
   */
  saveNewEmpFormFinal(data: any) {
    let formControlsNew = this.formSchRowGroup['controls'];
    if (formControlsNew.length > 0) {
      for (let i = 0; i < formControlsNew.length; i++) {
        let appliedid = $("#newEmpTable tbody tr#id" + i + " td #appliedid").val();
        let ProfileID = $("#newEmpTable tbody tr#id" + i + " td #ProfileID").val();
        let setId = $("#newEmpTable tbody tr#id" + i);
        let name = $("#newEmpTable tbody tr#id" + i + " td #candidateName").val();
        let email = $("#newEmpTable tbody tr#id" + i + " td #email").val();
        let phone = $("#newEmpTable tbody tr#id" + i + " td #phone").val();
        let candidateType = $("#newEmpTable tbody tr#id" + i + " td #candidateType").val();

        let intModes = $("#newEmpTable tbody tr#id" + i + " td #modeInterview").val();
        let intDt = $("#newEmpTable tbody tr#id" + i + " td #interviewDetails").val();
        let idType = $("#newEmpTable tbody tr#id" + i + " td #idtype").val();
        let idNo = $("#newEmpTable tbody tr#id" + i + " td #idno").val();
        let interviewDate = this.formatDate($("#newEmpTable tbody tr#id" + i + " td #intDate").val());
        let interviewDate1 = $("#newEmpTable tbody tr#id" + i + " td #intDate").val();
        let timeHours = $("#newEmpTable tbody tr#id" + i + " td #timeHours").val();
        let timeMinute = $("#newEmpTable tbody tr#id" + i + " td #timeMint").val();
        let joiningDate = this.formatDate($("#newEmpTable tbody tr#id" + i + " td #joinDate").val());
        let joiningDate1 = $("#newEmpTable tbody tr#id" + i + " td #joinDate").val();
        let talentId = $("#newEmpTable tbody tr#id" + i + " td #talentVal").val();
        let talentIdNum = $("#newEmpTable tbody tr#id" + i + " td #talentId").val();
        let remark = $("#newEmpTable tbody tr#id" + i + " td #remark").val();
        let file = $("#newEmpTable tbody tr#id" + i + " #files")[0].files[0];
        // let jdFile = $("#newEmpTable tbody tr#id" + i + " #jdFiles")[0].files[0];
        let currencyTypeId = $("#newEmpTable tbody tr#id" + i + " td #currencyType").val();
        let currentSalary = $("#newEmpTable tbody tr#id" + i + " td #currentSalary").val();
        let expectSalary = $("#newEmpTable tbody tr#id" + i + " td #expectedSalary").val();
        let offLetter = $("#newEmpTable tbody tr#id" + i + " td #offLetter").val();
        let panelFull = $("#newEmpTable tbody tr#id" + i + " td #panelVal").val();
        let panelAd = $("#newEmpTable tbody tr#id" + i + " td #adpanelVal").val();
        let toalExp = $("#newEmpTable tbody tr#id" + i + " td #toexpNo").val();
        let toalExpMonth = $("#newEmpTable tbody tr#id" + i + " td #toexpNoMonth").val();
        let totrelevantExpNo = $("#newEmpTable tbody tr#id" + i + " td #totrelevantExpNo").val();
        let totrelevantExpNoMonth = $("#newEmpTable tbody tr#id" + i + " td #totrelevantExpNoMonth").val();
        let primarySkillNo = $("#newEmpTable tbody tr#id" + i + " td #primarySkillNo").val();
        let currCompanyNo = $("#newEmpTable tbody tr#id" + i + " td #currCompanyNo").val();
        //let currlocationNo = $("#newEmpTable tbody tr#id" + i + " td #currlocationNo").val();
        let CountryID = $("#newEmpTable tbody tr#id" + i + " td #CountryID").val();
        let CityID = $("#newEmpTable tbody tr#id" + i + " td #CityID").val();
        let educaQualification = $("#newEmpTable tbody tr#id" + i + " td #educaQualification").val();
        let currOrganisation = $("#newEmpTable tbody tr#id" + i + " td #currOrganisation").val();
        let interviewType = $("#newEmpTable tbody tr#id" + i + " td #interviewType").val();

        let panelTrim = panelFull.trim();
        let panel = panelTrim;
        let panelAdditional = panelAd.trim();
        //let pickedOrNot = this.getAllEmp.filter(alias => alias.empnewid === panel);
        if (ProfileID === 'undefined' || ProfileID == null || ProfileID == '' || ProfileID == '-1') {
          //alert("Please select Candidate Type ");
          $("#newEmpTable tbody tr#id" + i + " td #ProfileID").focus();
          this.errorMsg = "Please select Profile Source";
          this.isAlertDanger = true;
          return false;
        }

        if (name === 'undefined' || name == null || name == '') {
          this.errorMsg = "Please enter Candidate Name";
          this.isAlertDanger = true;
          $("#newEmpTable tbody tr#id" + i + " td #candidateName").focus();
          return false;
        }
        let nameRegex = /^[A-Za-z ]+$/;
        if (!name.match(nameRegex)) {
          this.errorMsg = "Please enter valid Candidate Name";
          this.isAlertDanger = true;
          $("#newEmpTable tbody tr#id" + i + " td #candidateName").focus();
          return false;
        }
        if (toalExp === 'undefined' || toalExp == null || toalExp == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #toexpNo").focus();
          this.errorMsg = "Please enter Total Experience in Year.";
          this.isAlertDanger = true;
          return false;
        }
        if (toalExpMonth === 'undefined' || toalExpMonth == null || toalExpMonth == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #toexpNoMonth").focus();
          this.errorMsg = "Please enter Total Experience in Month.";
          this.isAlertDanger = true;
          return false;
        }
        if (totrelevantExpNo === 'undefined' || totrelevantExpNo == null || totrelevantExpNo == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #totrelevantExpNo").focus();
          this.errorMsg = "Please enter Relevant Experience in Year.";
          this.isAlertDanger = true;
          return false;
        }
        if (totrelevantExpNoMonth === 'undefined' || totrelevantExpNoMonth == null || totrelevantExpNoMonth == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #totrelevantExpNoMonth").focus();
          this.errorMsg = "Please enter Relevant Experience in Month.";
          this.isAlertDanger = true;
          return false;
        }
        // if (primarySkillNo === 'undefined' || primarySkillNo == null || primarySkillNo == '') {
        //   // alert("Please enter Email Id ");
        //   $("#newEmpTable tbody tr#id" + i + " td #primarySkillNo").focus();
        //   this.errorMsg = "Please enter Primary Skill.";
        //   this.isAlertDanger = true;
        //   return false;
        // }
        if (primarySkillNo === 'undefined' || primarySkillNo == null || primarySkillNo == '' || primarySkillNo == '-1') {
          $("#newEmpTable tbody tr#id" + i + " td #primarySkillNo").focus();
          this.errorMsg = "Please select  Skill.";
          this.isAlertDanger = true;
          return false;
        }
        if (phone === 'undefined' || phone == null || phone == '') {
          // alert("Please enter Phone NO");
          $("#newEmpTable tbody tr#id" + i + " td #phone").focus();
          this.errorMsg = "Please enter Phone No.";
          this.isAlertDanger = true;
          return false;
        }
        if (phone.length < 10) {
          // alert("Please enter Phone NO");
          $("#newEmpTable tbody tr#id" + i + " td #phone").focus();
          this.errorMsg = "Please enter valid  Phone No.";
          this.isAlertDanger = true;
          return false;
        }
        let dd = /^[1-9][0-9]*$/g;
        if (!dd.test(phone)) {
          $("#newEmpTable tbody tr#id" + i + " td #phone").focus();
          this.errorMsg = "Please enter valid  Phone No.";
          this.isAlertDanger = true;
          return false;
        }
        if (email === 'undefined' || email == null || email == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #email").focus();
          this.errorMsg = "Please enter Email ID";
          this.isAlertDanger = true;
          return false;
        }
        let uniqEmail = /@infogain.com\s*$/;
        if (uniqEmail.test(email)) {
          this.errorMsg = "You cannot enter Infogain Email ID";
          this.isAlertDanger = true;
          return false;
        }
        if (currCompanyNo === 'undefined' || currCompanyNo == null || currCompanyNo == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #currCompanyNo").focus();
          this.errorMsg = "Please enter Current Company.";
          this.isAlertDanger = true;
          return false;
        }

        if (CountryID === 'undefined' || CountryID == null || CountryID == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #CountryID").focus();
          this.errorMsg = "Please select Country.";
          this.isAlertDanger = true;
          return false;
        }
        if (CityID === 'undefined' || CityID == null || CityID == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #CountryID").focus();
          this.errorMsg = "Please select City.";
          this.isAlertDanger = true;
          return false;
        }

        if (educaQualification === 'undefined' || educaQualification == null || educaQualification == '') {
          // alert("Please enter Email Id ");
          $("#newEmpTable tbody tr#id" + i + " td #educaQualification").focus();
          this.errorMsg = "Please enter Educational Qualification.";
          this.isAlertDanger = true;
          return false;
        }

        if (candidateType === 'undefined' || candidateType == null || candidateType == '' || candidateType == '-1') {
          //alert("Please select Candidate Type ");
          $("#newEmpTable tbody tr#id" + i + " td #candidateType").focus();
          this.errorMsg = "Please select Employment Type";
          this.isAlertDanger = true;
          return false;
        }


        // if (idType === 'undefined' || idType == null || idType == '' || idType == '-1') {
        //    $("#newEmpTable tbody tr#id" + i + " td #idtype").focus();
        //   this.errorMsg = "Please select Unique ID Type";
        //   this.isAlertDanger = true;
        //   return false;
        // }

        // if (idNo === 'undefined' || idNo == null || idNo == '') {
        //   $("#newEmpTable tbody tr#id" + i + " td #idno").focus();
        //   this.errorMsg = "Please enter Unique ID No.";
        //   this.isAlertDanger = true;
        //   return false;
        // }

        // if (idType == 1) {
        //   let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

        //   if (!regpan.test(idNo)) {
        //     this.errorMsg = "Please enter valid PAN number";
        //     this.isAlertDanger = true;
        //     return false;
        //   }
        // }
        // if (idType == 2) {
        //   let num = /^\d*$/;
        //   let dd = /^[1-9][0-9]*$/g;
        //   if (!dd.test(idNo)) {
        //     this.errorMsg = "Please enter valid AADHAAR Card Number";
        //     this.isAlertDanger = true;
        //     return false;
        //   }
        //   if (!num.test(idNo)) {
        //     this.errorMsg = "Please enter valid AADHAAR Card Number";
        //     this.isAlertDanger = true;
        //     return false;
        //   }

        //   if (idNo.length > 12 || idNo.length < 12) {
        //     this.errorMsg = "Please enter 12 digit AADHAAR  Number";
        //     this.isAlertDanger = true;
        //     return false;
        //   }
        // }
        // if (idType == 3) {
        //   if (idNo === 'undefined' || idNo == null || idNo == '') {
        //     $("#newEmpTable tbody tr#id" + i + " td #idno").focus();
        //     this.errorMsg = "Please enter Unique ID No.";
        //     this.isAlertDanger = true;
        //     return false;
        //   }
        // }
        if (interviewDate1 === 'undefined' || interviewDate1 == null || interviewDate1 == '') {
          $("#newEmpTable tbody tr#id" + i + " td #intDate").focus();
          this.errorMsg = "Please enter Interview  Date";
          this.isAlertDanger = true;
          return false;
        }
       if (timeHours === 'undefined' || timeHours == null || timeHours == '' || timeHours == '-1') {
          // alert("Please select Hours ");
          $("#newEmpTable tbody tr#id" + i + " td #timeHours").focus();
          this.errorMsg = "Please select Hours";
          this.isAlertDanger = true;
          return false;
        }
        if (timeMinute === 'undefined' || timeMinute == null || timeMinute == '' || timeMinute == '-1') {
          alert("Please select Minuts ");
          //$("#newEmpTable tbody tr#id" + i + " td #timeMint").focus();
          this.errorMsg = "Please select Minutes";
          this.isAlertDanger = true;
          return false;
        }
        if (intModes === 'undefined' || intModes == null || intModes == '' || intModes == '-1') {
          // alert("Please select Mode Of Interview ");
          this.errorMsg = "Please select Mode of Interview";
          this.isAlertDanger = true;
          $("#newEmpTable tbody tr#id" + i + " td #modeInterview").focus();
          return false;
        }

        if (interviewType === 'undefined' || interviewType == null || interviewType == '' || interviewType == '-1') {
          $("#newEmpTable tbody tr#id" + i + " td #interviewType").focus();
          this.errorMsg = "Please select Interview Type";
          this.isAlertDanger = true;
          return false;
        }

        if (panel === 'undefined' || panel == null || panel == '') {
          // alert("Please select Interviewer ");
          // $("#newEmpTable tbody tr#id" + i + " td #panelVal").focus();
          this.errorMsg = "Please select Interviewer ";
          this.isAlertDanger = true;
          return false;
        }

        if (joiningDate1 === 'undefined' || joiningDate1 == null || joiningDate1 == '') {
          //alert("Please Enter Joining  Date ");
          $("#newEmpTable tbody tr#id" + i + " td #joinDate").focus();
          this.errorMsg = "Please enter Tentative DOJ";
          this.isAlertDanger = true;
          return false;
        }

        let intDts = new Date(interviewDate1);
        let intJoinDts = new Date(joiningDate1);
        if (intDts > intJoinDts) {
          this.errorMsg = "Tentative DOJ Should not less than Interview  Date.";
          this.isAlertDanger = true;
          return false;
        }

        if ((file === 'undefined' || file == null) && $("#newEmpTable tbody tr#id" + i + " td #addExist").val() != 'true') {
          $("#newEmpTable tbody tr#id" + i + " td #files").focus();
          this.errorMsg = "Please upload CV";
          this.isAlertDanger = true;
          return false;
        }
        // if (jdFile === 'undefined' || jdFile == null) {
        //   $("#newEmpTable tbody tr#id" + i + " td #jdFiles").focus();
        //   this.errorMsg = "Please upload JD";
        //   this.isAlertDanger = true;
        //   return false;
        // }

        if (currencyTypeId === 'undefined' || currencyTypeId == null || currencyTypeId == '' || currencyTypeId == '-1') {
          //alert("Please select Candidate Type ");
          $("#newEmpTable tbody tr#id" + i + " td #currencyType").focus();
          this.errorMsg = "Please select Currency Type";
          this.isAlertDanger = true;
          return false;
        }
        if (currentSalary === 'undefined' || currentSalary == null || currentSalary == '') {
          $("#newEmpTable tbody tr#id" + i + " td #currentSalary").focus();
          this.errorMsg = "Please enter Current Salary";
          this.isAlertDanger = true;
          return false;
        }
        let salary = /^[0-9]*$/;
        if (!currentSalary.match(salary)) {
          $("#newEmpTable tbody tr#id" + i + " td #currentSalary").focus();
          this.errorMsg = "Please enter valid Current Salary";
          this.isAlertDanger = true;
          return false;
        }
        if (expectSalary === 'undefined' || expectSalary == null || expectSalary == '') {
          $("#newEmpTable tbody tr#id" + i + " td #expectedSalary").focus();
          this.errorMsg = "Please enter Expected Salary";
          this.isAlertDanger = true;
          return false;
        }
        if (!expectSalary.match(salary)) {
          $("#newEmpTable tbody tr#id" + i + " td #expectedSalary").focus();
          this.errorMsg = "Please enter valid Expected Salary";
          this.isAlertDanger = true;
          return false;
        }

        // if (pickedOrNot.length < 0 || pickedOrNot == "" || pickedOrNot == null) {
        //   this.isAlertDanger = true;
        //   this.errorMsg = "Please select valid  interviewer ";
        //   return false;
        // }
        else {
          let uniqName = this._storage.getUserEmpId();
          let getData = {
            "profileId": ProfileID,
            "appliedid": appliedid,
            "name": name,
            "email": email,
            "phone": phone,
            "candidateType": candidateType,
            "intModes": intModes,
            "intDt": intDt,
            "candidateStatus": idType,
            // "idType": idType,
            //  "idNo": idNo,
            "interviewDate": interviewDate + " " + timeHours + ":" + timeMinute + ":00",
            //"time" :idType,
            "joiningDate": joiningDate + " " + timeHours + ":" + timeMinute + ":00",
            "talentId": talentId,
            "thId": talentIdNum,
            "panel": panel,
            "panelAd": panelAdditional,
            "remark": remark,
            "currencyTypeId": currencyTypeId,
            "currentSalary": currentSalary,
            "expectedSalary": expectSalary,
            "offersLetter": offLetter,
            "c_role": '3',
            "rec": uniqName,
            "toexpNo": toalExp,
            "toexpNoMonth": toalExpMonth,
            "totrelevantExpNo": totrelevantExpNo,
            "totrelevantExpNoMonth": totrelevantExpNoMonth,
            "primarySkillNo": primarySkillNo,
            "currCompanyNo": currCompanyNo,
            "CountryID": CountryID,
            "CityID": CityID,
            "educaQualification": educaQualification,
            "currOrganisation": currOrganisation,
            "interviewType": interviewType,
            "file": file,
            "c_profileUniqId":this.c_profileUniqId
          }

          if (this.ScheduleFormGroup.valid) {

            this.isLoading = true;
            this.submitDataToserver(getData, i);
          }
        }

      }
    }

  }

  submitDataToserver(getData, i) {
    this.errorArray = [];
    document.getElementById("sucessMsg").innerHTML = "";
    let formControlsNew = this.formSchRowGroup['controls'];
    this._newInterviewServe.sendDataToServer(getData).subscribe(
      res => {

        //  console.log(res)
        //  if (res.code == "200") {
        this.isLoading = false;
        //  let tableRowLenShow = tableRowLen - 1;
        let recs = i + 1;
        this.isSuccessAlert = "true";
        // this.successMsg = recs + " row record saved of" + "" + tableRowLenShow;
        this.successMsg = res;
        // $("#newEmpTable tbody tr#id" + i + " td .btn-delete").click();
        // $("#newEmpTable tbody tr#id" + i ).remove();
        // this.remove(i);
        let node = document.createElement("LI");
        let textnode = document.createTextNode(res);
        node.appendChild(textnode);
        document.getElementById("sucessMsg").appendChild(node);

        let tableRowLens = document.getElementsByTagName("tr").length - 1;
        if (formControlsNew.length == 1) {
          this.ScheduleFormGroup.reset();
          this.resetSpecificControl();
          this.panelIdControl.reset();
          //autocom
          // this.intDataFuncNew();
        }
        else {
          //  this.intDataFuncNew();
          this.removeRow(i);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error.error);
        let recsError = i + 1;
        let errType = error.error.Message;
        // alert(errType);
        if (errType == null) {

          this.custmsg = "Somthing went wrong. Please try again later.";
        }
        else {

          this.custmsg = error.error.Message;
        }
        this.errorSvMsg = error.error.Message;
        this.isExistAlert = 'true';
        sessionStorage.setItem("userDataIds" + recsError, JSON.stringify(error.error));
        //console.log(this.errorArray);
        let errorObj = {
          "num": recsError,
          "id": recsError,
          "msg": this.custmsg,

        }
        this.errorArray.push(errorObj);


      }
    )
  }



  ngOnInit() {
    $(".infoconnect-nav a.active-link.rec").parents(".submenu").parent().addClass("activeIcon active");
    $(".infoconnect-nav a.active-link.rec").parents(".submenu").show();
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtToken = queryToken ? this._globalMethodServe.decryptData(queryToken) : null;


    //get talent id
    this.IsDropdownLoader = true;

    //get cand type
    this._globalApi.getCurrency().subscribe(
      res => {
        this.currencyTypeData = res;
        console.log('currency');
      },
      (error) => {
        console.log('currency Error');
        console.log(error)
      }
    );
    //get cand type
    this._intCommonServe.getCandidateType().subscribe(
      res => {
        this.candidateTypeData = res;
      }
    );

    //get Profile Name
    this._intCommonServe.getProfileName().subscribe(
      res => {
        let filterById;
        if (queryToken && queryExtToken) {
          filterById = [1, 2, 3, 4, 5, 6];
        }
        else {
          filterById = [1, 2,5, 6];
        }

        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.id) !== -1;
        });
        this.profileNameData = filterByStatus;
      }
    );
    //get all panel
    //  this.intDataFuncNew();
    // this.intDataFuncForce();
    //  this.intDataAllEmp();

    //get interview Mode 
    this._intCommonServe.getIntMode().subscribe(
      res => {
        this.intModeData = res;
      }
    );
    //Get id type
    this._intCommonServe.getIdType().subscribe(
      res => {
        this.idTypeData = res;
      }
    )

    //Get interview type
    this._intCommonServe.getInterviewType().subscribe(
      res => {
        let filterById = [1];
        let dataRes = res['data'];
        let filterByStatus = dataRes.filter(t => {
          return filterById.indexOf(t.id) !== -1;
        });
        this.interviewTypeData = filterByStatus;
      }
    )

  }



  ngAfterViewInit() {
    let queryToken = this.acttive['snapshot'].queryParams.query;
    let queryExtToken = queryToken ? this._globalMethodServe.decryptData(queryToken) : null;
    if (queryToken && queryExtToken) {
      let thId = queryExtToken.thId;
      let talentId = queryExtToken.talentId;
      let addExist = queryExtToken.addExist;
      let mobile = queryExtToken.mobile;
      let name = queryExtToken.name;
      let email = queryExtToken.email;
      let totalExp = queryExtToken.totalExp;
      let totalExpMonth = queryExtToken.totalExpMonth;
      let realExp = queryExtToken.releventExp;
      let releventExpMonth = queryExtToken.releventExpMonth;
      let primary_skill = queryExtToken.primarySkill;
      let profileid = queryExtToken.profileid;
      let appliedid = queryExtToken.appliedid;
      let data = { addExist: addExist, mobile: mobile, name: name, email: email, totalExp: totalExp, realExp: realExp, primary_skill: primary_skill, totalExpMonth: totalExpMonth, releventExpMonth: releventExpMonth, profileid: profileid, appliedid: appliedid }
      data['currentCompany'] =queryExtToken.currentCompany;
      data['currencyType'] =queryExtToken.currencyType;
      data['currentCtc'] =queryExtToken.currentCtc;
      data['expCtc'] =queryExtToken.expCtc;
      data['countryId'] =queryExtToken.countryId;
      data['cityId'] =queryExtToken.cityId;
      if (thId && talentId) {
        if (addExist) {
          this.c_profileUniqId = queryExtToken.c_profileUniqId
          this.getThDetails({ talent_Id: talentId, thId: thId, data: data }, 1)
        }
        else {
          this.autoAyat.patchValue(talentId);
          this.getThDetails({ talent_Id: talentId, thId: thId }, 1)
        }

      }
    }


  }




  getDataTalent(data) {
    this.getThDetails({ talent_Id: data.talentID, thId: data.TH_ID }, 1)
  }
  //get talent id
  getTalentId(event, type) {
    let thId;
    if (type == null) {
      this.talentIdAyat = event.source.value;
      thId = event.source.id
    }
    else {
      this.talentIdAyat = event.talent_Id;
      thId = event.thId
    }

    this._globalApi.getRequisitionTHID(thId).subscribe(
      resPanel => {
        let selectedData = [{
          value: this.talentIdAyat,
          name: '',
          email: '',
          cType: -1,
          phone: '',
          unIdType: -1,
          unIdNum: '',
          intDt: '',
          joinDt: '',
          mm: -1,
          mode: -1,
          hh: -1,
          intPanel: '',
          remark: '',
          // text: target.innerText.trim()
        }];
        if (this.newEmpData == "" || this.newEmpData.length === 0) {
          this.newEmpData = selectedData;
          this.talentVal = this.talentIdAyat;
          this.talentIdVal = thId;
          this.fileInput = "";
          this.inputBlank = "";
          this.selectNum = -1;
          this.selectNo = "false";
          this.isPanelTop = true;
          this.panelData = resPanel[0];
          this.isFooterHide = true;
        }
        else {
          let selectedData = [{
            value: this.talentIdAyat,
            name: '',
            email: '',
            cType: 2,
            phone: '',
            unIdType: -1,
            unIdNum: '',
            intDt: '',
            joinDt: '',
            mm: -1,
            mode: -1,
            hh: -1,
            intPanel: '',
            remark: '',
            // text: target.innerText.trim()
          }];
          let newUser = {
            "name": "Ayat"
          }
          this.talentVal = this.talentIdAyat;
          this.talentIdVal = thId;
          this.fileInput = "";
          this.inputBlank = "";
          this.selectNum = -1;
          this.selectNo = "false";
          this.isPanelTop = true;
          this.panelData = resPanel[0];
          this.isFooterHide = true;
        }

      }
    )
  }
  //add new data
  pushDataNew(data) {
    this.newEmpData.push(data);

  }
  // add new row
  addRows() {

    let tableRowLen = document.getElementsByTagName("tr").length;
    let talentValue = this.talentIdAyat;
    if (talentValue == null || talentValue == "") {
      this.isAlertDanger = true;
      this.errorMsg = "Please Select Talent Id";
    }
    else if (tableRowLen > 10) {
      this.isAlertDanger = true;
      this.errorMsg = "You can not add more than Ten rows";
    }
    else {
      let selectedDatas = [{
        value: "ff",
        name: '',
        email: '',
        cType: -1,
        phone: '',
        unIdType: -1,
        unIdNum: '',
        intDt: '',
        joinDt: '',
        mm: -1,
        mode: -1,
        hh: -1,
        intPanel: '',
        remark: ''
      }];
      this.talentVal = this.talentIdAyat;
      this.fileInput = "";
      this.inputBlank = "";
      this.selectNum = -1;
      this.selectNo = "false";

      this.newEmpData.push(selectedDatas);
      this.isFooterHide = true;
    }
  }

  remove(index) {
    this.newEmpData.splice(index, 1);

    let tableRowLen = document.getElementsByTagName("tr").length;
    if (tableRowLen == 2) {
      this.isFooterHide = false;
    }
  }

  searchTalent(event) {
    document.getElementById('talentFocused').focus();
    event.stopPropagation()
  }

  candIdTypeValid(event) {
    let idTypeNum = event.target.value;
    event.target.parentElement.nextSibling.firstChild.firstChild.value = "";
    event.target.parentElement.nextSibling.firstChild.firstChild.nextSibling.innerHTML = "";
    let detectInput = event.target.parentElement.nextSibling.firstChild.firstChild;
    if (idTypeNum == 4) {
      detectInput.disabled = true;
      detectInput.value = "NA";
    }
    else {
      detectInput.disabled = false;
      detectInput.value = "";
    }
    detectInput.addEventListener("keyup", function () {
      let getidType = this.parentElement.parentElement.previousSibling.firstChild.value;
      this.nextElementSibling.innerHTML = "";
      let msg = this.nextElementSibling;
      if (getidType == 1) {
        let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

        if (regpan.test(this.value)) {
          msg.innerHTML = "";
        } else {
          msg.innerHTML = "Please enter valid PAN number"
        }
      }
      if (getidType == 2) {

        this.nextElementSibling.innerHTML = "";
        let num = /^\d*$/;
        let dd = /^[1-9][0-9]*$/g;
        if (!dd.test(this.value)) {
          msg.innerHTML = "Please enter valid AADHAAR Card Number";
        }
        if (this.value.length < 12 || this.value.length > 12) {
          msg.innerHTML = "Please enter 12 digit AADHAAR  Number";

        }
        if (this.value.length == "0") {
          msg.innerHTML = " ";
        }
        if (num.test(this.value)) {
          return true
        }

        else {
          msg.innerHTML = "Please enter valid AADHAAR Card Number";

        }
      }
    });
  }
  hoursValid(event) {
    //  console.log(event);
    if (event.target.value == "00") {
      this.isTimeZero = false;
      event.target.parentElement.nextSibling.nextSibling.firstChild.value = "-1";

    }
    else {
      this.isTimeZero = true;
      event.target.parentElement.nextSibling.nextSibling.firstChild.value = "00";
    }
  }
  IdValidion(event) {
    if (this.idTypeNum == 1) {
      let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

      if (regpan.test(event.target.value)) {
        // valid pan card number
      } else {
        // alert("Please enter valid PAN number");
        this.isAlertDanger = true;
        this.errorMsg = "Please enter valid PAN number";

      }
    }
    //PAN Card Validation
    if (this.idTypeNum == 2) {
      let num = /^\d*$/;
      if (event.target.value.length < 12) {
        //  alert("Please enter 12 digit AADHAAR  Number");
        this.isAlertDanger = true;
        this.errorMsg = "Please enter 12 digit AADHAAR  Number";

      }
      if (num.test(event.target.value)) {
        return true
      }

      else {
        // alert("Please enter valid AADHAAR Card Number");
        this.isAlertDanger = true;
        this.errorMsg = "Please enter valid AADHAAR Card Number";

      }
    }
  }
  IdLen(event) {

    if (this.idTypeNum == 2) {
      if (event.target.value.length > 12) {
        this.isAlertDanger = true;
        this.errorMsg = "Please enter 12 digit AADHAAR  Number";

      }
    }

    if (this.idTypeNum == 3) {
      if (event.target.value.length > 15) {
        // alert("Please enter Correct DL No.");
        this.isAlertDanger = true;
        this.errorMsg = "Please enter Correct DL No.";
      }
    }
  }


  reset() {
    this.saveNewEmp.reset();
    this.isSuccessAlert = "false";
    this.isExistAlert = "false";
    // this.selectNum = -1;
    this.saveNewEmp.controls['idType'].setValue("-1");
    this.saveNewEmp.controls['offLetter'].setValue("false");
    this.saveNewEmp.controls['candidateType'].setValue("-1");
    this.saveNewEmp.controls['timeHours'].setValue("-1");
    this.saveNewEmp.controls['timeMint'].setValue("-1");
    this.saveNewEmp.controls['modeInterview'].setValue("-1");
    this.saveNewEmp.controls['currencyType'].setValue("-1");
    this.saveNewEmp.controls['interviewType'].setValue("-1");
  }

  closePopUp(): void {
    this.editPopup = false;
  }
  fileValidation(event) {
    //   var fileInput = document.getElementById('file');
    var filePath = event.target.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    if (!allowedExtensions.exec(filePath)) {
      // this.errorMsg = "Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.";
      this.isAlertFileType = true;
      //  fileInput.value = '';
      event.target.value = "";
      return false;
    }
  }
  validateEmail(event) {
    let emailText = event.target.value;
    let msg = event.target.nextElementSibling;
    msg.innerHTML = " ";
    let pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    let uniqEmail = /@infogain.com\s*$/;
    if (uniqEmail.test(emailText)) {
      msg.innerHTML = "You cannot enter Infogain Email ID";
      return false;
    }

    if (pattern.test(emailText)) {
      return true;
    }
    else if (emailText == "") {
      //  this.isAlertDanger = true;
      // this.errorMsg = "Please enter Email Id";
      msg.innerHTML = "Please enter Email ID";
      return false;
    } else {
      // alert('Bad email address: ' + emailText);
      // this.isAlertDanger = true;
      // this.errorMsg = emailText + " is invalid Email ID";
      msg.innerHTML = "Please enter valid  Email ID";
      return false;
    }
  }

  nameValidation(event) {
    let inputtxt = event.target.value;
    let msg = event.target.nextElementSibling;
    msg.innerHTML = " ";
    let phoneno = /^[A-Za-z ]+$/;

    if (inputtxt.match(phoneno)) {

      return true;
    }
    else if (inputtxt == "") {
      //this.isAlertDanger = true;
      // this.errorMsg = "Please enter Phone No";
      msg.innerHTML = "Please enter Candidate Name ";
      return false;
    }
    else {
      // this.isAlertDanger = true;
      // this.errorMsg = " Please enter valid Phone No.";
      msg.innerHTML = "Please enter valid Candidate Name ";
      return false;
    }
  }

  saleryValidation(event) {
    let nodeVal = event.target.attributes.placeholder.nodeValue;
    let inputtxt = event.target.value;
    let msg = event.target.nextElementSibling;
    msg.innerHTML = " ";
    let phoneno = /^[0-9]*$/;

    if (inputtxt.match(phoneno)) {

      return true;
    }
    else if (inputtxt == "") {
      msg.innerHTML = "Please enter " + " " + nodeVal;
      return false;
    }
    else {
      msg.innerHTML = "Please enter valid" + " " + nodeVal;
      return false;
    }
  }
  phonenumber(event) {
    let inputtxt = event.target.value;
    let msg = event.target.nextElementSibling;
    msg.innerHTML = " ";
    let phoneno = /^\d{10}$/;
    let dd = /^[1-9][0-9]*$/g;
    if (!dd.test(inputtxt)) {
      msg.innerHTML = "Please enter valid Phone No.";
      return false;
    }
    if (inputtxt.match(phoneno)) {

      return true;
    }
    else if (inputtxt == "") {
      //this.isAlertDanger = true;
      // this.errorMsg = "Please enter Phone No";
      msg.innerHTML = "Please enter Phone No.";
      return false;
    }
    else {
      // this.isAlertDanger = true;
      // this.errorMsg = " Please enter valid Phone No.";
      msg.innerHTML = "Please enter valid Phone No.";
      return false;
    }
  }
  closeAlertSuc(): void {
    this.isSuccessAlert = "false";
  }
  closeAlert(): void {
    this.isAlertDanger = false;
    this.isAlertSucess = false;
    this.isAlertFileType = false;
  }
  closeAlertWarn(): void {

    this.isExistAlert = "false";
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
