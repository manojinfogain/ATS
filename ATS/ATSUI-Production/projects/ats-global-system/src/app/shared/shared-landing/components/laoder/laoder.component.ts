import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-laoder',
  templateUrl: './laoder.component.html',
  styleUrls: ['./laoder.component.scss']
})
export class LaoderComponent implements OnInit {

  constructor( private _spinner:NgxSpinnerService){

  }

  ngOnInit(): void {
   // this._spinner.show();
  }

}
