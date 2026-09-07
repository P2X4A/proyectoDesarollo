import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Contenidocomponent } from './components/contenidocomponent/contenidocomponent';
import { Crearproductocomponent } from './components/crearproductocomponent/crearproductocomponent';
import { Listarproductocomponent } from './components/listarproductocomponent/listarproductocomponent';
import { Actualizarproductocomponent } from './components/actualizarproductocomponent/actualizarproductocomponent';
import { Eliminarproductocomponent } from './components/eliminarproductocomponent/eliminarproductocomponent';
import { Categoriascomponent } from './components/categoriascomponent/categoriascomponent';
import { Mercadoplaycomponent } from './components/mercadoplaycomponent/mercadoplaycomponent';

import { Carritocomponent } from './components/carritocomponent/carritocomponent';
import { Miscomprascomponent } from './components/miscomprascomponent/miscomprascomponent';
import { Buscarcomponent } from './components/buscarcomponent/buscarcomponent';


const routes: Routes = [
  { path: '', component: Contenidocomponent },
  { path: 'crear-producto', component: Crearproductocomponent },
  { path: 'listar-producto', component: Listarproductocomponent },
  { path: 'actualizar-producto/:id', component: Actualizarproductocomponent },
  { path: 'eliminar-producto/:id', component: Eliminarproductocomponent },
  { path: 'categoria', component: Categoriascomponent },
  { path: 'categoria/:nombre', component: Categoriascomponent },
  { path: 'mercado-play', component: Mercadoplaycomponent },
  { path: 'carrito', component: Carritocomponent },
  { path: 'mis-compras', component: Miscomprascomponent },
  { path: 'buscar', component: Buscarcomponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
