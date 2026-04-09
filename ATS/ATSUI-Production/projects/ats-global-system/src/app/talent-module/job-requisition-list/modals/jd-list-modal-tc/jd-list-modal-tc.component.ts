import { Component, OnInit, AfterViewInit,Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ShareService } from 'projects/ats-global-system/src/app/core/services/share.service';
import { TalentService } from '../../../talent.service';
import { forkJoin } from 'rxjs';
import { GlobalApisService } from 'projects/ats-global-system/src/app/core/services/global-apis.service';
import { Options } from '@angular-slider/ngx-slider';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-jd-list-modal-tc',
  templateUrl: './jd-list-modal-tc.component.html',
  styleUrls: ['./jd-list-modal-tc.component.scss']
})
export class JDListModalTcComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JDListModalTcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _fb: UntypedFormBuilder,
    public _share: ShareService,
    private _talentServ: TalentService,
    private _globApiServ: GlobalApisService
  ) { }
  public searchInputPrimarySkill: string;
  public filterCtrlPrimarySkill: UntypedFormControl = new UntypedFormControl();
  ngOnInit(): void {
   if(this.data['TalentCubeCode'] && this.data['TCRole']){
    
  //  this.getJDByTCROLE(1,5);
  this.getJDByTCROLE(this.data['TalentCubeCode'],this.data['TCRole']);
   }
   
  }
  public tcJDDetails:any = {};
  getJDByTCROLE(TalentCubeCode:number,TCRole:number){
    this._globApiServ.getJDByTCAndRole(TalentCubeCode,TCRole).subscribe(
      res=>{
        this.tcJDDetails = res['data'][0];
      }
    )
   }

  closeModal(): void {
    this.dialogRef.close();
  }

}
