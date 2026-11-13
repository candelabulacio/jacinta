(function () {
  "use strict";

  const CLAVE = "jacinta-carrito";
  const CLAVE_ENVIO = "jacinta-envio";
  const tonos = ["kraft", "salvia", "oliva", "arena"];
  const ENVIOS = CONFIG.envios || [];
  let filtro = "todo";
  let carrito = leer(CLAVE, {});
  let envioId = leer(CLAVE_ENVIO, ENVIOS[0] ? ENVIOS[0].id : null);
  if (!ENVIOS.some((e) => e.id === envioId)) envioId = ENVIOS[0] ? ENVIOS[0].id : null;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const grilla = $("[data-grilla]");
  const filtros = $("[data-filtros]");
  const panel = $("#carrito");
  const velo = $("[data-velo]");
  const botonCarrito = $(".btn-carrito");
  const toast = $("[data-toast]");

  // ---------- Utilidades ----------
  function leer(clave, porDefecto) {
    try {
      const v = JSON.parse(localStorage.getItem(clave));
      return v === null ? porDefecto : v;
    } catch (e) {
      return porDefecto;
    }
  }
  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) { /* sin almacenamiento: vive en memoria */ }
  }
  function tienePrecio(n) {
    return typeof n === "number" && !isNaN(n);
  }
  function plata(n) {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: CONFIG.moneda, maximumFractionDigits: 0 }).format(n);
  }
  function precio(n) {
    return tienePrecio(n) ? plata(n) : "Precio a confirmar";
  }
  function producto(id) {
    return PRODUCTOS.find((p) => p.id === id);
  }
  function envioElegido() {
    return ENVIOS.find((e) => e.id === envioId) || null;
  }
  function linkWhatsApp(texto) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  }
  function abrirAfuera(a) {
    a.target = "_blank";
    a.rel = "noopener";
  }
  function el(tag, clase, texto) {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }
  function ilustracion(simbolo) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + simbolo);
    svg.appendChild(use);
    return svg;
  }
  let toastTimer;
  function avisar(texto) {
    toast.textContent = texto;
    toast.classList.add("toast--visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("toast--visible"), 2200);
  }

  // ---------- Filtros ----------
  function pintarFiltros() {
    filtros.innerHTML = "";
    CATEGORIAS.forEach((c) => {
      const b = el("button", "chip", c.nombre);
      b.type = "button";
      b.setAttribute("aria-pressed", String(c.id === filtro));
      b.addEventListener("click", () => elegirFiltro(c.id));
      filtros.appendChild(b);
    });
  }
  function elegirFiltro(id) {
    filtro = id;
    pintarFiltros();
    pintarGrilla();
  }

  // ---------- Catálogo ----------
  function pintarGrilla() {
    grilla.innerHTML = "";
    const lista = PRODUCTOS.filter((p) => filtro === "todo" || p.categoria === filtro);
    lista.forEach((p, i) => {
      const li = el("li", "tarjeta");

      const foto = el("div", "tarjeta__foto tarjeta__foto--" + tonos[PRODUCTOS.indexOf(p) % tonos.length]);
      if (p.imagen) {
        const img = el("img");
        img.src = p.imagen;
        img.alt = p.nombre;
        img.loading = "lazy";
        foto.appendChild(img);
      } else {
        foto.appendChild(ilustracion(i % 2 ? "flor" : "sprig"));
      }
      if (p.nuevo) foto.appendChild(el("span", "tarjeta__sello", "Nuevo"));

      const etiqueta = el("div", "tarjeta__etiqueta");
      const cat = CATEGORIAS.find((c) => c.id === p.categoria);
      etiqueta.appendChild(el("span", "tarjeta__cat", cat ? cat.nombre : ""));
      etiqueta.appendChild(el("h3", "tarjeta__nombre", p.nombre));
      etiqueta.appendChild(el("span", "tarjeta__precio", precio(p.precio)));

      const b = el("button", "btn btn--linea btn--ancho", "Agregar al carrito");
      b.type = "button";
      b.addEventListener("click", () => agregar(p.id));

      const consulta = el("a", "tarjeta__consulta", "Consultar por WhatsApp");
      consulta.href = linkWhatsApp("¡Hola Jacinta! Quiero consultar por: " + p.nombre);
      consulta.setAttribute("aria-label", "Consultar por WhatsApp: " + p.nombre);
      abrirAfuera(consulta);

      li.append(foto, etiqueta, b, consulta);
      grilla.appendChild(li);
    });
  }

  // ---------- Envíos ----------
  function textoCostoEnvio(e) {
    if (!e) return "—";
    if (e.precio === 0) return "Sin cargo";
    return tienePrecio(e.precio) ? plata(e.precio) : "A coordinar";
  }
  function pintarSeccionEnvios() {
    const lista = $("[data-envios]");
    if (!lista) return;
    lista.innerHTML = "";
    ENVIOS.forEach((e, i) => {
      const li = el("li", "envio");
      li.appendChild(ilustracion(i % 2 ? "flor" : "sprig"));
      li.appendChild(el("h3", "envio__nombre", e.nombre));
      li.appendChild(el("p", "envio__detalle", e.detalle));
      li.appendChild(el("span", "envio__precio", textoCostoEnvio(e)));
      lista.appendChild(li);
    });
    const gratis = $("[data-envio-gratis]");
    if (gratis && tienePrecio(CONFIG.envioGratisDesde)) {
      gratis.textContent = "Envío gratis en compras desde " + plata(CONFIG.envioGratisDesde) + ".";
      gratis.hidden = false;
    }
  }
  function pintarOpcionesEnvio() {
    const caja = $("[data-envio-opciones]");
    caja.innerHTML = "";
    ENVIOS.forEach((e) => {
      const label = el("label", "opcion");
      const input = el("input");
      input.type = "radio";
      input.name = "envio";
      input.value = e.id;
      input.checked = e.id === envioId;
      input.addEventListener("change", () => {
        envioId = e.id;
        guardar(CLAVE_ENVIO, envioId);
        pintarCarrito();
      });
      const texto = el("span", "opcion__texto");
      texto.appendChild(el("span", "opcion__nombre", e.nombre));
      texto.appendChild(el("span", "opcion__costo", textoCostoEnvio(e)));
      label.append(input, texto);
      caja.appendChild(label);
    });
  }

  // ---------- Carrito ----------
  function agregar(id) {
    carrito[id] = (carrito[id] || 0) + 1;
    guardar(CLAVE, carrito);
    pintarCarrito();
    avisar(producto(id).nombre + " se agregó al carrito");
  }
  function cambiar(id, delta) {
    carrito[id] = (carrito[id] || 0) + delta;
    if (carrito[id] <= 0) delete carrito[id];
    guardar(CLAVE, carrito);
    pintarCarrito();
  }
  function calcular() {
    const ids = Object.keys(carrito).filter((id) => producto(id));
    let cantidad = 0;
    let subtotal = 0;
    let faltanPrecios = false;
    ids.forEach((id) => {
      const p = producto(id);
      cantidad += carrito[id];
      if (tienePrecio(p.precio)) subtotal += p.precio * carrito[id];
      else faltanPrecios = true;
    });

    const e = envioElegido();
    let envio = null; // null = a coordinar
    let envioTexto = textoCostoEnvio(e);
    if (e) {
      const umbral = CONFIG.envioGratisDesde;
      const aplicaGratis = e.precio !== 0 && tienePrecio(umbral) && !faltanPrecios && subtotal >= umbral;
      if (aplicaGratis) {
        envio = 0;
        envioTexto = "Gratis";
      } else if (tienePrecio(e.precio)) {
        envio = e.precio;
      }
    } else {
      envio = 0;
    }

    let totalTexto;
    if (!ids.length) totalTexto = plata(0);
    else if (faltanPrecios && !subtotal) totalTexto = "A confirmar";
    else {
      const parcial = plata(subtotal + (envio || 0));
      totalTexto = faltanPrecios || envio === null ? parcial + " + a confirmar" : parcial;
    }
    return { ids, cantidad, subtotal, faltanPrecios, envioTexto, totalTexto, e };
  }
  function pintarCarrito() {
    const lista = $("[data-lista]");
    lista.innerHTML = "";
    const r = calcular();

    r.ids.forEach((id) => {
      const p = producto(id);
      const n = carrito[id];
      const li = el("li", "item");
      const info = el("div", "item__info");
      info.appendChild(el("span", "item__nombre", p.nombre));
      info.appendChild(el("span", "item__precio", precio(p.precio)));

      const ctrl = el("div", "item__cantidad");
      const menos = el("button", "icono icono--chico", "−");
      menos.type = "button";
      menos.setAttribute("aria-label", "Quitar uno de " + p.nombre);
      menos.addEventListener("click", () => cambiar(id, -1));
      const num = el("span", "item__num", String(n));
      const mas = el("button", "icono icono--chico", "+");
      mas.type = "button";
      mas.setAttribute("aria-label", "Sumar uno de " + p.nombre);
      mas.addEventListener("click", () => cambiar(id, 1));
      ctrl.append(menos, num, mas);

      li.append(info, ctrl);
      lista.appendChild(li);
    });

    $$("[data-cuenta]").forEach((n) => (n.textContent = String(r.cantidad)));
    $("[data-vacio]").hidden = r.ids.length > 0;
    $("[data-subtotal]").textContent = r.faltanPrecios ? (r.subtotal ? plata(r.subtotal) + " + a confirmar" : "A confirmar") : plata(r.subtotal);
    $("[data-costo-envio]").textContent = r.envioTexto;
    $("[data-total]").textContent = r.totalTexto;

    const finalizar = $("[data-finalizar]");
    if (r.ids.length) {
      const lineas = r.ids.map((id) => "• " + carrito[id] + " x " + producto(id).nombre);
      let msg = "¡Hola Jacinta! Quiero hacer este pedido:\n" + lineas.join("\n");
      if (r.e) msg += "\n\nEnvío: " + r.e.nombre + " (" + r.envioTexto + ")";
      msg += "\nTotal: " + r.totalTexto;
      finalizar.href = linkWhatsApp(msg);
      abrirAfuera(finalizar);
      finalizar.removeAttribute("aria-disabled");
    } else {
      finalizar.href = "#";
      finalizar.removeAttribute("target");
      finalizar.setAttribute("aria-disabled", "true");
    }
  }
  function abrirCarrito() {
    panel.classList.add("carrito--abierto");
    panel.setAttribute("aria-hidden", "false");
    botonCarrito.setAttribute("aria-expanded", "true");
    velo.hidden = false;
    panel.querySelector("[data-cerrar]").focus();
  }
  function cerrarCarrito() {
    panel.classList.remove("carrito--abierto");
    panel.setAttribute("aria-hidden", "true");
    botonCarrito.setAttribute("aria-expanded", "false");
    velo.hidden = true;
    botonCarrito.focus();
  }

  // ---------- Inicio ----------
  botonCarrito.addEventListener("click", abrirCarrito);
  panel.querySelector("[data-cerrar]").addEventListener("click", cerrarCarrito);
  velo.addEventListener("click", cerrarCarrito);
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarCarrito(); });
  $("[data-finalizar]").addEventListener("click", (e) => {
    if (!Object.keys(carrito).length) e.preventDefault();
  });

  $$("[data-filtro]").forEach((a) =>
    a.addEventListener("click", () => elegirFiltro(a.getAttribute("data-filtro")))
  );
  $$("[data-whatsapp-kit]").forEach((a) => {
    a.href = linkWhatsApp("¡Hola Jacinta! Quiero el " + a.getAttribute("data-whatsapp-kit") + ".");
    abrirAfuera(a);
  });
  $$("[data-whatsapp-link]").forEach((a) => { a.href = linkWhatsApp("¡Hola Jacinta!"); abrirAfuera(a); });
  $$("[data-instagram-link]").forEach((a) => { a.href = CONFIG.instagram; abrirAfuera(a); });
  $$("[data-anio]").forEach((n) => (n.textContent = String(new Date().getFullYear())));

  pintarFiltros();
  pintarGrilla();
  pintarSeccionEnvios();
  pintarOpcionesEnvio();
  pintarCarrito();
})();
