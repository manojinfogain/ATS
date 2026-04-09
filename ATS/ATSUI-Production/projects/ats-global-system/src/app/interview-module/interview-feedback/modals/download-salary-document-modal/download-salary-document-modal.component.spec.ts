import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSalaryDocumentModalComponent } from './download-salary-document-modal.component';

describe('DownloadSalaryDocumentModalComponent', () => {
  let component: DownloadSalaryDocumentModalComponent;
  let fixture: ComponentFixture<DownloadSalaryDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadSalaryDocumentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadSalaryDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
