import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveAccountDrugTestComponent } from './add-remove-account-drug-test.component';

describe('AddRemoveAccountDrugTestComponent', () => {
  let component: AddRemoveAccountDrugTestComponent;
  let fixture: ComponentFixture<AddRemoveAccountDrugTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemoveAccountDrugTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveAccountDrugTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
