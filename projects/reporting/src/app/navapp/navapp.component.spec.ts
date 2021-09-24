import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavappComponent } from './navapp.component';

describe('NavappComponent', () => {
  let component: NavappComponent;
  let fixture: ComponentFixture<NavappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavappComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
