import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiApprovDocumentsModalComponent } from './recrui-approv-documents-modal.component';

describe('RecruiApprovDocumentsModalComponent', () => {
  let component: RecruiApprovDocumentsModalComponent;
  let fixture: ComponentFixture<RecruiApprovDocumentsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecruiApprovDocumentsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiApprovDocumentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
