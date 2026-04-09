import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-found',
  templateUrl: './no-result-found.component.html',
  styleUrls: ['./no-result-found.component.scss']
})
export class NoResultFoundComponent implements OnInit {
  @Input() searchedValue :string ="";
  @Input() noRecordFound :string ="No Record Found";
  constructor() { }

  ngOnInit(): void {
  }

}
