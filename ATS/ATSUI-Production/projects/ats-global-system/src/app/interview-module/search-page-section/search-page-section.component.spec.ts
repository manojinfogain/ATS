import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPageSectionComponent } from './search-page-section.component';

describe('SearchPageSectionComponent', () => {
  let component: SearchPageSectionComponent;
  let fixture: ComponentFixture<SearchPageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchPageSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
