import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningFormComponent } from './joining-form.component';

describe('JoiningFormComponent', () => {
  let component: JoiningFormComponent;
  let fixture: ComponentFixture<JoiningFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoiningFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoiningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
