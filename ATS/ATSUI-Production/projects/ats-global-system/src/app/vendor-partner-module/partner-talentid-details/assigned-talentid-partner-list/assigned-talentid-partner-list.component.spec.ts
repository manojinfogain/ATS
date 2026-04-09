import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTalentidPartnerListComponent } from './assigned-talentid-partner-list.component';

describe('AssignedTalentidPartnerListComponent', () => {
  let component: AssignedTalentidPartnerListComponent;
  let fixture: ComponentFixture<AssignedTalentidPartnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedTalentidPartnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTalentidPartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
