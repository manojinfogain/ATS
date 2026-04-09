import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesscardFormComponent } from './accesscard-form.component';

describe('AccesscardFormComponent', () => {
  let component: AccesscardFormComponent;
  let fixture: ComponentFixture<AccesscardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccesscardFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesscardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
