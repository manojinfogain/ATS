import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListControlComponent } from './account-list-control.component';

describe('AccountListControlComponent', () => {
  let component: AccountListControlComponent;
  let fixture: ComponentFixture<AccountListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
