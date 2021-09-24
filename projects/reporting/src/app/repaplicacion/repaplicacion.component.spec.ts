import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaplicacionComponent } from './repaplicacion.component';

describe('RepaplicacionComponent', () => {
  let component: RepaplicacionComponent;
  let fixture: ComponentFixture<RepaplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepaplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
