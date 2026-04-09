import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallHiringOfferToJoiningComponent } from './overall-hiring-offer-to-joining.component';

describe('OverallHiringOfferToJoiningComponent', () => {
  let component: OverallHiringOfferToJoiningComponent;
  let fixture: ComponentFixture<OverallHiringOfferToJoiningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallHiringOfferToJoiningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallHiringOfferToJoiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
