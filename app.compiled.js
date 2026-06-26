// ============================================================
// SÁNCHEZ MOTOR — APP.JS (React + Supabase)
// ============================================================

const {
  useState,
  useEffect,
  useCallback,
  useRef
} = React;

// Cliente Supabase (usa las constantes de config.js)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============ UTILIDADES ============ */
function euros(n) {
  return (Number(n) || 0).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + " €";
}
function hoy() {
  return new Date().toISOString().slice(0, 10);
}
function fechaBonita(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function numeroFactura(seq, year) {
  return `SM-${year}-${String(seq).padStart(4, "0")}`;
}

/* ============ LOGO ============ */
function LogoMark({
  size = 60
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "47",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 58 L30 40 Q33 34 40 34 L62 34 Q69 34 72 40 L80 58",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 58 L84 58",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "60",
    r: "6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "60",
    r: "6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 34 L44 22 L58 22 L62 34",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}

/* ============ ICONOS ============ */
const Ico = {
  clientes: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 21v-2a4 4 0 0 0-3-3.87"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3.13a4 4 0 0 1 0 7.75"
  })),
  piezas: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
  })),
  ficha: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 2v6h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 13H8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17H8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 9H8"
  })),
  factura: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 2h12l4 4v16H4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 12h8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 16h5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 8h2"
  })),
  panel: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "7",
    height: "9"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "3",
    width: "7",
    height: "5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "12",
    width: "7",
    height: "9"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "16",
    width: "7",
    height: "5"
  })),
  mas: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })),
  editar: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"
  })),
  borrar: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
  })),
  coche: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 17h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 17V11l2-5h12l3 5h2v6"
  })),
  imprimir: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9V2h12v7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 14h12v8H6z"
  })),
  cerrar: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12"
  })),
  ojo: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }))
};

/* ============ TOAST ============ */
function Toast({
  toast,
  onClose
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "toast" + (toast.type === "error" ? " error" : "")
  }, toast.msg);
}

/* ============ MODAL ============ */
function Modal({
  title,
  onClose,
  children,
  wide
}) {
  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onMouseDown: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    style: wide ? {
      maxWidth: 720
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-title"
  }, title), /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Ico.cerrar, null))), children));
}

/* ============ LOGIN (Supabase Auth) ============ */
function Login({
  onLogin
}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const {
      error: err
    } = await sb.auth.signInWithPassword({
      email,
      password: pass
    });
    setLoading(false);
    if (err) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onLogin();
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "login-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "login-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stamp-logo"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--azul-700)"
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 72
  })), /*#__PURE__*/React.createElement("div", {
    className: "brand-title"
  }, "Sánchez Motor"), /*#__PURE__*/React.createElement("div", {
    className: "brand-sub"
  }, "Electromecánica y Neumáticos")), /*#__PURE__*/React.createElement("form", {
    className: "login-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("label", null, "Correo electrónico"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    autoComplete: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "correo@ejemplo.com"
  }), /*#__PURE__*/React.createElement("label", null, "Contraseña"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    autoComplete: "current-password",
    value: pass,
    onChange: e => setPass(e.target.value),
    placeholder: "Contraseña"
  }), error && /*#__PURE__*/React.createElement("div", {
    className: "login-error"
  }, error), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary btn-block",
    disabled: loading
  }, loading ? "Entrando…" : "Entrar")), /*#__PURE__*/React.createElement("div", {
    className: "login-foot"
  }, "Antonio M. Sánchez Triguero · Barcarrota")));
}

/* ============ NAV + SHELL ============ */
const NAV_ITEMS = [{
  key: "panel",
  label: "Panel",
  icon: Ico.panel
}, {
  key: "clientes",
  label: "Clientes",
  icon: Ico.clientes
}, {
  key: "piezas",
  label: "Piezas y stock",
  icon: Ico.piezas
}, {
  key: "facturas",
  label: "Facturas",
  icon: Ico.factura
}];
function AppShell({
  children,
  view,
  setView,
  userEmail,
  onLogout,
  mobileOpen,
  setMobileOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mobile-topbar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 26
  }), /*#__PURE__*/React.createElement("span", {
    className: "mobile-topbar-title"
  }, "Sánchez Motor")), /*#__PURE__*/React.createElement("button", {
    className: "burger",
    onClick: () => setMobileOpen(true)
  }, "☰")), mobileOpen && /*#__PURE__*/React.createElement("div", {
    className: "sidebar-scrim show",
    onClick: () => setMobileOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "sidebar" + (mobileOpen ? " mobile-open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-head"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 36
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-head-text"
  }, "Sánchez Motor"), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-head-sub"
  }, "Gestión de taller"))), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, NAV_ITEMS.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.key,
    className: "nav-item" + (view === item.key ? " active" : ""),
    onClick: () => {
      setView(item.key);
      setMobileOpen(false);
    }
  }, /*#__PURE__*/React.createElement(item.icon, null), item.label))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sidebar-user"
  }, userEmail), /*#__PURE__*/React.createElement("button", {
    className: "logout-btn",
    onClick: onLogout
  }, "Cerrar sesión"))), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, children));
}

