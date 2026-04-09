import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { forkJoin } from 'rxjs';
import { TalentService } from '../../../talent.service';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { NaukriService } from '../../../naukri.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { join } from 'path';
@Component({
  selector: 'app-post-job-to-naukri-modal',
  templateUrl: './post-job-to-naukri-modal.component.html',
  styleUrls: ['./post-job-to-naukri-modal.component.scss']
})
export class PostJobToNaukriModalComponent implements OnInit, AfterViewInit, OnDestroy {
  public formAppearance: string = 'outline';
  public formClass: string = 'form-fill-ats';
  public formClassCol: string = 'ats-form-col';
  public addiSkillMulti: boolean = true;
  public isSpecialBidTypeAndProjectDateVisi: boolean = false;
  public user: any = [];
  public today = new Date();
  public submitJobCreateForm: UntypedFormGroup = new UntypedFormGroup({});
  commonConst = COMMON_CONST;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    // ['bold'],
    ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link', 'image'],
    ['text_color', 'background_color'],
    //['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  // public industryList: any = [];
  public workModeList: any = [];
  public courseTypeList: any[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Management' },
    { id: 3, name: 'Arts & Science' },
    { id: 4, name: 'Commerce' },
    { id: 5, name: 'Doctorate' }
  ];

  public qualificationMap: { [key: number]: any[] } = {
    1: [ // Engineering
      { id: 101, name: 'B.Tech' },
      { id: 102, name: 'M.Tech' },
      { id: 103, name: 'BE' },
      { id: 104, name: 'ME' }
    ],
    2: [ // Management
      { id: 201, name: 'BBA' },
      { id: 202, name: 'MBA' },
      { id: 203, name: 'PGDM' }
    ],
    3: [ // Arts & Science
      { id: 301, name: 'BA' },
      { id: 302, name: 'BSc' },
      { id: 303, name: 'MA' },
      { id: 304, name: 'MSc' }
    ],
    4: [ // Commerce
      { id: 401, name: 'BCom' },
      { id: 402, name: 'MCom' },
      { id: 403, name: 'CA' }
    ],
    5: [ // Doctorate
      { id: 501, name: 'PhD' },
      { id: 502, name: 'D.Litt' }
    ]
  };
  organisationList: string[] = [];
  public filteredQualificationList: any[] = [];
  public readonly CURRENCY_VALIDATIONS = {
    '1': {
      minValue: 50000,
      maxValue: 1000000000
    },
    '2': {
      minValue: 5000,
      maxValue: 10000000
    }
  };
  public joiningLocationList: any[] = [];
  public industryList: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<PostJobToNaukriModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private _globalServe: GlobalApisService,
    private _talentServ: TalentService,
    private _naukriServ: NaukriService,
    private _storage: GetSetStorageService,
  ) {
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.formInit();
    this.GetTHIDDetailsByTHID();
    this.user = this._storage.getSetUserData();
    this.getOrganisationList();
    this.getIndustryList();

    // Add valueChanges subscription for job description
    // this.submitJobCreateForm.get('jobDescription').valueChanges.subscribe(value => {
    //   if (value) {
    //     try {
    //       // Check if value is a string before using replace
    //       if (typeof value === 'string') {
    //         this.editorLen = value.replace(/<[^>]*>/g, '').trim();
    //       } else if (value && typeof value === 'object') {
    //         // For structured content from ngx-editor
    //         this.editorLen = JSON.stringify(value);
    //       } else {
    //         this.editorLen = '';
    //       }

    //       if (this.editorLen.length < 1) {
    //         this.getControl('jobDescription').setErrors({ minlength: true });
    //       } else if (this.editorLen.length > 30000) {
    //         this.getControl('jobDescription').setErrors({ maxlength: true });
    //       } else {
    //         // Clear length-related errors but maintain any other errors
    //         const currentErrors = this.getControl('jobDescription').errors;
    //         if (currentErrors) {
    //           const newErrors = { ...currentErrors };
    //           delete newErrors['minlength'];
    //           delete newErrors['maxlength'];

    //           this.getControl('jobDescription').setErrors(
    //             Object.keys(newErrors).length ? newErrors : null
    //           );
    //         }
    //       }
    //     } catch (error) {
    //       console.error('Error processing job description value:', error);
    //       this.editorLen = '';
    //     }
    //   } else {
    //     this.editorLen = '';
    //     this.getControl('jobDescription').setErrors({ required: true });
    //   }
    // });

    // Add valueChanges subscription for job description
    //  this.submitJobCreateForm.get('jobDescription').valueChanges.subscribe(value => {
    //   if (value) {
    //     this.editorLen = value.replace(/<[^>]*>/g, '').trim();
    //     if (this.editorLen.length < 1) {
    //       this.getControl('jobDescription').setErrors({ minlength: true });
    //     } else if (this.editorLen.length > 30000) {
    //       this.getControl('jobDescription').setErrors({ maxlength: true });
    //     }
    //   } else {
    //     this.editorLen = '';
    //     this.getControl('jobDescription').setErrors({ required: true });
    //   }
    // });
  }

  public editorLen: string = '';
  public JobSecHtml: string = '';
  ngAfterViewInit() {
    this.editor.valueChanges.subscribe(
      get => {
        this.JobSecHtml = toHTML(get);
        const el = document.createElement('div')
        el.innerHTML = this.JobSecHtml;
        this.editorLen = el.textContent;
        if (this.editorLen?.length < 1) {
          this.getControl('jobDescription').setErrors({ 'invalid': true })
        }

      }
    )

  }
  public demandCreationTcCtrl: UntypedFormControl = new UntypedFormControl('T');
  public isTalentCube: boolean = true;


  //get 
  public RoleTalentCubeList: any = [];
  public talentCubeSkills: any = [];
  public mergedCubeSkills: any = [];

  // GetExperienceByGradeID(GradeID: number) {
  //   this._talentServ.GetExperienceByGradeID(GradeID)
  //     .subscribe(
  //       res => {
  //         this.ExperienceList = res['data'];
  //       });
  // }



  /**
   * 
   * @param e GET ROLE ID
   */
  public ExperienceList: any = [];
  public filterCubeRole: any = {};

  public designationCategoriesList: any = [];
  public qualificationsList: any = [];
  public employementTypelist: any = [];
  public filterCtrlDesigCategory: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDesigCatgory: string;
  public filterCtrlQualification: UntypedFormControl = new UntypedFormControl();
  public searchCtrlQualification: string;
  public talentCubeList: any = [];
  public salaryCurrencyList: any = [];
  /**getting data from apis */
  excuteAllAPI() {
    forkJoin([
      this._naukriServ.getWorkModes(),
      this._naukriServ.getEmploymentType(),
      this._talentServ.GetDesignationCategories(),
      this._naukriServ.getQualificationsByCourseType(),
      this._naukriServ.getQualificationsCourseType(),
      this._globalServe.getRoleByTalentCube(this.talentDetailsList?.TalentCubeId),
      this._naukriServ.getSalaryCurrency()  // this.talentDetailsList?.TCGradeId
    ]).subscribe(
      res => {
        this.workModeList = res[0]['data'];
        this.employementTypelist = res[1]['data'];
        this.designationCategoriesList = res[2]['data'];
        this.qualificationsList = res[3]['data'];
        this.courseTypeList = res[4]['data'];
        this.RoleTalentCubeList = res[5]['data'];
        this.salaryCurrencyList = res[6]['data'];
      }
    )
    /**search designation category */
    this.filterCtrlDesigCategory.valueChanges.subscribe(
      val => {
        this.searchCtrlDesigCatgory = val;
      }
    )
    /**search qualification */
    this.filterCtrlQualification.valueChanges.subscribe(
      val => {
        this.searchCtrlQualification = val;
      }
    )
  }


  /** get designation list clent list*/
  public designationList: any = [];
  public filterCtrlDesignation: UntypedFormControl = new UntypedFormControl();
  public searchCtrlDesignation: String;
  GetDesignations(desginationId: number) {
    /**search */
    this.filterCtrlDesignation.valueChanges.subscribe(
      val => {
        this.searchCtrlDesignation = val;
      }
    )
    this._talentServ.GetDesignations(desginationId).subscribe(
      res => {
        this.designationList = res['data'];
      }
    )
  }

  /**form  init */
  formInit() {
    this.submitJobCreateForm = this._fb.group({
      joiningLocation: [[], []],
     jobTitle: ['', [Validators.required, Validators.maxLength(70)]],
      jobDescription: [null, [Validators.required]],
      employmentType: [null, [Validators.required]],
      organisationName: [null, [Validators.required]],
      industry: [null, Validators.required],
      minWorkExperience: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(30),
        Validators.pattern('^[0-9]*$')
      ]],
      maxWorkExperience: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(30),
        Validators.pattern('^[0-9]*$')
      ]],
      showSalary: [null, Validators.required],  // Default value is false (unchecked)
      courseType: [[], Validators.required],
      qualificationByCourse: [[], Validators.required],
      workMode: [null, [Validators.required]],
      minSalary: ['', [Validators.required]],
      maxSalary: ['', [Validators.required]],
      salaryCurrency: [null, [Validators.required]],
      addQuestions: [2], // Default to "No"
      questions: this._fb.array([], this.uniqueQuestionsValidator)
    });
    // Add validation for salary range
    this.submitJobCreateForm.get('minWorkExperience').valueChanges.subscribe(() => {
      this.validateExperienceRange();
    });

    this.submitJobCreateForm.get('maxWorkExperience').valueChanges.subscribe(() => {
      this.validateExperienceRange();
    });
    // Subscribe to currency changes to update validators
    this.submitJobCreateForm.get('salaryCurrency').valueChanges.subscribe(currency => {
      this.updateSalaryValidators(currency);
    });

    // Initial setup of validators based on default currency
    this.updateSalaryValidators(this.submitJobCreateForm.get('salaryCurrency').value);

    // Existing subscriptions for range validation
    this.submitJobCreateForm.get('minSalary').valueChanges.subscribe(() => {
      this.validateSalaryRange();
    });

    this.submitJobCreateForm.get('maxSalary').valueChanges.subscribe(() => {
      this.validateSalaryRange();
    });
  }



  /***
   * control show/hide delivery
   */
  public roleCtrl: boolean = false;

  /**control */
  getControl(name: string) {
    return this.submitJobCreateForm.get(name);
  }

  public isJobDescriAndJobVisible: boolean = true;


  /**method for add validators */
  addValidator(name: string) {
    let ctrl = this.getControl(name);
    ctrl.setValidators([Validators.required]);
    ctrl.updateValueAndValidity();
  }



  /**method for clear validators */
  clearValidators(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.clearValidators();
    ctrl?.updateValueAndValidity();
  }
  /**method for clear validators */
  clearValidatorsAndValue(name: string) {
    let ctrl = this.getControl(name);
    ctrl.reset();
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }
  /**method for add min and max length validators */
  minLengthMaxLengthValidator(name: string, type?: string, min: number = 0, max: number = 0) {
    let ctrl = this.getControl(name);
    if (type == 'min') {
      ctrl.setValidators([Validators.required, Validators.minLength(min)]);
    }
    ctrl.updateValueAndValidity();
  }

  /**method for reset value */
  resetControl(name: string) {
    let ctrl = this.getControl(name);
    ctrl?.reset();
  }


  /* submit form */
  submitFormHandler(form: any) {
    this.isSubmitForm = true;

    if (form.get('addQuestions').value === 1) {
      // Mark all question fields as touched to trigger validation
      for (let i = 0; i < this.questionsArray.length; i++) {
        const control = this.questionsArray.at(i).get('questionText');
        control.markAsTouched();
      }

      // Check if all question fields are valid
      let allQuestionsValid = true;
      for (let i = 0; i < this.questionsArray.length; i++) {
        if (this.questionsArray.at(i).get('questionText').invalid) {
          allQuestionsValid = false;
          break;
        }
      }

      if (!allQuestionsValid) {
        this._share.showAlertErrorMessage.next('Please fill in all required question fields.');
        return;
      }
    }
    let minExp = this.submitJobCreateForm.get('minWorkExperience').value;
    let maxExp = this.submitJobCreateForm.get('maxWorkExperience').value;
    if (minExp && maxExp && Number(maxExp) < Number(minExp)) {
      this.submitJobCreateForm.get('maxWorkExperience').setErrors({ invalidRange: true });
      this._share.showAlertErrorMessage.next('Maximum work experience cannot be less than minimum work experience.');
      return;
    }
    const doc = this.getControl('jobDescription')?.value;
    if (doc.type == 'doc') {

      this.getControl('jobDescription').patchValue(toHTML(this.getControl('jobDescription').value));
    }
    this.JobSecHtml;
    form.markAllAsTouched();
    if (form.valid) {
      let formData = form.value;
      this.submitFormTalentToServer(formData);
    } else {
      if (this.questionsArray.errors?.duplicateQuestions) {       
        this._share.showAlertErrorMessage.next('Questions must be unique. Please remove duplicates.');
      } else {
        this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
      }
      return;
    }
  }


  closeModal(): void {
    this.dialogRef.close();
  }

  validateExperienceRange() {
    const minExp = this.submitJobCreateForm.get('minWorkExperience').value;
    const maxExp = this.submitJobCreateForm.get('maxWorkExperience').value;

    if (minExp && maxExp && Number(maxExp) < Number(minExp)) {
      this.submitJobCreateForm.get('maxWorkExperience').setErrors({ invalidRange: true });
    }else {
      this.submitJobCreateForm.get('maxWorkExperience').setErrors(null);
    }
  }
  onCourseTypeChange(event: any) {
    const selectedCourseTypes = event.value || [];
    // Filter qualifications based on all selected course types
    this.filteredQualificationList = this.qualificationsList.filter(q =>
      selectedCourseTypes.includes(q.CauseTypeId)
    );
    if(event?.arr?.length > 0){
      setTimeout(() => {        
        this.getControl('qualificationByCourse')?.patchValue(event?.arr);
      }, 1000);
    }
  }
  public talentDetailsList: any = [];
  /**get THID details by THID */
  GetTHIDDetailsByTHID() {
    this._talentServ.GetTHIDDetailsByTHID(this.data?.TH_ID).subscribe(
      res => {
        this.talentDetailsList = res['data'][0];
        if (this.talentDetailsList?.JoiningLocID == 21) {
          this.getJoiningLocationList();
        }
        this.excuteAllAPI();
        // Add this line to call autoPatchFormValues after talent details are loaded
        setTimeout(() => {          
          this.autoPatchFormValues();
        }, 500);
      });
  }

  // Add method to update validators based on currency
  updateSalaryValidators(currency: string) {
    const validationConfig = this.CURRENCY_VALIDATIONS[currency] || this.CURRENCY_VALIDATIONS['1'];

    // Update minSalary validators
    this.getControl('minSalary').clearValidators();
    this.getControl('minSalary').setValidators([
      Validators.required,
      Validators.min(validationConfig.minValue),
      Validators.max(validationConfig.maxValue),
      Validators.pattern('^[0-9]*$')
    ]);
    this.getControl('minSalary').updateValueAndValidity();

    // Update maxSalary validators
    this.getControl('maxSalary').clearValidators();
    this.getControl('maxSalary').setValidators([
      Validators.required,
      Validators.min(validationConfig.minValue),
      Validators.max(validationConfig.maxValue),
      Validators.pattern('^[0-9]*$')
    ]);
    this.getControl('maxSalary').updateValueAndValidity();
  }
  // Update the salary range validation method
  validateSalaryRange() {
    const minSalary = this.submitJobCreateForm.get('minSalary').value;
    const maxSalary = this.submitJobCreateForm.get('maxSalary').value;
    const currency = this.submitJobCreateForm.get('salaryCurrency').value;
    const validationConfig = this.CURRENCY_VALIDATIONS[currency] || this.CURRENCY_VALIDATIONS['1'];

    if (minSalary && !Number.isNaN(Number(minSalary))) {
      // Check if minimum salary is below the allowed minimum
      if (Number(minSalary) < validationConfig.minValue) {
        this.getControl('minSalary').setErrors({
          ...this.getControl('minSalary').errors,
          min: { min: validationConfig.minValue, actual: minSalary }
        });
      }
      // Check if minimum salary exceeds the allowed maximum
      if (Number(minSalary) > validationConfig.maxValue) {
        this.getControl('minSalary').setErrors({
          ...this.getControl('minSalary').errors,
          max: { max: validationConfig.maxValue, actual: minSalary }
        });
      }
    }

    if (maxSalary && !Number.isNaN(Number(maxSalary))) {
      // Check if maximum salary is below the allowed minimum
      if (Number(maxSalary) < validationConfig.minValue) {
        this.getControl('maxSalary').setErrors({
          ...this.getControl('maxSalary').errors,
          min: { min: validationConfig.minValue, actual: maxSalary }
        });
      }
      // Check if maximum salary exceeds the allowed maximum
      if (Number(maxSalary) > validationConfig.maxValue) {
        this.getControl('maxSalary').setErrors({
          ...this.getControl('maxSalary').errors,
          max: { max: validationConfig.maxValue, actual: maxSalary }
        });
      }
    }

    // Check if maximum salary is less than minimum salary
    if (minSalary && maxSalary && Number(maxSalary) < Number(minSalary)) {
      this.getControl('maxSalary').setErrors({
        ...this.getControl('maxSalary').errors,
        invalidRange: true
      });
    } else if (this.getControl('maxSalary').errors && this.getControl('maxSalary').errors.invalidRange) {
      // Clear only the invalidRange error if it's now valid
      const errors = { ...this.getControl('maxSalary').errors };
      delete errors['invalidRange'];
      this.getControl('maxSalary').setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  // Add these properties to your component class
  public showQuestionsSection: boolean = false;
  public isSubmitForm: boolean = false;
  // Get the questions FormArray
  get questionsArray() {
    return this.submitJobCreateForm.get('questions') as UntypedFormArray;
  }

  // Handle dropdown change event
  onAddQuestionsChange(event) {
    const value = event.value;

    if (value === 1) { // Yes
      this.showQuestionsSection = true;

      // Add initial two question fields if the array is empty
      if (this.questionsArray.length === 0) {
        this.addQuestionField();
        this.addQuestionField();
      }
    } else {
      this.showQuestionsSection = false;

      // Clear all questions if "No" is selected
      while (this.questionsArray.length) {
        this.questionsArray.removeAt(0);
      }
    }
  }

  // Add a new question field
  addQuestionField() {
    if (this.questionsArray.length < 10) {
      const questionGroup = this._fb.group({
        questionText: ['', [Validators.required, Validators.maxLength(100)]]
      });

      this.questionsArray.push(questionGroup);
    }
  }

  // Remove a question field
  removeQuestion(index: number) {
    if (this.questionsArray.length > 2) { // Keep at least 2 questions
      this.questionsArray.removeAt(index);
    } else {
      this._share.showAlertErrorMessage.next('At least 2 questions are required.');
    }
  }

   // Custom validator to ensure unique questions
    uniqueQuestionsValidator(control: AbstractControl): ValidationErrors | null {
      if (control instanceof UntypedFormArray) {
        const questions = control.controls.map((group: AbstractControl) =>
          group.get('questionText')?.value?.trim().toLowerCase()
        );
        const duplicates = questions.filter((item, index) => questions.indexOf(item) !== index);

        if (duplicates.length > 0) {
          return { duplicateQuestions: true };
        }
      }
      return null;
    }

  /**
   * Submit form data to server
   * @param formData Original form data from form submission
   */
  submitFormTalentToServer(formData: any) {
    // Create new object with required field mapping
    const submitData = {
      thid: this.data?.TH_ID,
      title: formData.jobTitle, 
      description: this.JobSecHtml,
      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,
      salaryCurrency: formData.salaryCurrency,
      workModeId: formData.workMode,
      employmentTypeId: formData.employmentType,
      orgId: formData.organisationName,
      minWorkExperience: formData.minWorkExperience,
      maxWorkExperience: formData.maxWorkExperience,
      CauseTypeId: formData.courseType? formData.courseType?.toString():'', 
      QaulificationId: formData.qualificationByCourse ? formData.qualificationByCourse?.toString():'', // Note the field name mapping
      showSalary: formData.showSalary,
      questions: formData.addQuestions === 1 ? formData.questions : [], // Format questions array if enabled
      JobId: this.data?.JobId || null, // Include JobId if available for update
      PostingLocationId: formData.joiningLocation ? formData.joiningLocation.toString():'', // Include joining location
      industry: formData.industry
    };

    // Send data to API
    this._naukriServ.AddUpdateJobOnNaukri(submitData).subscribe(
      (response) => {
        if (response) {
          // Success
          this._share.showAlertSuccessMessage.next(
            response || 'Job has been successfully posted to Naukri'
          );
          this.dialogRef.close({ success: true, data: response.data });
        } else {
          // API returned error
          this._share.showAlertErrorMessage.next(
            response || 'Failed to post job to Naukri. Please try again.'
          );
        }
      },
      (error) => {

        console.error('Error posting job to Naukri:', error);
        this._share.showAlertErrorMessage.next(
          'An error occurred while posting the job. Please try again later.'
        );
      }
    );
  }

  /**
   * Auto-patch form values based on whether it's a new submission or an update
   */
  autoPatchFormValues() {
    // Check if a jobId exists in the data passed to the component
    if (this.talentDetailsList && this.talentDetailsList?.JobId && this.talentDetailsList?.PostedStatus != 'CREATE_FAILED') {
      
      this._naukriServ.getPostedJobDetailsById(this.talentDetailsList?.JobId).subscribe(
        (response) => {
          if (response && response['data'][0]) {
            response['data'][0]['Questions'] = response['Queations'];
            this.patchFormWithJobDetails(response['data'][0]);
          } else {
            this._share.showAlertErrorMessage.next('Failed to load job details. Please try again.');
          }
        },
        (error) => {
          console.error('Error fetching job details:', error);
          this._share.showAlertErrorMessage.next('Error loading job details. Please try again later.');
        }
      );
    } else {
      // This is a new submission, patch with talent details
      this.patchFormWithTalentDetails();
    }
  }

  /**
   * Patch form with talent details for new job posting
   */
  private patchFormWithTalentDetails() {
    if (!this.talentDetailsList) return;
    let v = GlobalMethod.htmlUnescape(this.talentDetailsList?.JobDesc)
    // Map talent details to form fields
    const patchData = {
      jobTitle: this.talentDetailsList.TalentCubeRole || '',
      // roleId: this.talentDetailsList.TalentCubeRoleId || null,
      employmentType: this.talentDetailsList.EMPLOYEMENT_TYPE_ID ? this.selectEmploymentType(parseInt(this.talentDetailsList.EMPLOYEMENT_TYPE_ID)) : null,
      // Use default values for salary range based on currency
      salaryCurrency: 1, // Default to INR
      minWorkExperience: this.talentDetailsList.MinExp ? parseInt(this.talentDetailsList.MinExp) : '',
      maxWorkExperience: this.talentDetailsList.MaxExp ? parseInt(this.talentDetailsList.MaxExp) : '',
      // Set default values for other fields
      workMode: this.talentDetailsList?.ClientWorkRequirementId ? this.selectWorkMode(this.talentDetailsList?.ClientWorkRequirementId) : null, // Default work mode (e.g., Remote)
      showSalary: 'Y', // Default to not showing salary
      addQuestions: 2, // Default to no questions
      // If talent cube has job description, use it
      jobDescription: v || null
    };

    // Patch the form with initial values
    this.submitJobCreateForm.patchValue(patchData);

    // Initialize editor with job description if available
    if (this.talentDetailsList.JobDescription) {
      this.JobSecHtml = this.talentDetailsList.JobDescription;
    }
  }

  /**
   * Patch form with job details for updating existing job
   * @param jobDetails Job details received from API
   */
  private patchFormWithJobDetails(jobDetails: any) {
    if (!jobDetails) return;
    // Parse courseType and qualificationByCourse as arrays
    const courseTypeArr = jobDetails.CauseTypeId
      ? jobDetails.CauseTypeId.split(',').map((x: string) => Number(x.trim()))
      : [];
    const qualificationArr = jobDetails.QaulificationId
      ? jobDetails.QaulificationId.split(',').map((x: string) => Number(x.trim()))
      : [];
    // Map API response fields to form fields
    const patchData = {
      jobTitle: jobDetails.title || '', // Make sure this matches your API response field
      jobDescription: jobDetails.JobDescription,
      employmentType: jobDetails.EmployementTypeId,
      organisationName: jobDetails.OrgId,
      minWorkExperience: jobDetails.MinWorkExperience,
      maxWorkExperience: jobDetails.MaxWorkExperience,
      showSalary: jobDetails.showSalary,
      courseType: courseTypeArr,
      qualificationByCourse: [],
      workMode: jobDetails.WorkModeId,
      minSalary: jobDetails.MinSalary,
      maxSalary: jobDetails.MaxSalary,
      salaryCurrency: jobDetails.SalaryCurrencyId,
      addQuestions: jobDetails.Questions && jobDetails.Questions.length > 0 ? 1 : 2,
      joiningLocation: jobDetails.PostingLocationId
        ? jobDetails.PostingLocationId.split(',').map((x: string) => Number(x.trim()))
        : [],
      industry: jobDetails?.IndustryId,
    };

    // Patch the form with values
    this.submitJobCreateForm.patchValue(patchData);
    // Call onCourseTypeChange to filter the qualification list
    this.onCourseTypeChange({ value: courseTypeArr, arr:qualificationArr } );
    // Initialize editor with job description
    if (jobDetails.Description) {
      this.JobSecHtml = jobDetails.Description;
    }

    // Handle questions if they exist
    if (jobDetails.Questions && jobDetails.Questions.length > 0) {
      this.showQuestionsSection = true;

      // Clear existing questions array
      while (this.questionsArray.length) {
        this.questionsArray.removeAt(0);
      }

      // Add questions from response
      jobDetails.Questions.forEach(question => {
        const questionGroup = this._fb.group({
          questionText: [question.Questions, Validators.required]
        });
        this.questionsArray.push(questionGroup);
      });
    }
  }

  selectWorkMode(Id:number){
    if(Id == 1) return 3;
    else if(Id == 2) return 2;
    else if(Id == 3) return 1;
    else return 1;
  }

  getOrganisationList() {
    this._naukriServ.getOrganizationForNaukri().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          this.organisationList = res.data;
        }
      },
      error: () => {
      }
    });
  }

  selectEmploymentType(Id:number){
    if(Id == 1) return 1;
    else if(Id == 3) return 2;
    else return 1;
  }

  getJoiningLocationList() {
    this._naukriServ.getPostedLocationsForNaukri().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.joiningLocationList = res.data;
        }
      },
      error: () => {
        // fallback or error handling
      }
    });
  }

  onJoiningLocationChange(event: any) {
    const selected = this.getControl('joiningLocation').value || [];
    if (selected.length >= 3) {
      // This should never happen now, but just in case:
      this.getControl('joiningLocation').setValue(selected.slice(0, 3), { emitEvent: false });
      this._share.showAlertErrorMessage.next('You can select up to 3 locations only.');
    } else {
      this.getControl('joiningLocation').setErrors(null);
    }
  }

  getIndustryList() {
    this._naukriServ.getIndustryList().subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.industryList = res.data;
        }
      },
      error: () => {
      }
    });
  }

}

