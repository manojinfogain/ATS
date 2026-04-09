import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateListControlComponent } from './state-list-control.component';

describe('StateListControlComponent', () => {
  let component: StateListControlComponent;
  let fixture: ComponentFixture<StateListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
