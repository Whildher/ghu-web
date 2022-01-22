import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiqmensualComponent } from './liqmensual.component';

describe('LiqmensualComponent', () => {
  let component: LiqmensualComponent;
  let fixture: ComponentFixture<LiqmensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiqmensualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiqmensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