/* ============ PANEL ============ */
function Panel({
  setView
}) {
  const [kpis, setKpis] = useState({
    clientes: 0,
    pendientes: 0,
    ingresosMes: 0,
    stockBajo: 0
  });
  const [ultimas, setUltimas] = useState([]);
  useEffect(() => {
    async function cargar() {
      const mesActual = hoy().slice(0, 7);
      const [{
        count: nCli
      }, {
        count: nPend
      }, {
        data: facsMes
      }, {
        count: nStock
      }, {
        data: ults
      }] = await Promise.all([sb.from("clientes").select("*", {
        count: "exact",
        head: true
      }), sb.from("facturas").select("*", {
        count: "exact",
        head: true
      }).eq("estado", "pendiente"), sb.from("facturas").select("total").gte("fecha", mesActual + "-01").lte("fecha", mesActual + "-31").eq("estado", "pagada"), sb.from("piezas").select("*", {
        count: "exact",
        head: true
      }).filter("stock", "lte", "stock_min"), sb.from("facturas").select("numero,cliente_nombre,fecha,total,estado").order("fecha", {
        ascending: false
      }).limit(6)]);
      const ingresosMes = (facsMes || []).reduce((s, f) => s + Number(f.total || 0), 0);
      setKpis({
        clientes: nCli || 0,
        pendientes: nPend || 0,
        ingresosMes,
        stockBajo: nStock || 0
      });
      setUltimas(ults || []);
    }
    cargar();
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Resumen"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Panel del taller"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Clientes"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value"
  }, kpis.clientes)), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Facturas pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value oxido"
  }, kpis.pendientes)), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Ingresado este mes"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value"
  }, euros(kpis.ingresosMes))), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Piezas stock bajo"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value oxido"
  }, kpis.stockBajo))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Últimas facturas"), ultimas.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Ico.factura, null), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-title"
  }, "Todavía no hay facturas")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Nº factura"), /*#__PURE__*/React.createElement("th", null, "Cliente"), /*#__PURE__*/React.createElement("th", null, "Fecha"), /*#__PURE__*/React.createElement("th", null, "Importe"), /*#__PURE__*/React.createElement("th", null, "Estado"))), /*#__PURE__*/React.createElement("tbody", null, ultimas.map((f, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, f.numero), /*#__PURE__*/React.createElement("td", null, f.cliente_nombre), /*#__PURE__*/React.createElement("td", null, fechaBonita(f.fecha)), /*#__PURE__*/React.createElement("td", null, euros(f.total)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "badge " + (f.estado === "pagada" ? "badge-ok" : "badge-pend")
  }, f.estado === "pagada" ? "Pagada" : "Pendiente")))))))), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setView("clientes")
  }, "Ir a clientes"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setView("facturas")
  }, "Ver todas las facturas")));
}

/* ============ PIEZAS ============ */
function FormPieza({
  inicial,
  onSave,
  onCancel,
  loading
}) {
  const [f, setF] = useState(inicial || {
    nombre: "",
    referencia: "",
    precio: "",
    stock: "",
    stock_min: "",
    proveedor: ""
  });
  const u = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  function submit(e) {
    e.preventDefault();
    if (!f.nombre.trim()) return;
    onSave({
      nombre: f.nombre,
      referencia: f.referencia,
      precio: Number(f.precio) || 0,
      stock: Number(f.stock) || 0,
      stock_min: Number(f.stock_min) || 0,
      proveedor: f.proveedor
    });
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Nombre *"), /*#__PURE__*/React.createElement("input", {
    value: f.nombre,
    onChange: e => u("nombre", e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Referencia"), /*#__PURE__*/React.createElement("input", {
    value: f.referencia,
    onChange: e => u("referencia", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Precio (€)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    min: "0",
    value: f.precio,
    onChange: e => u("precio", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Stock actual"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: f.stock,
    onChange: e => u("stock", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Stock mínimo"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    value: f.stock_min,
    onChange: e => u("stock_min", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Proveedor"), /*#__PURE__*/React.createElement("input", {
    value: f.proveedor,
    onChange: e => u("proveedor", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: loading
  }, loading ? "Guardando…" : "Guardar pieza"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onCancel
  }, "Cancelar")));
}
function Piezas({
  notify
}) {
  const [piezas, setPiezas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);
  async function cargar() {
    const {
      data
    } = await sb.from("piezas").select("*").order("nombre");
    setPiezas(data || []);
  }
  useEffect(() => {
    cargar();
  }, []);
  const filtradas = piezas.filter(p => (p.nombre + " " + (p.referencia || "") + " " + (p.proveedor || "")).toLowerCase().includes(busqueda.toLowerCase()));
  async function guardar(datos) {
    setSaving(true);
    if (modal === "nueva") {
      const {
        error
      } = await sb.from("piezas").insert(datos);
      if (error) {
        notify("Error al guardar: " + error.message, "error");
      } else {
        notify("Pieza añadida.");
        setModal(null);
        cargar();
      }
    } else {
      const {
        error
      } = await sb.from("piezas").update(datos).eq("id", modal.edit.id);
      if (error) {
        notify("Error al guardar: " + error.message, "error");
      } else {
        notify("Pieza actualizada.");
        setModal(null);
        cargar();
      }
    }
    setSaving(false);
  }
  async function eliminar(id) {
    const {
      error
    } = await sb.from("piezas").delete().eq("id", id);
    if (error) notify("Error al eliminar: " + error.message, "error");else {
      notify("Pieza eliminada.");
      setConfirmDel(null);
      cargar();
    }
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Administración"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Piezas y stock")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setModal("nueva")
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico.mas, {
    style: {
      width: 15,
      height: 15
    }
  }), "Añadir pieza"))), /*#__PURE__*/React.createElement("div", {
    className: "search-bar"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar por nombre, referencia o proveedor…",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, filtradas.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Ico.piezas, null), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-title"
  }, piezas.length === 0 ? "Sin piezas registradas" : "Sin resultados")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Pieza"), /*#__PURE__*/React.createElement("th", null, "Referencia"), /*#__PURE__*/React.createElement("th", null, "Precio"), /*#__PURE__*/React.createElement("th", null, "Stock"), /*#__PURE__*/React.createElement("th", null, "Proveedor"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, filtradas.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id
  }, /*#__PURE__*/React.createElement("td", null, p.nombre), /*#__PURE__*/React.createElement("td", null, p.referencia || "—"), /*#__PURE__*/React.createElement("td", null, euros(p.precio)), /*#__PURE__*/React.createElement("td", null, p.stock, Number(p.stock) <= Number(p.stock_min || 0) && /*#__PURE__*/React.createElement("span", {
    className: "badge badge-pend",
    style: {
      marginLeft: 8
    }
  }, "Stock bajo")), /*#__PURE__*/React.createElement("td", null, p.proveedor || "—"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => setModal({
      edit: p
    })
  }, /*#__PURE__*/React.createElement(Ico.editar, null)), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => setConfirmDel(p)
  }, /*#__PURE__*/React.createElement(Ico.borrar, null)))))))))), modal === "nueva" && /*#__PURE__*/React.createElement(Modal, {
    title: "Añadir pieza",
    onClose: () => setModal(null)
  }, /*#__PURE__*/React.createElement(FormPieza, {
    onSave: guardar,
    onCancel: () => setModal(null),
    loading: saving
  })), modal && modal !== "nueva" && /*#__PURE__*/React.createElement(Modal, {
    title: "Editar pieza",
    onClose: () => setModal(null)
  }, /*#__PURE__*/React.createElement(FormPieza, {
    inicial: modal.edit,
    onSave: guardar,
    onCancel: () => setModal(null),
    loading: saving
  })), confirmDel && /*#__PURE__*/React.createElement(Modal, {
    title: "Eliminar pieza",
    onClose: () => setConfirmDel(null)
  }, /*#__PURE__*/React.createElement("p", null, "¿Eliminar ", /*#__PURE__*/React.createElement("strong", null, confirmDel.nombre), " del inventario?"), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => eliminar(confirmDel.id)
  }, "Eliminar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setConfirmDel(null)
  }, "Cancelar"))));
}

