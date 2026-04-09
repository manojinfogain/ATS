import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CandidateService } from 'projects/ats-global-system-external/src/app/candidate-module/candidate.service';
import { GlobalMethod } from 'projects/ats-global-system-external/src/app/core/common/global-method';
import { CANDIDATE_COMMON } from 'projects/ats-global-system-external/src/app/core/constant/candidate-common.const';
import { ExternalUserGlobalApiService } from 'projects/ats-global-system-external/src/app/core/services/external-user-global-api.service';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';
import { ShareService } from 'projects/ats-global-system-external/src/app/core/services/share.service';

@Component({
  selector: 'app-candidate-education-details-form-modal',
  templateUrl: './candidate-education-details-form-modal.component.html',
  styleUrls: ['./candidate-education-details-form-modal.component.scss']
})
export class CandidateEducationDetailsFormModalComponent implements OnInit {
  public appearance: string = 'fill';
  public formClass: string = 'form-fill-ats'
  updateEduDetailsForm: UntypedFormGroup;
  public thisYear: number;
  public passoutYear: number[] = [];
  public eduGradeMaster: any = CANDIDATE_COMMON.eduGradeMaster;
  public isSponsored: any = CANDIDATE_COMMON.sponsoredMaster;
  public FilterCtrlCourseId: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlCollege: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlUniversity: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlSubject: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlLevel: UntypedFormControl = new UntypedFormControl();
  public FilterCtrlYop: UntypedFormControl = new UntypedFormControl();
  public searchInputYop: string;
  public searchInputLevel: string;
  public searchInputSubject: string;
  public searchInputUniv: string;
  public searchInputCourse: string;
  public searchInputClg: string;
  public today = new Date();
  public manualCollReq: boolean = false;
  public manualUnivReq: boolean = false;
  private candidateId = this._storage.getCandidateId();
  constructor(
    public dialogRef: MatDialogRef<CandidateEducationDetailsFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _exGlobal: ExternalUserGlobalApiService,
    private _candidateServ: CandidateService,
    private _storage: GetSetStorageService

  ) {
    this.thisYear = new Date().getFullYear();
    for (let i = this.thisYear; i >= this.thisYear - 50; i--) {
      this.passoutYear.push(i);
    }
    this.FilterCtrlYop.valueChanges.subscribe(
      val => {
        this.searchInputYop = val;
      }
    )
  }

  /**getting start year of qualification - to date */
  public startYearQualification: number;
  changeDateStart(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    const dateObject = new Date(selectedDate);
    if (!isNaN(dateObject.getTime())) {
      const year = dateObject.getFullYear();
      this.startYearQualification = year;
      this.yearOfPassingControl.reset();
    } else {
      console.log('Invalid date');
    }

  }


  /**getting end year of qualification - to date */
  public toYearQualification: number;
  changeDateEnd(event: Event) {
    const selectedDate = (event.target as HTMLInputElement).value;
    const dateObject = new Date(selectedDate);
    if (!isNaN(dateObject.getTime())) {
      const year = dateObject.getFullYear();
      this.toYearQualification = year;
      this.yearOfPassingControl.reset();
    } else {
      console.log('Invalid date');
    }

  }

  /**on change of passing year - reseting selection if passing year is greater than attendent too date */
  getPassingYeear(event: any) {
    let passingYear = event.value;
    if (this.toYearQualification != null || this.toYearQualification != undefined) {
      // if (passingYear > this.toYearQualification) {
      //   this._share.showAlertErrorMessage.next('Passing year cannot be greater than end year of qualification.');
      //   this.yearOfPassingControl.reset();
      // } else
      /**condition for passing year cannot be less than attendent toYear */
      if (passingYear < this.toYearQualification) {
        this._share.showAlertErrorMessage.next('Year of passing should not be earlier than year selected in "Attended To".');
        this.yearOfPassingControl.reset();
      } {

      }
    }
  }
  ngOnInit(): void {
    this.data
    debugger
    this.formInit();
    this.getDegreeNames();
    this.getCollegeList();
    this.getUniversityList();
    this.getSpecializationList();
    this.getEducationTypeList();
    this.getLevelNamesList();
    this.getDisciplineList();

    if (this.data?.toDate) {
      const year = new Date(this.data.toDate).getFullYear();
      this.toYearQualification = year;
    }
  }



