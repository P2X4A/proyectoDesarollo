import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';

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

  constructor(private router: Router, private productoService: ProductoService) {}

  onSubmit() {
    this.productoService.crearProducto({
      titulo: this.producto.nombre,
      precio: Number(this.producto.precio),
      categoria: this.producto.categoria,
      descripcion: this.producto.descripcion,
      imagen: this.producto.imagen,
    }).subscribe({
      next: () => {
        alert('Producto creado exitosamente');
        this.router.navigate(['/listar-producto']);
      },
      error: (err) => {
        console.error('Error al crear producto', err);
        alert('No se pudo crear el producto. ¿Está corriendo `npm run api`?');
      },
    });
  }
}