/* ============ FORM CLIENTE ============ */
function FormCliente({
  inicial,
  onSave,
  onCancel,
  loading
}) {
  const [f, setF] = useState(inicial || {
    nombre: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    matricula: "",
    marca: "",
    modelo: "",
    anio: "",
    bastidor: ""
  });
  const u = (k, v) => setF(p => ({
    ...p,
    [k]: v
  }));
  function submit(e) {
    e.preventDefault();
    if (!f.nombre.trim() || !f.matricula.trim()) return;
    onSave(f);
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title",
    style: {
      marginTop: 0,
      border: "none",
      paddingBottom: 4
    }
  }, "Datos del cliente"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Nombre y apellidos *"), /*#__PURE__*/React.createElement("input", {
    value: f.nombre,
    onChange: e => u("nombre", e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "DNI / NIF"), /*#__PURE__*/React.createElement("input", {
    value: f.dni,
    onChange: e => u("dni", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Teléfono"), /*#__PURE__*/React.createElement("input", {
    value: f.telefono,
    onChange: e => u("telefono", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: f.email,
    onChange: e => u("email", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Dirección"), /*#__PURE__*/React.createElement("input", {
    value: f.direccion,
    onChange: e => u("direccion", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-title",
    style: {
      paddingBottom: 4
    }
  }, "Datos del vehículo"), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Matrícula *"), /*#__PURE__*/React.createElement("input", {
    value: f.matricula,
    onChange: e => u("matricula", e.target.value.toUpperCase())
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Año"), /*#__PURE__*/React.createElement("input", {
    value: f.anio,
    onChange: e => u("anio", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Marca"), /*#__PURE__*/React.createElement("input", {
    value: f.marca,
    onChange: e => u("marca", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Modelo"), /*#__PURE__*/React.createElement("input", {
    value: f.modelo,
    onChange: e => u("modelo", e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Nº de bastidor"), /*#__PURE__*/React.createElement("input", {
    value: f.bastidor,
    onChange: e => u("bastidor", e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: loading
  }, loading ? "Guardando…" : "Guardar cliente"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onCancel
  }, "Cancelar")));
}

/* ============ LISTA CLIENTES ============ */
function Clientes({
  notify,
  abrirFicha
}) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);
  async function cargar() {
    const {
      data
    } = await sb.from("clientes").select("*").order("nombre");
    setClientes(data || []);
  }
  useEffect(() => {
    cargar();
  }, []);
  const filtrados = clientes.filter(c => (c.nombre + " " + c.matricula + " " + (c.marca || "") + " " + (c.modelo || "")).toLowerCase().includes(busqueda.toLowerCase()));
  async function guardar(datos) {
    setSaving(true);
    if (modal === "nuevo") {
      const {
        error
      } = await sb.from("clientes").insert(datos);
      if (error) notify("Error: " + error.message, "error");else {
        notify("Cliente añadido.");
        setModal(null);
        cargar();
      }
    } else {
      const {
        error
      } = await sb.from("clientes").update(datos).eq("id", modal.edit.id);
      if (error) notify("Error: " + error.message, "error");else {
        notify("Cliente actualizado.");
        setModal(null);
        cargar();
      }
    }
    setSaving(false);
  }
  async function eliminar(id) {
    const {
      error
    } = await sb.from("clientes").delete().eq("id", id);
    if (error) notify("Error: " + error.message, "error");else {
      notify("Cliente eliminado.");
      setConfirmDel(null);
      cargar();
    }
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Administración"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Clientes y vehículos")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setModal("nuevo")
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico.mas, {
    style: {
      width: 15,
      height: 15
    }
  }), "Añadir cliente"))), /*#__PURE__*/React.createElement("div", {
    className: "search-bar"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar por nombre, matrícula, marca o modelo…",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, filtrados.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Ico.clientes, null), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-title"
  }, clientes.length === 0 ? "Sin clientes" : "Sin resultados")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Cliente"), /*#__PURE__*/React.createElement("th", null, "Vehículo"), /*#__PURE__*/React.createElement("th", null, "Matrícula"), /*#__PURE__*/React.createElement("th", null, "Teléfono"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, filtrados.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    className: "client-row",
    onClick: () => abrirFicha(c.id)
  }, /*#__PURE__*/React.createElement("td", null, c.nombre), /*#__PURE__*/React.createElement("td", null, [c.marca, c.modelo].filter(Boolean).join(" ") || "—"), /*#__PURE__*/React.createElement("td", null, c.matricula), /*#__PURE__*/React.createElement("td", null, c.telefono || "—"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => abrirFicha(c.id)
  }, /*#__PURE__*/React.createElement(Ico.ojo, null)), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => setModal({
      edit: c
    })
  }, /*#__PURE__*/React.createElement(Ico.editar, null)), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => setConfirmDel(c)
  }, /*#__PURE__*/React.createElement(Ico.borrar, null)))))))))), modal === "nuevo" && /*#__PURE__*/React.createElement(Modal, {
    title: "Añadir cliente",
    onClose: () => setModal(null),
    wide: true
  }, /*#__PURE__*/React.createElement(FormCliente, {
    onSave: guardar,
    onCancel: () => setModal(null),
    loading: saving
  })), modal && modal !== "nuevo" && /*#__PURE__*/React.createElement(Modal, {
    title: "Editar cliente",
    onClose: () => setModal(null),
    wide: true
  }, /*#__PURE__*/React.createElement(FormCliente, {
    inicial: modal.edit,
    onSave: guardar,
    onCancel: () => setModal(null),
    loading: saving
  })), confirmDel && /*#__PURE__*/React.createElement(Modal, {
    title: "Eliminar cliente",
    onClose: () => setConfirmDel(null)
  }, /*#__PURE__*/React.createElement("p", null, "¿Eliminar a ", /*#__PURE__*/React.createElement("strong", null, confirmDel.nombre), " y todo su historial? No se puede deshacer."), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => eliminar(confirmDel.id)
  }, "Eliminar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setConfirmDel(null)
  }, "Cancelar"))));
}

