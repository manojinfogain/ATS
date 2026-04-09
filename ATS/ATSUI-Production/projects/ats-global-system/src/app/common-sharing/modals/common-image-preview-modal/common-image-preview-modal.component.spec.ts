import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonImagePreviewModalComponent } from './common-image-preview-modal.component';

describe('CommonImagePreviewModalComponent', () => {
  let component: CommonImagePreviewModalComponent;
  let fixture: ComponentFixture<CommonImagePreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonImagePreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonImagePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
