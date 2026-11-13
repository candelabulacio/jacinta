(function () {
  "use strict";

  const CLAVE = "jacinta-carrito";
  const tonos = ["kraft", "salvia", "oliva", "arena"];
  let filtro = "todo";
  let carrito = leerCarrito();

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const grilla = $("[data-grilla]");
  const filtros = $("[data-filtros]");
  const panel = $("#carrito");
  const velo = $("[data-velo]");
  const botonCarrito = $(".btn-carrito");
  const toast = $("[data-toast]");

  // ---------- Utilidades ----------
  function leerCarrito() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE)) || {};
    } catch (e) {
      return {};
    }
  }
  function guardarCarrito() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito));
    } catch (e) { /* sin almacenamiento: el carrito vive en memoria */ }
  }
  function precio(n) {
    if (n === null || n === undefined) return "Precio a confirmar";
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: CONFIG.moneda, maximumFractionDigits: 0 }).format(n);
  }
  function producto(id) {
    return PRODUCTOS.find((p) => p.id === id);
  }
  function linkWhatsApp(texto) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
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

      li.append(foto, etiqueta, b);
      grilla.appendChild(li);
    });
  }

  // ---------- Carrito ----------
  function agregar(id) {
    carrito[id] = (carrito[id] || 0) + 1;
    guardarCarrito();
    pintarCarrito();
    avisar(producto(id).nombre + " se agregó al carrito");
  }
  function cambiar(id, delta) {
    carrito[id] = (carrito[id] || 0) + delta;
    if (carrito[id] <= 0) delete carrito[id];
    guardarCarrito();
    pintarCarrito();
  }
  function pintarCarrito() {
    const lista = $("[data-lista]");
    lista.innerHTML = "";
    const ids = Object.keys(carrito).filter((id) => producto(id));
    let cantidad = 0;
    let total = 0;
    let faltanPrecios = false;

    ids.forEach((id) => {
      const p = producto(id);
      const n = carrito[id];
      cantidad += n;
      if (p.precio === null || p.precio === undefined) faltanPrecios = true;
      else total += p.precio * n;

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

    $$("[data-cuenta]").forEach((n) => (n.textContent = String(cantidad)));
    $("[data-vacio]").hidden = ids.length > 0;
    $("[data-total]").textContent = faltanPrecios ? (total ? precio(total) + " + a confirmar" : "A confirmar") : precio(total);

    const finalizar = $("[data-finalizar]");
    if (ids.length) {
      const lineas = ids.map((id) => "• " + carrito[id] + " x " + producto(id).nombre);
      finalizar.href = linkWhatsApp("¡Hola Jacinta! Quiero hacer este pedido:\n" + lineas.join("\n"));
      finalizar.target = "_blank";
      finalizar.rel = "noopener";
      finalizar.removeAttribute("aria-disabled");
    } else {
      finalizar.href = "#";
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
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-whatsapp-link]").forEach((a) => { a.href = linkWhatsApp("¡Hola Jacinta!"); a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-instagram-link]").forEach((a) => { a.href = CONFIG.instagram; a.target = "_blank"; a.rel = "noopener"; });
  $$("[data-anio]").forEach((n) => (n.textContent = String(new Date().getFullYear())));

  pintarFiltros();
  pintarGrilla();
  pintarCarrito();
})();
