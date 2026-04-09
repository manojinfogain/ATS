import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortbyalpha'
})
export class SortbyalphaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value
    }

    if (args.toLowerCase() == "ae") {
      let arryaAlpha = ["a", "b", "c", "d", "e"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        return (sortA + sortB + sortC + sortD + sortE);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    //F-J
    if (args.toLowerCase() == "fj") {
      let arryaAlpha = ["f", "g", "h", "i", "j"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        return (sortA + sortB + sortC + sortD + sortE);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    //K-O
    if (args.toLowerCase() == "ko") {
      let arryaAlpha = ["k", "l", "m", "n", "o"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        return (sortA + sortB + sortC + sortD + sortE);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    //K-O
    if (args.toLowerCase() == "ko") {
      let arryaAlpha = ["k", "l", "m", "n", "o"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        return (sortA + sortB + sortC + sortD + sortE);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    //P-T
    if (args.toLowerCase() == "pt") {
      let arryaAlpha = ["p", "q", "r", "s", "t"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        return (sortA + sortB + sortC + sortD + sortE);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    //U-Z
    if (args.toLowerCase() == "uz") {
      let arryaAlpha = ["u", "v", "w", "x", "y", "z"]
      return value.filter(it => {
        let sortA = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[0]);
        let sortB = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[1]);
        let sortC = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[2]);
        let sortD = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[3]);
        let sortE = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[4]);
        let sortF = it.candidateName.charAt(0).toLowerCase().includes(arryaAlpha[5]);
        return (sortA + sortB + sortC + sortD + sortE + sortF);
      }).sort((a, b) => {
        a = a.candidateName.toLowerCase();
        b = b.candidateName.toLowerCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
      })
    }

    else {
      return value;
    }



  }

}
