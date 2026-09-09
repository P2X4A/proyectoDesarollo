import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Eliminarproductocomponent } from './eliminarproductocomponent';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({ selector: 'app-ruta-destino', standalone: false, template: '' })
class RutaDestinoStub {}

function configure(arId: string, storeStub: Partial<ProductStoreService>) {
  return TestBed.configureTestingModule({
    providers: [
      provideRouter([{ path: 'listar-producto', component: RutaDestinoStub }]),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: { get: () => arId } } },
      },
      { provide: ProductStoreService, useValue: storeStub },
    ],
    declarations: [Eliminarproductocomponent, RutaDestinoStub],
  }).compileComponents();
}

describe('Eliminarproductocomponent', () => {
  let component: Eliminarproductocomponent;
  let fixture: ComponentFixture<Eliminarproductocomponent>;

  beforeEach(async () => {
    await configure('5', {
      loadAll: vi.fn(),
      loading: signal(false).asReadonly(),
      getById: vi.fn().mockReturnValue({ id: 5, title: 'Producto 5' }),
      remove: vi.fn().mockReturnValue(of(true)),
    });

    fixture = TestBed.createComponent(Eliminarproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el nombre del producto a eliminar', () => {
    fixture.detectChanges();
    expect(component.nombre).toBe('Producto 5');
  });

  it('llama a remove con el id de la ruta al confirmar', () => {
    const store = TestBed.inject(ProductStoreService);
    component.onConfirmDelete();
    expect(store.remove).toHaveBeenCalledWith(5);
  });
});
