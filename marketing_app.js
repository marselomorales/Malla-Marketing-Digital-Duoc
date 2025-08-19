// ===== Utilidades =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const normalizarTexto = (str) => (str || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// ===== Modo oscuro =====
const body = document.body;
const toggle = $("#theme-toggle");
const applyTheme = (mode) => {
  if (mode === "dark") body.classList.add("active");
  else body.classList.remove("active");
  toggle?.setAttribute("aria-checked", mode === "dark" ? "true" : "false");
};
applyTheme(localStorage.getItem("modo") || "light");
toggle?.addEventListener("click", () => {
  const isDark = body.classList.toggle("active");
  const modo = isDark ? "dark" : "light";
  localStorage.setItem("modo", modo);
  toggle?.setAttribute("aria-checked", isDark ? "true" : "false");
});

// ===== Datos base (desde el TXT del usuario) =====
// Áreas: marketing, ventas, negocios, datos, talleres, globales, generales
// Nota: Los optativos/competencias globales y "Formación Complementaria" no traen créditos oficiales ('-').
// En progreso y totales SOLO sumamos ramos con créditos numéricos.

const cursosRaw = [
  // Sem 1
  { id:"fundamentos-de-economia", sem:1, nombre:"Fundamentos de Economía", creditos:8,  area:"negocios", prereqs:[] },
  { id:"fundamentos-de-ventas", sem:1, nombre:"Fundamentos de Ventas", creditos:8, area:"ventas", prereqs:[] },
  { id:"habilidades-de-comunicacion", sem:1, nombre:"Habilidades de Comunicación", creditos:8, area:"generales", prereqs:[] },
  { id:"herramientas-tecnologicas-i", sem:1, nombre:"Herramientas Tecnológicas I", creditos:6, area:"datos", prereqs:[] },
  { id:"introduccion-al-marketing", sem:1, nombre:"Introducción al Marketing", creditos:8, area:"marketing", prereqs:[] },
  { id:"nivelacion-matematica", sem:1, nombre:"Nivelación Matemática", creditos:12, area:"generales", prereqs:[] },

  // Sem 2
  { id:"fundamentos-de-finanzas-y-presupuestos", sem:2, nombre:"Fundamentos de Finanzas y Presupuestos", creditos:8, area:"negocios", prereqs:[] },
  { id:"fundamentos-de-gestion-de-personas", sem:2, nombre:"Fundamentos de Gestión de Personas", creditos:8, area:"negocios", prereqs:[] },
  { id:"herramientas-tecnologicas-ii", sem:2, nombre:"Herramientas Tecnológicas II", creditos:6, area:"datos", prereqs:[] },
  { id:"plan-de-marketing", sem:2, nombre:"Plan de Marketing", creditos:8, area:"marketing", prereqs:[] },
  { id:"sitios-web-y-landing-pages", sem:2, nombre:"Sitios Web y Landing Pages", creditos:8, area:"marketing", prereqs:[] },
  { id:"algebra", sem:2, nombre:"Álgebra", creditos:10, area:"generales", prereqs:["Nivelación Matemática"] },

  // Sem 3
  { id:"branding", sem:3, nombre:"Branding", creditos:4, area:"marketing", prereqs:[] },
  { id:"estadistica-descriptiva", sem:3, nombre:"Estadística Descriptiva", creditos:8, area:"generales", prereqs:["Álgebra"] },
  { id:"fundamentos-de-antropologia", sem:3, nombre:"Fundamentos de Antropología", creditos:4, area:"generales", prereqs:[] },
  { id:"herramientas-de-marketing-digital", sem:3, nombre:"Herramientas de Marketing Digital", creditos:8, area:"marketing", prereqs:[] },
  { id:"herramientas-tecnologicas-iii", sem:3, nombre:"Herramientas Tecnológicas III", creditos:8, area:"datos", prereqs:["Herramientas Tecnológicas II"] },
  { id:"propuesta-de-valor-y-precios", sem:3, nombre:"Propuesta de Valor y Precios", creditos:8, area:"ventas", prereqs:[] },
  { id:"storytelling", sem:3, nombre:"Storytelling", creditos:8, area:"marketing", prereqs:[] },

  // Sem 4
  { id:"electivo-competencias-globales-1", sem:4, nombre:"Electivo Competencias Globales", creditos:null, area:"globales", prereqs:[] },
  { id:"optativo-de-formacion-cristiana", sem:4, nombre:"Optativo de Formación Cristiana", creditos:4, area:"generales", prereqs:[] },
  { id:"investigacion-de-mercados", sem:4, nombre:"Investigación de Mercados", creditos:8, area:"marketing", prereqs:["Estadística Descriptiva"] },
  { id:"negociacion", sem:4, nombre:"Negociación", creditos:8, area:"ventas", prereqs:[] },
  { id:"social-media-marketing", sem:4, nombre:"Social Media Marketing", creditos:8, area:"marketing", prereqs:[] },
  { id:"taller-aplicado-i-de-marketing", sem:4, nombre:"Taller Aplicado I de Marketing", creditos:12, area:"talleres", prereqs:[], untilSem:3 },
  { id:"etica-para-el-trabajo", sem:4, nombre:"Ética para el Trabajo", creditos:4, area:"generales", prereqs:["Fundamentos de Antropología"] },

  // Sem 5
  { id:"optativo-competencias-globales-2", sem:5, nombre:"Optativo Competencias Globales", creditos:null, area:"globales", prereqs:[] },
  { id:"formacion-complementaria-1", sem:5, nombre:"Formación Complementaria", creditos:null, area:"globales", prereqs:[] },
  { id:"comunicaciones-integradas-de-marketing", sem:5, nombre:"Comunicaciones Integradas de Marketing", creditos:8, area:"marketing", prereqs:[] },
  { id:"inbound-marketing-i", sem:5, nombre:"Inbound Marketing I", creditos:8, area:"marketing", prereqs:[] },
  { id:"key-account-management", sem:5, nombre:"Key Account Management", creditos:8, area:"ventas", prereqs:[] },
  { id:"medios-y-audiencias", sem:5, nombre:"Medios & Audiencias", creditos:8, area:"marketing", prereqs:[] },

  // Sem 6
  { id:"optativo-competencias-globales-3", sem:6, nombre:"Optativo Competencias Globales", creditos:null, area:"globales", prereqs:[] },
  { id:"formacion-complementaria-2", sem:6, nombre:"Formación Complementaria", creditos:null, area:"globales", prereqs:[] },
  { id:"big-data-e-inteligencia-de-negocios", sem:6, nombre:"Big Data e Inteligencia de Negocios", creditos:12, area:"datos", prereqs:["Herramientas Tecnológicas III"] },
  { id:"cadena-de-suministros", sem:6, nombre:"Cadena de Suministros", creditos:8, area:"negocios", prereqs:[] },
  { id:"diseno-ux-ui", sem:6, nombre:"Diseño UX/UI", creditos:8, area:"marketing", prereqs:[] },
  { id:"inbound-marketing-ii", sem:6, nombre:"Inbound Marketing II", creditos:8, area:"marketing", prereqs:["Inbound Marketing I"] },
  { id:"taller-aplicado-ii-de-marketing", sem:6, nombre:"Taller Aplicado II de Marketing", creditos:20, area:"talleres", prereqs:[], untilSem:5 },

  // Sem 7
  { id:"optativo-competencias-globales-4", sem:7, nombre:"Optativo Competencias Globales", creditos:null, area:"globales", prereqs:[] },
  { id:"formacion-complementaria-3", sem:7, nombre:"Formación Complementaria", creditos:null, area:"globales", prereqs:[] },
  { id:"canales-de-distribucion-ecommerce", sem:7, nombre:"Canales de Distribución & E-Commerce", creditos:8, area:"marketing", prereqs:[] },
  { id:"gestion-de-equipos-de-venta", sem:7, nombre:"Gestión de Equipos de Venta", creditos:8, area:"ventas", prereqs:[] },
  { id:"inbound-marketing-iii", sem:7, nombre:"Inbound Marketing III", creditos:8, area:"marketing", prereqs:["Inbound Marketing II"] },
  { id:"productos-y-servicios", sem:7, nombre:"Productos y Servicios", creditos:8, area:"marketing", prereqs:[] },
  { id:"etica-profesional", sem:7, nombre:"Ética Profesional", creditos:4, area:"generales", prereqs:["Ética para el Trabajo"] },

  // Sem 8
  { id:"electivo-competencias-globales-2", sem:8, nombre:"Electivo Competencias Globales", creditos:null, area:"globales", prereqs:[] },
  { id:"formacion-complementaria-4", sem:8, nombre:"Formación Complementaria", creditos:null, area:"globales", prereqs:[] },
  { id:"habilidades-comunicacionales-para-el-trabajo", sem:8, nombre:"Habilidades Comunicacionales para el Trabajo", creditos:8, area:"generales", prereqs:["Habilidades de Comunicación"] },
  { id:"taller-aplicado-final", sem:8, nombre:"Taller Aplicado Final", creditos:30, area:"talleres", prereqs:[], untilSem:7 },
];

