import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredPartnerStatusComponent } from './registered-partner-status.component';

describe('RegisteredPartnerStatusComponent', () => {
  let component: RegisteredPartnerStatusComponent;
  let fixture: ComponentFixture<RegisteredPartnerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredPartnerStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredPartnerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
