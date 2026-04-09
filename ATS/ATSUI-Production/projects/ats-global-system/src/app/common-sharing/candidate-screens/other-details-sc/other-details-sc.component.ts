import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Subscription } from 'rxjs';
import { CommonPdfViewerInternalComponent } from '../../modals/common-pdf-viewer-internal/common-pdf-viewer-internal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/ats-global-system/src/environments/environment';
@Component({
  selector: 'app-other-details-sc',
  templateUrl: './other-details-sc.component.html',
  styleUrls: ['./other-details-sc.component.scss']
})


export class OtherDetailsScComponent implements OnInit {
  @Input() appearance: string = 'outline';
  @Input() formClass: string = 'form-outline-ats';
  public otherDetailsform: UntypedFormGroup = new UntypedFormGroup({});
  public otherTabSubmitSubs: Subscription;
  displayedColumns: string[] = ['quest', 'ans', 'comment'];
  public candidateOtherDetails: any = {
    locationPreferenceName: 'Noida',
    strengthsImprovementArea: '.net',
    techAreaImprove: 'backend'
  };
  @Input() public candidateReferenceDetails: any = [];
  @Input() public candidateQuestionareDetails: any = [];
  @Input() public otherInformation: any = [];
  @Input() public typeLeader: any = [];
  refrredTableColumns: string[] = ['Name', 'Email', 'Mobile', 'Designation', 'Organization'];
  constructor(
    private dialog:MatDialog,
    private http:HttpClient
  ) { }

  public isHideAllControl: boolean = true;
  public isFinalSumbit: boolean = false;
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }
  viewConsentDocument(elm:any={}){
    debugger
      this.http.get(`${environment.apiMainUrlNet}Dashboard/downloadCommonpdfPath?cid=${elm?.cid}&pdfid=${elm?.PdfIdConsent}`, { responseType: 'blob' }).subscribe(
            res => {
               elm['title'] = 'Preview Document';
               elm['documentName'] = elm?.PdfNameConsent;
               elm['pdfPreviewData'] = res;
            const dialogRef = this.dialog.open(CommonPdfViewerInternalComponent, {
              panelClass: ['ats-model-wrap', 'ats-model-full-screen'],
              data: elm,
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100%',
              width: '100%'
            });
            dialogRef.afterClosed().subscribe(
              res => {
              }
            );
            })

  }

}
