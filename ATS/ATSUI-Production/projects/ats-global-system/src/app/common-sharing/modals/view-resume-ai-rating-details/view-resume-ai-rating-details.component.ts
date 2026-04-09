import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { GlobalApisService } from '../../../core/services/global-apis.service';

@Component({
  selector: 'app-view-resume-ai-rating-details',
  templateUrl: './view-resume-ai-rating-details.component.html',
  styleUrls: ['./view-resume-ai-rating-details.component.scss']
})
export class ViewResumeAiRatingDetailsComponent implements OnInit {
  ratingDt: any = {};
  displayedColumnsGenAI = ['Skill','SkillType','RatingDemand', 'Rating'];
  displayedColumnsGenAI1 = ['Skill','SkillType','RatingDemand', 'Rating'];
  public SkillRatings: any = [];
  constructor(
        public dialogRef: MatDialogRef<ViewResumeAiRatingDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _globalApi:GlobalApisService
  ) { }

  public skillProficiencyLevel: any=[];
  ngOnInit(): void {
    this._globalApi.getSkillProficiencyLevelMaster().subscribe(
      res => {
        this.skillProficiencyLevel = res['data'];
      }
    )
    if(this.data && this.data?.isDBFrom){ 
      let param:string = `id=${this.data?.id}&IsProfileInterview=${this.data?.isProfileInterview} &profileId=${this.data?.profileTypeId}&profileSource=${this.data?.profileSource || 'N'}`;
      this._globalApi.getAIResumeRatingByCid(param).subscribe(
      res=>{
        this.ratingDt =res['data'][0];
        this.SkillRatings = res['Skills'];

      }
    )
    }
   
  }

  // Utility method to get proficiency name
getProficiencyName(level: number): string {
  const found = this.skillProficiencyLevel.find(p => p?.Rating === level);
  return found ? found.Name : 'Unknown';
}

  closeModal(): void {
    this.dialogRef.close();
  }

}
