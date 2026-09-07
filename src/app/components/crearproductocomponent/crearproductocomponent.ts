import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({
  selector: 'app-crearproductocomponent',
  standalone: false,
  templateUrl: './crearproductocomponent.html',
  styleUrl: './crearproductocomponent.css',
})
export class Crearproductocomponent {
  private store = inject(ProductStoreService);
  private router = inject(Router);

  producto = {
    nombre: '',
    precio: null as number | null,
    categoria: '',
    descripcion: '',
    imagen: '',
  };

  isSaving = false;
  errorMsg: string | null = null;

  onSubmit() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.errorMsg = null;

    this.store
      .create({
        title: this.producto.nombre.trim(),
        price: Number(this.producto.precio) || 0,
        description: this.producto.descripcion.trim(),
        category: this.producto.categoria,
        image:
          this.producto.imagen.trim() ||
          'https://picsum.photos/seed/nuevo-producto/600/600',
      })
      .subscribe({
        next: () => this.router.navigate(['/listar-producto']),
        error: () => {
          this.isSaving = false;
          this.errorMsg = 'No se pudo publicar. Inténtalo de nuevo.';
        },
      });
  }
}
