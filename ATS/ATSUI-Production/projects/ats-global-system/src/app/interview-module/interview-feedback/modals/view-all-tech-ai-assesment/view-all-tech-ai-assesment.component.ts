import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { dE } from '@fullcalendar/core/internal-common';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { InterviewStatusService } from 'projects/ats-global-system/src/app/core/services/interview-status.service';

@Component({
  selector: 'app-view-all-tech-ai-assesment',
  templateUrl: './view-all-tech-ai-assesment.component.html',
  styleUrls: ['./view-all-tech-ai-assesment.component.scss']
})
export class ViewAllTechAiAssesmentComponent implements OnInit {
  displayedColumnsGenAI = ['Areas', 'RatingPanel','RatingAI'];
  displayedColumns3 = ['QuestionAuto', 'Rating','RatingAI'];
 // 'AutoQAns',
  public userData: any = {};
  constructor(
    public dialogRef: MatDialogRef<ViewAllTechAiAssesmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
         private dialog: MatDialog,
         private _interviewStatus: InterviewStatusService,
             private _GlobCommon: GlobalCommonMethodService
  ) { }

  ngOnInit(): void {
    this.getInterviewRound();
  }

  mergeAIAndPanelAssessmentData(panelAssessmentData:any, AIAssesmentDataArr:any) {  
    if(panelAssessmentData?.length>0){
    this.GenAIResponsesListModel= this._GlobCommon.mergeAIAndPanelAssessmentData(panelAssessmentData,AIAssesmentDataArr);
    }
    else{
      this.GenAIResponsesListModel= [];
    }
    debugger
    return this.GenAIResponsesListModel;
    
  }

  mergeAIAndPanelAutoQuestionData(panelAssessmentData:any, AIAssesmentDataArr:any) {  
    if(panelAssessmentData?.length>0 && AIAssesmentDataArr?.length>0){
    this.GenAIResponsesListModel= this._GlobCommon.mergeAIQuestRating(panelAssessmentData,AIAssesmentDataArr);
    }
    else{
      this.GenAIResponsesListModel= [];
    }
    return this.GenAIResponsesListModel;
    
  }

  public GenAIResponsesListModel: any = []
  public candidateData: any = [];
  public roundDataList: any = [];
  public AIAutoQuestFeedbackData: any = [];
  getInterviewRound() {
    this._interviewStatus.getCandidateDetails(this.data.cid).subscribe(

      res => {
        this.candidateData = res;
       this.roundDataList = res.roundList.filter(list => list?.interviewType?.Id == 2 && (list.InterViewStatus?.Id == 7 || list.InterViewStatus?.Id == 5 || list.InterViewStatus?.Id == 10) && list?.interviewBy =='I');
        debugger
        // if (this.roundDataList?.AIAreaRating.length > 0) {
        //  // this.GenAIResponsesListModel= this._GlobCommon.mergeAIAndPanelAssessmentData(this.roundDataList?.areas,this.roundDataList?.AIAreaRating);
        //  }
        //  if (this.roundDataList?.AIQuestRating.length > 0) {
        // //  this.AIAutoQuestFeedbackData = this._GlobCommon.mergeAIQuestRating(this.roundDataList?.autoQuestionFeedback,this.roundDataList?.AIQuestRating);
        //  }
      }

    )
    
  }

   /***
  * close dialog
  */
   closeModal(): void {
    this.dialogRef.close();
  }

}
