import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Eliminarproductocomponent } from './eliminarproductocomponent';

describe('Eliminarproductocomponent', () => {
  let component: Eliminarproductocomponent;
  let fixture: ComponentFixture<Eliminarproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Eliminarproductocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Eliminarproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
