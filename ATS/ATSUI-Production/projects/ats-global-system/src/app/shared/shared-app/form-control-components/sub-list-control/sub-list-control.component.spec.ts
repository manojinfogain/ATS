import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubListControlComponent } from './sub-list-control.component';

describe('SubListControlComponent', () => {
  let component: SubListControlComponent;
  let fixture: ComponentFixture<SubListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
