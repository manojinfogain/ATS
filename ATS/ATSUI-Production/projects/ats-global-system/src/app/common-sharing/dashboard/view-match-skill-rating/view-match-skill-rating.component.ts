import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-match-skill-rating',
  templateUrl: './view-match-skill-rating.component.html',
  styleUrls: ['./view-match-skill-rating.component.scss']
})
export class ViewMatchSkillRatingComponent implements OnInit {
  @Input() dataResume: any;
  @Input() skillProficiencyLevel: any = [];
  displayedColumnsGenAI1 = ['Skill','SkillType','RatingDemand', 'Rating'];
  constructor() { }

  ngOnInit(): void {
     
  }
    // Utility method to get proficiency name
getProficiencyName(level: number): string {
  const found = this.skillProficiencyLevel.find(p => p?.Rating === level);
  return found ? found.Name : 'Unknown';
}

}
