import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentHiringDetailsComponent } from './permanent-hiring-details.component';

describe('PermanentHiringDetailsComponent', () => {
  let component: PermanentHiringDetailsComponent;
  let fixture: ComponentFixture<PermanentHiringDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermanentHiringDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermanentHiringDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
