import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { Actualizarproductocomponent } from './actualizarproductocomponent';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({ selector: 'app-ruta-destino', standalone: false, template: '' })
class RutaDestinoStub {}

const PRODUCTO_STUB = {
  id: 1,
  title: 'Producto 1',
  price: 50000,
  description: 'Descripción',
  category: 'Tecnología',
  image: 'https://example.com/img.jpg',
  source: 'api' as const,
};

function configure(arId: string) {
  return TestBed.configureTestingModule({
    imports: [FormsModule, RouterModule],
    providers: [
      provideRouter([{ path: 'listar-producto', component: RutaDestinoStub }]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => arId } } },
      },
      {
        provide: ProductStoreService,
        useValue: {
          loadAll: vi.fn(),
          loading: signal(false).asReadonly(),
          getById: vi.fn().mockReturnValue({ ...PRODUCTO_STUB }),
        },
      },
    ],
    declarations: [Actualizarproductocomponent, RutaDestinoStub],
  }).compileComponents();
}

describe('Actualizarproductocomponent', () => {
  let component: Actualizarproductocomponent;
  let fixture: ComponentFixture<Actualizarproductocomponent>;

  beforeEach(async () => {
    await configure('1');

    fixture = TestBed.createComponent(Actualizarproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('precarga el formulario con el producto del id de la ruta', () => {
    fixture.detectChanges();
    expect(component.producto.nombre).toBe('Producto 1');
    expect(component.producto.precio).toBe(50000);
  });

  it('muestra error si el id de la ruta no es válido', async () => {
    TestBed.resetTestingModule();
    await configure('abc');

    const badFixture = TestBed.createComponent(Actualizarproductocomponent);
    await badFixture.whenStable();

    expect(badFixture.componentInstance.errorMsg).toBe('Publicación no encontrada.');
  });
});
