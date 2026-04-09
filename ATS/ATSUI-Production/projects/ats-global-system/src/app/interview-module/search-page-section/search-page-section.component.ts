import { Component, OnInit } from '@angular/core';
import { InterviewCommonService } from 'projects/ats-global-system/src/app/core/services/interview-common.service';

@Component({
  selector: 'app-search-page-section',
  templateUrl: './search-page-section.component.html',
  styleUrls: ['./search-page-section.component.scss']
})
export class SearchPageSectionComponent implements OnInit {
  public statusList:any = [];
  constructor(private _intCommonServe:InterviewCommonService) { }

  ngOnInit(): void {
    this.GetInterviewStatus();
  }

   /***
    * get Int Status
    */
  /***
    * get Int Status
    */
   GetInterviewStatus():void{
    this._intCommonServe.getIntStatusList().subscribe(
      res => {
        this.statusList = res;
      }
    );
  }

}