// ===== Preparación de datos y grafos =====
const nombreToObj = new Map();
cursosRaw.forEach(c => nombreToObj.set(c.nombre, c));

// Expandir reglas untilSem -> las convertimos en prerequisitos explícitos
for (const c of cursosRaw) {
  if (typeof c.untilSem === "number") {
    const depNombres = cursosRaw.filter(x => x.sem <= c.untilSem).map(x => x.nombre);
    // Unir con prereqs existentes, sin duplicar
    const set = new Set([...(c.prereqs || []), ...depNombres]);
    c.prereqs = Array.from(set);
  }
}

// Índices para render
const ramos = {};             // nombre -> {semestre, area, id, abre:[]}
const creditosRamos = {};     // nombre -> número o null
const prereqsPorNombre = {};  // nombre -> [nombres]

for (const c of cursosRaw) {
  ramos[c.nombre] = { semestre: c.sem, area: c.area, id: c.id, abre: [] };
  creditosRamos[c.nombre] = (typeof c.creditos === "number") ? c.creditos : null;
  prereqsPorNombre[c.nombre] = (c.prereqs || []).slice();
}
for (const [nombre, lista] of Object.entries(prereqsPorNombre)) {
  for (const p of lista) if (ramos[p]) ramos[p].abre.push(nombre);
}

