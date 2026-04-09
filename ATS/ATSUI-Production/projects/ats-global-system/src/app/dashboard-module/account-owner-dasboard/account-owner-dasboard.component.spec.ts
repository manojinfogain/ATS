import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOwnerDasboardComponent } from './account-owner-dasboard.component';

describe('AccountOwnerDasboardComponent', () => {
  let component: AccountOwnerDasboardComponent;
  let fixture: ComponentFixture<AccountOwnerDasboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOwnerDasboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOwnerDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
