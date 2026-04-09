import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvApprovedByRecModalComponent } from './bgv-approved-by-rec-modal.component';

describe('BgvApprovedByRecModalComponent', () => {
  let component: BgvApprovedByRecModalComponent;
  let fixture: ComponentFixture<BgvApprovedByRecModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvApprovedByRecModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvApprovedByRecModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
