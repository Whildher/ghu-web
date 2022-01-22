import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiqdetalleComponent } from './liqdetalle.component';

describe('LiqdetalleComponent', () => {
  let component: LiqdetalleComponent;
  let fixture: ComponentFixture<LiqdetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiqdetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiqdetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
