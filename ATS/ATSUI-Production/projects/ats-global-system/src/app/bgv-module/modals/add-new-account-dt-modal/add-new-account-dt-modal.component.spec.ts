import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAccountDtModalComponent } from './add-new-account-dt-modal.component';

describe('AddNewAccountDtModalComponent', () => {
  let component: AddNewAccountDtModalComponent;
  let fixture: ComponentFixture<AddNewAccountDtModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAccountDtModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAccountDtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
