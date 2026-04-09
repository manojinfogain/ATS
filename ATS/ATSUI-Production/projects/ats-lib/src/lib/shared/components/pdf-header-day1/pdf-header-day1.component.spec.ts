import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfHeaderDay1Component } from './pdf-header-day1.component';

describe('PdfHeaderDay1Component', () => {
  let component: PdfHeaderDay1Component;
  let fixture: ComponentFixture<PdfHeaderDay1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfHeaderDay1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfHeaderDay1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