/* ============ FORM TRABAJO ============ */
function FormTrabajo({
  clienteId,
  onSave,
  onCancel,
  loading
}) {
  const [piezasDisp, setPiezasDisp] = useState([]);
  const [fecha, setFecha] = useState(hoy());
  const [descripcion, setDescripcion] = useState("");
  const [manoObra, setManoObra] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [lineas, setLineas] = useState([]);
  useEffect(() => {
    sb.from("piezas").select("id,nombre,precio").order("nombre").then(({
      data
    }) => setPiezasDisp(data || []));
  }, []);
  function addLinea() {
    setLineas(l => [...l, {
      pieza_id: "",
      nombre: "",
      precio: 0,
      cantidad: 1
    }]);
  }
  function updLinea(i, k, v) {
    setLineas(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      if (k === "pieza_id") {
        const pz = piezasDisp.find(p => p.id === v);
        return {
          ...l,
          pieza_id: v,
          nombre: pz ? pz.nombre : "",
          precio: pz ? pz.precio : 0
        };
      }
      return {
        ...l,
        [k]: v
      };
    }));
  }
  function delLinea(i) {
    setLineas(l => l.filter((_, idx) => idx !== i));
  }
  const totalPiezas = lineas.reduce((s, l) => s + (Number(l.precio) || 0) * (Number(l.cantidad) || 0), 0);
  const total = totalPiezas + (Number(manoObra) || 0);
  function submit(e) {
    e.preventDefault();
    if (!descripcion.trim()) return;
    onSave({
      fecha,
      descripcion,
      mano_obra: Number(manoObra) || 0,
      estado,
      total,
      lineas: lineas.filter(l => l.nombre)
    });
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Fecha"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: fecha,
    onChange: e => setFecha(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Estado"), /*#__PURE__*/React.createElement("select", {
    value: estado,
    onChange: e => setEstado(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "pendiente"
  }, "Pendiente"), /*#__PURE__*/React.createElement("option", {
    value: "completado"
  }, "Completado")))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Descripción del trabajo *"), /*#__PURE__*/React.createElement("textarea", {
    value: descripcion,
    onChange: e => setDescripcion(e.target.value),
    autoFocus: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Piezas utilizadas"), lineas.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8,
      alignItems: "flex-end",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("select", {
    style: {
      flex: 2,
      minWidth: 140,
      padding: "9px 10px",
      border: "1px solid var(--linea)",
      borderRadius: 3,
      fontFamily: "inherit"
    },
    value: l.pieza_id,
    onChange: e => updLinea(i, "pieza_id", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Selecciona pieza…"), piezasDisp.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nombre, " (", euros(p.precio), ")"))), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    style: {
      width: 70,
      padding: "9px 10px",
      border: "1px solid var(--linea)",
      borderRadius: 3,
      fontFamily: "inherit"
    },
    value: l.cantidad,
    onChange: e => updLinea(i, "cantidad", Number(e.target.value))
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn danger",
    onClick: () => delLinea(i)
  }, /*#__PURE__*/React.createElement(Ico.borrar, null)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary btn-sm",
    onClick: addLinea
  }, "+ Añadir pieza")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Mano de obra (€)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    min: "0",
    value: manoObra,
    onChange: e => setManoObra(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "summary-row total"
  }, /*#__PURE__*/React.createElement("span", null, "Total del trabajo"), /*#__PURE__*/React.createElement("span", null, euros(total))), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: loading
  }, loading ? "Guardando…" : "Guardar trabajo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onCancel
  }, "Cancelar")));
}

