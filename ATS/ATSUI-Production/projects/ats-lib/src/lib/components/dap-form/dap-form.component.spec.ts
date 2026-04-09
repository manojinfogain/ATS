import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DapFormComponent } from './dap-form.component';

describe('DapFormComponent', () => {
  let component: DapFormComponent;
  let fixture: ComponentFixture<DapFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DapFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
