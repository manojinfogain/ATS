import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { GlobalMethod } from 'projects/ats-global-system/src/app/core/common/global-method';
import { COMMON_CONST } from 'projects/ats-global-system/src/app/core/constant/common.const';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { GlobalCommonMethodService } from 'projects/ats-global-system/src/app/core/common/global-common-method.service';
import { PanelSelfNominationService } from '../../panel-self-nomination.service';
import { an } from '@fullcalendar/core/internal-common';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import * as moment from 'moment-timezone'; // Ensure you have moment-timezone installed

@Component({
  selector: 'app-add-new-slot',
  templateUrl: './add-new-slot.component.html',
  styleUrls: ['./add-new-slot.component.scss']
})
export class AddNewSlotComponent implements OnInit {
  public slotCtrl:UntypedFormControl = new UntypedFormControl();
  public addSlotForm:UntypedFormGroup = new UntypedFormGroup({});
  constructor(
    public dialogRef: MatDialogRef<AddNewSlotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: UntypedFormBuilder,
    private _share: ShareService,
    private  _PanelServe:PanelSelfNominationService,
    private _storage: GetSetStorageService
  ) { }

  public gridBucketingList: any = [];
  public isEmpDroDown: boolean = true;
  public startTimeData:any = {};
  public endTimeData:any = {};
  public userData: any = {};
  ngOnInit() {
    this.data;
    debugger;
    this.userData = this._storage.getSetUserData();
    let timeZone = GlobalMethod.getTimezone();
    debugger
    this.addSlotForm = this._fb.group({
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      timeZone:[timeZone?timeZone:'Asia/Kolkata', Validators.required]
    })
    this.setEndTime(10,0);
    this.setStartTime(9,0);
    this.addSlotForm.get('startTime')?.valueChanges.subscribe((val) => {
      if(val){
        this.startTimeData = val;
        let startHours = val?.hour;
        let startMin = val?.minute;
        debugger
        // if(startHours == 23 && startMin < 45){
        //   this.setEndTime(0,startMin);
        //  // return false;
        // }
        // else{
        //   this.setEndTime(startHours+1,startMin);
        // }
        this.setEndTime(startHours+1,startMin);
        
        let endHours =  this.addSlotForm.get('endTime')?.value?.hour;
        debugger
        if(endHours != 0){
          this.validationStartEndTime();
        }
      }
     
    })

    this.addSlotForm.get('endTime')?.valueChanges.subscribe((val) => {
      if(val){
        let startHours =  this.addSlotForm.get('startTime')?.value?.hour;
        let startMin = this.addSlotForm.get('startTime')?.value?.minute;
       
        debugger
        if(startHours != 0){
          this.validationStartEndTime();
        }
      }
     
    })
  }

    //control for form
    getControl(name: string) {
      return this.addSlotForm.get(name);
    }

  validationStartEndTime(){
    let startHours = this.addSlotForm.get('startTime')?.value?.hour;
    let startMin = this.addSlotForm.get('startTime')?.value?.minute;
    let endHours =  this.addSlotForm.get('endTime')?.value?.hour;
    let endtMin =  this.addSlotForm.get('endTime')?.value?.minute;

      // Convert start time and end time to minutes
    let startTimeInMinutes = startHours * 60 + startMin;
     let endTimeInMinutes = endHours * 60 + endtMin;

      // Calculate the difference in minutes
     let differenceInMinutes = endTimeInMinutes - startTimeInMinutes;

    if(startHours == endHours && startMin == endtMin){
      this._share.showAlertErrorMessage.next("Time Change Not Allowed: Start time and end time can not be same.");
      this.setEndTime(startHours+1,startMin);
      return false;
    }
    else if(startHours > endHours){
      this._share.showAlertErrorMessage.next("Start time can not be greater than end time.");
      this.setEndTime(startHours+1,startMin);
      return false;
    }
    
   //  Check if the difference is exactly 60 minutes
   //less than 60 minutes should not be allowed
  else if (differenceInMinutes < 60) {
   // this._share.showAlertErrorMessage.next("Time slots less than 60 minutes are not allowed.");
 //   this._share.showAlertErrorMessage.next("Time Change Not Allowed: The gap between the start time and end time must be exactly 1 hour.");
    this.setEndTime(startHours+1,startMin);
    return false;
  } 
  }
  /***
   * reset 
   */

