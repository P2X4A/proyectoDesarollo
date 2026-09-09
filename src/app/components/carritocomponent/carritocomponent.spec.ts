import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter, RouterModule } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Carritocomponent } from './carritocomponent';
import { CartService } from '../../services/cart.service';

describe('Carritocomponent', () => {
  let component: Carritocomponent;
  let fixture: ComponentFixture<Carritocomponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      declarations: [Carritocomponent],
      imports: [FormsModule, RouterModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Carritocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no confirma con datos vacíos y muestra error inline (sin alert)', () => {
    const cart = TestBed.inject(CartService);
    cart.agregarProducto({
      id: 1,
      title: 'Producto 1',
      price: 100000,
      description: 'Desc',
      category: 'Tecnología',
      image: 'https://example.com/img.jpg',
    });
    component.ngOnInit();

    component.nombre = '  ';
    component.direccion = '';
    component.telefono = '';
    component.confirmarCompra();

    expect(component.checkoutError).toBe('Completa tus datos antes de confirmar la compra.');
    expect(component.pedidoConfirmado).toBeNull();
    expect(cart.obtenerHistorial()).toHaveLength(0);
  });

  it('confirma con datos válidos y limpia el error', () => {
    const cart = TestBed.inject(CartService);
    cart.agregarProducto({
      id: 1,
      title: 'Producto 1',
      price: 100000,
      description: 'Desc',
      category: 'Tecnología',
      image: 'https://example.com/img.jpg',
    });
    component.ngOnInit();

    component.nombre = 'Ana Pérez';
    component.direccion = 'Calle 100 #7-33';
    component.telefono = '3001234567';
    component.confirmarCompra();

    expect(component.checkoutError).toBeNull();
    expect(component.pedidoConfirmado?.total).toBe(108000);
    expect(component.mostrarFormulario).toBe(false);
  });

  it('irAConfirmar no abre el formulario con carrito vacío', () => {
    component.irAConfirmar();
    expect(component.mostrarFormulario).toBe(false);
  });
});
