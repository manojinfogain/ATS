import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuListControlComponent } from './du-list-control.component';

describe('DuListControlComponent', () => {
  let component: DuListControlComponent;
  let fixture: ComponentFixture<DuListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
