import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeIeControlComponent } from './practice-ie-control.component';

describe('PracticeIeControlComponent', () => {
  let component: PracticeIeControlComponent;
  let fixture: ComponentFixture<PracticeIeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeIeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeIeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
