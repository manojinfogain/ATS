import { Pipe, PipeTransform } from '@angular/core';
import { ToWords } from 'to-words';
@Pipe({
  name: 'convertToWord'
})
export class ConvertToWordPipe implements PipeTransform {
  
  a = [
    '',
    'one ',
    'two ',
    'three ',
    'four ',
    'five ',
    'six ',
    'seven ',
    'eight ',
    'nine ',
    'ten ',
    'eleven ',
    'twelve ',
    'thirteen ',
    'fourteen ',
    'fifteen ',
    'sixteen ',
    'seventeen ',
    'eighteen ',
    'nineteen '];

  b = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'];
  transform(value: unknown,currencyId?:number, ...args: unknown[]): unknown {
    if (value) {
      let num: any = Number(value);
      if (num) {
        let toWords:any = null;
        if(currencyId == 2){
           toWords = new ToWords({
            localeCode: 'en-US',
            converterOptions: {
              currency: true,
              doNotAddOnly: true,
              currencyOptions: { 
                name: '',
                plural: '',
                symbol: '',
                fractionalUnit: {
                  name: '',
                  plural: '',
                  symbol: '',
                },
              }
             
            }
          });
        }
        else{
          toWords = new ToWords({
            localeCode: 'en-IN',
            converterOptions: {
              currency: true,
              ignoreDecimal: true,
              doNotAddOnly: true,
              currencyOptions: { 
                name: '',
                plural: '',
                symbol: '',
                fractionalUnit: {
                  name: '',
                  plural: '',
                  symbol: '',
                },
              }
            }
          });
        }
        // if ((num = num.toString()).length > 9)  { return 'maxumim number exceed'; }
        // const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        // if (!n) {return ''; }
        // let str = '';
        // str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' : '';
        // str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' : '';
        // str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' : '';
        // str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' : '';
        // str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
        // (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' +
        // this.a[n[5][1]]) + '' : '';
        // //this.a[n[5][1]]) + 'rupees' : '';
        // return str;
       
        let words = toWords.convert(num, { currency: true });
        return words;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

}
