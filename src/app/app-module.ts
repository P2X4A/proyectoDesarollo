import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
  ],
  imports: [BrowserModule, CommonModule, FormsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App],
})
export class AppModule {}
