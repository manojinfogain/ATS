import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.scss']
})
export class SalaryDetailsComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public currentSalType: number = 1;
  updateSalDetailsForm: UntypedFormGroup;
  public varReq:boolean = false;
  @Input() public salaryDetails:any = {};
  @Input() public candidateDetails:any = {};
  public amountLabel: string = 'Amount (Fixed)';
  constructor(
    private _fb: UntypedFormBuilder,
    private _share: ShareService
  ) { }

  ngOnInit(): void {
    this.getLabel(this.salaryDetails?.variableType);
  }
 /***
   * label
   */
 getLabel(val: string) {
  if (val == 'M') {
    this.amountLabel = 'Amount (Monthly)';
  } else if (val == 'Q') {
    this.amountLabel = 'Amount (Quarterly)';
  } else if (val == 'B') {
    this.amountLabel = 'Amount (Biannual)';
  } else if (val == 'A') {
    this.amountLabel = 'Amount (Annual)';
  }
  else{
    this.amountLabel = 'Amount';
  }
}
  

}