  setStartTime(hour?:number,minute?:number) {
    this.addSlotForm.get('startTime').patchValue({hour: hour, minute: minute});
  }
  setEndTime(hour?:number,minute?:number) {
    this.addSlotForm.get('endTime').patchValue({hour: hour, minute: minute});
  }


  

  /***
  * close dialog
  */
  closeModal(): void {
    this.dialogRef.close();
  }

  time = { hour: 13, minute: 30 };
  updateHour(e:any){
    debugger
  }

  /***
   * submit details  Data to server
   */
 addSlot(form:UntypedFormGroup) {
  form.markAllAsTouched();
    if (form.valid) {
      
      let selectedDate = this.data?.selectedDate;
      let formData = form.value;
      let startHours = formData?.startTime?.hour;
      let startMin = formData?.startTime?.minute;
      let endHours =  formData?.endTime?.hour;
      let endtMin =  formData?.endTime?.minute;
      // GlobalMethod.convertToUTCDateTimeByTimzone(intDate, data.interviewDateTimeZone)
      // let startTimeDate=  GlobalMethod.convertToUTCDate(new Date(selectedDate).setHours(startHours,startMin,0));
      // let endTimeDate=  GlobalMethod.convertToUTCDate(new Date(selectedDate).setHours(endHours,endtMin,0));
      let startTimeDate=  GlobalMethod.formatDate(selectedDate) + " " + startHours + ":" + startMin + ":00";
      let endTimeDate= GlobalMethod.formatDate(selectedDate) + " " + endHours + ":" + endtMin + ":00";
      debugger
      let startTimeDateUTC=  GlobalMethod.convertToUTCDateTimeByTimzone(startTimeDate.toString(),formData?.timeZone);
      let endTimeDateUTC=  GlobalMethod.convertToUTCDateTimeByTimzone(endTimeDate.toString(),formData?.timeZone);
      let userEmp = this._storage.getUserEmpId();
      let body = {
        ThId: this.data?.thid,
        PanelEmpId: userEmp,
        SlotDateUTC: GlobalMethod.convertToUTCDate(new Date(selectedDate)),
        ActionDateUTC: GlobalMethod.convertToUTCDate(new Date()),
        TimeZone:formData?.timeZone,
        OffSetDate: GlobalMethod.getOffset(),
        PanelSlotTimeDetails:
          {
            SlotStartTime: startHours+":"+startMin,
            SlotEndTime: endHours+":"+endtMin,
            SlotStartDateUTC: startTimeDateUTC,
            SlotEndDateUTC: endTimeDateUTC,
          }
        
        
      };
      let newSlot = JSON.parse(JSON.stringify(body.PanelSlotTimeDetails));
    // Convert UTC times to local times for the new slot
let newSlotStartLocal = moment.utc(newSlot.SlotStartDateUTC).local().format('YYYY-MM-DD HH:mm:ss');
let newSlotEndLocal = moment.utc(newSlot.SlotEndDateUTC).local().format('YYYY-MM-DD HH:mm:ss');

const slotExists = this?.data?.slotList.some(slot => {
  // Convert existing slot UTC times to local times
  let existingSlotStartLocal = moment.utc(slot.SlotStartDateUTC).local().format('YYYY-MM-DD HH:mm:ss');
  let existingSlotEndLocal = moment.utc(slot.SlotEndDateUTC).local().format('YYYY-MM-DD HH:mm:ss');

  // Compare using local times
  return existingSlotStartLocal === newSlotStartLocal &&
         existingSlotEndLocal === newSlotEndLocal;
});

this._PanelServe.addPanelJobSlotTime(body).subscribe(
  res=>{
    this._share.showAlertSuccessMessage.next(res);
    this.dialogRef.close(true);
  }
)
      // if(!slotExists){
      //   this._PanelServe.addPanelJobSlotTime(body).subscribe(
      //     res=>{
      //       this._share.showAlertSuccessMessage.next(res);
      //       this.dialogRef.close(true);
      //     }
      //   )
      // }
      // else{
      //   this._share.showAlertErrorMessage.next("Slot already exists.");
      // }

     
      
     
    }
    else {
      this._share.showAlertErrorMessage.next("Please fill all mandatory fields.");
    }
  }



}