// Agrupar por semestre
const porSemestre = {};
for (const [nombre, info] of Object.entries(ramos)) {
  if (!porSemestre[info.semestre]) porSemestre[info.semestre] = [];
  porSemestre[info.semestre].push(nombre);
}
const maxSemestre = Math.max(...Object.values(ramos).map(r => r.semestre));

// ===== Persistencia: por id estable =====
const firmaMalla = JSON.stringify(cursosRaw.map(c => c.id).sort());
const firmaGuardada = localStorage.getItem("firma_malla_marketing");
if (firmaGuardada && firmaGuardada !== firmaMalla) {
  localStorage.removeItem("ramos_aprobados_ids_marketing");
}
localStorage.setItem("firma_malla_marketing", firmaMalla);

let aprobadasIds = JSON.parse(localStorage.getItem("ramos_aprobados_ids_marketing") || "[]");
const idValido = new Set(cursosRaw.map(c => c.id));
aprobadasIds = aprobadasIds.filter(id => idValido.has(id));
localStorage.setItem("ramos_aprobados_ids_marketing", JSON.stringify(aprobadasIds));

const idPorNombre = new Map(cursosRaw.map(c => [c.nombre, c.id]));
const aprobadoPorNombre = new Set(cursosRaw.filter(c => aprobadasIds.includes(c.id)).map(c => c.nombre));
const aprobadosNombres = () => cursosRaw.filter(c => aprobadasIds.includes(c.id)).map(c => c.nombre);

// ===== Lógica =====
const malla = $("#malla");
const nombreToEl = new Map();
const estadoAnterior = new Map();
let areaSeleccionada = "all";
let busqueda = "";
let mostrarSoloDisponibles = false;

