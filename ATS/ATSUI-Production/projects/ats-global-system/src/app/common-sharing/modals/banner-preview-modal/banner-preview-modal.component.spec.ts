import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerPreviewModalComponent } from './banner-preview-modal.component';

describe('BannerPreviewModalComponent', () => {
  let component: BannerPreviewModalComponent;
  let fixture: ComponentFixture<BannerPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
