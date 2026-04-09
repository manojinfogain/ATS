import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallHiringSourceTypeComponent } from './overall-hiring-source-type.component';

describe('OverallHiringSourceTypeComponent', () => {
  let component: OverallHiringSourceTypeComponent;
  let fixture: ComponentFixture<OverallHiringSourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallHiringSourceTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallHiringSourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
