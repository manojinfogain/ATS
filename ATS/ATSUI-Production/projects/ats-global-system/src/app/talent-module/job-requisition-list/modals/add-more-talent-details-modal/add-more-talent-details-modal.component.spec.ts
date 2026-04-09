import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreTalentDetailsModalComponent } from './add-more-talent-details-modal.component';

describe('AddMoreTalentDetailsModalComponent', () => {
  let component: AddMoreTalentDetailsModalComponent;
  let fixture: ComponentFixture<AddMoreTalentDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreTalentDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreTalentDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
