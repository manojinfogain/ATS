import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuOverallHiringComponent } from './du-overall-hiring.component';

describe('DuOverallHiringComponent', () => {
  let component: DuOverallHiringComponent;
  let fixture: ComponentFixture<DuOverallHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuOverallHiringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuOverallHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
