import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTalentidStatusComponent } from './update-talentid-status.component';

describe('UpdateTalentidStatusComponent', () => {
  let component: UpdateTalentidStatusComponent;
  let fixture: ComponentFixture<UpdateTalentidStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTalentidStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTalentidStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
