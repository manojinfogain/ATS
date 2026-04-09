import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseOpportunitiesComponent } from './browse-opportunities.component';

describe('BrowseOpportunitiesComponent', () => {
  let component: BrowseOpportunitiesComponent;
  let fixture: ComponentFixture<BrowseOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseOpportunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
