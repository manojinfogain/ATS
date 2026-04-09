import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibiltyTableViewCountComponent } from './visibilty-table-view-count.component';

describe('VisibiltyTableViewCountComponent', () => {
  let component: VisibiltyTableViewCountComponent;
  let fixture: ComponentFixture<VisibiltyTableViewCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisibiltyTableViewCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibiltyTableViewCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
