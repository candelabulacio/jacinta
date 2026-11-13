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

## Antes de publicar

1. Cargá tu número en `js/config.js` (formato `549` + código de área + número, sin espacios).
2. Reemplazá los textos entre corchetes en `index.html`: zonas de envío, punto de retiro, precio de los kits y el texto de "Sobre Jacinta".
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
