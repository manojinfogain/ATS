import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAddressCandidateModalComponent } from './update-address-candidate-modal.component';

describe('UpdateAddressCandidateModalComponent', () => {
  let component: UpdateAddressCandidateModalComponent;
  let fixture: ComponentFixture<UpdateAddressCandidateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAddressCandidateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddressCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
