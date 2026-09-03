import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Crearproductocomponent } from './crearproductocomponent';

describe('Crearproductocomponent', () => {
  let component: Crearproductocomponent;
  let fixture: ComponentFixture<Crearproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Crearproductocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Crearproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
