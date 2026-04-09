import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullfillmentdatelapseTalentModalComponent } from './fullfillmentdatelapse-talent-modal.component';

describe('FullfillmentdatelapseTalentModalComponent', () => {
  let component: FullfillmentdatelapseTalentModalComponent;
  let fixture: ComponentFixture<FullfillmentdatelapseTalentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullfillmentdatelapseTalentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullfillmentdatelapseTalentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
