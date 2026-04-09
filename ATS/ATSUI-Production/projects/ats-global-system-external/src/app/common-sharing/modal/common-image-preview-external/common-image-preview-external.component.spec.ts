import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonImagePreviewExternalComponent } from './common-image-preview-external.component';

describe('CommonImagePreviewExternalComponent', () => {
  let component: CommonImagePreviewExternalComponent;
  let fixture: ComponentFixture<CommonImagePreviewExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonImagePreviewExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonImagePreviewExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