  /***
   * form Initialization
   */
  public isCourseDisabled: boolean = false;
  formInit() {
    this.updateEduDetailsForm = this._fb.group({
      //courseId: [(this.data?.type == 1 && !this.data?.isMatric) ? 12 : null, [Validators.required]],
      courseId: !this.data?.isLeadershipOnboard ? (this.data?.type == 1 && !this.data?.isMatric ? 12 : null) : null,
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      yearOfPassing: [null, [Validators.required]],
      collegeName: [null, [Validators.required]],
      boardName: [null, [Validators.required]],
      specialization: [null, [Validators.required]],
      educationType: [null],
      level: [null],
      grade: [null, [Validators.required]],
      gradePercent: [null, [Validators.required]],
      sponsored: [null],
      discipline: [null],
      minorFields: [null],
      majorFields: [null],
      manualCollegeName: [null],
      manualUnivName: [null],
      ManualCourseName: [null],
      ManualSubjectName: [null]
    });
    if (this.data?.type == 2) {
      this.updateEduDetailsForm.patchValue({
        courseId: this.data?.courseId != null ? this.data?.courseId : null,
        dateFrom: this.data?.formDate ? this.data?.formDate : null,
        dateTo: this.data?.toDate ? this.data?.toDate : null,
        yearOfPassing: this.data?.yearOfPassing ? this.data?.yearOfPassing : null,
        collegeName: this.data?.establishmentId ? this.data?.establishmentId : null,
        boardName: this.data?.affiliatedToId ? this.data?.affiliatedToId : null,
        specialization: this.data?.subject != null ? this.data?.subject : null,
        educationType: this.data?.CourseType ? this.data?.CourseType : null,
        level: this.data?.eduLevel ? this.data?.eduLevel : null,
        grade: this.data?.grade ? this.data?.grade : null,
        gradePercent: this.data?.gradeValue ? this.data?.gradeValue : null,
        manualCollegeName: this.data?.establishmentName1 ? this.data?.establishmentName1 : null,
        manualUnivName: this.data?.affiliatedToName1 ? this.data?.affiliatedToName1 : null,
        ManualCourseName: this.data?.courseId == 0 && this.data?.courseName ? this.data?.courseName : null,
        ManualSubjectName: this.data?.subject == 0 && this.data?.subjectName ? this.data?.subjectName : null
      });
      if (this.data?.courseId != null) {
        this.getCourseId(this?.data?.courseId);
        this.isCourseDisabled = true;
      }
      if (this.data?.subject != null) {
        this.getSubjectId(this?.data?.subject);
      }
      debugger
      if (!this.data?.isLeadershipOnboard) {
        this.courseIdControl.patchValue(this.data?.courseId ? this.data?.courseId : null);
      }
      this.collegeSelect(this.data?.establishmentId);
      this.universitySelect(this.data?.affiliatedToId);
    }
  }

  get courseIdControl() { return this.updateEduDetailsForm.get('courseId'); }
  get dateFromControl() { return this.updateEduDetailsForm.get('dateFrom'); }
  get dateToControl() { return this.updateEduDetailsForm.get('dateTo'); }
  get yearOfPassingControl() { return this.updateEduDetailsForm.get('yearOfPassing'); }
  get collegeNameControl() { return this.updateEduDetailsForm.get('collegeName'); }
  get boardNameControl() { return this.updateEduDetailsForm.get('boardName'); }
  get specializationControl() { return this.updateEduDetailsForm.get('specialization'); }
  get educationTypeControl() { return this.updateEduDetailsForm.get('educationType'); }
  get levelControl() { return this.updateEduDetailsForm.get('level'); }
  get gradeControl() { return this.updateEduDetailsForm.get('grade'); }
  get gradePercentControl() { return this.updateEduDetailsForm.get('gradePercent'); }
  get sponsoredControl() { return this.updateEduDetailsForm.get('sponsored'); }
  get disciplineControl() { return this.updateEduDetailsForm.get('discipline'); }
  get minorFieldsControl() { return this.updateEduDetailsForm.get('minorFields'); }
  get majorFieldsControl() { return this.updateEduDetailsForm.get('majorFields'); }
  get manualCollegeNameControl() { return this.updateEduDetailsForm.get('manualCollegeName'); }
  get manualUnivNameControl() { return this.updateEduDetailsForm.get('manualUnivName'); }
  get ManualCourseNameControl() { return this.updateEduDetailsForm.get('ManualCourseName'); }
  get ManualSubjectNameControl() { return this.updateEduDetailsForm.get('ManualSubjectName'); }

