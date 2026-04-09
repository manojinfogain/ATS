import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureGlobalCComponent } from './signature-global-c.component';

describe('SignatureGlobalCComponent', () => {
  let component: SignatureGlobalCComponent;
  let fixture: ComponentFixture<SignatureGlobalCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureGlobalCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureGlobalCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
