import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AtsOfferCommonMethodService {

  constructor() { }
  // DGM Calc For NNT
  getDGMCalcValueForNNT(annualCTC,type,conversionRateNew,clientApprovedBillingNew, monthlyCTCNNT,conversionRate,ClientApprovedBilling){
    let obj:any = {};
    if(annualCTC){
      monthlyCTCNNT = annualCTC/12;
    }
    let monthlyCTCLoading = type == 2 ? monthlyCTCNNT : (monthlyCTCNNT*1.11);
    let convertedCTC = conversionRateNew ? monthlyCTCLoading / conversionRateNew : (conversionRate ? monthlyCTCLoading / conversionRate : 0)
    let DGM = clientApprovedBillingNew ? ((clientApprovedBillingNew - convertedCTC)/clientApprovedBillingNew)*100
    : (ClientApprovedBilling != 0 && ClientApprovedBilling != null ? ((ClientApprovedBilling - convertedCTC)/ClientApprovedBilling)*100 : 0);
    obj['monthlyCTCNNT'] = Math.round(monthlyCTCNNT);
    obj['monthlyCTCLoading'] = Math.round(monthlyCTCLoading);
    obj['convertedCTC'] = Math.round(convertedCTC);
    obj['DGM'] = Math.round(DGM);
    return obj;
  }
}
