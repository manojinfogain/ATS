import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { OnboardService } from '../onboard.service';
import { GlobalApisService } from '../../core/services/global-apis.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ScheduleIndividualSessionFormModalComponent } from './modal/schedule-individual-session-form-modal/schedule-individual-session-form-modal.component';
import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { GetSetStorageService } from '../../core/services/get-set-storage.service';
@Component({
  selector: 'app-send-induction-sessions-invite',
  templateUrl: './send-induction-sessions-invite.component.html',
  styleUrls: ['./send-induction-sessions-invite.component.scss']
})
export class SendInductionSessionsInviteComponent implements OnInit, AfterViewInit {
  //
  public sendInviteForm: UntypedFormGroup = new UntypedFormGroup({});
  public minDate: any = new Date();
  public minDateEnd: any = new Date();
  displayedColumns: string[] = ['SNum', 'eventName', 'startTime', 'endTime', 'duration', 'dojRangeFrom', 'dojRangeTo', 'candi', 'spoc'];
  public candidateList = [];
  public allCandidateList = [];
  public sessionDataSource = [];
  selection = new SelectionModel<any>(true, []);
  public showTable: boolean = true;
  public FilterCtrlCandidates: UntypedFormControl = new UntypedFormControl();
  public searchInputCandidates: string;
  public FilterCtrlAddlCandidates: UntypedFormControl = new UntypedFormControl();
  public searchInputAddlCandidates: string;

  constructor(
    public dialogRef: MatDialogRef<SendInductionSessionsInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _onboardServ: OnboardService,
    private _share: ShareService,
    public dialog: MatDialog,
    private _globalApiServe: GlobalApisService,
    private _storage: GetSetStorageService
  ) { }

  ngOnInit(): void {
    this.sendInviteFormInit();
    this.getLocation();
    // if (!this.isInducionAlreadyScheduled) {
    this.getList();
    // }
  }

  ngAfterViewInit(): void {
  }



  //form init
  sendInviteFormInit() {
    this.sendInviteForm = this._fb.group({
      DOJ: [this.data?.DateOfJoining ? this.data?.DateOfJoining : null, [Validators.required]],
      candidateLists: [null, [Validators.required]],
      locationId: [this.data?.JoiningLocationID ? this.data?.JoiningLocationID : null, [Validators.required]],
      dateOfInvite: [null, [Validators.required]],
      itineraryFormDetails: this._fb.array([])
    });
    if (this.data?.JoiningLocationID) {
      this.locChanged(this.data?.JoiningLocationID);
    }
    if (this.data?.DateOfJoining) {
      this.inputDoj(this.data?.DateOfJoining);
    }
  }

  /////////  ////////
  get itineraryFormDetailsGroup() {
    return this.sendInviteForm.get('itineraryFormDetails') as UntypedFormArray;
  }
  ///////////End ////////////////

  get formGroupControls() {
    return this.itineraryFormDetailsGroup['controls']
  }

  private setItineraryFormDetails() {
    this.sessionDataSource.forEach((user) => {
      if (this.itineraryFormDetailsGroup?.length < this.sessionDataSource?.length) {
        this.itineraryFormDetailsGroup.push(this.setItineraryFormDetailsArray(user));
      }
    });
  };

  private setItineraryFormDetailsForTalentRMConnect(newRows) {
    newRows.forEach(user => {
      this.itineraryFormDetailsGroup.push(this.setItineraryFormDetailsArray(user));
    })
  };

  private setItineraryFormDetailsArray(user) {
    let spocIDs = [];
    user?.JoiningItineraryListMeetingSpoc?.forEach(ele => {
      spocIDs.push(ele?.EmpId);
    });
    return this._fb.group({
      eventId: [user?.EventId],
      duration: [user?.Duration],
      isSelected: [true],
      startTimeHours: [user?.StartTime.split(":")[0], [Validators.required]],
      startTimeMint: [user?.StartTime.split(":")[1], [Validators.required]],
      endTimeHours: [user?.EndTime.split(":")[0], [Validators.required]],
      endTimeMint: [user?.EndTime.split(":")[1], [Validators.required]],
      candlist: [null],
      spocPersonId: [spocIDs, [Validators.required]],
    });
  }

  // additional candidate validation
  addValidationAddlCandidate() {
    const formGroupControl = this.itineraryFormDetailsGroup['controls'];
    formGroupControl.forEach(ele => {
      if (ele['controls'].eventId?.value == 8 || ele['controls'].eventId?.value == 9) {
        ele['controls'].candlist.addValidators([Validators.required]);
        ele['controls'].candlist.updateValueAndValidity();
      }
    });
  }

