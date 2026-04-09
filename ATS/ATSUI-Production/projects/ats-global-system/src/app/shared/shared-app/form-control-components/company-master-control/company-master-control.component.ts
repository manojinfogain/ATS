import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { distinctUntilChanged,debounceTime } from 'rxjs';

@Component({
  selector: 'app-company-master-control',
  templateUrl: './company-master-control.component.html',
  styleUrls: ['./company-master-control.component.scss']
})
export class CompanyMasterControlComponent implements OnInit {
  @Input() public formControlOpt: UntypedFormControl = new UntypedFormControl();
  public FilterCtrl: UntypedFormControl = new UntypedFormControl();
  public searchInput: string;
  @Input() public listData:any = [];
  @Input() placeholder:string = 'Search';
  @Input() title:string = 'Company';
  @Input() required:boolean = false;
  @Input() filterIds:any = [];
  @Output() getValFromControl = new EventEmitter<any>();
  @Input() outline:boolean = false;
  @Input() public formFieldAppearance:string = "legacy";
  @Input() public floatLabel:string = "auto";
  @Input() public isAllOption:boolean = false;
  @Input() public isOther:boolean = false;
  @Input() public isDataParent:boolean = false;
  @Input() public isClientSearch:boolean = false;
  constructor(private _intCommonServe:GlobalApisService) { }

  ngOnInit(): void {
    let queryParam:string = '';
    if(!this.isDataParent){
      this.getDaata(queryParam);
    }
    if(!this.isClientSearch){
      this.FilterCtrl.valueChanges.
    pipe(
      distinctUntilChanged(),
      debounceTime(500)
    ).subscribe(
      val => {
        this.searchInput = val;
        let queryParam:string = 'name='+val;
        this.getDaata(queryParam);
       
      }
    )
    }
    else{
      this.FilterCtrl.valueChanges
       // .pipe(distinctUntilChanged(), debounceTime(100))
        .subscribe((val) => {
          this.searchInput = val;
        });
    }
    
   
  }

  getDaata(queryParam:string): void {
    this._intCommonServe.getCompanyListPaging(queryParam).subscribe(
      res => {
        this.listData = res['data'];
        
      }
    );
  }

   // get id
   getSelectId(event) {
    
    this.getValFromControl.emit(event.source.value)
  }
}
