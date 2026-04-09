import { Component, OnInit, ViewChild } from '@angular/core';
import { InterviewStatusService } from '../../core/services/interview-status.service';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
import { ActivatedRoute } from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatLegacyTableDataSource as MatTableDataSource, MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { InrerviewsService } from '../inrerviews.service';
import { ShareService } from '../../core/services/share.service';


@Component({
  selector: 'app-ai-question-list',
  templateUrl: './ai-question-list.component.html',
  styleUrls: ['./ai-question-list.component.scss']
})
export class AiQuestionListComponent implements OnInit {

  constructor(
    private _interviewStatus: InterviewStatusService,
    private _storage: GetSetStorageService,
    private _activatedRoute: ActivatedRoute,
    private _intServe:InrerviewsService,
    private _share:ShareService
  ) { }

  public paramId: number;
  public userData: any = {};
  ngOnInit(): void {
    this.userData = this._storage.getSetUserData();
    const paramId = this._activatedRoute.snapshot.params.id;
    if (paramId) {
      this.paramId = paramId;
    }

  }
  /**
   * 
   * @param id 
   */
  public currentRoundData: any = {};
  public canddiateData: any = {};
  public roundcount: number = 0;
  getProfileDetailsById(id: number) {
    this._interviewStatus.getCandidateDetails(id).subscribe(
      res => {
        this.canddiateData = res;
        this.currentRoundData = res.roundList.filter(list => list.IsCurrentRound == 'Y')[0];
      
        this.checkifAuthorizedUser(this.currentRoundData);
        this.checkIfInvalidUser(this.currentRoundData);
      }
    )
   
  }

  public validScreen: boolean = true;
  checkIfInvalidUser(data:any) {
    let interviewType = data.interviewType?.Id;
    let interviewStatus = data.InterViewStatus?.Id;
    if(interviewType == 2 && (interviewStatus == 1 || interviewStatus == 3)){
      if(data?.isPanelSaveQuestion == 'Y'){
        this.validScreen = false;
      }
      else{
        this.validScreen = true;
      }
     
    }
    else{
      this.validScreen = false;
    }

  }

  /***
   * check if authroized user
   */
  public authorizedUser: boolean = false;
  checkifAuthorizedUser(data: any) {
    const empId = this.userData?.EmpNewId;
    const additionalPanel = data.AdditionalInterviewer || [];
     // Function to check if empId exists in the panel
  const isAuthorized = (panel: any[]) => {
    return panel.some(member => member.Id === empId);
  };
    /***
     * if parimary panel
     */
    if (data.interviewer?.Id == empId) {
      //authorized user
     // alert('authorized user');
     this.authorizedUser = true;
     this.getQuestionList();
    }
   
    // Check if empId exists in additionalPanel
    else if (isAuthorized(additionalPanel)) {
    //  alert('authorized user additional panel');
    this.authorizedUser = true;
    this.getQuestionList();
    }
    else{
      this.authorizedUser = false;
   //   alert('not authorized user');
    }
  }


  /***
   * get data
   */
  public questionList: any = [];
  getQuestionList() {
     
    this._interviewStatus.getJDQuestionsByThId(this.canddiateData?.talentId,this.roundcount).subscribe(
      res=>{
        this.dataSource = new MatTableDataSource(res['QuestionAuto']);
        this.questionList = res['QuestionAuto'];
        this.dataSource.paginator = this.paginator;
      }
    )
  }



  ngAfterViewInit() {
    if(this.paramId){
      
      this._intServe.getTehRoundCountByCid(this.paramId).subscribe(
        res=>{
          this.roundcount = res['Table'][0]?.RoundCount;
          this.getProfileDetailsById(this.paramId);
        }
      )
      
    }
  }

  public isbuttonVisible: boolean = true;
  submit() {
    const currentPageData = this.getCurrentPageData();
    let body = {
      cid: this.paramId,
      QuestionAuto: currentPageData
    }

    this._intServe.addUpdateQuestionList(body).subscribe(
      res=>{
         this._share.showAlertSuccessMessage.next(res);
         this.isbuttonVisible = false;
      }
    )
  }

  getCurrentPageData() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.data.slice(startIndex, endIndex);
  }
  getSerialNumber(index: number): number {
    if(this.paginator?.pageIndex != undefined && this.paginator?.pageSize != undefined){ 
      return this.paginator?.pageIndex * this.paginator?.pageSize + index + 1;
    }
    
  }
  /***
   * data table
   */
  //displayedColumns: string[] = ['select','SNum', 'question'];
  displayedColumns: string[] = ['SNum', 'question'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild('paginator') paginator: MatPaginator;
  pageSizes = [10];

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
