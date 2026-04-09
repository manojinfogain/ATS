import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (!args) {return value;}
    var re = new RegExp(args.trim(), 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    return value.trim().replace(re, "<mark>" + args.trim() + "</mark>");
}

}
