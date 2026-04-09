
import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from '@angular/forms';
@Directive({
    selector: "[libExpYear]"
  })
  export class LibExpYearDirective {
    constructor(private _el: NgControl) { }
    
    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
     if(parseInt(value) > 60){
      this._el.control.patchValue(null);
     }
      
    }
  }

  @Directive({
    selector: "[libExpMonth]"
  })
  export class LibExpMonthDirective {
    constructor(private _el: NgControl) { }
    
    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
     if(parseInt(value) > 11){
      this._el.control.patchValue(null);
     }
      
    }
  }

  @Directive({
    selector: "[libEmailContainInfogain]"
  })
  export class LibEmailContainInfogain {
    constructor(private _el: NgControl) { }
    
    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
    let uniqEmail = /@infogain.com\s*$/;
    let uniqEmail1 = /@infogain\s*$/;
    let uniqEmail2 = /@igglobal.com\s*$/;
    if (uniqEmail.test(value) || uniqEmail2.test(value)) {
      this._el.control.patchValue(null);
    }
  
      
    }
  }