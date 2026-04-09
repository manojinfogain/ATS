import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTalentAssigneeModalComponent } from './update-talent-assignee-modal.component';

describe('UpdateTalentAssigneeModalComponent', () => {
  let component: UpdateTalentAssigneeModalComponent;
  let fixture: ComponentFixture<UpdateTalentAssigneeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTalentAssigneeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTalentAssigneeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
