import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsCandidateAddressComponent } from './us-candidate-address.component';

describe('UsCandidateAddressComponent', () => {
  let component: UsCandidateAddressComponent;
  let fixture: ComponentFixture<UsCandidateAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsCandidateAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsCandidateAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
