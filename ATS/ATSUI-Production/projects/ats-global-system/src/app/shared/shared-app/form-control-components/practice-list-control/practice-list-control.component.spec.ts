import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeListControlComponent } from './practice-list-control.component';

describe('PracticeListControlComponent', () => {
  let component: PracticeListControlComponent;
  let fixture: ComponentFixture<PracticeListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
