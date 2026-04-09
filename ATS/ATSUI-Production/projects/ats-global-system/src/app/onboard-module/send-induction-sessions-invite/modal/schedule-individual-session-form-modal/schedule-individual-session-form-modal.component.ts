import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { OnboardService } from '../../../onboard.service';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
@Component({
  selector: 'app-schedule-individual-session-form-modal',
  templateUrl: './schedule-individual-session-form-modal.component.html',
  styleUrls: ['./schedule-individual-session-form-modal.component.scss']
})
export class ScheduleIndividualSessionFormModalComponent implements OnInit {
  public scheduleIndividualSessionForm: UntypedFormGroup = new UntypedFormGroup({});
  displayedColumns: string[] = ['eventName', 'startTime', 'endTime', 'duration', 'dojRangeFrom', 'dojRangeTo', 'candi', 'spoc'];
  public sessionDataSource = [];
  public today = new Date();
  public FilterCtrlAddlCandidates: UntypedFormControl = new UntypedFormControl();
  public searchInputAddlCandidates: string;
  constructor(
    public dialogRef: MatDialogRef<ScheduleIndividualSessionFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _onboardServ: OnboardService,
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getJoiningItineraryList(this.data?.joiningLocationId);    
    this.FilterCtrlAddlCandidates.valueChanges.subscribe(
      val => {
        this.searchInputAddlCandidates = val;
      }
    );
  }

  /***
     * FormInit
     */
  formInit() {
    this.scheduleIndividualSessionForm = this._fb.group(
      {
        eventId: [null, [Validators.required]],
        startTimeHours: [null, [Validators.required]],
        startTimeMint: [null, [Validators.required]],
        endTimeHours: [null, [Validators.required]],
        endTimeMint: [null, [Validators.required]],
        dateOfInvite: [this.data?.dateOfInvite, [Validators.required]],
        spocPersonId: [null, [Validators.required]],
        candList: [null, [Validators.required]],
      }
    );
  }

  //get itinerarty event list
  public joiningItineraryList: any = [];
  getJoiningItineraryList(locId: number) {
    this._onboardServ.GetJoiningItineraryList(locId).subscribe(
      res => {
        this.joiningItineraryList = res['JoiningItineraryListEvent'];
      }
    )
  }

  //on select of event 
  selectEvent(val: any) {
    let filterByEventId = this.joiningItineraryList?.filter(d => d.EventId == val?.value);
    this.setValueOnSelectionEvent(filterByEventId[0]);
  }

  setValueOnSelectionEvent(obj: any) {
    if (obj) {
      let spocIDs = [];
      obj?.JoiningItineraryListMeetingSpoc?.forEach(ele => {
        spocIDs.push(ele?.EmpId);
      });
      this.scheduleIndividualSessionForm.patchValue({
        startTimeHours: obj?.StartTime.split(":")[0],
        startTimeMint: obj?.StartTime.split(":")[1],
        endTimeHours: obj?.EndTime.split(":")[0],
        endTimeMint: obj?.EndTime.split(":")[1],
        spocPersonId: spocIDs
        });
      }
  }


    getControl(name: string) {
      return this.scheduleIndividualSessionForm.get(name);
    }

    /**
     * submit
     */
    submitRequest(form: UntypedFormGroup) {
      form.markAllAsTouched();
      
      if (form.valid) {
        let formValue = form.value;
        let itineraryFormList: any = [];
        let spocPersonList: any = [];
        let addCandidateListList: any = [];
        let objEvent = {
          Id: formValue['eventId'],
          InviteDate: GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + formValue['startTimeHours'] + ":" + formValue['startTimeMint'] + ":00",
          InviteDateUTC: GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + formValue['startTimeHours'] + ":" + formValue['startTimeMint'] + ":00"),
          InviteEndDate: GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + formValue['endTimeHours'] + ":" + formValue['endTimeMint'] + ":00",
          InviteEndDateUTC: GlobalMethod.convertToUTCDateTime(GlobalMethod.formatDate(formValue['dateOfInvite']) + " " + formValue['endTimeHours'] + ":" + formValue['endTimeMint'] + ":00"),
          InviteDateDuration: this.joiningItineraryList.filter(d => d?.EventId == formValue['eventId'])[0]?.Duration
        };
        itineraryFormList.push(objEvent);
        formValue['spocPersonId']?.forEach(key => {
          let objSpoc = {
            Id: formValue['eventId'],
            EmpId: key?.toString()
          };
          spocPersonList.push(objSpoc);
        });
        formValue['candList']?.forEach(key => {
          let objCandiList = {
            Id: formValue['eventId'],
            EmpId: key?.toString()
          };
          addCandidateListList.push(objCandiList);
        });
        let body = {};
        // body['CandidateEmpIds'] = formValue['candList']?.toString();
        if (this.data?.dateOfJoining) {
          body['JoiningDate'] = GlobalMethod.formatDate(this.data?.dateOfJoining);
        }
        if (formValue['dateOfInvite']) {
          body['InviteDate'] = GlobalMethod.formatDate(formValue['dateOfInvite']);
        }
        if (this.data?.joiningLocationId) {
          body['locationId'] = this.data?.joiningLocationId;
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

    closeModal(): void {
      this.dialogRef.close();
    }

  }