  /***
 * clear row
 */
  deleteRowSuc() {
    const control = this.itineraryFormDetailsGroup;
    for (let index = 0; index < control?.length; index++) {
      this.itineraryFormDetailsGroup.clear();
    }
  }

  /***
 * on  delate row
 */
  deleteRow(index: number) {
    const control = this.itineraryFormDetailsGroup;
    control.removeAt(index);
  }

  @ViewChild(MatTable) table: MatTable<any>;
  changeCandi(e: boolean) {
    if (e === false) {
      let row1 = this.sessionDataSource.filter(d => d?.EventId == 8)[0];
      let row2 = this.sessionDataSource.filter(d => d?.EventId == 9)[0];
      let obj = [];
      obj = [...obj, row1, row2];
      this.delete(obj);
    } else if (e === true) {
      const newRows = [];
      newRows.push(JSON.parse(JSON.stringify(this.filterByRMTPConnect[0])));
      newRows.push(JSON.parse(JSON.stringify(this.filterByRMTPConnect[1])));
      this.sessionDataSource = [...this.sessionDataSource, newRows[0], newRows[1]];
      this.setItineraryFormDetailsForTalentRMConnect(newRows)
      this.selection.clear();
      this.sessionDataSource?.forEach(row => {
        this.selection.select(row)
      });
      this.addValidationAddlCandidate();
    }
  }

  delete(row: any): void {
    for (let i = 0; i < row?.length; i++) {
      let index = this.sessionDataSource?.indexOf(row[i], 0);
      if (index > -1) {
        this.sessionDataSource?.splice(index, 1);
        this.sessionDataSource = [...this.sessionDataSource];
        this.deleteRow(this.itineraryFormDetailsGroup['controls']?.length - 1);
      }
    }
  }

  //
  trackByIndex(i, row: any) {
    return i;
  }

  /***
  * get spoc persons Id list
  */
  IsDropdownLoader: boolean = false;
  public IsDropdownLoaderSearch: boolean = false;
  getList() {
    this.IsDropdownLoader = true;
    let userEmp = this._storage.getUserEmpId();
    let filterData = {
      empId: userEmp,
      pagination: false,
      limit: null,
      text: null
    }
    filterData['pagination'] = false;
    filterData['limit'] = null;
    filterData['text'] = null;
    this.serverCallForFetch(filterData);
  }

  public getAllEmp: any = [];
  serverCallForFetch(data) {
    this._globalApiServe.getEmployeeList(data.empId, data.pagination, data.limit, data.text).subscribe(
      res => {
        this.getAllEmp = res['data'];
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
      },
      (error) => {
        this.IsDropdownLoader = false;
        this.IsDropdownLoaderSearch = false;
      }
    );
  }

  //get location list
  public locationList: any = [];
  getLocation() {
    this._globalApiServe.getLocationList().subscribe(
      res => {
        let ids = [1, 2, 4, 5, 11, 16];
        let filterLocation = res['data'].filter(loc => {
          return ids.indexOf(loc.LocID) !== -1;
        })
        this.locationList = filterLocation;
      }
    );
  }

  //on selection of location
  locChanged(val: any) {
    let doIVal = this.getControl('dateOfInvite')?.value;
    this.getInductionInviteDetails(val, doIVal);
    this.getCandidateListBasedOnLocAndDOJ();
    // this.getJoiningItineraryList(val);
  }

  //get induction invite details
  public inductionInviteDetailsList: any = [];
  public isInducionAlreadyScheduled: boolean = false;
  getInductionInviteDetails(locId: number, doI: string) {
    if (locId && doI) {
      this._onboardServ.getInductionInviteDetails(locId, GlobalMethod.formatDate(doI)).subscribe(
        res => {
          this.inductionInviteDetailsList = res['Day1InductionInviteMeetingList'];
          if (this.inductionInviteDetailsList?.length == 0) {
            this.deleteRowSuc();
            this.isInducionAlreadyScheduled = false;
            this.displayedColumns = ['SNum', 'eventName', 'startTime', 'endTime', 'duration', 'candi', 'spoc'];

            this.getJoiningItineraryList(locId);
          } else {
            this.isInducionAlreadyScheduled = true;
            this.displayedColumns = ['SNum', 'eventName', 'startTime', 'endTime', 'duration', 'spoc', 'schedCandiList'];

            this._share.showAlertErrorMessage.next('Induction sessions are already scheduled for this Location & Invite Date.');
          }
        }
      )
    }
  }

