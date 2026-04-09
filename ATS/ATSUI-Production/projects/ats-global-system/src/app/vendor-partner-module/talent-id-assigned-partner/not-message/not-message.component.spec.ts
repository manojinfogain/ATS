import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotMessageComponent } from './not-message.component';

describe('NotMessageComponent', () => {
  let component: NotMessageComponent;
  let fixture: ComponentFixture<NotMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
