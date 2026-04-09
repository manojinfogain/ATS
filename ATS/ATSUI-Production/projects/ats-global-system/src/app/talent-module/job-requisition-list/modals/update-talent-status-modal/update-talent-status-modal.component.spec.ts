import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTalentStatusModalComponent } from './update-talent-status-modal.component';

describe('UpdateTalentStatusModalComponent', () => {
  let component: UpdateTalentStatusModalComponent;
  let fixture: ComponentFixture<UpdateTalentStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTalentStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTalentStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
