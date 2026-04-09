import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvEmploymentDetailsComponent } from './bgv-employment-details.component';

describe('BgvEmploymentDetailsComponent', () => {
  let component: BgvEmploymentDetailsComponent;
  let fixture: ComponentFixture<BgvEmploymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvEmploymentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvEmploymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
