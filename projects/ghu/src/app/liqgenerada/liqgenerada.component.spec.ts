import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiqgeneradaComponent } from './liqgenerada.component';

describe('LiqgeneradaComponent', () => {
  let component: LiqgeneradaComponent;
  let fixture: ComponentFixture<LiqgeneradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiqgeneradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiqgeneradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
