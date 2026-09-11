# Clon de Mercado Libre Colombia 🇨🇴

Réplica educativa de la página de inicio de **Mercado Libre Colombia**, desarrollada con **Angular 22** (proyecto no-standalone, con `AppModule`). Incluye navbar y footer fieles al diseño original, catálogo de productos, categorías, sección de streaming y carrito de compras funcional.

## ✨ Funcionalidades

- **Navbar estilo ML Colombia**: logo, buscador funcional (navega a `/buscar?q=`), ubicación, categorías reales, Ofertas, Cupones, Supermercado, Moda, Mercado Play, Vender, Mis compras y Ayuda.
- **Contenido principal**: carrusel de banners, atajo a Mercado Play, categorías destacadas, ofertas del día y productos más buscados.
- **Búsqueda** (`/buscar`): filtra el catálogo por título, categoría y descripción, sin distinguir mayúsculas ni tildes. El término viaja en la URL, así que el enlace se puede compartir.
- **Categorías** (`/categoria`, `/categoria/:nombre`): grilla de categorías y listado de los productos de cada una.
- **Carrito de compras** (`/carrito`): agregar/quitar productos, cantidades, resumen con envío, checkout con formulario y confirmación de pedido. Persiste en `localStorage` y el badge del navbar se actualiza en vivo.
- **Mis compras** (`/mis-compras`): historial de los pedidos confirmados.
- **Mercado Play** (`/mercado-play`): catálogo de 12 películas con datos de la API de OMDb (póster, sinopsis, rating, reparto) y reproductor de trailers de YouTube embebido.
- **CRUD de productos**: crear, listar, actualizar y eliminar publicaciones. Como Fake Store API acepta los cambios pero no los guarda entre recargas, `ProductStoreService` los conserva en `localStorage` y los combina con el catálogo de la API.
- **Footer estilo ML Colombia**: beneficios, métodos de pago (Visa, Mastercard, PSE, Efecty, Nequi…), links de ayuda/PQR, redes oficiales y aviso legal.

## 🛠️ Tecnologías

| Tecnología | Uso |
| --- | --- |
| **Angular 22** + Angular CLI 22 | Framework principal (módulos, routing, `HttpClient`, `FormsModule`) |
| TypeScript + RxJS | Lógica y consumo de APIs con observables |
| Bootstrap 5.3 | Layout y componentes (vía CDN) |
| Font Awesome 6 | Iconografía (vía CDN) |
| Animate.css 4 | Animaciones de entrada (vía CDN) |
| Fake Store API | Catálogo de productos (`https://fakestoreapi.com`) |
| OMDb API | Fichas de películas de Mercado Play (`https://www.omdbapi.com`) |
| YouTube (embed) | Reproductor de trailers en Mercado Play |
| `localStorage` | Persistencia del carrito, el historial de pedidos y los cambios del CRUD |

## 📁 Estructura

```text
public/mercado_free.ico         # Favicon
src/
├── index.html                  # CDN: Bootstrap, Font Awesome, Animate.css
├── styles.css                  # Estilos globales
└── app/
    ├── environments/           # URLs base y API keys (OMDb, FakeStore)
    ├── models/                 # Interfaces del carrito (producto, item, pedido)
    ├── services/
    │   ├── cart.service.ts     # Carrito + checkout (localStorage)
    │   ├── fake-store/         # Cliente HTTP de Fake Store API
    │   ├── omdb/               # Cliente HTTP de OMDb
    │   ├── product-store/      # Catálogo: API + cambios locales, y filtros
    │   └── storage/            # Acceso tipado a localStorage
    └── components/
        ├── navbarcomponent/    # Barra superior (2 filas amarilla/blanca)
        ├── contenidocomponent/ # Home: banners, ofertas, búsquedas
        ├── buscarcomponent/    # Resultados de /buscar?q=
        ├── categoriascomponent/# Grilla de categorías y productos por categoría
        ├── mercadoplaycomponent/
        ├── crear/listar/actualizar/eliminar-productocomponent/
        ├── carritocomponent/
        ├── miscomprascomponent/# Historial de pedidos
        └── footercomponent/    # 5 bloques estilo ML Colombia
```

## 🚀 Desarrollo

```bash
npm install
npx ng serve
```

Abre `http://localhost:4200/`. La app se recarga sola al editar archivos.

## 📦 Build

```bash
npx ng build
```

Los artefactos quedan en `dist/`.

## 👥 Ramas

- `master` — rama principal, con todo el trabajo integrado.
- `ramaHTMLComponents` — maquetación, estilos y conexión de APIs.
- `DanielAya_CarritoCompra` — carrito de compras (ya integrado).

---
Proyecto con fines académicos. No afiliado a MercadoLibre, Inc.
