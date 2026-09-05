import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbarcomponent } from './components/navbarcomponent/navbarcomponent';
import { Contenidocomponent } from './components/contenidocomponent/contenidocomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';
import { Categoriascomponent } from './components/categoriascomponent/categoriascomponent';
import { Mercadoplaycomponent } from './components/mercadoplaycomponent/mercadoplaycomponent';
import { Crearproductocomponent } from './components/crearproductocomponent/crearproductocomponent';
import { Actualizarproductocomponent } from './components/actualizarproductocomponent/actualizarproductocomponent';
import { Listarproductocomponent } from './components/listarproductocomponent/listarproductocomponent';
import { Eliminarproductocomponent } from './components/eliminarproductocomponent/eliminarproductocomponent';
import { Carritocomponent } from './components/carritocomponent/carritocomponent';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    App,
    Navbarcomponent,
    Contenidocomponent,
    Footercomponent,
    Categoriascomponent,
    Mercadoplaycomponent,
    Crearproductocomponent,
    Actualizarproductocomponent,
    Listarproductocomponent,
    Eliminarproductocomponent,
    Carritocomponent,
  ],
  imports: [BrowserModule, AppRoutingModule,FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
