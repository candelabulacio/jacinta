# Jacinta · Accesorios

Tienda online de Jacinta: accesorios con estética botánica (bolsos, cinturones, pelo, bijou y playa).

Es una web estática (HTML, CSS y JavaScript): no necesita servidor ni base de datos. El carrito arma el pedido y lo manda por WhatsApp.

## Estructura

```
index.html        → la página
css/styles.css    → colores, tipografías y estilos
js/config.js      → tu WhatsApp e Instagram
js/productos.js   → el catálogo (acá cargás productos y precios)
js/main.js        → filtros y carrito
img/              → tus fotos de producto
```

## Cómo cargar productos

En `js/productos.js`, cada producto es un bloque así:

```js
{ id: "bolso-rafia", nombre: "Bolso de rafia con asas", categoria: "bolsos", precio: 25000, imagen: "img/bolso-rafia.jpg", nuevo: true }
```

- `precio`: número sin puntos. Con `null` se muestra "Precio a confirmar".
- `imagen`: ruta a la foto dentro de `img/`. Si está vacía, se muestra una ilustración botánica.
- `nuevo: true` le pone el sello "Nuevo".

## WhatsApp y envíos

Todo se configura en `js/config.js`:

- `whatsapp`: tu número en formato `549` + código de área sin 0 + número sin 15 (ej. `5491112345678`). Lo usan el carrito, los kits, el botón flotante y el "Consultar por WhatsApp" de cada producto.
- `envios`: las opciones que aparecen en el carrito y en la sección "Envíos y retiros". En `precio` poné un número, `0` si es gratis, o `null` para mostrar "A coordinar".
- `envioGratisDesde`: monto desde el que moto y correo son gratis. `null` para no ofrecerlo.

El pedido que llega por WhatsApp incluye los productos, la opción de envío elegida y el total.

## Antes de publicar

1. Cargá tu número y tus precios de envío en `js/config.js`.
2. Reemplazá los textos entre corchetes en `index.html`: precio de los kits y el texto de "Sobre Jacinta".
3. Subí tus fotos a `img/` y apuntalas desde `js/productos.js`.

## Publicar gratis

- **Vercel:** importá el repo desde vercel.com → Add New Project. No hace falta configurar nada.
- **GitHub Pages:** Settings → Pages → Branch `main` / root.

## Paleta

| Color | Hex |
|---|---|
| Bosque | `#26321E` |
| Oliva | `#56653A` |
| Salvia | `#A3AD85` |
| Crema | `#F3EEE3` |
| Kraft | `#E2D3B8` |

Tipografías: Cormorant Garamond (títulos) y Jost (textos), de Google Fonts.
