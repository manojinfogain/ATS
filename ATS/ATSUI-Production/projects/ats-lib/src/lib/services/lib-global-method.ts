import * as moment from 'moment';
export class LibGlobalMethod{
  public static  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public static  formatDateExcel(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return d;
  }

  /**
   * convert local time into UTC for API data
   * @param date 
   */
  public static timeIntoUTC(date) {
    let val = new Date(date).toUTCString();
    return new Date(val).getTime();
  }

 

  public static getTimezone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public static getOffset(){
    return new Date().getTimezoneOffset()
  }

  public static convertToUTCDateTime(date:string){
  //  return new Date().getTimezoneOffset()
  //moment.utc(new Date(intDate)).format()
  return moment.utc(new Date(date)).format("YYYY-MM-DD HH:mm:ss")
  }

  public static generateYearsListBetween(startYear = 2000, endYear) {
    const endDate = endYear || new Date().getFullYear();
    let years = [];
    while (startYear <= endDate) {
      years.push(startYear);
      startYear++;
    }
    return years;
  }

}