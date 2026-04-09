import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSpecificHiringDetailsComponent } from './location-specific-hiring-details.component';

describe('LocationSpecificHiringDetailsComponent', () => {
  let component: LocationSpecificHiringDetailsComponent;
  let fixture: ComponentFixture<LocationSpecificHiringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationSpecificHiringDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSpecificHiringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
