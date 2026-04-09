import { Component, OnInit, ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../../partner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DatePipe } from '@angular/common';
import { ShareService } from '../../../core/services/share.service';
import { Subscription } from 'rxjs';
import { GetLocationInfo } from '../../../core/common/getLocationInfo';
import { ViewTalentidDetailsPartnerComponent } from '../../modals/view-talentid-details-partner/view-talentid-details-partner.component';

@Component({
  selector: 'app-assigned-talentid-partner-list',
  templateUrl: './assigned-talentid-partner-list.component.html',
  styleUrls: ['./assigned-talentid-partner-list.component.scss'],
  providers: [DatePipe]
})
export class AssignedTalentidPartnerListComponent implements OnInit {
  displayedColumns = ['talentId', 'skill', 'exp', 'state', 'city', 'salaryType', 'maxRate', 'designation',
    'profileSubmitted', 'action'];
  displayColumnsIndia = ['talentId', 'skill', 'exp', 'location' ,'designation', 'contractType', 
    'profileSubmitted', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public myType: string='';
  public partnerId: number;
  public selectedItem: string = 'T';
  /** Paginator Reference */
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    public datepipe: DatePipe,
    private _share: ShareService,
    private getLocInfo: GetLocationInfo,
    private router: Router, 
    private route:ActivatedRoute)
  {
  }
  
  ngOnInit() {
    this.userData = this._storage.getSetUserData();
    this.partnerId = this.userData.partnerId;
    let LocID=this.userData.LocationID;
    if(LocID == 3){
      this.displayedColumns = ['talentId', 'skill', 'exp', 'state', 'city','assignedBy', 'salaryType', 'maxRate', 'designation',
        'profileSubmitted', 'action'];
    }else{
      this.displayedColumns = ['talentId', 'skill', 'exp', 'location','assignedBy' ,'designation', 'contractType', 
        'profileSubmitted', 'action'];
    }
    this.myType = this.route.snapshot.queryParams['action'];
    if(this.myType != null || this.myType != ''){
      this.selectedItem = this.myType;
    }
  }

  // location wise check
  public isLocationUS: boolean = false;
  public isLocationIndia: boolean = false;
  showHideLocWise() {
   if (this.getLocInfo.isLocationIndia()) {
     this.isLocationIndia = true;
     this.isLocationUS = false;
   } else if (this.getLocInfo.isLocationUS()) {
     this.isLocationIndia = false;
     this.isLocationUS = true;
   }
   this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, '', this.selectedItem);

 }

  ngAfterViewInit() {
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )
  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }

  /***
  * reset paging
  */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  /**
   * reset filter and search
   */
  resetSortFilter() {
    this.isResetSearch = true;
    this.isResetFilter = true;
    this.searchInput = '';
  }

  /**
* get filter value
* @param data
*/
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput, this.selectedItem);
  }


  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getVenderTalentIdList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null, this.selectedItem);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
    this.isResetFilter = true;
    this.isResetSearch = false;
    this.searchInput = e;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, e, this.selectedItem);
  }

  public bodyParam: any = {};
  getVenderTalentIdList(page: number, pageSize: number, search: any, type:string) {
    //  let queryString = `EmpID=${this._storage.getUserEmpId()}&page=${page}&pageSize=${pageSize}&search=${search ? search.trim() : ''}${sortParam ? sortParam : ''}${sortTable ? sortTable : ''}`;
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }
    if(type){
      body['Action'] = type;
    }
    if(this.partnerId){
      body['partnerId'] = this.partnerId;
    }
    if (search) {
      body['search'] = search;
    }
    this.bodyParam = body;
    // this._partnerserve.getPartnerTalentIdAssinedList(body).subscribe(
      this._partnerserve.getAssignedTalentIdList(body).subscribe(      
      res => {
        this.candidateList = new MatTableDataSource(res['data']);
        this.paginationData = res['pagination'][0];
      }
    )
  }

  viewTalentIdDetails(th_id: string) {
    let  data = {th_id:th_id,isPartner:true};
    const dialogRef = this.dialog.open(ViewTalentidDetailsPartnerComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'ats-model-talent'],
      data: data,
      disableClose: true
    });
  }

  viewProfilesList(th_id: string) {    
    this.router.navigate(['candidate-profile-list'], { queryParams: { thid: th_id } });
  }

  uploadProfile(th_id: string) {    
    this.router.navigate(['add-candidate-profile'], { queryParams: { thid: th_id } });
  }

   /**
   * radio button get val
   * @param e 
   */
   getFilterVal(e) {
    let val = e.value;
    this.searchInput='';
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getVenderTalentIdList(1, CONSTANTS.PAGE_SIZE, this.searchInput,val);    
  }
}
