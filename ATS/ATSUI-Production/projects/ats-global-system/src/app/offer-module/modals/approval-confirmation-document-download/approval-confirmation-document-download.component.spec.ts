import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalConfirmationDocumentDownloadComponent } from './approval-confirmation-document-download.component';

describe('ApprovalConfirmationDocumentDownloadComponent', () => {
  let component: ApprovalConfirmationDocumentDownloadComponent;
  let fixture: ComponentFixture<ApprovalConfirmationDocumentDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalConfirmationDocumentDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalConfirmationDocumentDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