const prerequisitosDe = (nombre) => [...(prereqsPorNombre[nombre] || [])];
const estaDisponible = (nombre) => prerequisitosDe(nombre).every(p => aprobadoPorNombre.has(p));
const obtenerTodosDependientes = (nombre) => {
  const out = new Set();
  const dfs = (n) => {
    for (const d of (ramos[n]?.abre || [])) {
      if (!out.has(d)) { out.add(d); dfs(d); }
    }
  };
  dfs(nombre);
  return [...out];
};

const aprobar = (ramoNombre) => {
  const id = idPorNombre.get(ramoNombre);
  if (!id) return;

  if (aprobadoPorNombre.has(ramoNombre)) {
    // Desmarcar también todos los que dependen
    const dep = obtenerTodosDependientes(ramoNombre);
    const aEliminar = [ramoNombre, ...dep];
    $$(".ramo").forEach(el => {
      const n = el.querySelector(".ramo-nombre")?.textContent;
      if (n && aEliminar.includes(n)) el.classList.add("retirado");
    });
    const idsEliminar = aEliminar.map(n => idPorNombre.get(n)).filter(Boolean);
    aprobadasIds = aprobadasIds.filter(x => !idsEliminar.includes(x));
    localStorage.setItem("ramos_aprobados_ids_marketing", JSON.stringify(aprobadasIds));
    aprobadoPorNombre.clear(); aprobadosNombres().forEach(n => aprobadoPorNombre.add(n));
    render();
  } else {
    if (estaDisponible(ramoNombre)) {
      if (!aprobadasIds.includes(id)) aprobadasIds.push(id);
      localStorage.setItem("ramos_aprobados_ids_marketing", JSON.stringify(aprobadasIds));
      aprobadoPorNombre.add(ramoNombre);
      render();
    } else {
      alert("No puedes aprobar este ramo hasta completar sus prerrequisitos");
    }
  }
};

const calcularCreditos = () => {
  let total = 0, completados = 0;
  for (const [nombre] of Object.entries(ramos)) {
    const c = creditosRamos[nombre];
    if (typeof c === "number") {
      total += c;
      if (aprobadoPorNombre.has(nombre)) completados += c;
    }
  }
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
  return { total, completados, porcentaje };
};

const syncBoxWidths = () => {
  $$(".ramo").forEach(el => {
    const w = Math.round(el.getBoundingClientRect().width);
    el.style.setProperty("--box-w", w + "px");
  });
};

const highlightPrereqs = (nombre, on) => {
  const selfEl = nombreToEl.get(nombre);
  if (selfEl) selfEl.classList.toggle("is-self", on);
  for (const p of (prereqsPorNombre[nombre] || [])) {
    nombreToEl.get(p)?.classList.toggle("is-prereq", on);
  }
};

