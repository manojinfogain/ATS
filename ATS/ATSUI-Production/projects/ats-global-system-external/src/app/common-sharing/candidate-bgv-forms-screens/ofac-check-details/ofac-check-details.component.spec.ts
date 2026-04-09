import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfacCheckDetailsComponent } from './ofac-check-details.component';

describe('OfacCheckDetailsComponent', () => {
  let component: OfacCheckDetailsComponent;
  let fixture: ComponentFixture<OfacCheckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfacCheckDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfacCheckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
