import { Component } from '@angular/core';

@Component({
  selector: 'app-categoriascomponent',
  standalone: false,
  templateUrl: './categoriascomponent.html',
  styleUrl: './categoriascomponent.css',
})
export class Categoriascomponent {
  categorias = [
    { nombre: 'Vehículos', icono: 'fa-solid fa-car', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Supermercado', icono: 'fa-solid fa-basket-shopping', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Tecnología', icono: 'fa-solid fa-laptop', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Electrodomésticos', icono: 'fa-solid fa-blender', img: 'https://images.unsplash.com/photo-1585659722983-38ca899fc73d?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Hogar y Muebles', icono: 'fa-solid fa-couch', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Deportes y Fitness', icono: 'fa-solid fa-dumbbell', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Belleza y Cuidado Personal', icono: 'fa-solid fa-spa', img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Moda', icono: 'fa-solid fa-shirt', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
    { nombre: 'Juegos y Juguetes', icono: 'fa-solid fa-gamepad', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop' },
  ];
}
