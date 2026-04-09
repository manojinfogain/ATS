import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCandidateComponent } from './address-candidate.component';

describe('AddressCandidateComponent', () => {
  let component: AddressCandidateComponent;
  let fixture: ComponentFixture<AddressCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
