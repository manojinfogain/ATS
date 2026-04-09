import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewContractsModalComponent } from './add-new-contracts-modal.component';

describe('AddNewContractsModalComponent', () => {
  let component: AddNewContractsModalComponent;
  let fixture: ComponentFixture<AddNewContractsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewContractsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewContractsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
