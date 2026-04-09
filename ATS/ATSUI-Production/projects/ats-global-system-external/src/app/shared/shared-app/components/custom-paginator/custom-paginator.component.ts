import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { CONSTANTS } from 'projects/ats-global-system-external/src/app/core/constant/constants';
@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit,OnChanges {
  @Input() public pageSize:number;
  @Input() pageSizeOptions:any=[];
  @Input() total:number;
  @Input() jumpFirstPage:boolean = false;
  @Output() public sendPagingData = new EventEmitter<any>();
  public CONST = CONSTANTS;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.jumpFirstPage){
      this.paginator!.pageIndex = 0;
    }
  }
  pageEvent(pageEvent:any){
    this.sendPagingData.emit(pageEvent);
   // 
   // this.getProfileCandList(pageEvent.pageIndex+1,pageEvent.pageSize,null);
  }

}
