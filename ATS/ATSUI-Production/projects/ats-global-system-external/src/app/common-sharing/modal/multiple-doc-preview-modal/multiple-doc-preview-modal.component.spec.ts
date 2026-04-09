import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDocPreviewModalComponent } from './multiple-doc-preview-modal.component';

describe('MultipleDocPreviewModalComponent', () => {
  let component: MultipleDocPreviewModalComponent;
  let fixture: ComponentFixture<MultipleDocPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleDocPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleDocPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
