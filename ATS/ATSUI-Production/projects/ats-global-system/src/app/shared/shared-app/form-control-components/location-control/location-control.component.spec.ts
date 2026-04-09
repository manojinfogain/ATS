import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationControlComponent } from './location-control.component';

describe('LocationControlComponent', () => {
  let component: LocationControlComponent;
  let fixture: ComponentFixture<LocationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