/* ============ FICHA CLIENTE ============ */
function FichaCliente({
  clienteId,
  notify,
  onVolver,
  onFacturar
}) {
  const [cliente, setCliente] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [modalTrabajo, setModalTrabajo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [confirmDelTrabajo, setConfirmDelTrabajo] = useState(null);
  const [saving, setSaving] = useState(false);
  async function cargar() {
    const [{
      data: cli
    }, {
      data: tr
    }] = await Promise.all([sb.from("clientes").select("*").eq("id", clienteId).single(), sb.from("trabajos").select("*, trabajo_piezas(*)").eq("cliente_id", clienteId).order("fecha", {
      ascending: false
    })]);
    setCliente(cli);
    setTrabajos(tr || []);
  }
  useEffect(() => {
    cargar();
  }, [clienteId]);
  async function guardarTrabajo({
    fecha,
    descripcion,
    mano_obra,
    estado,
    total,
    lineas
  }) {
    setSaving(true);
    const {
      data: tr,
      error
    } = await sb.from("trabajos").insert({
      cliente_id: clienteId,
      fecha,
      descripcion,
      mano_obra,
      estado,
      total
    }).select().single();
    if (error) {
      notify("Error: " + error.message, "error");
      setSaving(false);
      return;
    }
    if (lineas.length > 0) {
      await sb.from("trabajo_piezas").insert(lineas.map(l => ({
        trabajo_id: tr.id,
        pieza_id: l.pieza_id || null,
        nombre: l.nombre,
        precio: l.precio,
        cantidad: l.cantidad
      })));
    }
    setSaving(false);
    setModalTrabajo(false);
    notify("Trabajo añadido.");
    cargar();
  }
  async function eliminarTrabajo(id) {
    await sb.from("trabajos").delete().eq("id", id);
    setConfirmDelTrabajo(null);
    notify("Trabajo eliminado.");
    cargar();
  }
  async function guardarEdicionCliente(datos) {
    setSaving(true);
    const {
      error
    } = await sb.from("clientes").update(datos).eq("id", clienteId);
    if (error) notify("Error: " + error.message, "error");else {
      notify("Datos actualizados.");
      setModalEditar(false);
      cargar();
    }
    setSaving(false);
  }
  if (!cliente) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      color: "var(--metal)"
    }
  }, "Cargando ficha…");
  const totalHistorico = trabajos.reduce((s, t) => s + (Number(t.total) || 0), 0);
  const pendientes = trabajos.filter(t => t.estado === "pendiente").length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Ficha de cliente"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, cliente.nombre)), /*#__PURE__*/React.createElement("div", {
    className: "btn-row",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: onVolver
  }, "← Volver"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => setModalEditar(true)
  }, "Editar datos"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-oxido btn-sm",
    onClick: () => onFacturar(cliente, trabajos)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico.factura, {
    style: {
      width: 14,
      height: 14
    }
  }), "Generar factura")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Datos del cliente"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "DNI:"), " ", cliente.dni || "—"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Teléfono:"), " ", cliente.telefono || "—"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Email:"), " ", cliente.email || "—"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Dirección:"), " ", cliente.direccion || "—")), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title"
  }, "Vehículo"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Matrícula:"), " ", cliente.matricula), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Marca / modelo:"), " ", [cliente.marca, cliente.modelo].filter(Boolean).join(" ") || "—"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Año:"), " ", cliente.anio || "—"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Bastidor:"), " ", cliente.bastidor || "—"))), /*#__PURE__*/React.createElement("div", {
    className: "kpi-row",
    style: {
      gridTemplateColumns: "1fr 1fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Trabajos"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value"
  }, trabajos.length)), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value oxido"
  }, pendientes)), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Total histórico"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-value"
  }, euros(totalHistorico)))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title",
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Historial de trabajos"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setModalTrabajo(true)
  }, "+ Añadir trabajo")), trabajos.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Ico.coche, null), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-title"
  }, "Sin trabajos registrados")) : trabajos.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "work-tab" + (t.estado === "pendiente" ? " pend" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "work-tab-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "work-tab-date"
  }, fechaBonita(t.fecha)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge " + (t.estado === "pendiente" ? "badge-pend" : "badge-ok")
  }, t.estado === "pendiente" ? "Pendiente" : "Completado"), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn danger",
    onClick: () => setConfirmDelTrabajo(t)
  }, /*#__PURE__*/React.createElement(Ico.borrar, null)))), /*#__PURE__*/React.createElement("div", {
    className: "work-tab-desc"
  }, t.descripcion), t.trabajo_piezas?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "work-tab-parts"
  }, "Piezas: ", t.trabajo_piezas.map(p => `${p.nombre} (x${p.cantidad})`).join(", ")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "work-tab-parts"
  }, "Mano de obra: ", euros(t.mano_obra)), /*#__PURE__*/React.createElement("span", {
    className: "work-tab-price"
  }, euros(t.total)))))), modalTrabajo && /*#__PURE__*/React.createElement(Modal, {
    title: "Añadir trabajo",
    onClose: () => setModalTrabajo(false),
    wide: true
  }, /*#__PURE__*/React.createElement(FormTrabajo, {
    clienteId: clienteId,
    onSave: guardarTrabajo,
    onCancel: () => setModalTrabajo(false),
    loading: saving
  })), modalEditar && /*#__PURE__*/React.createElement(Modal, {
    title: "Editar datos",
    onClose: () => setModalEditar(false),
    wide: true
  }, /*#__PURE__*/React.createElement(FormCliente, {
    inicial: cliente,
    onSave: guardarEdicionCliente,
    onCancel: () => setModalEditar(false),
    loading: saving
  })), confirmDelTrabajo && /*#__PURE__*/React.createElement(Modal, {
    title: "Eliminar trabajo",
    onClose: () => setConfirmDelTrabajo(null)
  }, /*#__PURE__*/React.createElement("p", null, "¿Eliminar este trabajo del historial?"), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger",
    onClick: () => eliminarTrabajo(confirmDelTrabajo.id)
  }, "Eliminar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: () => setConfirmDelTrabajo(null)
  }, "Cancelar"))));
}

