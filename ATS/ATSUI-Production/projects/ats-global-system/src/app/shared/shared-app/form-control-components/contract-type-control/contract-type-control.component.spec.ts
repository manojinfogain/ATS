import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTypeControlComponent } from './contract-type-control.component';

describe('ContractTypeControlComponent', () => {
  let component: ContractTypeControlComponent;
  let fixture: ComponentFixture<ContractTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractTypeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
