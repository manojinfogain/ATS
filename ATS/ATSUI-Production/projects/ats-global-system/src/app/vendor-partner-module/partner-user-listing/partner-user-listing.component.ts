import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { CONSTANTS } from 'projects/ats-global-system/src/app/core/constant/constants';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { GetSetStorageService } from 'projects/ats-global-system/src/app/core/services/get-set-storage.service';
import { PartnerService } from '../partner.service';
import { ConfirmationDialogComponent } from 'projects/ats-global-system/src/app/shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { UserActiveDeactiveComponent } from '../modals/user-active-deactive/user-active-deactive.component';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GetLocationInfo } from '../../core/common/getLocationInfo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partner-user-listing',
  templateUrl: './partner-user-listing.component.html',
  styleUrls: ['./partner-user-listing.component.scss']
})
export class PartnerUserListingComponent implements OnInit,OnDestroy {
  displayedColumns = ['PartnerName','email','remark', 'status', 'action'];
  public userData: any = {};
  public searchInput: string = '';
  public paginationData: any;
  public candidateList: any = [];
  public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public isResetFilter: boolean = false;
  public sortParam: string = '';
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  private refreshSubscription: Subscription = new Subscription();
  constructor(
    public dialog: MatDialog,
    private _storage: GetSetStorageService,
    private _partnerserve: PartnerService,
    private _router:Router,
    private _fb:UntypedFormBuilder,
    private _share:ShareService,
    private getLocInfo: GetLocationInfo
  ) {
  }

  ngOnInit() {
    this.showHideLocWise();
    this.refreshSubscription = this._share.detectSwitchLoc.subscribe(
      get => {
        this.showHideLocWise();
      }
    )
    this.filterFormInit();
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
    
 
    this.getVenderUserList(1, CONSTANTS.PAGE_SIZE, null,null);
    this.showHideTableCol();
  }

  /**
   * show table Coulmn location wise
   */
  showHideTableCol() {
    if(this.isLocationIndia){
      this.displayedColumns = ['PartnerName','email','remark', 'status', 'action'];
    }
    else if(this.isLocationUS){
      this.displayedColumns  = ['PartnerName','Name','email','contact','remark', 'status', 'action'];
    }
    else{
      this.displayedColumns= ['PartnerName','email','remark', 'status', 'action'];
    }
   
  }

  ngOnDestroy(): void {
    if(this.refreshSubscription){
      this.refreshSubscription.unsubscribe();
    }
  }
  /***
 * filter form Init
 */
filterFormInit() {
  this.sortFormFilter = this._fb.group({
    PartnerID: [[]]
  })
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
  this.sortParam = data;
  this.jumpFirstPage = false;
  this.jumpFirstPage = true;
  this.getVenderUserList(1, CONSTANTS.PAGE_SIZE,this.searchInput,data);
}


  /**
 * pagination method
 * @param pageEvent 
 */
  getPagingData(pageEvent: any) {
    this.getVenderUserList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null,this.sortParam);
  }

  /***
   * search
   */
  getSearchValueKey(e: any) {
     this.isResetFilter = true;
     this.isResetSearch = false;
     this.sortParam = '';
     this.searchInput = e;
     this.jumpFirstPage = false;
     this.jumpFirstPage = true;
    this.getVenderUserList(1, CONSTANTS.PAGE_SIZE, e,this.sortParam);
  }
  public bodyParam: any = {};
  getVenderUserList(page: number, pageSize: number, search: any, sortParam: any) {
    debugger
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.PartnerID && sortParam?.PartnerID?.length !== 0) {
      let Ids = sortParam?.PartnerID?.filter(n => n);
      body['PartnerID'] = Ids.toString();
    }
    this.bodyParam = body;
    this._partnerserve.getPartnerUserList(body).subscribe(
      res => {
        this.candidateList = res['data'];
        this.paginationData = res['pagination'][0];
      }
    )
  }

  

  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.status == 1 ? 'deactivate' : 'activate'} <span class='u-name'>${data?.PartnerName}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeStatusUser(data, event)
      }
      else {
        event.source.checked = data?.status === 1;
      }
    });
  }
  /***
   * open modal for status remark
   */
  changeStatusUser(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Active' : 'Deactive';
    elm['statusForUpdate'] = event.source.checked === true ? 1 : 0;
    elm['type']= 1;
    const dialogRef = this.dialog.open(UserActiveDeactiveComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'talent-transfers-mod', 'active-inc-modal'],
      data: elm,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
      //  this.paginatorCompRef.paginator.pageIndex = 0;
        this.jumpFirstPage = false;
        this.jumpFirstPage = true;
       this.getVenderUserList(1, CONSTANTS.PAGE_SIZE,  this.searchInput,this.sortParam);
      }
      else {
        event.source.checked = elm?.status === 1;
      }
    });
  }

  resendPasswordEmail(data:any){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to send reset password mail to <span class='u-name'>${data?.Email}</span> ?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._partnerserve.resetPassPartnerUser(data.Id,data?.Email).subscribe(
          res => {
            this._share.showAlertSuccessMessage.next(res);
          }
        )
      }
      else {
      }
    });
  }


  gotoUser():void{
    this._router.navigate(['user-registration'])
  }

}
