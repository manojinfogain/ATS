import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedJobListingsComponent } from './published-job-listings.component';

describe('PublishedJobListingsComponent', () => {
  let component: PublishedJobListingsComponent;
  let fixture: ComponentFixture<PublishedJobListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedJobListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedJobListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