/* ============ CONSTRUCTOR DE FACTURA ============ */
function ConstructorFactura({
  cliente,
  trabajos,
  onGenerar,
  onCancel,
  saving
}) {
  const [seleccion, setSeleccion] = useState(trabajos.filter(t => t.estado === "pendiente").map(t => t.id));
  const [ivaPct, setIvaPct] = useState(21);
  const [observaciones, setObservaciones] = useState("");
  function toggle(id) {
    setSeleccion(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  const sel = trabajos.filter(t => seleccion.includes(t.id));
  const base = sel.reduce((s, t) => s + (Number(t.total) || 0), 0);
  const iva = base * (Number(ivaPct) / 100);
  const total = base + iva;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Trabajos a incluir"), trabajos.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--metal)"
    }
  }, "Sin trabajos registrados.") : trabajos.map(t => /*#__PURE__*/React.createElement("label", {
    key: t.id,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      padding: "10px 0",
      borderBottom: "1px solid var(--papel-2)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: seleccion.includes(t.id),
    onChange: () => toggle(t.id),
    style: {
      marginTop: 3
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("strong", null, fechaBonita(t.fecha)), " — ", t.descripcion), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: "var(--azul-900)"
    }
  }, euros(t.total))))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "IVA (%)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "0",
    max: "100",
    value: ivaPct,
    onChange: e => setIvaPct(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Observaciones"), /*#__PURE__*/React.createElement("textarea", {
    value: observaciones,
    onChange: e => setObservaciones(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "Base imponible"), /*#__PURE__*/React.createElement("span", null, euros(base))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "IVA (", ivaPct, "%)"), /*#__PURE__*/React.createElement("span", null, euros(iva))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row total"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, euros(total))), /*#__PURE__*/React.createElement("div", {
    className: "btn-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    disabled: sel.length === 0 || saving,
    onClick: () => onGenerar({
      sel,
      base,
      ivaPct: Number(ivaPct),
      iva,
      total,
      observaciones
    })
  }, saving ? "Generando…" : "Generar factura"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    onClick: onCancel
  }, "Cancelar")));
}

/* ============ VISTA FACTURA ============ */
function VistaFactura({
  facturaId,
  notify,
  onVolver
}) {
  const [factura, setFactura] = useState(null);
  const [lineas, setLineas] = useState([]);
  async function cargar() {
    const [{
      data: f
    }, {
      data: l
    }] = await Promise.all([sb.from("facturas").select("*").eq("id", facturaId).single(), sb.from("factura_lineas").select("*").eq("factura_id", facturaId)]);
    setFactura(f);
    setLineas(l || []);
  }
  useEffect(() => {
    cargar();
  }, [facturaId]);
  async function marcarEstado(estado) {
    await sb.from("facturas").update({
      estado
    }).eq("id", facturaId);
    notify(estado === "pagada" ? "Factura marcada como pagada." : "Factura marcada como pendiente.");
    cargar();
  }
  if (!factura) return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 40,
      color: "var(--metal)"
    }
  }, "Cargando factura…");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head no-print"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Factura"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, factura.numero)), /*#__PURE__*/React.createElement("div", {
    className: "btn-row",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: onVolver
  }, "← Volver"), factura.estado === "pendiente" ? /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => marcarEstado("pagada")
  }, "Marcar como pagada") : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    onClick: () => marcarEstado("pendiente")
  }, "Marcar como pendiente"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => window.print()
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ico.imprimir, {
    style: {
      width: 14,
      height: 14
    }
  }), "Imprimir / PDF")))), /*#__PURE__*/React.createElement("div", {
    className: "invoice-paper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-brand"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--azul-700)"
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 54
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "invoice-brand-name"
  }, TALLER.nombre), /*#__PURE__*/React.createElement("div", {
    className: "invoice-brand-sub"
  }, TALLER.actividad), /*#__PURE__*/React.createElement("div", {
    className: "invoice-brand-sub"
  }, TALLER.titular, " · NIF ", TALLER.nif), /*#__PURE__*/React.createElement("div", {
    className: "invoice-brand-sub"
  }, TALLER.direccion, ", ", TALLER.cp, " ", TALLER.localidad))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-meta"
  }, /*#__PURE__*/React.createElement("strong", null, factura.numero), "Fecha: ", fechaBonita(factura.fecha)), /*#__PURE__*/React.createElement("div", {
    className: "invoice-stamp" + (factura.estado === "pagada" ? " pagado" : "")
  }, factura.estado === "pagada" ? "Pagado" : "Pendiente"))), /*#__PURE__*/React.createElement("div", {
    className: "invoice-cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-section-title"
  }, "Cliente"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, factura.cliente_nombre)), /*#__PURE__*/React.createElement("p", null, factura.cliente_dni || ""), /*#__PURE__*/React.createElement("p", null, factura.cliente_direccion || ""), /*#__PURE__*/React.createElement("p", null, factura.cliente_telefono || "")), /*#__PURE__*/React.createElement("div", {
    className: "invoice-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "invoice-section-title"
  }, "Vehículo"), /*#__PURE__*/React.createElement("p", null, [factura.vehiculo_marca, factura.vehiculo_modelo].filter(Boolean).join(" ") || "—"), /*#__PURE__*/React.createElement("p", null, "Matrícula: ", factura.vehiculo_matricula), factura.vehiculo_anio && /*#__PURE__*/React.createElement("p", null, "Año: ", factura.vehiculo_anio))), /*#__PURE__*/React.createElement("div", {
    className: "invoice-section-title"
  }, "Trabajos realizados"), /*#__PURE__*/React.createElement("table", {
    className: "invoice-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Descripción"), /*#__PURE__*/React.createElement("th", null, "Piezas"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right"
    }
  }, "Importe"))), /*#__PURE__*/React.createElement("tbody", null, lineas.map((l, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, l.descripcion), /*#__PURE__*/React.createElement("td", null, l.piezas_texto || "—"), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "right"
    }
  }, euros(l.total)))))), /*#__PURE__*/React.createElement("div", {
    className: "invoice-totals"
  }, /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "Base imponible"), /*#__PURE__*/React.createElement("span", null, euros(factura.base))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row"
  }, /*#__PURE__*/React.createElement("span", null, "IVA (", factura.iva_pct, "%)"), /*#__PURE__*/React.createElement("span", null, euros(factura.iva))), /*#__PURE__*/React.createElement("div", {
    className: "summary-row total"
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, euros(factura.total)))), factura.observaciones && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 18,
      fontSize: "0.85rem",
      color: "var(--metal)"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Observaciones:"), " ", factura.observaciones), /*#__PURE__*/React.createElement("div", {
    className: "invoice-footer-note"
  }, TALLER.nombre, " · ", TALLER.titular, " · NIF ", TALLER.nif, " · ", TALLER.direccion, ", ", TALLER.cp, " ", TALLER.localidad)));
}

