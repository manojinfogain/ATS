import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndertakingCurrentAddressComponent } from './undertaking-current-address.component';

describe('UndertakingCurrentAddressComponent', () => {
  let component: UndertakingCurrentAddressComponent;
  let fixture: ComponentFixture<UndertakingCurrentAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndertakingCurrentAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingCurrentAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
