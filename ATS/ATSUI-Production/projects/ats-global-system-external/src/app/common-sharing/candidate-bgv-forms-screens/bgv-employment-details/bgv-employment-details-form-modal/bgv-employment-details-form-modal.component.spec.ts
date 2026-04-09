import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvEmploymentDetailsFormModalComponent } from './bgv-employment-details-form-modal.component';

describe('BgvEmploymentDetailsFormModalComponent', () => {
  let component: BgvEmploymentDetailsFormModalComponent;
  let fixture: ComponentFixture<BgvEmploymentDetailsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvEmploymentDetailsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvEmploymentDetailsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
