import { Component, Input, OnInit } from '@angular/core';
import { GetSetStorageService } from 'projects/ats-global-system-external/src/app/core/services/get-set-storage.service';

@Component({
  selector: 'lib-pdf-header-day1',
  templateUrl: './pdf-header-day1.component.html',
  styleUrls: ['./pdf-header-day1.component.css']
})
export class PdfHeaderDay1Component implements OnInit {
  @Input() public formId:number = 0;
  @Input() public rightTextHeader:string = 'Acceptable Use of Asset Policy';
  @Input() public isRightTextHide:boolean = true;
  @Input() public locationId:number = 0;
  constructor(
    private _storage:GetSetStorageService
  ) { }

  ngOnInit(): void {
    let userData = this._storage.getSetUserData();
    debugger
    if(userData?.LocationID && (this.formId == 18 || this.formId == 25)){
      this.locationId = userData.LocationID
    }
   
  }

}
