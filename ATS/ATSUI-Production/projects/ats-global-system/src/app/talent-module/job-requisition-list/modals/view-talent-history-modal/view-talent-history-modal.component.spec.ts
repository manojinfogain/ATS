import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTalentHistoryModalComponent } from './view-talent-history-modal.component';

describe('ViewTalentHistoryModalComponent', () => {
  let component: ViewTalentHistoryModalComponent;
  let fixture: ComponentFixture<ViewTalentHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTalentHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTalentHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
