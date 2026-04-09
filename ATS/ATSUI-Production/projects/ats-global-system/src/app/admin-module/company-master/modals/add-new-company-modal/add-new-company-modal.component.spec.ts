import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCompanyModalComponent } from './add-new-company-modal.component';

describe('AddNewCompanyModalComponent', () => {
  let component: AddNewCompanyModalComponent;
  let fixture: ComponentFixture<AddNewCompanyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCompanyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCompanyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
