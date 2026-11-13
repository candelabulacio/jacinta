// Catálogo de Jacinta.
// Para sumar un producto, copiá un bloque y cambiá los datos.
// - precio: número sin puntos (ej. 25000). Dejalo en null mientras no lo tengas.
// - imagen: ruta a la foto (ej. "img/bolso-rafia.jpg"). Si queda vacía, se muestra una ilustración.
// - categoria: bolsos | cinturones | pelo | bijou | playa

const CATEGORIAS = [
  { id: "todo", nombre: "Todo" },
  { id: "bolsos", nombre: "Bolsos" },
  { id: "cinturones", nombre: "Cinturones" },
  { id: "pelo", nombre: "Pelo" },
  { id: "bijou", nombre: "Bijou" },
  { id: "playa", nombre: "Playa" }
];

const PRODUCTOS = [
  { id: "bolso-rafia", nombre: "Bolso de rafia con asas", categoria: "bolsos", precio: null, imagen: "", nuevo: true },
  { id: "cartera-crochet", nombre: "Cartera crochet", categoria: "bolsos", precio: null, imagen: "" },
  { id: "clutch-bordado", nombre: "Clutch bordado", categoria: "bolsos", precio: null, imagen: "" },
  { id: "cinturon-rafia", nombre: "Cinturón de rafia", categoria: "cinturones", precio: null, imagen: "", nuevo: true },
  { id: "cinturon-trenzado", nombre: "Cinturón trenzado", categoria: "cinturones", precio: null, imagen: "" },
  { id: "panuelo", nombre: "Pañuelo estampado", categoria: "pelo", precio: null, imagen: "" },
  { id: "clips", nombre: "Set de clips para el pelo", categoria: "pelo", precio: null, imagen: "" },
  { id: "aros-dorados", nombre: "Aros dorados", categoria: "bijou", precio: null, imagen: "", nuevo: true },
  { id: "visera-rafia", nombre: "Visera de rafia", categoria: "playa", precio: null, imagen: "" },
  { id: "toalla-turca", nombre: "Toalla turca", categoria: "playa", precio: null, imagen: "" }
];
