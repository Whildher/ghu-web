import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomelecComponent } from './nomelec.component';

describe('NomelecComponent', () => {
  let component: NomelecComponent;
  let fixture: ComponentFixture<NomelecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NomelecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomelecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
