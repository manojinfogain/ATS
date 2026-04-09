import { Directive, EventEmitter, ElementRef, HostListener, Output } from '@angular/core';
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
  @Output() appClickOutside = new EventEmitter<MouseEvent>(); 
 
  constructor(private elementRef: ElementRef) {}
 
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
 
      // Check if the click was outside the element
      if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
        // console.log(event) 
         this.appClickOutside.emit(event);
      }
  }

}
