import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDComponent } from './notification-d.component';

describe('NotificationDComponent', () => {
  let component: NotificationDComponent;
  let fixture: ComponentFixture<NotificationDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
