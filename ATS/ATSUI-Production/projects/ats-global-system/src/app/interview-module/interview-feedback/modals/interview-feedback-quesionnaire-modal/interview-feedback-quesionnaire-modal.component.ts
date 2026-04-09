import { Component, Inject, OnInit } from '@angular/core';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { FILE_UPLOAD } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { InrerviewsService } from '../../../inrerviews.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { CustomValidation } from 'projects/ats-global-system/src/app/core/validators/custom-validator';

@Component({
  selector: 'app-interview-feedback-quesionnaire-modal',
  templateUrl: './interview-feedback-quesionnaire-modal.component.html',
  styleUrls: ['./interview-feedback-quesionnaire-modal.component.scss']
})
export class InterviewFeedbackQuesionnaireModalComponent implements OnInit {

  
  public formAppearance: string = 'fill';
  public formClass: string = 'form-fill-ats';
  public feedbackDetails: any = [];
  public base64file: string;

  public feedbackQuestionnaireForm: UntypedFormGroup = new UntypedFormGroup({});
  public isHideAll: boolean = true;
  public offerTemplates: any = [];
  public maxTextLength: number = 1000;
  public minTextLength: number = 100;
  public minCharacError: string = 'Please enter minimum 100 characters.'
  public allQuestionnaireDetails: any = CONSTANTS.OldquesionnaireIntFeedback;
  public label1: string = this.allQuestionnaireDetails.label1?.name;
  public label2: string = this.allQuestionnaireDetails.label2?.name;
  public label3: string = this.allQuestionnaireDetails.label3?.name;;
  public label4: string = this.allQuestionnaireDetails.label4?.name;
  public label5: string = this.allQuestionnaireDetails.label5?.name;

  public familiarProgramTechnologLabel: string = this.allQuestionnaireDetails.label1?.question1;
  public technicalSkillsEvaluatLabel: string = this.allQuestionnaireDetails.label1?.question2;
  public candidateCodingChallengeLabel: string = this.allQuestionnaireDetails.label1?.question3;

  public assessRoleKnowledgLabel: string = this.allQuestionnaireDetails.label2?.question1;

  public candidateApprochComplexPrblmLabel: string = this.allQuestionnaireDetails.label3?.question1;
  public candidatePrblmSolvingApprochLabel: string = this.allQuestionnaireDetails.label3?.question2;

  public candidatePossesIndustryDomExpLabel: string = this.allQuestionnaireDetails.label4?.question1;

  public candidateFitForInfogainLabel: string = this.allQuestionnaireDetails.label5?.question1;
  public candidateAbilityToAdoptChangeWorkLabel: string = this.allQuestionnaireDetails.label5?.question2;
  constructor(
    public dialogRef: MatDialogRef<InterviewFeedbackQuesionnaireModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _share: ShareService,
    private _fb: UntypedFormBuilder,
    private _intServe: InrerviewsService,
    private _GlobCommon: GlobalCommonMethodService
  ) {
  }


  public countNonSpaceChars(str: string): number {
    const noSpaces = str.replace(/\s/g, '');
    return noSpaces.length;
  }
  public step: number = 0;
  setStep(index: number) {
    this.step = index;
  }

  // public isHideNextButton: boolean = false;
  nextStep() {
    this.step++;
    
  }

  prevStep() {
    this.step--;
  }


  ngOnInit(): void {

    this.formInit();
    this.getFeedbackDetails();

  }



  formInit() {
    this.feedbackQuestionnaireForm = this._fb.group({
      technicalPracticeSkillForm: this._fb.group({
        familiarProgramTechnolog: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
        technicalSkillsEvaluat: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
        candidateCodingChallenge: ['N', [Validators.required]],
        fileUpload: [null]
      }),
      fundamentalKnowledgForm: this._fb.group({
        assessRoleKnowledg: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
      }),
      prblmSolvingSkillForm: this._fb.group({
        candidateApprochComplexPrblm: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
        candidatePrblmSolvingApproch: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
      }),
      industryDomainKnowledgForm: this._fb.group({
        candidatePossesIndustryDomExp: [null],
      }),
      CulturatFitAdaptabilityForm: this._fb.group({
        candidateFitForInfogain: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
        candidateAbilityToAdoptChangeWork: [null, [Validators.required,CustomValidation.minLenNoWhitespace(100)]],
      }),

    })
  }

