import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[appCapitalizeWords]'
})
export class CapitalizeWordsDirective {
  constructor(private _el: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
  //  const capitalizedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    const capitalizedValue = value.replace(/\b\w+/g, word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
   this._el.control.patchValue(capitalizedValue);
// this._el.control.patchValue(value.replace(/[^0-9  + -]/g, ''));
  }
}