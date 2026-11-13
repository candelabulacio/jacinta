// Datos de la tienda. Este es el único archivo que necesitás tocar
// para contacto y envíos.
const CONFIG = {
  // Número de WhatsApp en formato internacional, sin + ni espacios.
  // Ejemplo Argentina: 5491112345678 (54 + 9 + código de área sin 0 + número sin 15)
  whatsapp: "5491100000000",
  instagram: "https://instagram.com/tu_usuario",
  moneda: "ARS",

  // Opciones de envío que aparecen en el carrito y en la sección "Envíos y retiros".
  // precio: número (ej. 3500), 0 si es gratis, o null para "a coordinar por WhatsApp".
  envios: [
    {
      id: "retiro",
      nombre: "Retiro en Pilar",
      detalle: "Sin cargo. Coordinamos día y horario por WhatsApp.",
      precio: 0
    },
    {
      id: "moto",
      nombre: "Moto en el día",
      detalle: "Pilar, Zona Norte y CABA.",
      precio: null
    },
    {
      id: "correo",
      nombre: "Correo al interior",
      detalle: "Correo Argentino o Andreani, según tu código postal.",
      precio: null
    }
  ],

  // Envío gratis (moto o correo) desde este monto de compra. null = sin envío gratis.
  envioGratisDesde: null
};
