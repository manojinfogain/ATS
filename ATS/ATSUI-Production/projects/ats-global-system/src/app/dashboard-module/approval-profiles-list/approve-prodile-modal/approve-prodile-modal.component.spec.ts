import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveProdileModalComponent } from './approve-prodile-modal.component';

describe('ApproveProdileModalComponent', () => {
  let component: ApproveProdileModalComponent;
  let fixture: ComponentFixture<ApproveProdileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveProdileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveProdileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
