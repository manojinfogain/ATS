import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationConsentModalComponent } from './declaration-consent-modal.component';

describe('DeclarationConsentModalComponent', () => {
  let component: DeclarationConsentModalComponent;
  let fixture: ComponentFixture<DeclarationConsentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationConsentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationConsentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
