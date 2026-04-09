import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibDocumentViewModalComponent } from './lib-document-view-modal.component';

describe('DocumentViewModalComponent', () => {
  let component: LibDocumentViewModalComponent;
  let fixture: ComponentFixture<LibDocumentViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibDocumentViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibDocumentViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
