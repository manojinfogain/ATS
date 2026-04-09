import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { G5AboveApproverNameList } from 'projects/ats-global-system/src/app/core/constant/g5Above.const';

@Component({
  selector: 'app-add-approver-dailog',
  templateUrl: './add-approver-dailog.component.html',
  styleUrls: ['./add-approver-dailog.component.scss']
})
export class AddApproverDailogComponent implements OnInit,AfterViewInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  @ViewChild('approver', { static: true }) approver;
  public formAprrover:UntypedFormGroup = new UntypedFormGroup({});
  public ApproverList: any = G5AboveApproverNameList;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AddApproverDailogComponent>,
  private fb:UntypedFormBuilder) { }

  ngOnInit(): void {
    this.data?.approver;
    
    if(this.data?.approver.length > 0){
      this.formAprrover = this.fb.group( {
        approvers: new UntypedFormControl(this.data?.approver) 
    });
    }
    else{
      this.formAprrover = this.fb.group( {
        approvers: new UntypedFormControl([]) 
    });
    }
  
  }

  submitForm(form:UntypedFormGroup){
    
    let approver = form.value.approvers;
    this.dialogRef.close(approver);

  }
  ngAfterViewInit(): void {
  }
   /***/

   closeModal(): void {
    this.dialogRef.close();
  }

}
