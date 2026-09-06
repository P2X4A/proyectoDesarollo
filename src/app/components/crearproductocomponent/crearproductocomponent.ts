import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FakeStoreService } from '../../services/fake-store/fake-store.service';

@Component({
  selector: 'app-crearproductocomponent',
  standalone: false,
  templateUrl: './crearproductocomponent.html',
  styleUrl: './crearproductocomponent.css',
})
export class Crearproductocomponent {
  producto = {
    nombre: '',
    precio: null,
    categoria: '',
    descripcion: '',
    imagen: ''
  };

  constructor(private router: Router, private fakeStoreService: FakeStoreService) {}

  onSubmit() {
    this.fakeStoreService.createProduct({
      title: this.producto.nombre,
      price: Number(this.producto.precio),
      category: this.producto.categoria,
      description: this.producto.descripcion,
      image: this.producto.imagen,
    }).subscribe({
      next: () => {
        alert('Producto creado exitosamente');
        this.router.navigate(['/listar-producto']);
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        alert('No se pudo crear el producto.');
      },
    });
  }
}
