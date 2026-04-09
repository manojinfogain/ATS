import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { COMMON_CONST, FILE_UPLOAD, salaryMinMaxLoc } from 'projects/ats-global-system/src/app/core/constant/common.const';
import * as XLSX from 'xlsx';
import { InrerviewsService } from '../inrerviews.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
@Component({
  selector: 'app-bulk-interview-schedule',
  templateUrl: './bulk-interview-schedule.component.html',
  styleUrls: ['./bulk-interview-schedule.component.scss']
})
export class BulkInterviewScheduleComponent implements OnInit {
  bulkFormGroup: UntypedFormGroup;
  public filebulk: any;
  public showForm: boolean = false;
  public talentIdVal: string;
  public fileAllowed: any = /(\.xlsx)$/i;
  public allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
  public allowedExtensionsMsg = 'jpeg/jpg/png/txt/pdf/doc/docx/rtf';
  public resultData: any = [];
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _intServe: InrerviewsService,
    private _storage: GetSetStorageService,
    private _globlaMethod: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.formSetup();
  }

  formSetup() {
    this.bulkFormGroup = this._fb.group({
      filexls: [null, Validators.required],
      fileResumes: this._fb.array([])
    })
  }

  /*** dynamic control for HR rating */
  initItemRow(data) {
    let fullName: string = '';
    //fullName = data?.CandidateFirstName + data?.CandidateMiddleName !=undefined ? data?.CandidateMiddleName : '';
    return this._fb.group({
      file: [null, [Validators.required]],
      name: [data?.CandidateFirstName, [Validators.required]],
      email: [data?.CandidateEmailId, [Validators.required]]
    })
  }
  get filexlscontrol() { return this.bulkFormGroup.get('filexls') }
  get fileResumesControls() { return <UntypedFormArray>this.bulkFormGroup.get('fileResumes') }
  /**
  * get Talent Id
  * @param data 
  */
  getDataTalent(data) {
    this.showForm = true;
    this.talentIdVal = data?.talentID;
    // this.talentIdcontrol.patchValue(data?.talentID);
  }

  public dataList: any;
  /**
   * 
   * @param e get File
   */
  getFile(e) {
    this.filebulk = e;
  }

  public fileData: any;
  fileUp(event) {
    this.resetdata();
    this.resultData = [];
    let file = event.target.files[0];
    const target: DataTransfer = <DataTransfer>(event.target);
    let fileName = file.name;
    if (!this.fileAllowed.exec(fileName)) {
      this._share.showAlertErrorMessage.next(`Please upload file type  xlsx only.`);
      event.target.value = "";
      return false;
    }
    if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next(`Image  uploaded cannot be greater than 15MB.`);
      event.target.value = "";
      return false;
    }
    else {
      this.filebulk = file;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const data: string = e.target.result;
        let workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
        //  workbook.SheetNames.forEach((sheetName) => {
        if (workbook.SheetNames[0] == "Screening Round Bulk uploads") {
          let excelRowObj = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          this.fileData = JSON.parse(JSON.stringify(excelRowObj).replace(/\(|\)/g, ""));
          replaceKeys(this.fileData);
          console.log(this.fileData)

          this.validationForDocs(event);
        }
        else {
          this._share.showAlertErrorMessage.next('Please select valid document.');
          event.target.value = "";
          this.fileData = [];
          this.bulkFormGroup.reset();
        }
        //   })


      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

  public salRange: any = salaryMinMaxLoc;
  validationForDocs(event) {
    let docsItem: any = this.fileData;
    debugger
    let emailReges = COMMON_CONST.emailregex;
    let nameReges = COMMON_CONST.nameRegex;
    for (let i = 0; i < docsItem.length; i++) {
      let num = i + 2;
      let mobileNumber = docsItem[i]?.PhoneNumber;
      let currencyCtrl = docsItem[i]?.Currency;
      let SalaryTypeCtrl = docsItem[i]?.SalaryType;
      let currentSalaryCtrl = docsItem[i]?.CurrentSalary;
      let expectedSalaryCtrl = docsItem[i]?.ExpectedSalary;
      let totalExps = (parseInt(docsItem[i]?.TotalExpInyearonly) * 12) + parseInt(docsItem[i]?.TotalExpInmonthonly);
      let relExps = (parseInt(docsItem[i].RelevantExpInyearonly) * 12) + parseInt(docsItem[i].RelevantExpInmonthonly);
      if (docsItem[i].ProfileSource === 'undefined' || docsItem[i].ProfileSource == null || docsItem[i].ProfileSource == '') {
        this._share.showAlertErrorMessage.next('Profile Source  is blank in row no ' + num + '  Please enter Profile Source.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].EmployeeUnit === 'undefined' || docsItem[i].EmployeeUnit == null || docsItem[i].EmployeeUnit == '') {
        this._share.showAlertErrorMessage.next('Employee Unit is blank in row no ' + num + '.  Please enter Employee Unit.');
        this.resetFileField(event);
        return false;
      }

      /**division */
      else if (docsItem[i].Division === 'undefined' || docsItem[i].Division == null || docsItem[i].Division == '') {
        this._share.showAlertErrorMessage.next('Division is blank in row no ' + num + '  Please enter Division.');
        this.resetFileField(event);
        return false;
      }
      /**Talent Cube */
      else if (docsItem[i].EmployeeUnit != 'Support' && (docsItem[i].TalentCube === 'undefined' || docsItem[i].TalentCube == null || docsItem[i].TalentCube == '')) {

        this._share.showAlertErrorMessage.next('Talent Cube is blank in row no ' + num + '  Please enter Talent Cube.');
        this.resetFileField(event);
        return false;
      }
      /**grade */
      else if (docsItem[i].EmployeeUnit != 'Support' && (docsItem[i].Grade === 'undefined' || docsItem[i].Grade == null || docsItem[i].Grade == '')) {
        this._share.showAlertErrorMessage.next('Grade is blank in row no ' + num + '  Please enter Grade.');
        this.resetFileField(event);
        return false;
      }
      /**CompBand */
      /** base on divison */
      else if ((docsItem[i].CompBand === 'undefined' || docsItem[i].CompBand == null || docsItem[i].CompBand == '')) {
        this._share.showAlertErrorMessage.next('Comp Band is blank in row no ' + num + '  Please enter Comp Band.');
        this.resetFileField(event);
        return false;

        // if (docsItem[i].CompBand === 'undefined' || docsItem[i].CompBand == null || docsItem[i].CompBand == '') {
        //   this._share.showAlertErrorMessage.next('Comp Band is blank in row no ' + num + '  Please enter Comp Band.');
        //   this.resetFileField(event);
        //   return false;
        // }
      }



      else if (docsItem[i].Currency === 'undefined' || docsItem[i].Currency == null || docsItem[i].Currency == '') {
        this._share.showAlertErrorMessage.next('Currency  is blank in row no ' + num + '  Please enter Currency Type.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].InterviewMode === 'undefined' || docsItem[i].InterviewMode == null || docsItem[i].InterviewMode == '') {
        this._share.showAlertErrorMessage.next('Interview Mode  is blank in row no ' + num + '  Please enter Interview Mode.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].InterviewDate === 'undefined' || docsItem[i].InterviewDate == null || docsItem[i].InterviewDate == '') {
        this._share.showAlertErrorMessage.next('Interview Date  is blank in row no ' + num + '  Please enter Interview Date.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].Time === 'undefined' || docsItem[i].Time == null || docsItem[i].Time == '') {
        this._share.showAlertErrorMessage.next('Time  is blank in row no ' + num + '  Please enter Interview Time.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].TentativejoiningDate === 'undefined' || docsItem[i].TentativejoiningDate == null || docsItem[i].TentativejoiningDate == '') {
        this._share.showAlertErrorMessage.next('Tentative joining Date  is blank in row no ' + num + '  Please enter Tentative joining Date.');
        this.resetFileField(event);
        return false;
      }
      /**DOB */
      else if (docsItem[i].DOB === 'undefined' || docsItem[i].DOB == null || docsItem[i].DOB == '') {
        this._share.showAlertErrorMessage.next('DOB is blank in row no ' + num + '  Please enter DOB.');
        this.resetFileField(event);
        return false;
      }

      if (docsItem[i].CandidateFirstName === 'undefined' || docsItem[i].CandidateFirstName == null || docsItem[i].CandidateFirstName == '') {
        this._share.showAlertErrorMessage.next('Candidate first Name  is blank in row no ' + num + '  Please enter candidate first name.');
        this.resetFileField(event);
        return false;
      }
      else if (nameReges.test(docsItem[i].CandidateFirstName) != true) {
        this._share.showAlertErrorMessage.next('Candidate first name  is not valid in row no ' + num + '  Please enter valid candidate first name.');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].CandidateEmailId === 'undefined' || docsItem[i].CandidateEmailId == null || docsItem[i].CandidateEmailId == '') {
        this._share.showAlertErrorMessage.next('Candidate Email  is blank in row no ' + num + '  Please enter candidate Email.');
        this.resetFileField(event);
        return false;
      }

      else if (emailReges.test(docsItem[i].CandidateEmailId) != true) {
        this._share.showAlertErrorMessage.next('Email  is not valid in row no ' + num + '  Please enter valid Email.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].PhoneNumber === 'undefined' || docsItem[i].PhoneNumber == null || docsItem[i].PhoneNumber == '') {
        this._share.showAlertErrorMessage.next('Phone Number  is blank in row no ' + num + '  Please enter Phone Number.');
        this.resetFileField(event);
        return false;
      }

      else if (COMMON_CONST.phoneNumberRegex.test(docsItem[i].PhoneNumber) != true) {
        this._share.showAlertErrorMessage.next('Phone No is not valid in row no ' + num + '.  Please enter valid  Phone No.');
        this.resetFileField(event);
        return false;
      }

      else if (mobileNumber?.toString()?.length != 10) {
        this._share.showAlertErrorMessage.next('Phone No is not valid in row no ' + num + '.  Please enter 10 digit valid  Phone No.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i]?.TotalExpInyearonly?.toString() === 'undefined' || docsItem[i].TotalExpInyearonly?.toString() == null || docsItem[i].TotalExpInyearonly?.toString() == '') {
        this._share.showAlertErrorMessage.next('Total Experience In year  is blank in row no ' + num + '  Please enter Total Experience In year');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].TotalExpInmonthonly?.toString() === 'undefined' || docsItem[i].TotalExpInmonthonly?.toString() == null || docsItem[i].TotalExpInmonthonly?.toString() == '') {
        this._share.showAlertErrorMessage.next('Total Experience In month  is blank in row no ' + num + '  Please enter Total Experience In month');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].RelevantExpInyearonly?.toString() === 'undefined' || docsItem[i].RelevantExpInyearonly?.toString() == null || docsItem[i].RelevantExpInyearonly?.toString() == '') {
        this._share.showAlertErrorMessage.next('Relevant Experience In year  is blank in row no ' + num + '  Please enter Relevant Experience In year.');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].RelevantExpInmonthonly?.toString() === 'undefined' || docsItem[i].RelevantExpInmonthonly?.toString() == null || docsItem[i].RelevantExpInmonthonly?.toString() == '') {
        this._share.showAlertErrorMessage.next('Relevant Experience In month  is blank in row no ' + num + '  Please enter Relevant Experience In month.');
        this.resetFileField(event);
        return false;
      }
      else if (relExps > totalExps) {
        this._share.showAlertErrorMessage.next('Total Experience can not be less than Relevant Experience in row no  ' + num + '  Please enter correct Relevant Experience.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].Gender === 'undefined' || docsItem[i].Gender == null || docsItem[i].Gender == '') {
        this._share.showAlertErrorMessage.next('Gender  is blank in row no ' + num + '  Please enter Gender.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].Skill === 'undefined' || docsItem[i].Skill == null || docsItem[i].Skill == '') {
        this._share.showAlertErrorMessage.next(' Skill  is blank in row no ' + num + '  Please enter  Skill.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].CurrentCompany === 'undefined' || docsItem[i].CurrentCompany == null || docsItem[i].CurrentCompany == '') {
        this._share.showAlertErrorMessage.next('Current Company  is blank in row no ' + num + '  Please enter Current Company.');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].Country === 'undefined' || docsItem[i].Country == null || docsItem[i].Country == '') {
        this._share.showAlertErrorMessage.next('Country  is blank in row no ' + num + '  Please enter Country.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].City === 'undefined' || docsItem[i].City == null || docsItem[i].City == '') {
        this._share.showAlertErrorMessage.next('City  is blank in row no ' + num + '  Please enter City.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].CurrentOrganization === 'undefined' || docsItem[i].CurrentOrganization == null || docsItem[i].CurrentOrganization == '') {
        this._share.showAlertErrorMessage.next('Current Organization  is blank in row no ' + num + '  Please enter Current Organization.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].EducationQualification === 'undefined' || docsItem[i].EducationQualification == null || docsItem[i].EducationQualification == '') {
        this._share.showAlertErrorMessage.next('Education Qualification  is blank in row no ' + num + '  Please enter Education Qualification.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].talentid === 'undefined' || docsItem[i].talentid == null || docsItem[i].talentid == '') {
        this._share.showAlertErrorMessage.next('Talent ID  is blank in row no ' + num + '  Please enter Talent ID.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].CandidateType === 'undefined' || docsItem[i].CandidateType == null || docsItem[i].CandidateType == '') {
        this._share.showAlertErrorMessage.next('Candidate Type  is blank in row no ' + num + '  Please enter Candidate Type.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].InterviewerEmpid === 'undefined' || docsItem[i].InterviewerEmpid == null || docsItem[i].InterviewerEmpid == '') {
        this._share.showAlertErrorMessage.next('Interviewer Emp ID  is blank in row no ' + num + '  Please enter Interviewer Emp ID.');
        this.resetFileField(event);
        return false;
      }

      else if (docsItem[i].CurrentSalary === 'undefined' || docsItem[i].CurrentSalary == null || docsItem[i].CurrentSalary == '') {
        this._share.showAlertErrorMessage.next('Current Salary  is blank in row no ' + num + '  Please enter Current Salary.');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].OtherOfferAvailable === 'undefined' || docsItem[i].OtherOfferAvailable == null || docsItem[i].OtherOfferAvailable == '') {
        this._share.showAlertErrorMessage.next('Other Offer Available  is blank in row no ' + num + '  Please enter Other Offer Available.');
        this.resetFileField(event);
        return false;
      }
      /**New in hand ctc */
      else if ((docsItem[i].OtherOfferAvailable === 'Yes' || docsItem[i].OtherOfferAvailable === 'YES') && (docsItem[i].OfferinHandCTC === 'undefined' || docsItem[i].OfferinHandCTC == null || docsItem[i].OfferinHandCTC == '')) {
        this._share.showAlertErrorMessage.next('In Hand Offer CTC  is blank in row no ' + num + '  Please enter In Hand Offer CTC.');
        this.resetFileField(event);
        return false;
      }
      else if (docsItem[i].ExpectedSalary === 'undefined' || docsItem[i].ExpectedSalary == null || docsItem[i].ExpectedSalary == '') {
        this._share.showAlertErrorMessage.next('Expected Salary  is blank in row no ' + num + '  Please enter Expected Salary.');
        this.resetFileField(event);
        return false;
      }

      else if (currencyCtrl == 'INR') {
        if (SalaryTypeCtrl == 'Annual') {
          if (currentSalaryCtrl < this.salRange.inrMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum ₹' + this.salRange.inrMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.inrMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than ₹' + this.salRange.inrMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.inrMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum ₹' + this.salRange.inrMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.inrMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than ₹' + this.salRange.inrMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        } else if (SalaryTypeCtrl == 'Monthly') {
          if (currentSalaryCtrl < this.salRange.inrMonthlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum ₹' + this.salRange.inrMonthlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.inrMonthlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than ₹' + this.salRange.inrMonthlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.inrMonthlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum ₹' + this.salRange.inrMonthlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.inrMonthlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than ₹' + this.salRange.inrMonthlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        } else if (SalaryTypeCtrl == 'Hourly') {
          if (currentSalaryCtrl < this.salRange.inrHrlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum ₹' + this.salRange.inrHrlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.inrHrlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than ₹' + this.salRange.inrHrlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.inrHrlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum ₹' + this.salRange.inrHrlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.inrHrlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than ₹' + this.salRange.inrHrlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        }
      }
      else if (currencyCtrl == 'USD') {
        if (SalaryTypeCtrl == 'Annual') {
          if (currentSalaryCtrl < this.salRange.usdMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum $' + this.salRange.usdMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.usdMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than $' + this.salRange.usdMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.usdMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum $' + this.salRange.usdMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.usdMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than $' + this.salRange.usdMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        } else if (SalaryTypeCtrl == 'Monthly') {
          if (currentSalaryCtrl < this.salRange.usdMonthlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum $' + this.salRange.usdMonthlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.usdMonthlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than $' + this.salRange.usdMonthlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.usdMonthlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum $' + this.salRange.usdMonthlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.usdMonthlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than $' + this.salRange.usdMonthlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        } else if (SalaryTypeCtrl == 'Hourly') {
          if (currentSalaryCtrl < this.salRange.usdHrlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary minimum $' + this.salRange.usdHrlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (currentSalaryCtrl > this.salRange.usdHrlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Current Salary less than $' + this.salRange.usdHrlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl < this.salRange.usdHrlyMin) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary minimum $' + this.salRange.usdHrlyMin + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
          if (expectedSalaryCtrl > this.salRange.usdHrlyMax) {
            this._share.showAlertErrorMessage.next('Please enter Expected Salary less than $' + this.salRange.usdHrlyMax + ' in row no ' + num + '.');
            this.resetFileField(event);
            return false;
          }
        }
      }
    }
    this.createDynamicFileUploadControl(this.fileData);
  }

  resetFileField(event) {
    event.target.value = "";
    this.fileData = [];
    this.bulkFormGroup.reset();
  }

  resumeSelect(event, i) {
    let file = event.target.files[0];
    const target: DataTransfer = <DataTransfer>(event.target);
    let fileName = file.name;
    if (!this.allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next(`Please upload file type  ${this.allowedExtensionsMsg} only.`);
      event.target.value = "";
      return false;
    }
    if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next(`Image  uploaded cannot be greater than 15MB.`);
      event.target.value = "";
      return false;
    }
    else {
      this.fileData[i].file = file;
    }
  }

  createDynamicFileUploadControl(data) {
    const control = this.fileResumesControls;
    for (let i = 0; i < data.length; i++) {
      control.push(this.initItemRow(data[i]));
    }

  }

  /**
   * reset
   */
  resetForm() {
    this.bulkFormGroup.reset();
    this.resetdata();

  }
  resetdata() {
    const control = this.fileResumesControls;
    while (control.length !== 0) {
      control.removeAt(0)
    }
    this.fileData = [];
  }

  /**
   * submit
   * @param form 
   */
  submitBulk(form: any) {
    this.bulkFormGroup.markAllAsTouched();
    if (this.bulkFormGroup.valid) {
      let empId = this._storage.getUserEmpId();
      let formdata = new FormData();
      formdata.append('file', this.filebulk);
      formdata.append('recruiter', empId);
      formdata.append('createdBy', empId);
      formdata.append('HiringLocation', this._globlaMethod.getSetLocation().locId)
      //  formdata.append('recruiter', '106949');
      //  formdata.append('createdBy', '106949');
      for (let i = 0; i < this.fileData.length; i++) {
        formdata.append('resume', this.fileData[i].file);
      }

      this._intServe.bulkSchedule(formdata).subscribe(
        res => {
          this.resultData = res;
          this.bulkFormGroup.reset();
          this.resetdata();
        }
      )
    }
    else {
      for (let i = 0; i < this.fileResumesControls.length; i++) {
        if (this.fileResumesControls.controls[i]['controls'].file.status === "INVALID") {
          this._share.showAlertErrorMessage.next('Please select resume for ' + this.fileResumesControls.controls[i]['controls'].name.value + '.');
          return false;
        }

      }

    }

  }

  exportResultExcel(): void {
    this._globlaMethod.exportAsExcelFile(this.resultData, 'bulk-schedule-result');
  }

}


function replaceKeys(object) {
  Object.keys(object).forEach(function (key) {
    var newKey = key.replace(/\s+/g, '');
    if (object[key] && typeof object[key] === 'object') {
      replaceKeys(object[key]);
    }
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });
}