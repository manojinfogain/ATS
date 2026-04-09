import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDetailsVisibiltyComponent } from './demand-details-visibilty.component';

describe('DemandDetailsVisibiltyComponent', () => {
  let component: DemandDetailsVisibiltyComponent;
  let fixture: ComponentFixture<DemandDetailsVisibiltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandDetailsVisibiltyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDetailsVisibiltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
