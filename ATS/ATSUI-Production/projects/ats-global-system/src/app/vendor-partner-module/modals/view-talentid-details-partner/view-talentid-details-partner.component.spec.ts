import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTalentidDetailsPartnerComponent } from './view-talentid-details-partner.component';

describe('ViewTalentidDetailsPartnerComponent', () => {
  let component: ViewTalentidDetailsPartnerComponent;
  let fixture: ComponentFixture<ViewTalentidDetailsPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTalentidDetailsPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTalentidDetailsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
