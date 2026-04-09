import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDocumentModalComponent } from './pending-document-modal.component';

describe('PendingDocumentModalComponent', () => {
  let component: PendingDocumentModalComponent;
  let fixture: ComponentFixture<PendingDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingDocumentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
