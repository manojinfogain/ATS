import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPendingDocumentsComponent } from './upload-pending-documents.component';

describe('UploadPendingDocumentsComponent', () => {
  let component: UploadPendingDocumentsComponent;
  let fixture: ComponentFixture<UploadPendingDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPendingDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPendingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
