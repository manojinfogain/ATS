import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerUserRegistrationComponent } from './partner-user-registration.component';

describe('PartnerUserRegistrationComponent', () => {
  let component: PartnerUserRegistrationComponent;
  let fixture: ComponentFixture<PartnerUserRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerUserRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