  //get itinerarty event list
  public filterByRMTPConnect: any = [];
  public joiningItineraryList: any = [];
  getJoiningItineraryList(locId: number) {
    this._onboardServ.GetJoiningItineraryList(locId).subscribe(
      res => {
        this.joiningItineraryList = res['JoiningItineraryListEvent'];
        let tempArr = this.joiningItineraryList.map(x => JSON.parse(JSON.stringify(x)));
        if (this.candidateList?.length != 0) {
          this.filterByRMTPConnect = this.joiningItineraryList?.filter(d => d?.EventId == 9 || d?.EventId == 8);
          for (let index = 0; index < this.candidateList?.length - 1; index++) {
            tempArr.push(JSON.parse(JSON.stringify(this.filterByRMTPConnect[0])));
            tempArr.push(JSON.parse(JSON.stringify(this.filterByRMTPConnect[1])));
          }
          tempArr = [...tempArr];
          this.sessionDataSource = tempArr;
        }
        this.setItineraryFormDetails()
        this.selection.clear();
        this.sessionDataSource?.forEach(row => {
          this.selection.select(row)
        });
        this.addValidationAddlCandidate();
      }
    )
  }

  /*
  get control Method*/
  getControl(name: string) {
    return this.sendInviteForm.get(name);
  }

  /***
* change date
*/
  changeDate(type: string, event: any) {
    this.minDateEnd = new Date(event.value);
  }

  inputDoj(e: any) {
    let dt = new Date(e);
    this.getControl('dateOfInvite').patchValue(dt);
    this.inputDoInvite(e);
    this.getCandidateListBasedOnLocAndDOJ();
  }

  //on selection of date of invite
  inputDoInvite(e: any) {
    let dt = new Date(e);
    // this.getControl('dateOfInvite').patchValue(dt);
    let locIdVal = this.getControl('locationId')?.value;
    this.getInductionInviteDetails(locIdVal, e);
    // this.getCandidateListBasedOnLocAndDOJ();
  }

  getCandidateListBasedOnLocAndDOJ() {
    let locId = this.getControl('locationId')?.value;
    let doj = this.getControl('DOJ')?.value;
    let dt = new Date(doj);
    if (locId && doj) {
      this._onboardServ.GetCandidateListByJoiningDate(locId, GlobalMethod.formatDate(doj)).subscribe(
        res => {
          let filterByDoj = res['data'];
          this.allCandidateList = filterByDoj;
          this.candidateList = filterByDoj?.filter(d => new Date(d?.DateOfJoining).getTime() == dt.getTime());
          let candIDList = [];
          this.candidateList.forEach(ele => {
            candIDList.push(ele?.empId);
          });

          this.getControl('candidateLists').setValue(candIDList);
          this.FilterCtrlCandidates.valueChanges.subscribe(
            val => {
              this.searchInputCandidates = val;
            }
          );
          this.FilterCtrlAddlCandidates.valueChanges.subscribe(
            val => {
              this.searchInputAddlCandidates = val;
            }
          );
        }
      );
      this.sendInviteForm.markAllAsTouched();
    }
  }

