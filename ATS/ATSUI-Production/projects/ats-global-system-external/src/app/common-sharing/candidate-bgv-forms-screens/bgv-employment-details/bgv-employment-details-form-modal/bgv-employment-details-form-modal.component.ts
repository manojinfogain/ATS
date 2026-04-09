import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system-external/src/app/core/common/global-common-method.service';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { COMMON_CONST, FILE_UPLOAD, requiredMsgPrefix, salaryMinMaxLoc } from 'projects/ats-global-system-external/src/app/core/constant/common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';
// import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bgv-employment-details-form-modal',
  templateUrl: './bgv-employment-details-form-modal.component.html',
  styleUrls: ['./bgv-employment-details-form-modal.component.scss']
})
export class BgvEmploymentDetailsFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  public employmentDetailsForm: UntypedFormGroup = new UntypedFormGroup({});
  public designationNamesList: any[];
  public functionList: any = [];
  public industryList: any = [];
  public skillNameList: any = [];
  public countryList: any = [];
  public cityList: any = [];
  public FilterCtrlDesignation: UntypedFormControl = new UntypedFormControl();
  public searchInputDesignation: string;
  public FilterCtrlLocation: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCity: UntypedFormControl = new UntypedFormControl();
  public searchInputLocation: string
  public searchInputCity: string
  public FilterCtrlSkills: UntypedFormControl = new UntypedFormControl();
  public searchInputSkills: string
  public FilterCtrlIndustry: UntypedFormControl = new UntypedFormControl();
  public searchInputIndustry: string
  public FilterCtrlFunction: UntypedFormControl = new UntypedFormControl();
  public searchInputFunction: string
  public onlyPastDate = new Date();
  public currentEmpDetails: any = {};
  public prev1EmpDetails: any = {};
  public prev2EmpDetails: any = {};
  public idTypeList: any = [];
  employmentStatusList = [
    { value: 'Permanent', label: 'Permanent' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Intern', label: 'Intern' },
    // Add more as needed
  ];
  public detailsToFreeze: any = {};
  public errorPrefix = requiredMsgPrefix
  constructor(
    public dialogRef: MatDialogRef<BgvEmploymentDetailsFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _candidateServe: CandidateService,
    private _share: ShareService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _globalMethod: GlobalCommonMethodService,
    public dialog: MatDialog,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.data;
    debugger
    this.empFormInit();
    setTimeout(() => {
      Object.keys(this.employmentDetailsForm.controls).forEach(key => {
        const control = this.employmentDetailsForm.get(key);
        if (control?.validator) {
          const validator = control.validator({} as UntypedFormControl);
          if (validator && validator['required']) {
            control.markAsTouched();
          }
        }
      });
    }, 0);
    if (this.data?.type == 1) {
      this.currentEmpDetails = this.data?.candidateEmploymentDetailsEAF?.filter((elm: any) => elm.EmployerType == 'C')[0] || {};
      this.prev1EmpDetails = this.data?.candidateEmploymentDetailsEAF?.filter((elm: any) => elm.EmployerType == 'P1')[0] || {};
      this.prev2EmpDetails = this.data?.candidateEmploymentDetailsEAF?.filter((elm: any) => elm.EmployerType == 'P2')[0] || {};
      if (this.data?.isCurrentEmployerAdded == false) {
        this.GetDocumentType('C', 'C');
        this.getControl('CompanyType').patchValue('C');
        this.selectEmployer('C');
      } else if (this.data?.isPrev1EmployerAdded == false) {
        this.GetDocumentType('C', 'P');
        this.getControl('CompanyType').patchValue('P1');
        this.selectEmployer('P1');
      } else if (this.data?.isPrev2EmployerAdded == false) {
        this.GetDocumentType('C', 'P');
        this.getControl('CompanyType').patchValue('P2');
        this.selectEmployer('P2');
      }
    } else if (this.data?.type == 2) {
      this.currentEmpDetails = this.data?.employmentDetailsList?.filter((elm: any) => elm.CompanyType == 'C')[0] || {};
      this.prev1EmpDetails = this.data?.employmentDetailsList?.filter((elm: any) => elm.CompanyType == 'P1')[0] || {};
      this.prev2EmpDetails = this.data?.employmentDetailsList?.filter((elm: any) => elm.CompanyType == 'P2')[0] || {};
      if (this.data?.CompanyType == 'C') {
        this.GetDocumentType('C', 'C');
        this.getControl('CompanyType').patchValue('C');
        this.selectEmployer('C');
      } else if (this.data?.CompanyType == 'P1') {
        this.GetDocumentType('C', 'P');
        this.getControl('CompanyType').patchValue('P1');
        this.selectEmployer('P1');
      } else if (this.data?.CompanyType == 'P2') {
        this.GetDocumentType('C', 'P');
        this.getControl('CompanyType').patchValue('P2');
        this.selectEmployer('P2');
      }
      console.log(this.data)
    }
  }

  public isFinalSumbit: boolean = false;
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this._globalMethod.isBGVFinalSubmit()) {
        this.isFinalSumbit = true;
      }
    }, 500);
  }

  empFormInit() {
    this.employmentDetailsForm = this._fb.group({
      CompanyType: [null, Validators.required],
      CandidateName: [null, Validators.required],
      PayloadOrganization: [null, Validators.required],
      EmployeeId: [null, Validators.required],
      DOJ: [null, Validators.required],
      CurrentlyWithSameCompany: [null, Validators.required],
      Designation: [null, Validators.required],
      RMNameDesignation: [null, Validators.required],
      RMContactNumber: [null, Validators.required],
      RMEmailId: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      HRNameDesignation: [null, Validators.required],
      HRContactNumber: [null, Validators.required],
      HREmailId: [null, [Validators.required, Validators.pattern(COMMON_CONST.emailregex)]],
      DocumentTypeId: [null, Validators.required],
      DocumentName: [null],
      DocumentPath: [null],
      UploadDocument: [null],
      UploadDocument1: [null, Validators.required],
      OrgId: [null, Validators.required],
      Id: [null]
    })
    //  if (this.data?.type == 2) {
    //    this.employmentDetailsForm.patchValue({
    //      CompanyType: this.data?.employerType,
    //      EmployerName: this.data?.employerName,
    //      Designation: this.data?.DesignationId != null ? this.data?.DesignationId : null,
    //      ProjectName: this.data?.projectName,
    //      location: this.data?.locationId != null ? this.data?.locationId : null,
    //      cityId: this.data?.CityId != null ? this.data?.CityId : null,
    //      durationFrom: this.data?.fromDate,
    //      durationTo: this.data?.toDate,
    //      currentEmployerTillDate: this.data?.CurrentEmployeerTillDate,
    //      clientName: this.data?.clientName,
    //      skil: this.data?.skill != null ? this.data?.skill : null,
    //      Industry: this.data?.industryId,
    //      function: this.data?.functionId,
    //      joiningCtc: this.data?.joiningCtc,
    //      leavingCtc: this.data?.leavingCtc,
    //      reasonForLeave: this.data?.reasonForLeaving,
    //      projectDicription: this.data?.projectDescription,
    //      ManualDesigName: this.data?.DesignationId == 0 ? this.data?.Designation : null,
    //      ManualLocationName: this.data?.locationId == 0 ? this.data?.location : null,
    //      ManualSkillName: this.data?.skill == 0 ? this.data?.skilName1 : null
    //    })
    //    if(this.data?.DesignationId == 0){
    //      this.getDesignationId(this.data?.DesignationId);
    //    }
    //    if(this.data?.locationId == 0 || this.data?.locationId == 331){
    //      this.getLocationId(this.data?.locationId);
    //    }
    //    if(this.data?.skill == 0){
    //      this.getSkillId(this.data?.skill);
    //    }
    //    if(this.data?.CurrentEmployeerTillDate == 1){
    //      this.durationToControl.disable();
    //      this.durationToControl.clearValidators();
    //      this.durationToControl.updateValueAndValidity();
    //    }
    //    if(this.data?.employerType == 'C'){
    //      this.lastCTCLabel = 'Current CTC';
    //    }else if(this.data?.employerType == 'P'){
    //      this.lastCTCLabel = 'Last Drawn CTC';
    //    }else{

    //    }
    //  }
  }

  getControl(name: string) {
    return this.employmentDetailsForm.get(name);
  }


  /***
   * submit form- to server
   */
  submitEmpDetailsForm(form: any) {

    form.markAllAsTouched();
    debugger
    if (this.employmentDetailsForm.valid) {
      let formValue = form.value;

      delete formValue['UploadDocument1'];
      delete formValue['UploadDocument'];
      delete formValue['DocumentName'];
      delete formValue['DocumentPath'];
      delete formValue['DocumentTypeId'];
      // formValue['Id'] = this.data?.employmentDetailsList[0]?.Id ? this.data?.employmentDetailsList[0]?.Id : null;
      // if(formValue['DOJ']){ 
      //   formValue['DOJ'] = GlobalMethod.formatDate(new Date(formValue['DOJ']));
      // }
      if (formValue['DOJ']) {
        // Expecting DOJ in DD/MM/YYYY format, convert to YYYY-MM-DD for backend
        const parts = formValue['DOJ'].split('/');
        if (parts.length === 3) {
          formValue['DOJ'] = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          formValue['DOJ'] = '';
        }
      }
      this._candidateServe.AddUpdateBGVEmploymentDetails(formValue).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res)
          this.dialogRef.close(true);
        }
      )

    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  selectEmployer(val: any) {
    if (val == 'C') {
      if (this.data?.type == 1) {
        this.patchValuesFromEAF(this.currentEmpDetails);
      } else {
        this.patchValuesFromBGV(this.currentEmpDetails);
      }
      this.detailsToFreeze = this.currentEmpDetails;
    } else if (val == 'P1') {
      if (this.data?.type == 1) {
        this.patchValuesFromEAF(this.prev1EmpDetails);
      } else {
        this.patchValuesFromBGV(this.prev1EmpDetails);
      }
      this.detailsToFreeze = this.prev1EmpDetails;
    } else if (val == 'P2') {
      if (this.data?.type == 1) {
        this.patchValuesFromEAF(this.prev2EmpDetails);
      } else {
        this.patchValuesFromBGV(this.prev2EmpDetails);
      }
      this.detailsToFreeze = this.prev2EmpDetails;
    }

  }
  patchValuesFromEAF(empDetails: any) {
    this.getControl('CandidateName').patchValue(empDetails?.CandidateName);
    this.getControl('PayloadOrganization').patchValue(empDetails?.EmployerName);
    this.getControl('DOJ').patchValue(empDetails?.DOJ ? GlobalMethod.formatDateToDDMMYYYY(empDetails?.DOJ) : '');
    this.getControl('CurrentlyWithSameCompany').patchValue(empDetails?.CurrentEmployeerTillDate);
    this.getControl('Designation').patchValue(empDetails?.DesignationName ? empDetails?.DesignationName : null);
    this.getControl('OrgId').patchValue(empDetails?.OrgId);
  }
  patchValuesFromBGV(empDetails: any) {
    this.getControl('CandidateName').patchValue(empDetails?.CandidateName);
    this.getControl('PayloadOrganization').patchValue(empDetails?.PayloadOrganization);
    this.getControl('EmployeeId').patchValue(empDetails?.EmployeeId);
    this.getControl('DOJ').patchValue(GlobalMethod.formatDateToDDMMYYYY(empDetails?.DOJ));
    this.getControl('CurrentlyWithSameCompany').patchValue(empDetails?.CurrentlyWithSameCompany);
    this.getControl('Designation').patchValue(empDetails?.Designation ? empDetails?.Designation : null);
    this.getControl('RMNameDesignation').patchValue(empDetails?.RMNameDesignation);
    this.getControl('RMContactNumber').patchValue(empDetails?.RMContactNumber);
    this.getControl('RMEmailId').patchValue(empDetails?.RMEmailId);
    this.getControl('HRNameDesignation').patchValue(empDetails?.HRNameDesignation);
    this.getControl('HRContactNumber').patchValue(empDetails?.HRContactNumber);
    this.getControl('HREmailId').patchValue(empDetails?.HREmailId);
    this.getControl('OrgId').patchValue(empDetails?.OrgId);
    this.getControl('DocumentTypeId').patchValue(empDetails?.DocumentTypeId);
    this.getControl('DocumentName').patchValue(empDetails?.DocumentName);
    this.getControl('DocumentPath').patchValue(empDetails?.DocumentPath);
    this.getControl('Id').patchValue(empDetails?.Id);
    setTimeout(() => {
      if (empDetails?.DocumentTypeId) {
        this.onIdTypeChange({ value: empDetails?.DocumentTypeId });
      }
    }, 500);
  }
  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

  public docDetails: any = {};
  public isDocumentAvailable: boolean = false;
  public isFileReq: boolean = true;
  // onIdTypeChange(event: any) {
  //   this._candidateServe.GetBGVFilePaths(event?.value).subscribe(
  //     res => {
  //       this.docDetails = res['data'];
  //       if (this.docDetails.length > 0) {
  //         this.isDocumentAvailable = true;
  //         this.isFileReq = false;
  //         this.getControl('DocumentPath').setValidators([Validators.required]);
  //         this.getControl('DocumentName').setValidators([Validators.required]);
  //         this.getControl('UploadDocument1').clearValidators();
  //         this.employmentDetailsForm.patchValue({
  //           DocumentPath: this.docDetails[0]?.DocumentPath,
  //           DocumentName: this.docDetails[0]?.documentName
  //         });
  //       } else {
  //         this.isDocumentAvailable = false;
  //         this.isFileReq = true;
  //         this.getControl('DocumentPath').clearValidators();
  //         this.getControl('DocumentName').clearValidators();
  //         this.getControl('UploadDocument1').setValidators([Validators.required]);
  //         this.employmentDetailsForm.patchValue({
  //           DocumentPath: null,
  //           DocumentName: null
  //         });
  //       }
  //       this.getControl('DocumentPath').updateValueAndValidity();
  //       this.getControl('DocumentName').updateValueAndValidity();
  //       this.getControl('UploadDocument1').updateValueAndValidity();
  //     }
  //   )
  // }
  onIdTypeChange(event: any) {
    this.getPreviewName(event?.value);
    this._candidateServe.GetBGVFilePaths(event?.value, this.getControl('OrgId').value).subscribe(
      res => {
        this.docDetails = res['data'] || [];
        let LstDoc: any[] = [];

        if (this.docDetails.length > 0) {
          this.isDocumentAvailable = true;
          this.isFileReq = false;
          this.getControl('DocumentPath').setValidators([Validators.required]);
          this.getControl('DocumentName').setValidators([Validators.required]);
          this.getControl('UploadDocument1').clearValidators();

          // Patch the first document for display
          this.employmentDetailsForm.patchValue({
            DocumentPath: this.docDetails[0]?.DocumentPath,
            DocumentName: this.docDetails[0]?.documentName
          });

          // Build LstDoc array for all documents
          LstDoc = this.docDetails.map((doc: any) => ({
            DocumentName: doc?.documentName,
            DocumentPath: doc?.DocumentPath,
            UploadDocument: null,
            DocumentTypeId: event?.value
          }));
        } else {
          this.isDocumentAvailable = false;
          this.isFileReq = true;
          this.getControl('DocumentPath').clearValidators();
          this.getControl('DocumentName').clearValidators();
          this.getControl('UploadDocument1').setValidators([Validators.required]);
          this.employmentDetailsForm.patchValue({
            DocumentPath: null,
            DocumentName: null
          });

          // Build LstDoc array for uploaded document
          LstDoc = [{
            DocumentName: this.getControl('DocumentName').value,
            DocumentPath: null,
            UploadDocument: this.getControl('UploadDocument').value,
            DocumentTypeId: event?.value
          }];
        }

        // Patch LstDoc to the form (add a control if needed)
        if (!this.employmentDetailsForm.contains('LstDoc')) {
          this.employmentDetailsForm.addControl('LstDoc', new UntypedFormControl(LstDoc));
        } else {
          this.employmentDetailsForm.get('LstDoc')?.setValue(LstDoc);
        }

        this.getControl('DocumentPath').updateValueAndValidity();
        this.getControl('DocumentName').updateValueAndValidity();
        this.getControl('UploadDocument1').updateValueAndValidity();
      }
    )
  }


  previewDocument(data: any) {
    let elm = {};
    elm['documentName'] = data.documentTypeName?.replace(/\.(dat|enc)$/i, '') || data.documentTypeName;
    elm['filePath'] = data?.DocumentPath;
    elm['fileName'] = data?.documentName?.replace(/\.(dat|enc)$/i, '') || data?.documentName;
    elm['type'] = 'path';
    elm['cid'] = data?.cid;
    this._globalMethod.downloadPrevDocuments(elm, this._http, this.dialog, this._share);
  }
  public fileID: any;
  fileUpload(event) {
    this.fileID = '';
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;
    let file = event.target.files[0];
    let fileName = file?.name;
    this.getControl('UploadDocument1').markAsTouched();
    if (!allowedExtensions.exec(fileName)) {
      this._share.showAlertErrorMessage.next('Please upload file type jpg/jpeg/png/pdf only.');
      event.target.value = "";
      this.fileID = '';
      return false;
    }
    else if (file.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('file  cannot be greater than 15MB.');
      event.target.value = "";
      this.fileID = '';
      return false;
    }
    else {
      this.fileID = file;
      //
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let base64File = reader.result.toString().replace(/^data:.+;base64,/, '');
        let data = {
          fileID: base64File,
          FileNameID: file.name,
        }
        console.log(data);
        this.getControl('UploadDocument').setValue(data?.fileID);
        this.getControl('UploadDocument').updateValueAndValidity();
        this.getControl('DocumentName').setValue(file.name);
        this.getControl('DocumentName').updateValueAndValidity();

        let LstDoc: any[] = [];
        // Build LstDoc array for uploaded document
        LstDoc = [{
          DocumentName: file.name,
          DocumentPath: null,
          UploadDocument: data?.fileID,
          DocumentTypeId: this.getControl('DocumentTypeId').value || null
        }];
        // }

        // Patch LstDoc to the form (add a control if needed)
        if (!this.employmentDetailsForm.contains('LstDoc')) {
          this.employmentDetailsForm.addControl('LstDoc', new UntypedFormControl(LstDoc));
        } else {
          this.employmentDetailsForm.get('LstDoc')?.setValue(LstDoc);
        }
      }
    }
  }

  GetDocumentType(id: string, employerType: string = null) {
    this._exGlobal.GetDocumentType('C', employerType).subscribe(
      res => {
        this.idTypeList = res['data'];
      }
    );
  }
  public PreviewName: string = '';
  //get preview name
  getPreviewName(val: any) {
    if (this.getControl('CompanyType')?.value == 'C') {
      if (val == 11) {
        this.PreviewName = 'Salary Slip';
      } else if (val == 20) {
        this.PreviewName = 'Resignation Acceptance Email';
      } else if (val == 23) {
        this.PreviewName = 'Appointment Letter';
      } else if (val == 24) {
        this.PreviewName = 'Offer Letter';
      } else if (val == 25) {
        this.PreviewName = 'Experience Letter';
      } else if (val == 26) {
        this.PreviewName = 'Relieving Letter';
      } else {
        this.PreviewName = 'Document';
      }
    } else if (this.getControl('CompanyType')?.value == 'P1' || this.getControl('CompanyType')?.value == 'P2') {
      if (val == 8) {
        this.PreviewName = 'Appointment Letter';
      } else if (val == 7) {
        this.PreviewName = 'Offer Letter';
      } else if (val == 9) {
        this.PreviewName = 'Experience Letter';
      } else if (val == 10) {
        this.PreviewName = 'Relieving Letter';
      } else {
        this.PreviewName = 'Document';
      }
    } else {
      this.PreviewName = 'Document';
    }

  }

}
