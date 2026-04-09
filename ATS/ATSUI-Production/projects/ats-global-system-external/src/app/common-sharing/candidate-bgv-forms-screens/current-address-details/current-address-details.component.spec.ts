import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAddressDetailsComponent } from './current-address-details.component';

describe('CurrentAddressDetailsComponent', () => {
  let component: CurrentAddressDetailsComponent;
  let fixture: ComponentFixture<CurrentAddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentAddressDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
