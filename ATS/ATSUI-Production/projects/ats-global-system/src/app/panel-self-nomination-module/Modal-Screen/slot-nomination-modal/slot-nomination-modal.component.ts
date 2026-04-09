import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddNewSlotComponent } from '../add-new-slot/add-new-slot.component';
import { PanelSelfNominationService } from '../../panel-self-nomination.service';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'
import { GlobalMethod } from '../../../core/common/global-method';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../../shared/shared-app/components/confirmation-dialog/confirmation-dialog.component';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-slot-nomination-modal',
  templateUrl: './slot-nomination-modal.component.html',
  styleUrls: ['./slot-nomination-modal.component.scss']
})
export class SlotNominationModalComponent implements OnInit,AfterViewInit {
   // references the #calendar in the template
   @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarApi: Calendar; 
  calendarOptions: CalendarOptions = {
  };
  public ctrl:UntypedFormControl = new UntypedFormControl();
  public date:any = new Date();
 
  displayedColumns: string[] = ['SNum', 'SlotLocal','timezone','Slot','action'];
  constructor(
    public dialogRef: MatDialogRef<SlotNominationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private _fb: UntypedFormBuilder,
    private  _PanelServe:PanelSelfNominationService,
    private _storage: GetSetStorageService,
    private _share:ShareService
  ) { }

  public isAddActionHidden: boolean = true;
  ngOnInit(): void {
    this.data;
    let cc =  moment.utc(this.data?.startDate).local(); 
    let localStartDate = moment.utc(this.data.startDate).local().toDate(); // Convert to local Date object
    let localDateEnd =GlobalMethod.convertUTCToLocalDate(this.data?.endDate);
    let localDateEndFinal = localDateEnd.setDate(localDateEnd.getDate() + 1);
    debugger;
    
    let startDate =GlobalMethod.formatDate(new Date());
     // Check if today's date is greater than endDate
     let today = new Date();
     if (today > new Date(localDateEnd)) {
      this.isAddActionHidden = false;
     // alert('End date is less than today');
      startDate =GlobalMethod.formatDate(localStartDate);
     }
   
    let endDate =GlobalMethod.formatDate(localDateEndFinal);
    debugger
    this.calendarOptions = {
      plugins: [dayGridPlugin,interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      initialView: 'dayGridMonth',
      validRange: {
        start:startDate,
        end:endDate
    //     start: '2024-07-25',
    // end: '2024-07-25'
      }
      
    //  weekends: false,
    // events: [
    //   { title: 'event 1', date: '2024-07-22' },
    //   { title: 'event 2', date: '2024-07-21' }
    // ]
    };
    this.data['selectedDate'] = new Date();
    this.getSlotList();
  }


   public selectedDateUTC: any =GlobalMethod.convertToUTCDate(new Date());
  handleDateClick(arg) {
    this.selectedDateUTC = GlobalMethod.convertToUTCDate(new Date( arg.dateStr));
    this.data['selectedDate'] =  new Date(arg.dateStr);
    this.getSlotList();
    debugger
  //  alert('Date clicked: ' + arg.dateStr);
  }

  

  ngAfterViewInit(): void {
    this.calendarApi;
    let gg= this.calendarComponent.getApi();
    debugger
  }

  /***
   * get the slot list
   **/
  public slotList: any = [];
  getSlotList(){
    let userEmp = this._storage.getUserEmpId();
    this._PanelServe.getPanelSlotDetails(userEmp,this.data?.thid,this.selectedDateUTC).subscribe((res) => {
      this.slotList = res['data'];
    })
  }
  


  /**open modal to add new Panel */
  addNewSlotModal(element: any ={}) {
    element= this.data;
    element['title'] = 'Add New Slot';
    element['slotList']=this.slotList;
    const dialogRef = this.dialog.open(AddNewSlotComponent, {
      //width: '500px',
      panelClass: ['ats-model-wrap','add-new-slot-modal'],
      data: element,
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          this.getSlotList();
        }
      }
    );

  }

  /**
   * delete slot
   */
  deleteSlot(data:any){
    debugger
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'ats-confirm',
      data: {
        headerText: 'Alert',
        message: `Are you sure you want to delete the slot?`,
        buttonText: {
          ok: "Yes",
          cancel: "No"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._PanelServe.deleteSlot(data?.ID).subscribe((res) => {
          this._share.showAlertSuccessMessage.next(res);
          this.getSlotList();
        })
      }
     
    });
  }
  
  closeModal(): void {
    this.dialogRef.close();
  }

}
