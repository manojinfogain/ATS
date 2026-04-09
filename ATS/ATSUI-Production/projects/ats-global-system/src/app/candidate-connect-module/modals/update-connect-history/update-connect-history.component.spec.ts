import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConnectHistoryComponent } from './update-connect-history.component';

describe('UpdateConnectHistoryComponent', () => {
  let component: UpdateConnectHistoryComponent;
  let fixture: ComponentFixture<UpdateConnectHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateConnectHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConnectHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
