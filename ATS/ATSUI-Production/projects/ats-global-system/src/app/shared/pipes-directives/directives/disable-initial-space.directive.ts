import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[disableInitialSpace]'
})
export class DisableInitialSpaceDirective {
  constructor(private elRef : ElementRef){}
  @HostListener("keydown",['$event'])
  onInputChange(event){
      if(event.keyCode === 32 &&  event.target.selectionStart === 0)
          event.preventDefault();
  }

}


@Directive({
  selector: '[disableSpace]'
})
export class DisableSpaceDirective {
  constructor(private elRef : ElementRef){}
  @HostListener("keydown",['$event'])
  onInputChange(event){
      if(event.keyCode === 32)
          event.preventDefault();
  }

}
