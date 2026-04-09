import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Pipe({
  name: 'decodeEntity'
})
export class DecodeEntityPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }
  transform(value: any, args?: any): any {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.documentElement.textContent;
  }

}
