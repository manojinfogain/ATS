import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApplicationHistoryModalComponent } from './my-application-history-modal.component';

describe('MyApplicationHistoryModalComponent', () => {
  let component: MyApplicationHistoryModalComponent;
  let fixture: ComponentFixture<MyApplicationHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyApplicationHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApplicationHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
