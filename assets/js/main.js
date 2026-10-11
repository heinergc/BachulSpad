/* Bachúl Spa y Estética — comportamiento de la página */
(() => {
  "use strict";

  const CFG = window.BACHUL_CONFIG || { sedes: {} };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Botones "Solicitar cita" -> WhatsApp ---------- */
  let citaUrl = "";
  if (CFG.citaWhatsapp) {
    citaUrl = "https://wa.me/" + String(CFG.citaWhatsapp).replace(/\D/g, "") +
      (CFG.citaMensaje ? "?text=" + encodeURIComponent(CFG.citaMensaje) : "");
    $$("[data-cita]").forEach((a) => { a.href = citaUrl; });
  }

  /* ---------- Año del pie ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Encabezado: borde al hacer scroll ---------- */
  const header = $("#site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const menuBtn = $(".menu-btn");
  const nav = $("#site-nav");
  const menuLabel = $(".menu-btn__label");

  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuLabel.textContent = open ? "Cerrar" : "Menú";
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });
  header.addEventListener("focusout", (e) => {
    if (menuBtn.getAttribute("aria-expanded") === "true" && e.relatedTarget && !header.contains(e.relatedTarget)) setMenu(false);
  });
  document.addEventListener("click", (e) => {
    if (menuBtn.getAttribute("aria-expanded") === "true" && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 880px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Enlace activo según la sección visible ---------- */
  const navLinks = $$(".nav__link");
  const sectionIds = navLinks.map((a) => a.getAttribute("href").slice(1));
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Pestañas de servicios ---------- */
  const tabs = $$('[role="tab"]');
  const panels = $$('[role="tabpanel"]');

  function selectTab(tab, { focus = false } = {}) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    if (focus) tab.focus();
    tab.scrollIntoView({ inline: "center", block: "nearest", behavior: reduceMotion.matches ? "auto" : "smooth" });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, { focus: true }); }
    });
  });

  /* ---------- Solicitud de cita ---------- */
  const sedeSel = $("#f-sede");
  const svcSel = $("#f-servicio");
  const nameIn = $("#f-nombre");
  const dateIn = $("#f-fecha");
  const result = $("#resultado");
  const form = $("#cita-form");
  const live = $("#live-status");

  form.addEventListener("submit", (e) => e.preventDefault());

  // Opciones de servicio agrupadas por categoría, tomadas de las tarjetas.
  panels.forEach((panel) => {
    const group = document.createElement("optgroup");
    group.label = panel.dataset.label;
    $$("[data-service]", panel).forEach((link) => {
      group.append(new Option(link.dataset.service, link.dataset.service));
    });
    svcSel.append(group);
  });

  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => c && node.append(c));
    return node;
  }

  function icon(id) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }

  function buildMessage(sede) {
    const name = nameIn.value.trim();
    const service = svcSel.value;
    const when = dateIn.value.trim();
    const parts = ["Hola" + (name ? ", soy " + name : "") + "."];
    parts.push(
      service
        ? "Quisiera consultar por " + service + " en la sede de " + sede.name + "."
        : "Quisiera agendar una valoración en la sede de " + sede.name + "."
    );
    if (when) parts.push("Me queda bien: " + when + ".");
    parts.push("¿Me podrían indicar la disponibilidad? Gracias.");
    return parts.join(" ");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (_e) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  let msgNode = null;
  let statusNode = null;

  function renderResult() {
    const sede = CFG.sedes[sedeSel.value];
    result.replaceChildren();
    msgNode = null;
    statusNode = null;

    if (!sede) {
      result.append(el("p", { class: "result__empty", text: "Escribinos por WhatsApp o elegí una sede para ver su teléfono, su Instagram y un mensaje listo para enviar." }));
      if (citaUrl) {
        result.append(el("div", { class: "result__actions" },
          el("a", { class: "btn btn--primary", href: citaUrl, target: "_blank", rel: "noopener noreferrer", "data-cita": "" }, icon("i-chat"), document.createTextNode("Solicitar cita por WhatsApp"))
        ));
      }
      return;
    }

    msgNode = el("p", { class: "msg" });
    statusNode = el("p", { class: "result__status" });

    const actions = el("div", { class: "result__actions" });
    actions.append(
      el("a", { class: "btn btn--primary", href: sede.phoneHref }, icon("i-phone"), document.createTextNode("Llamar a " + sede.name))
    );

    if (sede.whatsapp) {
      const wa = el("a", { class: "btn btn--ghost", target: "_blank", rel: "noopener noreferrer", "data-wa": "1" }, icon("i-chat"), document.createTextNode("Escribir por WhatsApp"));
      wa.href = "https://wa.me/" + sede.whatsapp.replace(/\D/g, "");
      actions.append(wa);
    }

    actions.append(
      el("a", { class: "btn btn--ghost", href: sede.instagram, target: "_blank", rel: "noopener noreferrer" }, icon("i-insta"), document.createTextNode("Instagram de " + sede.name))
    );

    const copyBtn = el("button", { class: "btn btn--ghost", type: "button" }, icon("i-copy"), document.createTextNode("Copiar mensaje"));
    copyBtn.addEventListener("click", async () => {
      const ok = await copyText(msgNode.textContent);
      const text = ok
        ? "Mensaje copiado. Pegalo en Instagram o leéselo a quien te atienda por teléfono."
        : "No pudimos copiar el mensaje. Seleccionalo y copialo manualmente.";
      statusNode.textContent = text;
      live.textContent = text;
    });
    actions.append(copyBtn);

    result.append(
      el("h3", { text: "Comunicate con Bachúl " + sede.name }),
      msgNode,
      actions,
      statusNode,
      el("p", { class: "result__fine", text: "Esto no envía una solicitud: la cita se coordina con la sede y queda sujeta a disponibilidad y confirmación. Por favor no incluyas información médica en tu mensaje; se conversa en la valoración." })
    );
    updateMessage();
  }

  function updateMessage() {
    const sede = CFG.sedes[sedeSel.value];
    if (!sede || !msgNode) return;
    const text = buildMessage(sede);
    msgNode.textContent = text;
    if (statusNode) statusNode.textContent = "";
    const wa = $("[data-wa]", result);
    if (wa && sede.whatsapp) wa.href = "https://wa.me/" + sede.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(text);
  }

  sedeSel.addEventListener("change", () => {
    renderResult();
    const sede = CFG.sedes[sedeSel.value];
    live.textContent = sede ? "Opciones de contacto de " + sede.name + " disponibles debajo del formulario." : "";
  });
  [svcSel, nameIn, dateIn].forEach((n) => n.addEventListener("input", updateMessage));
  svcSel.addEventListener("change", updateMessage);

  // Botones "Consultar este servicio"
  $$("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      svcSel.value = link.dataset.service;
      updateMessage();
    });
  });

  // Botones "Solicitar cita aquí" de cada sede
  $$("[data-pick-sede]").forEach((link) => {
    link.addEventListener("click", () => {
      sedeSel.value = link.dataset.pickSede;
      renderResult();
    });
  });

  renderResult();

  /* ---------- WhatsApp en tarjetas de sede (solo si está configurado) ---------- */
  $$(".sede").forEach((card) => {
    const sede = CFG.sedes[card.dataset.sede];
    if (!sede || !sede.whatsapp) return;
    const wa = el("a", { class: "btn btn--outline-light", target: "_blank", rel: "noopener noreferrer" }, icon("i-chat"), document.createTextNode("WhatsApp"));
    wa.href = "https://wa.me/" + sede.whatsapp.replace(/\D/g, "");
    $(".sede__actions", card).append(wa);
  });

  /* ---------- Botón flotante en móvil ---------- */
  const floatCta = $("#cta-float");
  if (floatCta && "IntersectionObserver" in window) {
    const hide = new Set();
    const update = () => floatCta.classList.toggle("is-visible", hide.size === 0);
    const watch = (target) => {
      if (!target) return;
      new IntersectionObserver((entries) => {
        entries.forEach((en) => (en.isIntersecting ? hide.add(en.target) : hide.delete(en.target)));
        update();
      }, { threshold: 0.05 }).observe(target);
    };
    watch($("#inicio"));
    watch($("#contacto"));
    watch($(".footer"));
  } else if (floatCta) {
    floatCta.classList.add("is-visible");
  }

  /* ---------- Visor de imágenes ---------- */
  const items = $$(".g-item");
  const dlg = $("#lightbox");
  const lbImg = $("#lb-img");
  const lbCount = $("#lb-count");
  let current = 0;
  let opener = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const thumb = $("img", items[current]);
    lbImg.src = items[current].dataset.full;
    lbImg.alt = thumb.alt;
    lbCount.textContent = (current + 1) + " de " + items.length;
  }

  items.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      opener = btn;
      show(i);
      dlg.showModal();
    });
  });
  $("#lb-prev").addEventListener("click", () => show(current - 1));
  $("#lb-next").addEventListener("click", () => show(current + 1));
  $("#lb-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });
  dlg.addEventListener("close", () => { if (opener) opener.focus(); });

  // Cierre al tocar fuera del visor en navegadores sin soporte de closedby.
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    dlg.addEventListener("click", (e) => {
      if (e.target !== dlg) return;
      const r = dlg.getBoundingClientRect();
      const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
      if (!inside) dlg.close();
    });
  }
})();