/* ============ LISTADO FACTURAS ============ */
function Facturas({
  notify,
  abrirFactura
}) {
  const [facturas, setFacturas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  useEffect(() => {
    sb.from("facturas").select("*").order("fecha", {
      ascending: false
    }).then(({
      data
    }) => setFacturas(data || []));
  }, []);
  const filtradas = facturas.filter(f => (f.numero + " " + f.cliente_nombre).toLowerCase().includes(busqueda.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "page-eyebrow"
  }, "Facturación"), /*#__PURE__*/React.createElement("div", {
    className: "page-title"
  }, "Facturas"))), /*#__PURE__*/React.createElement("div", {
    className: "search-bar"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar por número o cliente…",
    value: busqueda,
    onChange: e => setBusqueda(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, filtradas.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement(Ico.factura, null), /*#__PURE__*/React.createElement("div", {
    className: "empty-state-title"
  }, facturas.length === 0 ? "Sin facturas todavía" : "Sin resultados")) : /*#__PURE__*/React.createElement("div", {
    className: "table-wrap"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Nº"), /*#__PURE__*/React.createElement("th", null, "Cliente"), /*#__PURE__*/React.createElement("th", null, "Matrícula"), /*#__PURE__*/React.createElement("th", null, "Fecha"), /*#__PURE__*/React.createElement("th", null, "Importe"), /*#__PURE__*/React.createElement("th", null, "Estado"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, filtradas.map(f => /*#__PURE__*/React.createElement("tr", {
    key: f.id,
    className: "client-row",
    onClick: () => abrirFactura(f.id)
  }, /*#__PURE__*/React.createElement("td", null, f.numero), /*#__PURE__*/React.createElement("td", null, f.cliente_nombre), /*#__PURE__*/React.createElement("td", null, f.vehiculo_matricula), /*#__PURE__*/React.createElement("td", null, fechaBonita(f.fecha)), /*#__PURE__*/React.createElement("td", null, euros(f.total)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "badge " + (f.estado === "pagada" ? "badge-ok" : "badge-pend")
  }, f.estado === "pagada" ? "Pagada" : "Pendiente")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: e => {
      e.stopPropagation();
      abrirFactura(f.id);
    }
  }, /*#__PURE__*/React.createElement(Ico.ojo, null))))))))));
}