  // getDegree/Course Names list 
  public degreeList: any = [];
  getDegreeNames() {
    this._exGlobal.getDegreeNamesMaster().subscribe(
      res => {
        this.degreeList = res['data'];
        this.FilterCtrlCourseId.valueChanges.subscribe(
          val => {
            this.searchInputCourse = val;
          }
        )
      }
    )
  }

  // get college/establishments Names list 
  public collegeList: any = [];
  getCollegeList() {
    this._exGlobal.getCollegeNamesMaster().subscribe(
      res => {
        this.collegeList = res['data'];
        this.FilterCtrlCollege.valueChanges.subscribe(
          val => {
            this.searchInputClg = val;
          }
        )
      }
    )
  }

  //get college id on selection
  collegeSelect(e) {
    //for others
    if (e == 4456) {
      this.manualCollReq = true;
      this.manualCollegeNameControl.setValidators([Validators.required])
    } else {
      this.manualCollReq = false;
      this.manualCollegeNameControl.clearValidators();
    }
    this.manualCollegeNameControl.updateValueAndValidity();
  }

  //get university id on selection
  universitySelect(e) {
    //for others
    if (e == 314) {
      this.manualUnivReq = true;
      this.manualUnivNameControl.setValidators([Validators.required])
    } else {
      this.manualUnivReq = false;
      this.manualUnivNameControl.clearValidators();
    }
    this.manualUnivNameControl.updateValueAndValidity();
  }

  // get university/affiliate to / board Names list 
  public universityList: any = [];
  getUniversityList() {
    this._exGlobal.getUniversityNamesMaster().subscribe(
      res => {
        this.universityList = res['data'];
        this.FilterCtrlUniversity.valueChanges.subscribe(
          val => {
            this.searchInputUniv = val;
          }
        )
      }
    )
  }

  // get subject/specializaion to Names list 
  public specializationList: any = [];
  getSpecializationList() {
    this._exGlobal.getSpecializationListMaster().subscribe(
      res => {
        this.specializationList = res['data'];
        this.FilterCtrlSubject.valueChanges.subscribe(
          val => {
            this.searchInputSubject = val;
          }
        )
      }
    )
  }

  // get education type list 
  public eduTypeList: any = [];
  getEducationTypeList() {
    this._exGlobal.getEducationTypeListMaster().subscribe(
      res => {
        this.eduTypeList = res['data'];
      }
    )
  }

  // get lavel name list 
  public levelList: any = [];
  getLevelNamesList() {
    this._exGlobal.getLevelListMaster().subscribe(
      res => {
        this.levelList = res['data'];
        this.FilterCtrlLevel.valueChanges.subscribe(
          val => {
            this.searchInputLevel = val;
          }
        )
      }
    )
  }

  // get Discipline list 
  public disciplineList: any = [];
  public minorList: any = [];
  public majorList: any = [];
  getDisciplineList() {
    this._exGlobal.getDisciplineListMaster().subscribe(
      res => {
        this.disciplineList = res['data'];
        this.minorList = res['data'];
        this.majorList = res['data'];
      }
    )
  }

