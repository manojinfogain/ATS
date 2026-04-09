import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsLibComponent } from './ats-lib.component';

describe('AtsLibComponent', () => {
  let component: AtsLibComponent;
  let fixture: ComponentFixture<AtsLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtsLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtsLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
