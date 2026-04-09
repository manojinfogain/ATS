import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

  transform(value: any) {
    var datePipe = new DatePipe("en-US");
    datePipe.transform(value, 'mediumDate');
    //return value;
    console.log("arVal",value)
  }

}
