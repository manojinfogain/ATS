import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTalentWiseCountComponent } from './view-talent-wise-count.component';

describe('ViewTalentWiseCountComponent', () => {
  let component: ViewTalentWiseCountComponent;
  let fixture: ComponentFixture<ViewTalentWiseCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTalentWiseCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTalentWiseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