  //open modal to reschedule individual session
  openModalToScheduleIndividualSession() {
    let elm = {
      joiningLocationId: this.getControl('locationId')?.value,
      dateOfInvite: new Date(this.getControl('dateOfInvite')?.value),
      dateOfJoining: new Date(this.getControl('DOJ')?.value),
      candidateList: this.allCandidateList,
      spocPersonsList: this.getAllEmp,
      commonCandidateList: this.candidateList
    };

    const dialogRef = this.dialog.open(ScheduleIndividualSessionFormModalComponent, {
      width: '800px',
      panelClass: ['ats-model-wrap', 'candidate-connect-view-modal'],
      data: elm,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  //
  triggerFunc(id) {
    let names = this.candidateList?.filter(d => d.empId == id)[0];
    return names?.Name;
  }

  //
  triggerFuncAddlCandi(id: any) {
    let names = this.allCandidateList?.filter(d => d.empId == id)[0];
    return names?.Name;
  }

  //flag to identify which control is selected
  patchIsSelected(index: number, selec: boolean) {
    const formGroupControl = this.itineraryFormDetailsGroup['controls'];
    let ctrlIsSelected = formGroupControl[index]['controls'].isSelected;
    ctrlIsSelected.setValue(selec);
    if (selec === false && (formGroupControl[index]['controls'].eventId?.value == 8 || formGroupControl[index]['controls'].eventId?.value == 9)) {
      this.removeValidationAddlCandidates(index);
    } else if (selec === true && (formGroupControl[index]['controls'].eventId?.value == 8 || formGroupControl[index]['controls'].eventId?.value == 9)) {
      this.addValidationAddlCandidatesIndexWise(index);
    } else {

    }
  }

  //
  removeValidationAddlCandidates(i: number) {
    const formGroupControl = this.itineraryFormDetailsGroup['controls'];
    let ctrlAddlCandi = formGroupControl[i]['controls'].candlist;
    ctrlAddlCandi.clearValidators();
    ctrlAddlCandi.updateValueAndValidity();
  }

  addValidationAddlCandidatesIndexWise(i: number) {
    const formGroupControl = this.itineraryFormDetailsGroup['controls'];
    let ctrlAddlCandi = formGroupControl[i]['controls'].candlist;
    ctrlAddlCandi.addValidators([Validators.required]);
    ctrlAddlCandi.updateValueAndValidity();
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.sessionDataSource.length;
    return numSelected === numRows;
  }

  //submit send invite form
  sendInviteFormSubmit(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    this.itineraryFormDetailsGroup.markAllAsTouched();
    if (form.valid && this.itineraryFormDetailsGroup.valid) {
      let formValue = form.value;
      let selectedEvent = this.selection.selected;
      let selectedEventFormsList = form.value.itineraryFormDetails.filter(d => selectedEvent.some(o2 => (d?.eventId === o2?.EventId && d.isSelected === true)));
      let itineraryFormList: any = [];
      let spocPersonList: any = [];
      let addCandidateListList: any = [];
      selectedEventFormsList?.forEach(ele => {
        let objEvent = {
          Id: ele?.eventId,
          InviteDate: GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + ele?.startTimeHours + ":" + ele?.startTimeMint + ":00",
          InviteDateUTC: GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + ele?.startTimeHours + ":" + ele?.startTimeMint + ":00"),
          InviteEndDate: GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + ele?.endTimeHours + ":" + ele?.endTimeMint + ":00",
          InviteEndDateUTC: GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + ele?.endTimeHours + ":" + ele?.endTimeMint + ":00"),
          InviteDateDuration: ele?.duration
        };
        itineraryFormList.push(objEvent);
        ele?.spocPersonId?.forEach(key => {
          let objSpoc = {
            Id: ele?.eventId,
            EmpId: key?.toString()
          };
          spocPersonList.push(objSpoc);
        });
        ele?.candlist?.forEach(key => {
          let objCandiList = {
            Id: ele?.eventId,
            EmpId: key?.toString()
          };
          addCandidateListList.push(objCandiList);
        });
      });
      let commonWithEventId = [];
      for (let i = 0; i < itineraryFormList?.length; i++) {
        for (let j = 0; j < this.candidateList?.length; j++) {
          if (itineraryFormList[i].Id == 8 || itineraryFormList[i].Id == 9) {

          } else {
            commonWithEventId.push({ 'Id': itineraryFormList[i].Id, 'EmpId': this.candidateList[j].empId?.toString() });
          }
        }
      }
      addCandidateListList = addCandidateListList.concat(commonWithEventId);
      let body = {};
      // body['CandidateEmpIds'] = formValue['candidateLists']?.toString();
      if (formValue['DOJ']) {
        body['JoiningDate'] = GlobalMethod.formatDate(formValue['DOJ']);
      }
      if (formValue['dateOfInvite']) {
        body['InviteDate'] = GlobalMethod.formatDate(formValue['dateOfInvite']);
      }
      if (formValue['locationId']) {
        body['locationId'] = formValue['locationId'];
      }
      body['Day1InductionInvites'] = itineraryFormList;
      body['Day1InductionInviteSpoc'] = spocPersonList;
      if (addCandidateListList?.length != 0) {
        body['InductionInviteCandidate'] = addCandidateListList;
      }
      this._onboardServ.submitInductionInviteForm(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }

  }

  //resend invite to candidates
  resendInviteSubmit(form: UntypedFormGroup) {
    
    form.markAllAsTouched();
    if (form.valid) {
      let formValue = form.value;
      let body = {};
      if (formValue['dateOfInvite']) {
        body['InviteDate'] = GlobalMethod.formatDate(formValue['dateOfInvite']);
      }
      if (formValue['locationId']) {
        body['locationId'] = formValue['locationId'];
      }
      this._onboardServ.resendInductionInvite(body).subscribe(
        res => {
          this._share.showAlertSuccessMessage.next(res);
          this.dialogRef.close(true);
        }
      )
    } else {
      this._share.showAlertErrorMessage.next('Please fill all mandatory fields.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }


}

