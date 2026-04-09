import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Input() form: UntypedFormGroup;
  @Input() required:boolean = false;
  public isTimeZero:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  get interviewTimeMint(){ return this.form.get('interviewTimeMint')};
  
 /**
  * 
  * @param event 
  */
  hoursValid(event) {
    if (event.value == "00") {
      this.isTimeZero = false;
      this.interviewTimeMint.patchValue("-1");
    }
    else {
      this.isTimeZero = true;
      this.interviewTimeMint.patchValue("00");
    }
  }

}
