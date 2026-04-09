import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOwnerControlComponent } from './account-owner-control.component';

describe('AccountOwnerControlComponent', () => {
  let component: AccountOwnerControlComponent;
  let fixture: ComponentFixture<AccountOwnerControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOwnerControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOwnerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
