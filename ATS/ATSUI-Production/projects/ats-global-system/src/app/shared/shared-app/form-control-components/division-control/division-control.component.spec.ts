import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionControlComponent } from './division-control.component';

describe('DivisionControlComponent', () => {
  let component: DivisionControlComponent;
  let fixture: ComponentFixture<DivisionControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
