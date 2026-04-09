import { Component, EventEmitter, Input, OnInit,OnChanges, Output, SimpleChanges } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { OfferService } from 'projects/ats-global-system/src/app/offer-module/offer.service';

@Component({
  selector: 'app-salary-grid-control',
  templateUrl: './salary-grid-control.component.html',
  styleUrls: ['./salary-grid-control.component.scss']
})
export class SalaryGridControlComponent implements OnInit,OnChanges {
  public aprvCountDataList:any = [];
  @Input() title:string = 'Salary Grid';
  // @Output() getDataSource = new EventEmitter<any>();
  @Input() gradeID:number;
  @Input() gradeBand:any;
  @Input() ctc:number;
  @Input() cubeClusterId:number;
  @Input() ExpYear:number;
  @Input() ExpMonth:number;
  @Input() CandidateTypeID:string;
  @Input() divisionID:number;
  @Input() PracticeID:number;
  @Input() jfCateg:string;
  @Input() isVisibleForIndia:boolean = false;
  // public JfCategList: any = CONSTANTS.JfCategList;
  constructor(
    private _offerService: OfferService,
    private _share: ShareService,
    ) 
    { }

  ngOnInit(): void {
    // this.getApproverCont(this.gradeID, this.gradeBand, this.ctc, this.cubeClusterId, this.ExpYear, this.ExpMonth, this.JfCategList, this.CandidateTypeID, this.divisionID);
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ctc = 0;
    this.ExpYear =1
    this.ExpMonth =1
    if(this.isVisibleForIndia){
      if(
      this.gradeID  && this.gradeBand &&
      this.cubeClusterId 
      ){
        
        if(this.jfCateg){
          this.getApproverCont(this.gradeID, this.gradeBand, this.ctc, this.cubeClusterId, this.ExpYear, this.ExpMonth, this.jfCateg, this.CandidateTypeID, this.divisionID);
        }else{
          this.getApproverCont(this.gradeID, this.gradeBand, this.ctc, this.cubeClusterId, this.ExpYear, this.ExpMonth, null, this.CandidateTypeID, this.divisionID);
        }
      }else{
        // in case of required parameter not found, salary grid to be blanked
        this.getApproverCont(1, null, 1, 1, 1, 1, null, '1', this.divisionID);
      }
    }
  }
  
  public approverMsgMissing: string = '';
  public approverLength: number = 0;
  getApproverCont(gradeID: number, gradeBand: any, ctc: number, cubeClusterId: number, ExpYear: number, ExpMonth: number, JFCategory:string ,CandidateTypeID: string, divisionId:number) {
    debugger
    this._offerService.getApprovalCount(gradeID, gradeBand, ctc, cubeClusterId, ExpYear, ExpMonth, JFCategory, CandidateTypeID,divisionId,0,null,this.PracticeID).subscribe
      (
        res => {
          let data = res['data'][0];
          this.aprvCountDataList = data;
          this.approverMsgMissing = '';
          this.approverLength = data.NumberOfApprover;
          if (data.NumberOfApprover === 0) {
            this.approverMsgMissing = data.Msg;
            this._share.showAlertErrorMessage.next(data.Msg)
          }
      }
    );
  }

}

