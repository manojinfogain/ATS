import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContractDetailsModalComponent } from './update-contract-details-modal.component';

describe('UpdateContractDetailsModalComponent', () => {
  let component: UpdateContractDetailsModalComponent;
  let fixture: ComponentFixture<UpdateContractDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateContractDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContractDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
