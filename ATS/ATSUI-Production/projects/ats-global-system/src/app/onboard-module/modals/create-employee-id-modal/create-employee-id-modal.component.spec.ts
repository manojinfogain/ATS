import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeIdModalComponent } from './create-employee-id-modal.component';

describe('CreateEmployeeIdModalComponent', () => {
  let component: CreateEmployeeIdModalComponent;
  let fixture: ComponentFixture<CreateEmployeeIdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeIdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeIdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
