import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredPartnerDetailsComponent } from './registered-partner-details.component';

describe('RegisteredPartnerDetailsComponent', () => {
  let component: RegisteredPartnerDetailsComponent;
  let fixture: ComponentFixture<RegisteredPartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredPartnerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredPartnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
