import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CskillsCountryControlComponent } from './cskills-country-control.component';

describe('CskillsCountryControlComponent', () => {
  let component: CskillsCountryControlComponent;
  let fixture: ComponentFixture<CskillsCountryControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CskillsCountryControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CskillsCountryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
