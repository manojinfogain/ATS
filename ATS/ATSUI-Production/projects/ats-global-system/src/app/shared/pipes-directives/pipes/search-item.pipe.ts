import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchItem'
})
export class SearchItemPipe implements PipeTransform {

  transform(value: any, searchInput: any): any {

    if(!value || !searchInput){
      return value;
    }
    
    return value.filter( comList => 
       comList.candidateEmail.toLowerCase().indexOf(searchInput.toLocaleLowerCase()) !== -1);
   // return null;
  }

}
