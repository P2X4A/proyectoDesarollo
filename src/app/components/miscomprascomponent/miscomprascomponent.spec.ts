import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { Miscomprascomponent } from './miscomprascomponent';
import { CartService } from '../../services/cart.service';

describe('Miscomprascomponent', () => {
  let component: Miscomprascomponent;
  let fixture: ComponentFixture<Miscomprascomponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideRouter([])],
      declarations: [Miscomprascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Miscomprascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el historial de pedidos del carrito', async () => {
    // Se siembra el historial ANTES de crear el componente, igual que en
    // runtime real (ngOnInit corre antes del primer render).
    const cart = TestBed.inject(CartService);
    cart.agregarProducto({
      id: 1,
      title: 'Producto 1',
      price: 100000,
      description: 'Desc',
      category: 'Tecnología',
      image: 'https://example.com/img.jpg',
    });
    cart.confirmarCompra({
      nombre: 'Ana',
      direccion: 'Calle 1',
      telefono: '3000000000',
      medioPago: 'pse',
      fechaEstimadaEntrega: new Date().toISOString(),
    });

    fixture.destroy();
    fixture = TestBed.createComponent(Miscomprascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();

    expect(component.pedidos).toHaveLength(1);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Pedido #');
  });
});