// ===== Render =====
const render = () => {
  const totalRamos = Object.keys(ramos).length;
  const aprobadosList = aprobadosNombres();
  const { total: creditosTotal, completados: creditosAprobados, porcentaje } = calcularCreditos();

  $("#total-ramos").textContent = totalRamos;
  $("#aprobados-ramos").textContent = aprobadosList.length;
  $("#creditos-total").textContent = `${creditosAprobados}/${creditosTotal}`;
  $("#porcentaje").textContent = `${porcentaje}%`;
  $("#barraProgreso").style.width = porcentaje + "%";
  $("#textoProgreso").textContent = porcentaje + "%";

  const frag = document.createDocumentFragment();
  let semestresRenderizados = 0;
  const nuevoEstado = new Map();
  nombreToEl.clear();

  for (let sem = 1; sem <= maxSemestre; sem++) {
    const ramosSem = (porSemestre[sem] || []).filter(ramo => {
      if (areaSeleccionada !== "all" && areaSeleccionada !== "none") {
        if (ramos[ramo].area !== areaSeleccionada) return false;
      }
      if (busqueda) {
        const b = normalizarTexto(busqueda);
        const n = normalizarTexto(ramo);
        if (!n.includes(b)) return false;
      }
      if (mostrarSoloDisponibles) {
        if (!aprobadoPorNombre.has(ramo) && !estaDisponible(ramo)) return false;
      }
      return true;
    });

    if (!ramosSem.length) continue;

    const cont = document.createElement("div");
    cont.className = "semestre";
    const title = document.createElement("h3");
    title.textContent = `${sem}° Semestre`;
    cont.appendChild(title);

    const innerFrag = document.createDocumentFragment();

    ramosSem.forEach(ramo => {
      const info = ramos[ramo];
      const div = document.createElement("div");
      div.className = "ramo";
      div.dataset.area = info.area;
      div.setAttribute("role", "listitem");
      div.tabIndex = 0;

      const contenido = document.createElement("div");
      const nombreEl = document.createElement("div");
      nombreEl.className = "ramo-nombre";
      nombreEl.textContent = ramo;
      contenido.appendChild(nombreEl);

      const detalles = document.createElement("div");
      detalles.className = "ramo-detalles";
      const cred = creditosRamos[ramo];
      const creditosEl = document.createElement("span");
      creditosEl.className = "ramo-creditos";
      creditosEl.textContent = (typeof cred === "number") ? `${cred} créditos` : "— créditos";
      detalles.appendChild(creditosEl);
      contenido.appendChild(detalles);
      div.appendChild(contenido);

      const prere = prerequisitosDe(ramo);
      const desbloqueado = prere.every(p => aprobadoPorNombre.has(p));
      const estadoKey = `${sem}:${ramo}`;
      nuevoEstado.set(estadoKey, desbloqueado);

      const requiereTxt = prere.length
        ? `Requiere: ${prere.join(", ")}`
        : "Sin prerrequisitos";

      const setTooltip = (txt) => div.setAttribute("data-tooltip", txt);

      if (aprobadoPorNombre.has(ramo)) {
        div.classList.add("aprobado");
        setTooltip(`🟢 Aprobado\nToca para desmarcar ❌`);
        div.onclick = () => aprobar(ramo);
        div.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aprobar(ramo); } };
      } else if (estaDisponible(ramo)) {
        div.classList.add("disponible");
        if (!estadoAnterior.get(estadoKey)) { div.classList.add("desbloqueado"); void div.offsetWidth; }
        setTooltip(`🟡 Disponible\n${requiereTxt}\nToca para aprobar ✅`);
        div.onclick = () => aprobar(ramo);
        div.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); aprobar(ramo); } };
      } else {
        div.classList.add("bloqueado");
        const faltantes = prere.filter(p => !aprobadoPorNombre.has(p));
        setTooltip(`🔒 Bloqueado\n${requiereTxt}\nFaltan: ${faltantes.join(", ") || "—"}`);
      }

      // Resaltado de prerrequisitos
      div.addEventListener("mouseenter", () => highlightPrereqs(ramo, true));
      div.addEventListener("mouseleave", () => highlightPrereqs(ramo, false));
      div.addEventListener("focus", () => highlightPrereqs(ramo, true));
      div.addEventListener("blur", () => highlightPrereqs(ramo, false));
      nombreToEl.set(ramo, div);

      innerFrag.appendChild(div);
    });

    cont.appendChild(innerFrag);
    frag.appendChild(cont);
    semestresRenderizados++;
  }

  malla.innerHTML = "";
  malla.appendChild(frag);

  if (semestresRenderizados === 0) {
    const noResults = document.createElement("div");
    noResults.className = "no-results";
    noResults.innerHTML = `<ion-icon name="search-outline" style="font-size:32px;margin-bottom:8px;"></ion-icon><br>No se encontraron ramos que coincidan con la búsqueda`;
    malla.appendChild(noResults);
  }

  estadoAnterior.clear();
  nuevoEstado.forEach((v, k) => estadoAnterior.set(k, v));

  requestAnimationFrame(syncBoxWidths);
};

