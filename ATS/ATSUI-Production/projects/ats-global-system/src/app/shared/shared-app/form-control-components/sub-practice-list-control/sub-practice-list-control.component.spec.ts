import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPracticeListControlComponent } from './sub-practice-list-control.component';

describe('SubPracticeListControlComponent', () => {
  let component: SubPracticeListControlComponent;
  let fixture: ComponentFixture<SubPracticeListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubPracticeListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubPracticeListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
