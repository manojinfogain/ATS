import { Component, OnInit, Inject, Input } from '@angular/core';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
@Component({
  selector: 'app-view-questionnaire-detailed-feedback',
  templateUrl: './view-questionnaire-detailed-feedback.component.html',
  styleUrls: ['./view-questionnaire-detailed-feedback.component.scss']
})
export class ViewQuestionnaireDetailedFeedbackComponent implements OnInit {



  public feedbackDetails: any = [];
  @Input() dataFromInterview: any = [];
  public maxTextLength: number = 1000;
/**new view detailed feedback total 3 section starts */
  public NewallQuestionnaireDetails: any = CONSTANTS.NewquesionnaireIntFeedback;
  /**sec label  */
  public newLabel2: string = this.NewallQuestionnaireDetails.labelOne?.name;
  public newLabel3: string = this.NewallQuestionnaireDetails.labelTwo?.name;
  public newlabel5: string = this.NewallQuestionnaireDetails.labelThree?.name;
 /** questions  */

 public assessRoleKnowledgLabelNew: string = this.NewallQuestionnaireDetails.labelOne?.question1;
 public candidatePrblmSolvingApprochLabelNew: string = this.NewallQuestionnaireDetails.labelTwo?.question1;
 public candidateFitForInfogainLabelNew: string = this.NewallQuestionnaireDetails.labelThree?.question1;


/**new view detailed feedback total 3 section  ends*/

/**Old view detailed feedback total 5 section  */
  public allQuestionnaireDetails: any = CONSTANTS.OldquesionnaireIntFeedback;
/**sec label  */
  public label1: string = this.allQuestionnaireDetails.label1?.name;
  public label2: string = this.allQuestionnaireDetails.label2?.name;
  public label3: string = this.allQuestionnaireDetails.label3?.name;;
  public label4: string = this.allQuestionnaireDetails.label4?.name;
  public label5: string = this.allQuestionnaireDetails.label5?.name;

  /** questions  */
  public familiarProgramTechnologLabel: string = this.allQuestionnaireDetails.label1?.question1;
  public technicalSkillsEvaluatLabel: string = this.allQuestionnaireDetails.label1?.question2;
  public candidateCodingChallengeLabel: string = this.allQuestionnaireDetails.label1?.question3;

  public assessRoleKnowledgLabel: string = this.allQuestionnaireDetails.label2?.question1;

  public candidateApprochComplexPrblmLabel: string = this.allQuestionnaireDetails.label3?.question1;
  public candidatePrblmSolvingApprochLabel: string = this.allQuestionnaireDetails.label3?.question2;

  public candidatePossesIndustryDomExpLabel: string = this.allQuestionnaireDetails.label4?.question1;

  public candidateFitForInfogainLabel: string = this.allQuestionnaireDetails.label5?.question1;
  public candidateAbilityToAdoptChangeWorkLabel: string = this.allQuestionnaireDetails.label5?.question2;
/**Old view detailed feedback total 5 section  */

  constructor(
    private _GlobCommon: GlobalCommonMethodService
  ) {
  }

  ngOnInit(): void {
    this.feedbackDetails = this.dataFromInterview;
  }
  ngAfterViewInit() {

  }

  /**download file */
  dwnloadFileSingle(data: any) {
    this._GlobCommon.downloadFileCommon(data?.techFilePath, data?.techFileName);
  }


}
