import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractHistoryComponent } from './view-contract-history.component';

describe('ViewContractHistoryComponent', () => {
  let component: ViewContractHistoryComponent;
  let fixture: ComponentFixture<ViewContractHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContractHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
