import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateralNdaImpaqtiveKochiComponent } from './lateral-nda-impaqtive-kochi.component';

describe('LateralNdaImpaqtiveKochiComponent', () => {
  let component: LateralNdaImpaqtiveKochiComponent;
  let fixture: ComponentFixture<LateralNdaImpaqtiveKochiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateralNdaImpaqtiveKochiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateralNdaImpaqtiveKochiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
