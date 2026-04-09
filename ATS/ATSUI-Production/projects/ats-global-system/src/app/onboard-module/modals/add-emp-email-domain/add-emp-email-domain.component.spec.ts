import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmpEmailDomainComponent } from './add-emp-email-domain.component';

describe('AddEmpEmailDomainComponent', () => {
  let component: AddEmpEmailDomainComponent;
  let fixture: ComponentFixture<AddEmpEmailDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmpEmailDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmpEmailDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
