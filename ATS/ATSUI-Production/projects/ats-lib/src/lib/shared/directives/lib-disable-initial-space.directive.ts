import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[libDisableInitialSpace]'
})
export class LibDisableInitialSpaceDirective {
  constructor(private elRef : ElementRef){}
  @HostListener("keydown",['$event'])
  onInputChange(event){
      if(event.keyCode === 32 &&  event.target.selectionStart === 0)
          event.preventDefault();
  }

}


@Directive({
  selector: '[libDisableSpace]'
})
export class LibDisableSpaceDirective {
  constructor(private elRef : ElementRef){}
  @HostListener("keydown",['$event'])
  onInputChange(event){
      if(event.keyCode === 32)
          event.preventDefault();
  }

}
