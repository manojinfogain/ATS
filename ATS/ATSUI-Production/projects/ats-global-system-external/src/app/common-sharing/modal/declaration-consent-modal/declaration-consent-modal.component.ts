import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { CandidateService } from '../../../candidate-module/candidate.service';
import { SignatureCaptureComponent } from '../signature-capture/signature-capture.component';
import { el } from '@fullcalendar/core/internal-common';
import { GetSetStorageService } from '../../../core/services/get-set-storage.service';
import { ShareService } from '../../../core/services/share.service';

@Component({
  selector: 'app-declaration-consent-modal',
  templateUrl: './declaration-consent-modal.component.html',
  styleUrls: ['./declaration-consent-modal.component.scss'],
})
export class DeclarationConsentModalComponent implements OnInit {
  public copy: string = '© Infogain';

  constructor(
    public dialogRef: MatDialogRef<DeclarationConsentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _candidateServe: CandidateService,
    public dialog: MatDialog,
    private share: ShareService,
    private _storage: GetSetStorageService
  ) { }
  public candidatePersonalDetails: any = {};
  ngOnInit(): void {
    this.getPersonalDetails();
  }
  getPersonalDetails() {
    this._candidateServe.getCandidatePersonalDetails(this.data.candidateId).subscribe((res) => {
      this.candidatePersonalDetails = res['data'][0];
    });
  }

  public signFileName: string = '';
  public signFilePath: string = '';
  public todayDate: Date = new Date();
  signImage: any;
  signt(element: any = {}): void {
    element['titleSignModal'] = ' Add Signature';
    element['candidatePersonalDetails'] = this.candidatePersonalDetails;

    const dialogRef = this.dialog.open(SignatureCaptureComponent, {
      width: '500px',
      panelClass: ['ats-model-wrap', 'add-signature-modal'],
      data: element,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.signImage) {
        this.signImage = result?.signImage;
        this.signFileName = result?.signFileName;
        this.signFilePath = result?.signFilePath;
      }
    });
  }

  submitConsent(): void {
    if (!this.signImage) {
      this.share.showAlertErrorMessage.next(
        'Please add your signature before submitting.'
      );
      return;
    } else {
      let body = {};
      body['signFileName'] = this.signFileName;
      body['signFilePath'] = this.signFilePath;
      body['Candidateid'] = this._storage.getCandidateId();

      // this._candidateServe.declarationSubmit(body).subscribe();
      // this.dialogRef.close(true);
      this._candidateServe.declarationSubmit(body).subscribe({
        next: (res) => {
          this.dialogRef.close(true);
        },
       
      });

    }
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
