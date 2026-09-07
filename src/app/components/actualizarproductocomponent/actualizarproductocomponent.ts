import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto/producto.service';

@Component({
  selector: 'app-actualizarproductocomponent',
  standalone: false,
  templateUrl: './actualizarproductocomponent.html',
  styleUrl: './actualizarproductocomponent.css',
})
export class Actualizarproductocomponent implements OnInit {
  productoId!: number;

  producto = {
    nombre: '',
    precio: 0,
    categoria: '',
    descripcion: '',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productoService: ProductoService,
  ) {}

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtenerProductoPorId(this.productoId).subscribe({
      next: (prod: Producto) => {
        this.producto = {
          nombre: prod.titulo,
          precio: prod.precio,
          categoria: prod.categoria,
          descripcion: prod.descripcion,
        };
      },
      error: (err) => console.error('Error al cargar producto', err),
    });
  }

  onSubmit() {
    this.productoService.actualizarProducto(this.productoId, {
      titulo: this.producto.nombre,
      precio: Number(this.producto.precio),
      categoria: this.producto.categoria,
      descripcion: this.producto.descripcion,
      imagen: '',
    }).subscribe({
      next: () => {
        alert('Producto actualizado exitosamente');
        this.router.navigate(['/listar-producto']);
      },
      error: (err) => {
        console.error('Error al actualizar producto', err);
        alert('No se pudo actualizar el producto.');
      },
    });
  }
}
