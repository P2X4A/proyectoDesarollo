import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mercadoplaycomponent } from './mercadoplaycomponent';

describe('Mercadoplaycomponent', () => {
  let component: Mercadoplaycomponent;
  let fixture: ComponentFixture<Mercadoplaycomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Mercadoplaycomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Mercadoplaycomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
