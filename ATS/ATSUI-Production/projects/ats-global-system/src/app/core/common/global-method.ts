import * as moment from 'moment';
export class GlobalMethod{
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

  public static convertToUTCDate(date:any){
    //  return new Date().getTimezoneOffset()
    //moment.utc(new Date(intDate)).format()
    return moment.utc(new Date(date)).format("YYYY-MM-DD HH:mm:ss")
    }


    public static convertUTCToLocalDate(date:any){
      return moment.utc(date).local().toDate(); 
      }

  

  /**
   * convert to utc date time by timezone
   * @param date 
   * @param timezone 
   * @returns 
   */
  public static convertToUTCDateTimeByTimzone(date: string, timezone: string): string {
    // Set the timezone to 'Asia/Kolkata' (or your desired timezone)
    let dateTimeInDifferentTimezone = moment.tz(date, "YYYY-MM-DD HH:mm:ss", false,timezone);
    // Convert to local timezone
    let dateTimeInLocalTimezone = dateTimeInDifferentTimezone.local();
   // Format the date and time
    let formattedDateTime1 = dateTimeInLocalTimezone.format("YYYY-MM-DD HH:mm:ss");
    // Convert to UTC
    let dateTimeInUTC = dateTimeInLocalTimezone.utc();
  
    // Format the date and time
    let formattedDateTime = dateTimeInUTC.format("YYYY-MM-DD HH:mm:ss");
  
    return formattedDateTime;
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
  public static htmlEscape(str) {
    return str
        .replace(/&/g, '&amp')
        .replace(/'/g, '&apos')
        .replace(/"/g, '&quot')
        .replace(/>/g, '&gt')   
        .replace(/</g, '&lt');    
  }

  public static  htmlUnescape(str) {
    return str
        .replace(/&amp/g, '&')
        .replace(/&apos/g, "'")
        .replace(/&quot/g, '"')
        .replace(/&gt/g, '>')   
        .replace(/&lt/g, '<');    
}


}