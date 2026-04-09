import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTalentIdDetailsTagComponent } from './update-talent-id-details-tag.component';

describe('UpdateTalentIdDetailsTagComponent', () => {
  let component: UpdateTalentIdDetailsTagComponent;
  let fixture: ComponentFixture<UpdateTalentIdDetailsTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTalentIdDetailsTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTalentIdDetailsTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
