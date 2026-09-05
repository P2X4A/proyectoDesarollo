# Clon de Mercado Libre Colombia 🇨🇴

Réplica educativa de la página de inicio de **Mercado Libre Colombia**, desarrollada con **Angular 22** (proyecto no-standalone, con `AppModule`). Incluye navbar y footer fieles al diseño original, catálogo de productos, categorías, sección de streaming y carrito de compras funcional.

## ✨ Funcionalidades

- **Navbar estilo ML Colombia**: logo, buscador ("Ingresa lo que quieras encontrar"), ubicación, categorías reales, Ofertas, Cupones, Supermercado, Moda, Mercado Play, Vender y Ayuda.
- **Contenido principal**: carrusel de banners, atajo a Mercado Play, categorías destacadas, ofertas del día, productos más buscados y búsqueda por inicial (A–Z).
- **Carrito de compras** (`/carrito`): agregar/quitar productos, cantidades, resumen con envío, checkout con formulario y confirmación de pedido. Persiste en `localStorage` y el badge del navbar se actualiza en vivo.
- **Mercado Play** (`/mercado-play`): catálogo de películas consumiendo la API de OMDb.
- **CRUD de productos**: crear, listar, actualizar y eliminar publicaciones.
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
| OMDb API | Películas de Mercado Play (`https://www.omdbapi.com`) |

## 📁 Estructura

```text
src/
├── index.html                  # CDN: Bootstrap, Font Awesome, Animate.css
├── styles.css                  # Estilos globales
├── public/mercado_free.ico     # Favicon
└── app/
    ├── environments/           # URLs base y API keys (OMDb, FakeStore)
    ├── models/                 # Interfaces del carrito (producto, item, pedido)
    ├── services/
    │   ├── cart.service.ts     # Carrito + checkout (localStorage)
    │   ├── fake-store/         # Productos (CRUD completo)
    │   └── omdb/               # Películas
    └── components/
        ├── navbarcomponent/    # Barra superior (2 filas amarilla/blanca)
        ├── contenidocomponent/ # Home: banners, ofertas, búsquedas
        ├── categoriascomponent/# Grilla de categorías
        ├── mercadoplaycomponent/
        ├── crear/listar/actualizar/eliminar-productocomponent/
        ├── carritocomponent/
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

## 🧪 Tests

```bash
npx ng test
```

## 👥 Ramas

- `ramaHTMLComponents` — maquetación, estilos y conexión de APIs.
- `DanielAya_CarritoCompra` — carrito de compras (ya integrado a `ramaHTMLComponents`).

---
Proyecto con fines académicos. No afiliado a MercadoLibre, Inc.
