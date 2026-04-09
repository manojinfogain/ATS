import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[validationSpecialCharacter]'
})
export class ValidationSpecialCharacterDirective {
  constructor(private _el: NgControl) { }
  public allowedCharacter:string = '/^[ A-Za-z0-9_@./#&+-]*$/';
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^A-Za-z0-9  @.]/g, ''));
  }

}

@Directive({
  selector: "[onlyAlphabets]"
})
export class AlphabetsOnlyDirective {
  constructor(private _el: NgControl) { }
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^A-Za-z ]/g, ''));
  }
}


@Directive({
  selector: '[numericAndAlphabets]'
})
export class NumericAndAlphabetsDirective {
  constructor(private _el: NgControl) { }
  public allowedCharacter:string = '/^[ A-Za-z0-9_@./#&+-]*$/';
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^A-Za-z0-9]/g, ''));
  }

}

@Directive({
  selector: '[alphaNumericForAdd]'
})
export class AlphaNumericForAddDirective {
  constructor(private _el: NgControl) { }
  public allowedCharacter:string = '/^[ A-Za-z0-9_@./#&+-]*$/';
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^A-Za-z0-9 &,.-]/g, ''));
  }

}


