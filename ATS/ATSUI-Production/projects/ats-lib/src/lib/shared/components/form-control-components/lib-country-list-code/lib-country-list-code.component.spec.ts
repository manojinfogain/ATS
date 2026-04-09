import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibCountryListCodeComponent } from './lib-country-list-code.component';

describe('LibCountryListCodeComponent', () => {
  let component: LibCountryListCodeComponent;
  let fixture: ComponentFixture<LibCountryListCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibCountryListCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibCountryListCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
