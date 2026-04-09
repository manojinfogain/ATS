import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashSearch'
})
export class DashSearchPipe implements PipeTransform {

  transform(value: any, searchInput: any): any {
    if(!value || !searchInput){
      return value;
    }
    return value.filter( comList => 
      comList.talent_id.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1);
   // return null;
  }

}

