import { Component, ViewChild, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DatePipe } from '@angular/common';
import { AddupdatePanelScreenComponent } from './pages/addupdate-panel-screen/addupdate-panel-screen.component';
import { CONSTANTS } from '../../core/constant/constants';
import { PanelSelfNominationService } from '../panel-self-nomination.service';
import { ConfirmationDialogComponent } from '../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { PanelActiveDeactiveComponent } from './pages/panel-active-deactive/panel-active-deactive.component';



@Component({
  selector: 'app-panel-list-screen',
  templateUrl: './panel-list-screen.component.html',
  styleUrls: ['./panel-list-screen.component.scss'],
  providers: [DatePipe]
})
export class PanelListScreenComponent implements OnInit {

  displayedColumns = ['PanelName', 'PanelEmpId','Grade','exp', 'Account', 'Skill','AddedOn','AddedBy','status','action'];
   public searchInput: string;
   public paginationData: any;
   public sortParam: string = '';
   public pazeOption: any = [10, 20, 50, 100];
   public pazeSize: any = 10;
   public jumpFirstPage: boolean = false;
  public isResetSearch: boolean = false;
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public companyList: any = []; 
  @ViewChild(MatSort) sort: MatSort;
  public sortTable: string = '';
  @ViewChild('paginatorRef', { static: true }) paginatorCompRef;
  public sortFormFilter: UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialog: MatDialog,
    private  _PanelServe:PanelSelfNominationService,
    public datepipe: DatePipe,
    private _fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.filterFormInit();
    this.getPanelList(1, CONSTANTS.PAGE_SIZE, null, null);
  }

  filterFormInit(){
    this.sortFormFilter = this._fb.group({
      primarySkill: [[]],
      accountType: [[]],
      experienceRange: [[0, 50]],
    })
  }

  /***
   * reset paging
   */
  resetPagination() {
    this.paginatorCompRef.paginator.pageIndex = 0;
  }

  public bodyParam: any = {};
  public panelList: any = [];
  getPanelList(page: number, pageSize: number, search: any, sortParam: any) {
    this.bodyParam = {};
    let body = {
      page: page,
      pageSize: pageSize,
    }
    if (search) {
      body['search'] = search;
    }
    if (sortParam?.primarySkill && sortParam?.primarySkill?.length !== 0) {
      let Ids = sortParam?.primarySkill?.filter(n => n);
      body['PrimarySkill'] = Ids.toString();
    }
    if (sortParam?.accountType && sortParam?.accountType?.length !== 0) {
      let Ids = sortParam?.accountType?.filter(n => n);
      body['AccountID'] = Ids.toString();
    }
    if (sortParam?.experienceRange && sortParam?.experienceRange?.length !== 0) {
      body['MinExp'] = sortParam?.experienceRange[0];
      body['MaxExp'] = sortParam?.experienceRange[1];
    }
    this.bodyParam = body;
    this._PanelServe.getPanelList(body).subscribe(
      res=>{
       this.panelList = res['data'];
       this.paginationData = res['pagination'][0];
      }
    )
  }

 
  public isResetFilter: boolean = false;
  getSortData(data: string) {
    this.isResetSearch = true;
    this.isResetFilter = false;
    this.searchInput = '';
    this.sortParam = data;
    this.jumpFirstPage = false;
    this.jumpFirstPage = true;
    this.getPanelList(1, CONSTANTS.PAGE_SIZE, this.searchInput, data);
  }
 
  /**
  * pagination method
  * @param pageEvent 
  */
  getPagingData(pageEvent: any) {
    this.getPanelList(pageEvent.pageIndex + 1, pageEvent.pageSize, this.searchInput ? this.searchInput : null,  this.sortParam);
  }

  /***
     * search
     */
  getSearchValueKey(e: any) {
    this.isResetSearch = false;
     this.searchInput = e;
     this.jumpFirstPage = false;
     this.jumpFirstPage = true;
     this.getPanelList(1, CONSTANTS.PAGE_SIZE, e,  this.sortParam);
  }

/**open modal to add new Panel */
  addNewPanelModal(element: any) {
    element['title'] = 'Add New Panel';
    element['action'] = 'N';
    const dialogRef = this.dialog.open(AddupdatePanelScreenComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap','add-update-panel-modal'],
      data: element,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
           this.paginatorCompRef.paginator.pageIndex = 0;
           this.getPanelList(1, CONSTANTS.PAGE_SIZE, null, null);
        }
      }
    );

  }

  /***
   * edit panel
   */
  editPanel(element: any) {
    element['title'] = 'Edit '+element?.PanelName+ ' Details';
    element['action'] = 'U';
    const dialogRef = this.dialog.open(AddupdatePanelScreenComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap','add-update-panel-modal'],
      data: element,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
           this.paginatorCompRef.paginator.pageIndex = 0;
           this.getPanelList(1, CONSTANTS.PAGE_SIZE, null, null);
        }
      }
    );
  }

  /***
   * active/deactive  conform modal
   */

  confirmAlertActiveDeactive(event: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: ` Are you sure you want to ${data.isActive == 1 ? 'deactivate' : 'activate'} <span class='u-name'>${data?.PanelName}</span> ?`,
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
        event.source.checked = data?.isActive === 1;
      }
    });
  }

  /***
   * open modal for status remark
   */
  changeStatusUser(elm: any, event: any) {
    elm['title'] = event.source.checked === true ? 'Active' : 'Deactive';
    elm['statusForUpdate'] = event.source.checked === true ? 1 : 0;
    const dialogRef = this.dialog.open(PanelActiveDeactiveComponent, {
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
        this.getPanelList(1, CONSTANTS.PAGE_SIZE, null, null);
      }
      else {
        event.source.checked = elm?.status === 1;
      }
    });
  }
}
