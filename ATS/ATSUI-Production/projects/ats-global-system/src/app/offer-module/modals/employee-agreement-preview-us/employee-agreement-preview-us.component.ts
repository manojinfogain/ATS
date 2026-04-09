import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { GlobalMethod } from '../../../core/common/global-method';
import { environment } from 'projects/ats-global-system/src/environments/environment';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { OfferService } from '../../offer.service';
import { OnboardService } from '../../../onboard-module/onboard.service';
import { GlobalCommonMethodService } from '../../../core/common/global-common-method.service';
import { ShareService } from '../../../core/services/share.service';
import { HttpClient } from '@angular/common/http';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-employee-agreement-preview-us',
  templateUrl: './employee-agreement-preview-us.component.html',
  styleUrls: ['./employee-agreement-preview-us.component.scss']
})
export class EmployeeAgreementPreviewUsComponent implements OnInit,AfterContentInit {
  public encryptParam: string;
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  public height: string = '';
  public zoomLevels = ['auto', 'page-actual', 'page-width', 0.25, 0.50, 1, 1.2, 1.4, 1.6, 1.8, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(
    public dialogRef: MatDialogRef<EmployeeAgreementPreviewUsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _offerService: OfferService,
    private _onboardServ: OnboardService,
    private _globalMethodServe: GlobalCommonMethodService,
    private _share: ShareService,
    private _http: HttpClient,
    private dialog: MatDialog
  ) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

  ngOnInit(): void {
    this.data;
    

  }


  /***
   * preview offer letter method
   */
  public pdfPreviewData: Blob;
  public documentName: string = ''
  previewOfferletter(cid: number) {
    
    let today = new Date();
    let todayDate = GlobalMethod.formatDate(today);
    this.documentName = 'Employee_Agreement_' + this.data?.Name + '_' + this.data?.talent_id + '_' + todayDate
    this._http.get(`${environment.apiMainUrlNet}Offer/DownloadOffer?cid=${cid}&type=A`, { responseType: 'blob' }).subscribe(
      res => {
        this.pdfPreviewData = res
      }
    )
  }

  ngAfterContentInit(): void {
    this.previewOfferletter(this.data.cid);
  }

 
  closeModal(): void {
    this.dialogRef.close();
  }


}