// ===== Tooltips touch (simple) =====
const tip = $("#touch-tip");
function hideTip(){ tip.style.display="none"; tip.textContent=""; }
function showTipFor(target){
  const txt = target.getAttribute("data-tooltip"); if (!txt) return;
  tip.textContent = txt; tip.style.display = "block";
  const rect = target.getBoundingClientRect(); const tipRect = tip.getBoundingClientRect();
  let x = rect.left + rect.width/2; let y = rect.top - 8;
  if (rect.top - tipRect.height - 16 < 0) { y = rect.bottom + tipRect.height/2 + 8; }
  tip.style.left = x + "px"; tip.style.top = y + "px"; tip.style.transform = "translate(-50%, -8px)";
  clearTimeout(tip._hideT); tip._hideT = setTimeout(hideTip, 2500);
}
document.addEventListener("touchstart", (e) => {
  const t = e.target.closest(".ramo"); if (!t) return;
  showTipFor(t);
}, {passive:true});
document.addEventListener("scroll", hideTip, true);

// ===== Listeners =====
$$(".area-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active") && btn.dataset.area === areaSeleccionada) {
      btn.classList.remove("active");
      areaSeleccionada = "none";
    } else {
      $$(".area-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      areaSeleccionada = btn.dataset.area;
    }
    render();
  });
});

let debounceTimer = null;
$("#search-input").addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  const v = e.target.value;
  debounceTimer = setTimeout(() => { busqueda = v; render(); }, 120);
});

$("#toggle-disponibles").addEventListener("click", () => {
  mostrarSoloDisponibles = !mostrarSoloDisponibles;
  const boton = $("#toggle-disponibles");
  if (mostrarSoloDisponibles) {
    boton.classList.add("active");
    boton.innerHTML = '<ion-icon name="eye-off-outline"></ion-icon> Mostrar Todos';
  } else {
    boton.classList.remove("active");
    boton.innerHTML = '<ion-icon name="eye-outline"></ion-icon> Solo Disponibles';
  }
  render();
});

$("#btn-reset").addEventListener("click", () => {
  if (confirm("¿Reiniciar todo el progreso?")) {
    localStorage.removeItem("ramos_aprobados_ids_marketing");
    aprobadasIds = [];
    aprobadoPorNombre.clear();
    render();
  }
});

// ===== Primera pinta =====
render();

// ===== Navegación con teclado =====
(function(){
  const isVisible = (el) => !!(el.offsetParent);
  const $ramos = () => Array.from(document.querySelectorAll(".ramo")).filter(isVisible);

  const center = (el) => { const r = el.getBoundingClientRect(); return {x:r.left + r.width/2, y:r.top + r.height/2}; };

  function pickInDirection(from, dir){
    const origin = center(from);
    const candidates = $ramos().filter(el => !el.classList.contains("bloqueado") && el!==from);
    if (!candidates.length) return null;
    const weight = (dx,dy) => {
      if (dir==="ArrowRight" && dx>0) return dx*dx + (dy*dy)*0.7;
      if (dir==="ArrowLeft"  && dx<0) return dx*dx + (dy*dy)*0.7;
      if (dir==="ArrowDown"  && dy>0) return (dy*dy) + (dx*dx)*0.7;
      if (dir==="ArrowUp"    && dy<0) return (dy*dy) + (dx*dx)*0.7;
      return Infinity;
    };
    let best = null, bestScore = Infinity;
    for (const el of candidates){
      const c = center(el);
      const dx = c.x - origin.x, dy = c.y - origin.y;
      const score = weight(dx,dy);
      if (score < bestScore){ bestScore = score; best = el; }
    }
    return Number.isFinite(bestScore) ? best : null;
  }

  document.addEventListener("keydown", (ev) => {
    const { key } = ev;
    const active = document.activeElement;
    const dentroDeRamo = active?.classList?.contains("ramo");

    if ((key === "Enter" || key === " ") && dentroDeRamo){
      ev.preventDefault(); active.click?.(); return;
    }
    if (!["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(key)) return;

    if (!dentroDeRamo){
      const primero = $ramos().find(el => !el.classList.contains("bloqueado"));
      if (primero){ primero.focus(); ev.preventDefault(); }
      return;
    }
    const next = pickInDirection(active, key);
    if (next){ next.focus(); ev.preventDefault(); }
  });
})();