  //Validation on grade selection 
  public gradeName: string = 'Grade';
  gradeSelected(e) {
    if (e.value == 'C') {
      this.gradeName = 'CGPA';
      this.gradePercentControl.setValidators([Validators.required, Validators.pattern(/^[0-9](\.\d{1,2})?$/)]);
    } else if (e.value == 'S') {
      this.gradeName = 'SGPA';
      this.gradePercentControl.setValidators([Validators.required, Validators.pattern(/^[0-9](\.\d{1,2})?$/)]);
    } else if (e.value == 'P') {
      this.gradeName = 'Percentile';
      this.gradePercentControl.setValidators([Validators.required, Validators.pattern(/^[0-9][0-9](\.\d{1,4})?$/)]);
    } else if (e.value == 'T') {
      this.gradeName = 'Percentage'
      this.gradePercentControl.setValidators([Validators.required, Validators.pattern(/^[0-9][0-9](\.\d{1,2})?$/)]);
    } else {
      this.gradeName = 'Grade';
      this.gradePercentControl.setValidators([Validators.required, Validators.pattern(/^[0-9][0-9](\.\d{1,2})?$/)]);
    }
    this.gradePercentControl.updateValueAndValidity();
  }

  // get minor list 
  // getMinorList() {
  //   this._exGlobal.getDisciplineListMaster().subscribe(
  //     res => {
  //       this.minorList = res['data'];
  //     }
  //   )
  // }

  // // get major list 
  // public majorList: any = [];
  // getMajorList() {
  //   this._exGlobal.getMajorListMaster().subscribe(
  //     res => {
  //       this.majorList = res['data'];
  //     }
  //   )
  // }


  /***
   * submit form
   */
  submitForm(form: any) {
    form.markAllAsTouched();
    if (this.updateEduDetailsForm.valid) {
      let formValue = form?.value;
      let body = {
        courseId: formValue?.courseId ? formValue?.courseId : '',
        formDate: formValue?.dateFrom ? GlobalMethod.formatDate(formValue?.dateFrom) : '',
        toDate: formValue?.dateTo ? GlobalMethod.formatDate(formValue?.dateTo) : '',
        establishmentId: formValue?.collegeName ? formValue?.collegeName : '',
        affiliatedToId: formValue?.boardName ? formValue?.boardName : '',
        yearOfPassing: formValue?.yearOfPassing ? formValue?.yearOfPassing : '',
        subject: formValue?.specialization ? formValue?.specialization : '',

        courseType: formValue?.educationType ? formValue?.educationType : '',

        eduLevel: formValue?.level ? formValue?.level : '',
        sponsored: formValue?.sponsored ? formValue?.sponsored : '',
        discipline: formValue?.discipline ? formValue?.discipline : '',
        grade: formValue?.grade ? formValue?.grade : '',
        gradeValue: formValue?.gradePercent ? formValue?.gradePercent : '',
        establishmentName: formValue?.manualCollegeName ? formValue?.manualCollegeName : '',
        affiliatedToName: formValue?.manualUnivName ? formValue?.manualUnivName : '',
        courseName: formValue?.ManualCourseName ? formValue?.ManualCourseName : '',
        subjectName: formValue?.ManualSubjectName ? formValue?.ManualSubjectName : '',
        Candidateid: this.candidateId
      }
      if (this.data?.type == 1) {
        this._candidateServ.postEducationDetails(body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res)
            this.dialogRef.close(true);
          }
        )
      } else {
        this._candidateServ.updateEducationalDetails(this.data?.id, body).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
            this.dialogRef.close(true);

          }
        )
      }
    }
    else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  public manualCourseReq: boolean = false
  getCourseId(id) {
    if (id == 0) {
      this.manualCourseReq = true;
      this.ManualCourseNameControl.setValidators([Validators.required]);

    } else {
      this.manualCourseReq = false;
      this.ManualCourseNameControl.clearValidators();
    }
    this.ManualCourseNameControl.updateValueAndValidity();
  }

  public manualSubjectReq: boolean = false
  getSubjectId(id: any) {
    if (id == 0) {
      this.manualSubjectReq = true;
      this.ManualSubjectNameControl.setValidators([Validators.required]);

    } else {
      this.manualSubjectReq = false;
      this.ManualSubjectNameControl.clearValidators();
    }
    this.ManualSubjectNameControl.updateValueAndValidity();
  }


  /***
   * close modal
   */
  closeModal(): void {
    this.dialogRef.close();
  }

}
