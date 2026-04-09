import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForIjpComponent } from './apply-for-ijp.component';

describe('ApplyForIjpComponent', () => {
  let component: ApplyForIjpComponent;
  let fixture: ComponentFixture<ApplyForIjpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyForIjpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyForIjpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