/* ============ APP PRINCIPAL ============ */
function App() {
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState(null);
  const [view, setView] = useState("panel");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [fichaId, setFichaId] = useState(null);
  const [facturaId, setFacturaId] = useState(null);
  const [modalFac, setModalFac] = useState(null); // { cliente, trabajos }
  const [savingFac, setSavingFac] = useState(false);
  const notify = useCallback((msg, type) => setToast({
    msg,
    type,
    t: Date.now()
  }), []);

  // Verificar sesión al arrancar
  useEffect(() => {
    sb.auth.getSession().then(({
      data
    }) => {
      setSesion(data.session);
      setCargando(false);
    });
    const {
      data: {
        subscription
      }
    } = sb.auth.onAuthStateChange((_event, session) => {
      setSesion(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  async function handleLogout() {
    await sb.auth.signOut();
    setView("panel");
    setFichaId(null);
    setFacturaId(null);
  }
  async function generarFactura({
    sel,
    base,
    ivaPct,
    iva,
    total,
    observaciones
  }) {
    setSavingFac(true);
    const {
      cliente
    } = modalFac;
    const year = new Date().getFullYear();

    // Obtener y actualizar el contador correlativo
    const {
      data: cnt
    } = await sb.from("contador_facturas").select("siguiente_numero").eq("anio", year).single();
    let seq = cnt ? cnt.siguiente_numero : 1;
    await sb.from("contador_facturas").upsert({
      anio: year,
      siguiente_numero: seq + 1
    });
    const numero = numeroFactura(seq, year);
    const fecha = hoy();

    // Insertar factura
    const {
      data: fac,
      error
    } = await sb.from("facturas").insert({
      numero,
      fecha,
      cliente_id: cliente.id,
      cliente_nombre: cliente.nombre,
      cliente_dni: cliente.dni,
      cliente_direccion: cliente.direccion,
      cliente_telefono: cliente.telefono,
      vehiculo_marca: cliente.marca,
      vehiculo_modelo: cliente.modelo,
      vehiculo_matricula: cliente.matricula,
      vehiculo_anio: cliente.anio,
      base,
      iva_pct: ivaPct,
      iva,
      total,
      observaciones,
      estado: "pendiente"
    }).select().single();
    if (error) {
      notify("Error al generar factura: " + error.message, "error");
      setSavingFac(false);
      return;
    }

    // Insertar líneas
    const lineas = sel.map(t => ({
      factura_id: fac.id,
      trabajo_id: t.id,
      descripcion: t.descripcion,
      piezas_texto: (t.trabajo_piezas || []).map(p => `${p.nombre} (x${p.cantidad})`).join(", "),
      total: t.total
    }));
    if (lineas.length > 0) await sb.from("factura_lineas").insert(lineas);

    // Marcar trabajos como completados
    await sb.from("trabajos").update({
      estado: "completado"
    }).in("id", sel.map(t => t.id));
    setSavingFac(false);
    setModalFac(null);
    notify("Factura " + numero + " generada.");
    setFacturaId(fac.id);
    setView("verFactura");
  }
  if (cargando) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      color: "var(--azul-700)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 50
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: "0.85rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em"
    }
  }, "Cargando…")));
  if (!sesion) return /*#__PURE__*/React.createElement(Login, {
    onLogin: () => {}
  });

  // Comprobación de configuración pendiente
  const sinConfigurar = SUPABASE_URL.includes("XXXXXXXX");
  let contenido;
  if (sinConfigurar) {
    contenido = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "page-title"
    }, "Configuración pendiente"))), /*#__PURE__*/React.createElement("div", {
      className: "banner-warn"
    }, /*#__PURE__*/React.createElement("strong", null, "⚠ Falta configurar Supabase."), " Abre el archivo ", /*#__PURE__*/React.createElement("code", null, "config.js"), " y sustituye ", /*#__PURE__*/React.createElement("code", null, "SUPABASE_URL"), " y ", /*#__PURE__*/React.createElement("code", null, "SUPABASE_ANON_KEY"), " con los valores reales de tu proyecto en ", /*#__PURE__*/React.createElement("a", {
      href: "https://supabase.com",
      target: "_blank"
    }, "supabase.com"), " → Settings → API."));
  } else if (view === "panel") {
    contenido = /*#__PURE__*/React.createElement(Panel, {
      setView: setView
    });
  } else if (view === "clientes") {
    contenido = /*#__PURE__*/React.createElement(Clientes, {
      notify: notify,
      abrirFicha: id => {
        setFichaId(id);
        setView("ficha");
      }
    });
  } else if (view === "piezas") {
    contenido = /*#__PURE__*/React.createElement(Piezas, {
      notify: notify
    });
  } else if (view === "facturas") {
    contenido = /*#__PURE__*/React.createElement(Facturas, {
      notify: notify,
      abrirFactura: id => {
        setFacturaId(id);
        setView("verFactura");
      }
    });
  } else if (view === "ficha" && fichaId) {
    contenido = /*#__PURE__*/React.createElement(FichaCliente, {
      clienteId: fichaId,
      notify: notify,
      onVolver: () => {
        setFichaId(null);
        setView("clientes");
      },
      onFacturar: (cli, tr) => setModalFac({
        cliente: cli,
        trabajos: tr
      })
    });
  } else if (view === "verFactura" && facturaId) {
    contenido = /*#__PURE__*/React.createElement(VistaFactura, {
      facturaId: facturaId,
      notify: notify,
      onVolver: () => {
        setFacturaId(null);
        setView("facturas");
      }
    });
  } else {
    contenido = /*#__PURE__*/React.createElement(Panel, {
      setView: setView
    });
  }
  const navView = view === "ficha" ? "clientes" : view === "verFactura" ? "facturas" : view;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AppShell, {
    view: navView,
    setView: setView,
    userEmail: sesion.user?.email,
    onLogout: handleLogout,
    mobileOpen: mobileOpen,
    setMobileOpen: setMobileOpen
  }, contenido), /*#__PURE__*/React.createElement(Toast, {
    toast: toast,
    onClose: () => setToast(null)
  }), modalFac && /*#__PURE__*/React.createElement(Modal, {
    title: "Generar factura — " + modalFac.cliente.nombre,
    onClose: () => setModalFac(null),
    wide: true
  }, /*#__PURE__*/React.createElement(ConstructorFactura, {
    cliente: modalFac.cliente,
    trabajos: modalFac.trabajos,
    onGenerar: generarFactura,
    onCancel: () => setModalFac(null),
    saving: savingFac
  })));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));
