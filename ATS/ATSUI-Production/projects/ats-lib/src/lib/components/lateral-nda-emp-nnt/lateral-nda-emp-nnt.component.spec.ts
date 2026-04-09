import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralNDAEmpNNTComponent } from './lateral-nda-emp-nnt.component';

describe('LateralNDAEmpNNTComponent', () => {
  let component: LateralNDAEmpNNTComponent;
  let fixture: ComponentFixture<LateralNDAEmpNNTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateralNDAEmpNNTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateralNDAEmpNNTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
