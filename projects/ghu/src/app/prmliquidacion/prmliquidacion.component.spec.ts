import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrmliquidacionComponent } from './prmliquidacion.component';

describe('PrmliquidacionComponent', () => {
  let component: PrmliquidacionComponent;
  let fixture: ComponentFixture<PrmliquidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrmliquidacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrmliquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
