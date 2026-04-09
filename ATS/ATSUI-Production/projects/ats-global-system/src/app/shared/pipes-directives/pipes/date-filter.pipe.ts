import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';
import { GlobalMethod } from '../../../core/common/global-method';

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


@Pipe({
  name: 'dateTimezone'
})
export class TimezonePipe implements PipeTransform {

  transform(value: any, format: string, timeZone: string =null): any {
    if (!value) {
      return value;
    }
    if (!timeZone) {
      timeZone = GlobalMethod.getTimezone();
    }
    return moment(value).tz(timeZone).format(`${format} z`);
  }

}

@Pipe({
  name: 'timezoneName'
})
export class TimezoneNamePipe implements PipeTransform {

  transform(value: any, timeZone: string = null): any {
    if (!value) {
      return value;
    }
    if (!timeZone) {
      timeZone = GlobalMethod.getTimezone();
    }
    return moment.tz(timeZone).zoneName();
  }

}


@Pipe({
  name: 'dateUTCTime'
})
export class DateUTCTimePipe implements PipeTransform {

  transform(value: any, format: string, timeZone: string =null): any {
    if (!value) {
      return value;
    }
    if (!timeZone) {
      timeZone = GlobalMethod.getTimezone();
    }
    //return moment(value).tz(timeZone).format(`${format}`);
    return moment.utc(value).tz(timeZone).format(format);
  }

}
