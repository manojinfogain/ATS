import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  public searchTerm$ = new Subject<string>();
  @Output() sendKeyValue = new EventEmitter<string>();
  @Input() placeHolder: string = 'search by keywords';
  @Input() updateOnEvent: any = 'blur';
  @Input() public searchControl: UntypedFormControl = new UntypedFormControl(null,{updateOn:this.updateOnEvent});
  @Input() searchServerSide: boolean = false;
  @Input() isReset?: boolean = false;
  @Input() defaultValue:string = null;
  constructor() { }
  ngOnInit(): void {
    // if (!this.searchServerSide) {
    //   this.searchControl.valueChanges.subscribe(
    //     val => {
    //       if (val) {
    //         this.sendKeyValue.emit(val.trim());
    //       }
    //       else {
    //         this.sendKeyValue.emit('');
    //       }
    //     }
    //   )
    // }
    if(this.searchServerSide){
      this.searchControl.valueChanges.
      pipe(
        distinctUntilChanged(),
      //  debounceTime(500)
      ).subscribe(
        val=>{
          if(val){
            this.sendKeyValue.emit(val.trim());
           }
           else{
            this.sendKeyValue.emit('');
           }

        }
      )
    }
    else{
      this.searchControl.valueChanges.subscribe(
        val=>{
          if(val){
            this.sendKeyValue.emit(val.trim());
           }
           else{
            this.sendKeyValue.emit('');
           }
        }
      )
    }

  }

  getInuputByUser(event: any) {
    let val = event.target.value;
    if (this.searchServerSide) {
    if (val) {
      this.sendKeyValue.emit(val.trim());
    }
    else {
      this.sendKeyValue.emit('');
    }
  }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isReset) {
      this.searchControl.reset(null, { emitEvent: false });
    }
    if(this.defaultValue){
      this.searchControl.patchValue(this.defaultValue);
    }
    
  }

  reset() {
    this.searchControl.reset();
  }

}
