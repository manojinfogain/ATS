import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JdPanelConfirmationModalComponent } from './jd-panel-confirmation-modal.component';

describe('JdPanelConfirmationModalComponent', () => {
  let component: JdPanelConfirmationModalComponent;
  let fixture: ComponentFixture<JdPanelConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JdPanelConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JdPanelConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
