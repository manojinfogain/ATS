import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordShareComponent } from './password-share.component';

describe('PasswordShareComponent', () => {
  let component: PasswordShareComponent;
  let fixture: ComponentFixture<PasswordShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
