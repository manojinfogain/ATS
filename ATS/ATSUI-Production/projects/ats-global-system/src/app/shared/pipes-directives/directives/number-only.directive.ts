
import { AfterViewInit, Directive, ElementRef, HostListener } from "@angular/core";
import { NgControl } from '@angular/forms';

@Directive({
  selector: "[onlyNumber]"
})
export class NumberOnlyDirective {
  constructor(private _el: NgControl) { }
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^0-9]/g, ''));
    
  }
}

@Directive({
  selector: "[onlyDecimalNumber]"
})
export class NumberDecimalDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}


@Directive({
  selector: "[mobNumber]"
})
export class mobileNumberDirective {
  constructor(private _el: NgControl) { }
  
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    // NOTE: use NgControl patchValue to prevent the issue on validation
    this._el.control.patchValue(value.replace(/[^0-9  + -]/g, ''));
  }
}

@Directive({
  selector: '[appRemoveAriaOwns]'
})
export class RemoveAriaOwnsDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.parentElement.removeAttribute('aria-owns');
  }
}