  getFeedbackDetails() {
    this._intServe.getFeedbackQuesionnaire(this.data?.cid, this.data?.roundId).subscribe(
      res => {
        this.feedbackDetails = res['data'][0];
        this.setDefaultValue(this.feedbackDetails);
      }
    )
  }


  /***
         * file upload screenshot  
         */
  public fileAttechment: any = '';
  fileUp(event) {
    this.fileAttechment = '';
    // let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.txt|\.pdf|\.doc|\.docx|\.rtf)$/i;
    let files = event.target.files[0];

    let fileName = files.name;
    if (!allowedExtensions.exec(fileName)) {
      // this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/ only.');
      this._share.showAlertErrorMessage.next(fileName + 'is not  valid document type. Please upload file type  jpeg/jpg/png/txt/pdf/doc/docx/rtf only.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;
    }
    else if (files.size > FILE_UPLOAD.FILE_SIZE) {
      this._share.showAlertErrorMessage.next('Image  uploaded cannot be greater than 15MB.');
      event.target.value = "";
      this.fileAttechment = '';
      return false;

    }
    else {
      this.fileAttechment = files;
      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = () => {
        // const blob = this._commonMethodServe.base64toBlob(reader.result);
        this.base64file = reader.result.toString().replace(/^data:.+;base64,/, '');
      }
    }
  }



  getControl(name: string) {
    return this.feedbackQuestionnaireForm.get(name);
  }

  get technicalPracticeSkillControl() { return this.feedbackQuestionnaireForm.get('technicalPracticeSkillForm') }
  get fundamentalKnowledgFormControl() { return this.feedbackQuestionnaireForm.get('fundamentalKnowledgForm') }
  get prblmSolvingSkillFormControl() { return this.feedbackQuestionnaireForm.get('prblmSolvingSkillForm') }
  get industryDomainKnowledgFormContrl() { return this.feedbackQuestionnaireForm.get('industryDomainKnowledgForm') }
  get CulturatFitAdaptabilityFormControl() { return this.feedbackQuestionnaireForm.get('CulturatFitAdaptabilityForm') }


  /**showing default value of all details */
  setDefaultValue(data: any = {}) {
    this.technicalPracticeSkillControl.get('familiarProgramTechnolog').patchValue(data?.familiarProgramTechnolog ? data?.familiarProgramTechnolog : '');
    this.technicalPracticeSkillControl.get('technicalSkillsEvaluat').patchValue(data?.technicalSkillsEvaluat ? data?.technicalSkillsEvaluat : '');
    this.technicalPracticeSkillControl.get('candidateCodingChallenge').patchValue(data?.candidateCodingChallenge ? data?.candidateCodingChallenge : 'N');
    this.fundamentalKnowledgFormControl.get('assessRoleKnowledg').patchValue(data?.assessRoleKnowledg ? data?.assessRoleKnowledg : '');
    // this.fundamentalKnowledgFormControl.get('candidateCodingChallenge').patchValue(data?.candidateCodingChallenge ? data?.candidateCodingChallenge : '');

    this.prblmSolvingSkillFormControl.get('candidateApprochComplexPrblm').patchValue(data?.candidateApprochComplexPrblm ? data?.candidateApprochComplexPrblm : '');
    this.prblmSolvingSkillFormControl.get('candidatePrblmSolvingApproch').patchValue(data?.candidatePrblmSolvingApproch ? data?.candidatePrblmSolvingApproch : '');
    this.industryDomainKnowledgFormContrl.get('candidatePossesIndustryDomExp').patchValue(data?.candidatePossesIndustryDomExp ? data?.candidatePossesIndustryDomExp : '');

    this.CulturatFitAdaptabilityFormControl.get('candidateFitForInfogain').patchValue(data?.candidateFitForInfogain ? data?.candidateFitForInfogain : '');
    this.CulturatFitAdaptabilityFormControl.get('candidateAbilityToAdoptChangeWork').patchValue(data?.candidateAbilityToAdoptChangeWork ? data?.candidateAbilityToAdoptChangeWork : '');

    /**show default image if yes */
    if (data?.candidateCodingChallenge) {
      let val: any = [];
      if (data?.candidateCodingChallenge == 'Y') {
        val['value'] = "Y"
      } else {
        val['value'] = "N"
      }
      this.statusChange(val);
    }


  }


  public isSSrequired: boolean = false;
  statusChange(elm: any) {
    let fileUpload = this.technicalPracticeSkillControl?.get('fileUpload');
    fileUpload?.reset();
    if (elm.value == 'Y') {
      this.isSSrequired = true;
      fileUpload?.setValidators([Validators.required]);
    } else {
      this.isSSrequired = false;
      fileUpload?.clearValidators();
    }
    fileUpload?.updateValueAndValidity();
  }
  /**download file */
  dwnloadFileSingle(data: any) {
    this._GlobCommon.downloadFileCommon(data?.techFilePath, data?.techFileName);
  }


  /**
   * final feeback quesionnaire submit submit 
   */
  submitRequest(form: UntypedFormGroup, type: string) {
    let formData = form.value;
    formData['type'] = type;
    /**type S for Save and Type D for draft */
    if (type == "S") {
      form.markAllAsTouched();
      let technicalPracticeSkillForm = form.get('technicalPracticeSkillForm');
      let fundamentalKnowledgForm = form.get('fundamentalKnowledgForm');
      let prblmSolvingSkillForm = form.get('prblmSolvingSkillForm');
      let industryDomainKnowledgForm = form.get('industryDomainKnowledgForm');
      let CulturatFitAdaptabilityForm = form.get('CulturatFitAdaptabilityForm');
      if (form.valid) {
       // let formData = form.value;
       
        

        // this.saveDraftMethod(formData)
        this.submitData(formData)

        // formData['cid'] = this.data?.cid;
        // formData['roundId'] = this.data?.roundId;
        // formData.technicalPracticeSkillForm['techFileBase64'] = this.base64file;
        // formData.technicalPracticeSkillForm['techFileName'] = this.fileAttechment?.name;

        // this._intServe.submitIntervFeedbackQuesionnaire(formData).subscribe(
        //   res => {
        //     this._share.showAlertSuccessMessage.next(res);

        //   }
        // );

        

      } else {
        
        if (technicalPracticeSkillForm?.invalid) {
          this.step = 0;
          this._share.showAlertErrorMessage.next('Please fill the (Tab 1) - Technical Skills Proficiencies & Practical Skills.');
        }
        else if (fundamentalKnowledgForm?.invalid) {
          this.step = 1;
          this._share.showAlertErrorMessage.next('Please fill the (Tab 2) - Fundamental Knowledge.');
        }
        else if (prblmSolvingSkillForm?.invalid) {
          this.step = 2;
          this._share.showAlertErrorMessage.next('Please fill the (Tab 3) - Problem Solving and Logical Thinking.');
        }
        else if (industryDomainKnowledgForm?.invalid) {
          this.step = 3;

        }
        else if (CulturatFitAdaptabilityForm?.invalid) {
          this.step = 4;
          this._share.showAlertErrorMessage.next('Please fill the (Tab 5) - Cultural Fit & Adaptability.');
        }
        else {
          this._share.showAlertErrorMessage.next('Please fill the form.');
        }

      }
    }
    else {
      this.submitData(formData)
    }


  }



  submitData(formVal: any) {
    let formData = {}
    formData['cid'] = this.data?.cid;
    formData['roundId'] = this.data?.roundId;
    formData['isSaveOrDraft'] = formVal.type;
    let data = { 
      isValid: 1 ,
      type: formVal.type
    };
    let technicalPracticeSkillFormData = formVal?.technicalPracticeSkillForm;
    let fundamentalKnowledgFormData = formVal?.fundamentalKnowledgForm;
    let prblmSolvingSkillFormData = formVal?.prblmSolvingSkillForm;
    let industryDomainKnowledgFormdata = formVal?.industryDomainKnowledgForm;
    let CulturatFitAdaptabilityFormData = formVal?.CulturatFitAdaptabilityForm;
   

    let technicalPracticeSkillForm = {};
    let fundamentalKnowledgForm = {};

    let prblmSolvingSkillForm = {};
    let industryDomainKnowledgForm = {};
    let CulturatFitAdaptabilityForm = {};
    /**technical Practice Skill Form */
    
    if (formVal?.technicalPracticeSkillForm?.familiarProgramTechnolog) {
      technicalPracticeSkillForm['familiarProgramTechnolog'] = formVal?.technicalPracticeSkillForm?.familiarProgramTechnolog;
    }
    if (formVal?.technicalPracticeSkillForm?.technicalSkillsEvaluat) {
      technicalPracticeSkillForm['technicalSkillsEvaluat'] = formVal?.technicalPracticeSkillForm?.technicalSkillsEvaluat;
    }
    if (formVal?.technicalPracticeSkillForm?.candidateCodingChallenge) {
      technicalPracticeSkillForm['candidateCodingChallenge'] = formVal?.technicalPracticeSkillForm?.candidateCodingChallenge;
    }

    if(this.base64file){
      technicalPracticeSkillForm['techFileBase64'] = this.base64file;
      technicalPracticeSkillForm['techFileName'] = this.fileAttechment?.name;
    }
   
    // if (formVal?.technicalPracticeSkillForm?.candidateCodingChallenge == '') {
    //   technicalPracticeSkillForm['candidateCodingChallenge'] = formVal?.technicalPracticeSkillForm?.candidateCodingChallenge ? formVal?.technicalPracticeSkillForm?.candidateCodingChallenge : 'N';
    // }

    /**fundamental Knowledg Form */
    if (formVal?.fundamentalKnowledgForm?.assessRoleKnowledg) {
      fundamentalKnowledgForm['assessRoleKnowledg'] = formVal?.fundamentalKnowledgForm?.assessRoleKnowledg;
    }

    /**prblm Solving Skill Form*/
    if (formVal?.prblmSolvingSkillForm?.candidateApprochComplexPrblm) {
      prblmSolvingSkillForm['candidateApprochComplexPrblm'] = formVal?.prblmSolvingSkillForm?.candidateApprochComplexPrblm;
    }
    if (formVal?.prblmSolvingSkillForm?.candidatePrblmSolvingApproch) {
      prblmSolvingSkillForm['candidatePrblmSolvingApproch'] = formVal?.prblmSolvingSkillForm?.candidatePrblmSolvingApproch;
    }
    /**industry Domain Knowledg Form */

    if (formVal?.industryDomainKnowledgForm?.candidatePossesIndustryDomExp) {
      industryDomainKnowledgForm['candidatePossesIndustryDomExp'] = formVal?.industryDomainKnowledgForm?.candidatePossesIndustryDomExp;
    }
    /*CulturatFitAdaptabilityForm*/
    if (formVal?.CulturatFitAdaptabilityForm?.candidateFitForInfogain) {
      CulturatFitAdaptabilityForm['candidateFitForInfogain'] = formVal?.CulturatFitAdaptabilityForm?.candidateFitForInfogain;
    }
    if (formVal?.CulturatFitAdaptabilityForm?.candidateAbilityToAdoptChangeWork) {
      CulturatFitAdaptabilityForm['candidateAbilityToAdoptChangeWork'] = formVal?.CulturatFitAdaptabilityForm?.candidateAbilityToAdoptChangeWork;
    }

    formData['technicalPracticeSkillForm'] = technicalPracticeSkillForm;
    formData['fundamentalKnowledgForm'] = fundamentalKnowledgForm;
    formData['prblmSolvingSkillForm'] = prblmSolvingSkillForm;
    formData['industryDomainKnowledgForm'] = industryDomainKnowledgForm;
    formData['CulturatFitAdaptabilityForm'] = CulturatFitAdaptabilityForm;


    this._intServe.submitIntervFeedbackQuesionnaire(formData).subscribe(
      res => {
        
        // let formFeedbackData = `
        //   ${technicalPracticeSkillFormData?.familiarProgramTechnolog ? this.familiarProgramTechnologLabel : ''} \n
        //   ${technicalPracticeSkillFormData?.familiarProgramTechnolog ? technicalPracticeSkillFormData?.familiarProgramTechnolog : ''} \n
        //   ${technicalPracticeSkillFormData?.technicalSkillsEvaluat ? this.technicalSkillsEvaluatLabel : ''} \n
        //   ${technicalPracticeSkillFormData?.technicalSkillsEvaluat ? technicalPracticeSkillFormData?.technicalSkillsEvaluat : ''} \n
        //   ${technicalPracticeSkillFormData?.candidateCodingChallenge ? this.candidateCodingChallengeLabel : ''} \n
        //   ${technicalPracticeSkillFormData?.candidateCodingChallenge ? 'Yes' : 'No'} \n
        //   ${fundamentalKnowledgFormData?.assessRoleKnowledg ? this.assessRoleKnowledgLabel : ''} \n
        //   ${fundamentalKnowledgFormData?.assessRoleKnowledg ? fundamentalKnowledgFormData?.assessRoleKnowledg : ''} \n
        //   ${prblmSolvingSkillFormData?.candidateApprochComplexPrblm ? this.candidateApprochComplexPrblmLabel : ''} \n
        //   ${prblmSolvingSkillFormData?.candidateApprochComplexPrblm ? prblmSolvingSkillFormData?.candidateApprochComplexPrblm : ''} \n
        //   ${prblmSolvingSkillFormData?.candidatePrblmSolvingApproch ? this.candidatePrblmSolvingApprochLabel : ''} \n
        //   ${prblmSolvingSkillFormData?.candidatePrblmSolvingApproch ? prblmSolvingSkillFormData?.candidatePrblmSolvingApproch : ''} \n
        //   ${industryDomainKnowledgFormdata?.candidatePossesIndustryDomExp ? this.candidatePossesIndustryDomExpLabel : ''} \n
        //   ${industryDomainKnowledgFormdata?.candidatePossesIndustryDomExp ? industryDomainKnowledgFormdata?.candidatePossesIndustryDomExp : ''} \n
        //   ${CulturatFitAdaptabilityFormData?.candidateFitForInfogain ? this.candidateFitForInfogainLabel : ''} \n
        //   ${CulturatFitAdaptabilityFormData?.candidateFitForInfogain ? CulturatFitAdaptabilityFormData?.candidateFitForInfogain : ''} \n
        //   ${CulturatFitAdaptabilityFormData?.candidateAbilityToAdoptChangeWork ? this.candidateAbilityToAdoptChangeWorkLabel : ''} \n
        //   ${CulturatFitAdaptabilityFormData?.candidateAbilityToAdoptChangeWork ? CulturatFitAdaptabilityFormData?.candidateAbilityToAdoptChangeWork : ''} \n`;
      //  data['formFeedbackData'] = formFeedbackData;
      this._share.showAlertSuccessMessage.next(res);
        this.dialogRef.close(data);
      }
    );

  }

  //   saveDraftMethod(formData: any) {
  // 
  //     formData.append('question1', formData?.quest1);
  //     this._intServe.submitIntervFeedbackQuesionnaire(formData).subscribe(
  //       res => {
  //         this._share.showAlertSuccessMessage.next(res);

  //       }
  //     );
  //   }


  closeModal(): void {
    let data = { isValid: 0 };
    this.dialogRef.close(data);
  }

}
