import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Actualizarproductocomponent } from './actualizarproductocomponent';

describe('Actualizarproductocomponent', () => {
  let component: Actualizarproductocomponent;
  let fixture: ComponentFixture<Actualizarproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Actualizarproductocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actualizarproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
