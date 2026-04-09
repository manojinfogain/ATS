import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerTalentidDetailsComponent } from './partner-talentid-details.component';

describe('PartnerTalentidDetailsComponent', () => {
  let component: PartnerTalentidDetailsComponent;
  let fixture: ComponentFixture<PartnerTalentidDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerTalentidDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerTalentidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
