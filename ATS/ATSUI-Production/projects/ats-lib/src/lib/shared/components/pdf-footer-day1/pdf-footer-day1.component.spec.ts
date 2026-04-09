import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFooterDay1Component } from './pdf-footer-day1.component';

describe('PdfFooterDay1Component', () => {
  let component: PdfFooterDay1Component;
  let fixture: ComponentFixture<PdfFooterDay1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfFooterDay1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFooterDay1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
