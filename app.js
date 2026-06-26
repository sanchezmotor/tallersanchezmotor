// ============================================================
// SÁNCHEZ MOTOR — APP.JS (React + Supabase)
// ============================================================

const { useState, useEffect, useCallback, useRef } = React;

// Cliente Supabase (usa las constantes de config.js)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============ UTILIDADES ============ */
function euros(n) {
  return (Number(n) || 0).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
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
function LogoMark({ size = 60 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      <path d="M22 58 L30 40 Q33 34 40 34 L62 34 Q69 34 72 40 L80 58" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 58 L84 58" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="32" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
      <circle cx="70" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M40 34 L44 22 L58 22 L62 34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ============ ICONOS ============ */
const Ico = {
  clientes: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  piezas:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  ficha:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
  factura:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M4 2h12l4 4v16H4z"/><path d="M16 2v4h4"/><path d="M8 12h8"/><path d="M8 16h5"/><path d="M8 8h2"/></svg>,
  panel:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
  mas:      (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  editar:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>,
  borrar:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  coche:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M5 17h14"/><path d="M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M23 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M3 17V11l2-5h12l3 5h2v6"/></svg>,
  imprimir: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>,
  cerrar:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>,
  ojo:      (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

/* ============ TOAST ============ */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return <div className={"toast" + (toast.type === "error" ? " error" : "")}>{toast.msg}</div>;
}

/* ============ MODAL ============ */
function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={wide ? { maxWidth: 720 } : {}}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><Ico.cerrar /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ============ LOGIN (Supabase Auth) ============ */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await sb.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (err) {
      setError("Correo o contraseña incorrectos.");
    } else {
      onLogin();
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="stamp-logo">
          <div style={{ color: "var(--azul-700)" }}><LogoMark size={72} /></div>
          <div className="brand-title">Sánchez Motor</div>
          <div className="brand-sub">Electromecánica y Neumáticos</div>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label>Correo electrónico</label>
          <input type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
          <label>Contraseña</label>
          <input type="password" autoComplete="current-password" value={pass}
            onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <div className="login-foot">Antonio M. Sánchez Triguero · Barcarrota</div>
      </div>
    </div>
  );
}

/* ============ NAV + SHELL ============ */
const NAV_ITEMS = [
  { key: "panel",    label: "Panel",          icon: Ico.panel    },
  { key: "clientes", label: "Clientes",        icon: Ico.clientes },
  { key: "piezas",   label: "Piezas y stock",  icon: Ico.piezas   },
  { key: "facturas", label: "Facturas",         icon: Ico.factura  },
];

function AppShell({ children, view, setView, userEmail, onLogout, mobileOpen, setMobileOpen }) {
  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LogoMark size={26} />
          <span className="mobile-topbar-title">Sánchez Motor</span>
        </div>
        <button className="burger" onClick={() => setMobileOpen(true)}>☰</button>
      </div>

      {mobileOpen && <div className="sidebar-scrim show" onClick={() => setMobileOpen(false)} />}

      <div className={"sidebar" + (mobileOpen ? " mobile-open" : "")}>
        <div className="sidebar-head">
          <div style={{ color:"#fff" }}><LogoMark size={36} /></div>
          <div>
            <div className="sidebar-head-text">Sánchez Motor</div>
            <div className="sidebar-head-sub">Gestión de taller</div>
          </div>
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.key}
              className={"nav-item" + (view === item.key ? " active" : "")}
              onClick={() => { setView(item.key); setMobileOpen(false); }}>
              <item.icon />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="sidebar-user">{userEmail}</div>
          <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="main">{children}</div>
    </div>
  );
}

/* ============ PANEL ============ */
function Panel({ setView }) {
  const [kpis, setKpis] = useState({ clientes:0, pendientes:0, ingresosMes:0, stockBajo:0 });
  const [ultimas, setUltimas] = useState([]);

  useEffect(() => {
    async function cargar() {
      const mesActual = hoy().slice(0,7);
      const [{ count: nCli }, { count: nPend }, { data: facsMes }, { count: nStock }, { data: ults }] = await Promise.all([
        sb.from("clientes").select("*", { count:"exact", head:true }),
        sb.from("facturas").select("*", { count:"exact", head:true }).eq("estado","pendiente"),
        sb.from("facturas").select("total").gte("fecha", mesActual+"-01").lte("fecha", mesActual+"-31").eq("estado","pagada"),
        sb.from("piezas").select("*", { count:"exact", head:true }).filter("stock","lte","stock_min"),
        sb.from("facturas").select("numero,cliente_nombre,fecha,total,estado").order("fecha",{ascending:false}).limit(6),
      ]);
      const ingresosMes = (facsMes||[]).reduce((s,f) => s + Number(f.total||0), 0);
      setKpis({ clientes: nCli||0, pendientes: nPend||0, ingresosMes, stockBajo: nStock||0 });
      setUltimas(ults||[]);
    }
    cargar();
  }, []);

  return (
    <div>
      <div className="page-head">
        <div><div className="page-eyebrow">Resumen</div><div className="page-title">Panel del taller</div></div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="kpi-label">Clientes</div><div className="kpi-value">{kpis.clientes}</div></div>
        <div className="kpi"><div className="kpi-label">Facturas pendientes</div><div className="kpi-value oxido">{kpis.pendientes}</div></div>
        <div className="kpi"><div className="kpi-label">Ingresado este mes</div><div className="kpi-value">{euros(kpis.ingresosMes)}</div></div>
        <div className="kpi"><div className="kpi-label">Piezas stock bajo</div><div className="kpi-value oxido">{kpis.stockBajo}</div></div>
      </div>
      <div className="card">
        <div className="card-title">Últimas facturas</div>
        {ultimas.length === 0 ? (
          <div className="empty-state"><Ico.factura /><div className="empty-state-title">Todavía no hay facturas</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nº factura</th><th>Cliente</th><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead>
              <tbody>
                {ultimas.map((f,i) => (
                  <tr key={i}>
                    <td>{f.numero}</td>
                    <td>{f.cliente_nombre}</td>
                    <td>{fechaBonita(f.fecha)}</td>
                    <td>{euros(f.total)}</td>
                    <td><span className={"badge "+(f.estado==="pagada"?"badge-ok":"badge-pend")}>{f.estado==="pagada"?"Pagada":"Pendiente"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={() => setView("clientes")}>Ir a clientes</button>
        <button className="btn btn-secondary" onClick={() => setView("facturas")}>Ver todas las facturas</button>
      </div>
    </div>
  );
}

/* ============ PIEZAS ============ */
function FormPieza({ inicial, onSave, onCancel, loading }) {
  const [f, setF] = useState(inicial || { nombre:"", referencia:"", precio:"", stock:"", stock_min:"", proveedor:"" });
  const u = (k,v) => setF(p => ({...p,[k]:v}));
  function submit(e) {
    e.preventDefault();
    if (!f.nombre.trim()) return;
    onSave({ nombre:f.nombre, referencia:f.referencia, precio:Number(f.precio)||0, stock:Number(f.stock)||0, stock_min:Number(f.stock_min)||0, proveedor:f.proveedor });
  }
  return (
    <form onSubmit={submit}>
      <div className="grid-2">
        <div className="field"><label>Nombre *</label><input value={f.nombre} onChange={e=>u("nombre",e.target.value)} autoFocus /></div>
        <div className="field"><label>Referencia</label><input value={f.referencia} onChange={e=>u("referencia",e.target.value)} /></div>
      </div>
      <div className="grid-3">
        <div className="field"><label>Precio (€)</label><input type="number" step="0.01" min="0" value={f.precio} onChange={e=>u("precio",e.target.value)} /></div>
        <div className="field"><label>Stock actual</label><input type="number" min="0" value={f.stock} onChange={e=>u("stock",e.target.value)} /></div>
        <div className="field"><label>Stock mínimo</label><input type="number" min="0" value={f.stock_min} onChange={e=>u("stock_min",e.target.value)} /></div>
      </div>
      <div className="field"><label>Proveedor</label><input value={f.proveedor} onChange={e=>u("proveedor",e.target.value)} /></div>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading?"Guardando…":"Guardar pieza"}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

function Piezas({ notify }) {
  const [piezas, setPiezas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);

  async function cargar() {
    const { data } = await sb.from("piezas").select("*").order("nombre");
    setPiezas(data || []);
  }
  useEffect(() => { cargar(); }, []);

  const filtradas = piezas.filter(p =>
    (p.nombre+" "+(p.referencia||"")+" "+(p.proveedor||"")).toLowerCase().includes(busqueda.toLowerCase())
  );

  async function guardar(datos) {
    setSaving(true);
    if (modal === "nueva") {
      const { error } = await sb.from("piezas").insert(datos);
      if (error) { notify("Error al guardar: "+error.message, "error"); }
      else { notify("Pieza añadida."); setModal(null); cargar(); }
    } else {
      const { error } = await sb.from("piezas").update(datos).eq("id", modal.edit.id);
      if (error) { notify("Error al guardar: "+error.message, "error"); }
      else { notify("Pieza actualizada."); setModal(null); cargar(); }
    }
    setSaving(false);
  }

  async function eliminar(id) {
    const { error } = await sb.from("piezas").delete().eq("id", id);
    if (error) notify("Error al eliminar: "+error.message, "error");
    else { notify("Pieza eliminada."); setConfirmDel(null); cargar(); }
  }

  return (
    <div>
      <div className="page-head">
        <div><div className="page-eyebrow">Administración</div><div className="page-title">Piezas y stock</div></div>
        <button className="btn btn-primary" onClick={() => setModal("nueva")}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Ico.mas style={{width:15,height:15}}/>Añadir pieza</span>
        </button>
      </div>
      <div className="search-bar">
        <input placeholder="Buscar por nombre, referencia o proveedor…" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>
      <div className="card">
        {filtradas.length === 0 ? (
          <div className="empty-state"><Ico.piezas /><div className="empty-state-title">{piezas.length===0?"Sin piezas registradas":"Sin resultados"}</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Pieza</th><th>Referencia</th><th>Precio</th><th>Stock</th><th>Proveedor</th><th></th></tr></thead>
              <tbody>
                {filtradas.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.referencia||"—"}</td>
                    <td>{euros(p.precio)}</td>
                    <td>
                      {p.stock}
                      {Number(p.stock) <= Number(p.stock_min||0) && <span className="badge badge-pend" style={{marginLeft:8}}>Stock bajo</span>}
                    </td>
                    <td>{p.proveedor||"—"}</td>
                    <td>
                      <div style={{display:"flex",gap:4}}>
                        <button className="icon-btn" onClick={()=>setModal({edit:p})}><Ico.editar /></button>
                        <button className="icon-btn danger" onClick={()=>setConfirmDel(p)}><Ico.borrar /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal === "nueva" && <Modal title="Añadir pieza" onClose={()=>setModal(null)}><FormPieza onSave={guardar} onCancel={()=>setModal(null)} loading={saving} /></Modal>}
      {modal && modal !== "nueva" && <Modal title="Editar pieza" onClose={()=>setModal(null)}><FormPieza inicial={modal.edit} onSave={guardar} onCancel={()=>setModal(null)} loading={saving} /></Modal>}
      {confirmDel && (
        <Modal title="Eliminar pieza" onClose={()=>setConfirmDel(null)}>
          <p>¿Eliminar <strong>{confirmDel.nombre}</strong> del inventario?</p>
          <div className="btn-row">
            <button className="btn btn-danger" onClick={()=>eliminar(confirmDel.id)}>Eliminar</button>
            <button className="btn btn-secondary" onClick={()=>setConfirmDel(null)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ FORM CLIENTE ============ */
function FormCliente({ inicial, onSave, onCancel, loading }) {
  const [f, setF] = useState(inicial || { nombre:"", dni:"", telefono:"", email:"", direccion:"", matricula:"", marca:"", modelo:"", anio:"", bastidor:"" });
  const u = (k,v) => setF(p => ({...p,[k]:v}));
  function submit(e) {
    e.preventDefault();
    if (!f.nombre.trim() || !f.matricula.trim()) return;
    onSave(f);
  }
  return (
    <form onSubmit={submit}>
      <div className="card-title" style={{marginTop:0,border:"none",paddingBottom:4}}>Datos del cliente</div>
      <div className="grid-2">
        <div className="field"><label>Nombre y apellidos *</label><input value={f.nombre} onChange={e=>u("nombre",e.target.value)} autoFocus /></div>
        <div className="field"><label>DNI / NIF</label><input value={f.dni} onChange={e=>u("dni",e.target.value)} /></div>
      </div>
      <div className="grid-2">
        <div className="field"><label>Teléfono</label><input value={f.telefono} onChange={e=>u("telefono",e.target.value)} /></div>
        <div className="field"><label>Email</label><input type="email" value={f.email} onChange={e=>u("email",e.target.value)} /></div>
      </div>
      <div className="field"><label>Dirección</label><input value={f.direccion} onChange={e=>u("direccion",e.target.value)} /></div>
      <div className="card-title" style={{paddingBottom:4}}>Datos del vehículo</div>
      <div className="grid-2">
        <div className="field"><label>Matrícula *</label><input value={f.matricula} onChange={e=>u("matricula",e.target.value.toUpperCase())} /></div>
        <div className="field"><label>Año</label><input value={f.anio} onChange={e=>u("anio",e.target.value)} /></div>
      </div>
      <div className="grid-2">
        <div className="field"><label>Marca</label><input value={f.marca} onChange={e=>u("marca",e.target.value)} /></div>
        <div className="field"><label>Modelo</label><input value={f.modelo} onChange={e=>u("modelo",e.target.value)} /></div>
      </div>
      <div className="field"><label>Nº de bastidor</label><input value={f.bastidor} onChange={e=>u("bastidor",e.target.value)} /></div>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading?"Guardando…":"Guardar cliente"}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

/* ============ LISTA CLIENTES ============ */
function Clientes({ notify, abrirFicha }) {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [saving, setSaving] = useState(false);

  async function cargar() {
    const { data } = await sb.from("clientes").select("*").order("nombre");
    setClientes(data || []);
  }
  useEffect(() => { cargar(); }, []);

  const filtrados = clientes.filter(c =>
    (c.nombre+" "+c.matricula+" "+(c.marca||"")+" "+(c.modelo||"")).toLowerCase().includes(busqueda.toLowerCase())
  );

  async function guardar(datos) {
    setSaving(true);
    if (modal === "nuevo") {
      const { error } = await sb.from("clientes").insert(datos);
      if (error) notify("Error: "+error.message, "error");
      else { notify("Cliente añadido."); setModal(null); cargar(); }
    } else {
      const { error } = await sb.from("clientes").update(datos).eq("id", modal.edit.id);
      if (error) notify("Error: "+error.message, "error");
      else { notify("Cliente actualizado."); setModal(null); cargar(); }
    }
    setSaving(false);
  }

  async function eliminar(id) {
    const { error } = await sb.from("clientes").delete().eq("id", id);
    if (error) notify("Error: "+error.message, "error");
    else { notify("Cliente eliminado."); setConfirmDel(null); cargar(); }
  }

  return (
    <div>
      <div className="page-head">
        <div><div className="page-eyebrow">Administración</div><div className="page-title">Clientes y vehículos</div></div>
        <button className="btn btn-primary" onClick={()=>setModal("nuevo")}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Ico.mas style={{width:15,height:15}}/>Añadir cliente</span>
        </button>
      </div>
      <div className="search-bar">
        <input placeholder="Buscar por nombre, matrícula, marca o modelo…" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>
      <div className="card">
        {filtrados.length === 0 ? (
          <div className="empty-state"><Ico.clientes /><div className="empty-state-title">{clientes.length===0?"Sin clientes":"Sin resultados"}</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Cliente</th><th>Vehículo</th><th>Matrícula</th><th>Teléfono</th><th></th></tr></thead>
              <tbody>
                {filtrados.map(c => (
                  <tr key={c.id} className="client-row" onClick={()=>abrirFicha(c.id)}>
                    <td>{c.nombre}</td>
                    <td>{[c.marca,c.modelo].filter(Boolean).join(" ")||"—"}</td>
                    <td>{c.matricula}</td>
                    <td>{c.telefono||"—"}</td>
                    <td>
                      <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                        <button className="icon-btn" onClick={()=>abrirFicha(c.id)}><Ico.ojo /></button>
                        <button className="icon-btn" onClick={()=>setModal({edit:c})}><Ico.editar /></button>
                        <button className="icon-btn danger" onClick={()=>setConfirmDel(c)}><Ico.borrar /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modal==="nuevo" && <Modal title="Añadir cliente" onClose={()=>setModal(null)} wide><FormCliente onSave={guardar} onCancel={()=>setModal(null)} loading={saving} /></Modal>}
      {modal && modal!=="nuevo" && <Modal title="Editar cliente" onClose={()=>setModal(null)} wide><FormCliente inicial={modal.edit} onSave={guardar} onCancel={()=>setModal(null)} loading={saving} /></Modal>}
      {confirmDel && (
        <Modal title="Eliminar cliente" onClose={()=>setConfirmDel(null)}>
          <p>¿Eliminar a <strong>{confirmDel.nombre}</strong> y todo su historial? No se puede deshacer.</p>
          <div className="btn-row">
            <button className="btn btn-danger" onClick={()=>eliminar(confirmDel.id)}>Eliminar</button>
            <button className="btn btn-secondary" onClick={()=>setConfirmDel(null)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ FORM TRABAJO ============ */
function FormTrabajo({ clienteId, onSave, onCancel, loading }) {
  const [piezasDisp, setPiezasDisp] = useState([]);
  const [fecha, setFecha] = useState(hoy());
  const [descripcion, setDescripcion] = useState("");
  const [manoObra, setManoObra] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [lineas, setLineas] = useState([]);

  useEffect(() => {
    sb.from("piezas").select("id,nombre,precio").order("nombre").then(({data}) => setPiezasDisp(data||[]));
  }, []);

  function addLinea() { setLineas(l => [...l, { pieza_id:"", nombre:"", precio:0, cantidad:1 }]); }
  function updLinea(i, k, v) {
    setLineas(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      if (k === "pieza_id") {
        const pz = piezasDisp.find(p => p.id === v);
        return { ...l, pieza_id:v, nombre:pz?pz.nombre:"", precio:pz?pz.precio:0 };
      }
      return { ...l, [k]:v };
    }));
  }
  function delLinea(i) { setLineas(l => l.filter((_,idx) => idx!==i)); }

  const totalPiezas = lineas.reduce((s,l) => s + (Number(l.precio)||0)*(Number(l.cantidad)||0), 0);
  const total = totalPiezas + (Number(manoObra)||0);

  function submit(e) {
    e.preventDefault();
    if (!descripcion.trim()) return;
    onSave({ fecha, descripcion, mano_obra:Number(manoObra)||0, estado, total, lineas:lineas.filter(l=>l.nombre) });
  }

  return (
    <form onSubmit={submit}>
      <div className="grid-2">
        <div className="field"><label>Fecha</label><input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} /></div>
        <div className="field"><label>Estado</label>
          <select value={estado} onChange={e=>setEstado(e.target.value)}>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      </div>
      <div className="field"><label>Descripción del trabajo *</label>
        <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Piezas utilizadas</label>
        {lineas.map((l,i) => (
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <select style={{flex:2,minWidth:140,padding:"9px 10px",border:"1px solid var(--linea)",borderRadius:3,fontFamily:"inherit"}}
              value={l.pieza_id} onChange={e=>updLinea(i,"pieza_id",e.target.value)}>
              <option value="">Selecciona pieza…</option>
              {piezasDisp.map(p => <option key={p.id} value={p.id}>{p.nombre} ({euros(p.precio)})</option>)}
            </select>
            <input type="number" min="1" style={{width:70,padding:"9px 10px",border:"1px solid var(--linea)",borderRadius:3,fontFamily:"inherit"}}
              value={l.cantidad} onChange={e=>updLinea(i,"cantidad",Number(e.target.value))} />
            <button type="button" className="icon-btn danger" onClick={()=>delLinea(i)}><Ico.borrar /></button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addLinea}>+ Añadir pieza</button>
      </div>
      <div className="field"><label>Mano de obra (€)</label>
        <input type="number" step="0.01" min="0" value={manoObra} onChange={e=>setManoObra(e.target.value)} />
      </div>
      <div className="summary-row total"><span>Total del trabajo</span><span>{euros(total)}</span></div>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading?"Guardando…":"Guardar trabajo"}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

/* ============ FICHA CLIENTE ============ */
function FichaCliente({ clienteId, notify, onVolver, onFacturar }) {
  const [cliente, setCliente] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [modalTrabajo, setModalTrabajo] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [confirmDelTrabajo, setConfirmDelTrabajo] = useState(null);
  const [saving, setSaving] = useState(false);

  async function cargar() {
    const [{ data: cli }, { data: tr }] = await Promise.all([
      sb.from("clientes").select("*").eq("id", clienteId).single(),
      sb.from("trabajos").select("*, trabajo_piezas(*)").eq("cliente_id", clienteId).order("fecha", {ascending:false}),
    ]);
    setCliente(cli);
    setTrabajos(tr || []);
  }
  useEffect(() => { cargar(); }, [clienteId]);

  async function guardarTrabajo({ fecha, descripcion, mano_obra, estado, total, lineas }) {
    setSaving(true);
    const { data: tr, error } = await sb.from("trabajos")
      .insert({ cliente_id:clienteId, fecha, descripcion, mano_obra, estado, total })
      .select().single();
    if (error) { notify("Error: "+error.message, "error"); setSaving(false); return; }
    if (lineas.length > 0) {
      await sb.from("trabajo_piezas").insert(lineas.map(l => ({
        trabajo_id: tr.id, pieza_id: l.pieza_id||null,
        nombre: l.nombre, precio: l.precio, cantidad: l.cantidad,
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
    const { error } = await sb.from("clientes").update(datos).eq("id", clienteId);
    if (error) notify("Error: "+error.message, "error");
    else { notify("Datos actualizados."); setModalEditar(false); cargar(); }
    setSaving(false);
  }

  if (!cliente) return <div style={{padding:40,color:"var(--metal)"}}>Cargando ficha…</div>;

  const totalHistorico = trabajos.reduce((s,t) => s+(Number(t.total)||0), 0);
  const pendientes = trabajos.filter(t => t.estado==="pendiente").length;

  return (
    <div>
      <div className="page-head">
        <div><div className="page-eyebrow">Ficha de cliente</div><div className="page-title">{cliente.nombre}</div></div>
        <div className="btn-row" style={{marginTop:0}}>
          <button className="btn btn-secondary btn-sm" onClick={onVolver}>← Volver</button>
          <button className="btn btn-secondary btn-sm" onClick={()=>setModalEditar(true)}>Editar datos</button>
          <button className="btn btn-oxido btn-sm" onClick={()=>onFacturar(cliente, trabajos)}>
            <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Ico.factura style={{width:14,height:14}}/>Generar factura</span>
          </button>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Datos del cliente</div>
          <p style={{margin:"4px 0"}}><strong>DNI:</strong> {cliente.dni||"—"}</p>
          <p style={{margin:"4px 0"}}><strong>Teléfono:</strong> {cliente.telefono||"—"}</p>
          <p style={{margin:"4px 0"}}><strong>Email:</strong> {cliente.email||"—"}</p>
          <p style={{margin:"4px 0"}}><strong>Dirección:</strong> {cliente.direccion||"—"}</p>
        </div>
        <div className="card">
          <div className="card-title">Vehículo</div>
          <p style={{margin:"4px 0"}}><strong>Matrícula:</strong> {cliente.matricula}</p>
          <p style={{margin:"4px 0"}}><strong>Marca / modelo:</strong> {[cliente.marca,cliente.modelo].filter(Boolean).join(" ")||"—"}</p>
          <p style={{margin:"4px 0"}}><strong>Año:</strong> {cliente.anio||"—"}</p>
          <p style={{margin:"4px 0"}}><strong>Bastidor:</strong> {cliente.bastidor||"—"}</p>
        </div>
      </div>

      <div className="kpi-row" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
        <div className="kpi"><div className="kpi-label">Trabajos</div><div className="kpi-value">{trabajos.length}</div></div>
        <div className="kpi"><div className="kpi-label">Pendientes</div><div className="kpi-value oxido">{pendientes}</div></div>
        <div className="kpi"><div className="kpi-label">Total histórico</div><div className="kpi-value">{euros(totalHistorico)}</div></div>
      </div>

      <div className="card">
        <div className="card-title" style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"none"}}>
          <span>Historial de trabajos</span>
          <button className="btn btn-primary btn-sm" onClick={()=>setModalTrabajo(true)}>+ Añadir trabajo</button>
        </div>
        {trabajos.length === 0 ? (
          <div className="empty-state"><Ico.coche /><div className="empty-state-title">Sin trabajos registrados</div></div>
        ) : trabajos.map(t => (
          <div key={t.id} className={"work-tab"+(t.estado==="pendiente"?" pend":"")}>
            <div className="work-tab-head">
              <div className="work-tab-date">{fechaBonita(t.fecha)}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span className={"badge "+(t.estado==="pendiente"?"badge-pend":"badge-ok")}>
                  {t.estado==="pendiente"?"Pendiente":"Completado"}
                </span>
                <button className="icon-btn danger" onClick={()=>setConfirmDelTrabajo(t)}><Ico.borrar /></button>
              </div>
            </div>
            <div className="work-tab-desc">{t.descripcion}</div>
            {t.trabajo_piezas?.length > 0 && (
              <div className="work-tab-parts">
                Piezas: {t.trabajo_piezas.map(p=>`${p.nombre} (x${p.cantidad})`).join(", ")}
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span className="work-tab-parts">Mano de obra: {euros(t.mano_obra)}</span>
              <span className="work-tab-price">{euros(t.total)}</span>
            </div>
          </div>
        ))}
      </div>

      {modalTrabajo && <Modal title="Añadir trabajo" onClose={()=>setModalTrabajo(false)} wide><FormTrabajo clienteId={clienteId} onSave={guardarTrabajo} onCancel={()=>setModalTrabajo(false)} loading={saving} /></Modal>}
      {modalEditar && <Modal title="Editar datos" onClose={()=>setModalEditar(false)} wide><FormCliente inicial={cliente} onSave={guardarEdicionCliente} onCancel={()=>setModalEditar(false)} loading={saving} /></Modal>}
      {confirmDelTrabajo && (
        <Modal title="Eliminar trabajo" onClose={()=>setConfirmDelTrabajo(null)}>
          <p>¿Eliminar este trabajo del historial?</p>
          <div className="btn-row">
            <button className="btn btn-danger" onClick={()=>eliminarTrabajo(confirmDelTrabajo.id)}>Eliminar</button>
            <button className="btn btn-secondary" onClick={()=>setConfirmDelTrabajo(null)}>Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============ CONSTRUCTOR DE FACTURA ============ */
function ConstructorFactura({ cliente, trabajos, onGenerar, onCancel, saving }) {
  const [seleccion, setSeleccion] = useState(trabajos.filter(t=>t.estado==="pendiente").map(t=>t.id));
  const [ivaPct, setIvaPct] = useState(21);
  const [observaciones, setObservaciones] = useState("");

  function toggle(id) { setSeleccion(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]); }

  const sel = trabajos.filter(t => seleccion.includes(t.id));
  const base = sel.reduce((s,t) => s+(Number(t.total)||0), 0);
  const iva = base * (Number(ivaPct)/100);
  const total = base + iva;

  return (
    <div>
      <div className="field">
        <label>Trabajos a incluir</label>
        {trabajos.length === 0 ? <p style={{color:"var(--metal)"}}>Sin trabajos registrados.</p> : trabajos.map(t => (
          <label key={t.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 0",borderBottom:"1px solid var(--papel-2)",cursor:"pointer"}}>
            <input type="checkbox" checked={seleccion.includes(t.id)} onChange={()=>toggle(t.id)} style={{marginTop:3}} />
            <span style={{flex:1}}>
              <strong>{fechaBonita(t.fecha)}</strong> — {t.descripcion}
            </span>
            <span style={{fontWeight:700,color:"var(--azul-900)"}}>{euros(t.total)}</span>
          </label>
        ))}
      </div>
      <div className="grid-2">
        <div className="field"><label>IVA (%)</label><input type="number" min="0" max="100" value={ivaPct} onChange={e=>setIvaPct(e.target.value)} /></div>
      </div>
      <div className="field"><label>Observaciones</label><textarea value={observaciones} onChange={e=>setObservaciones(e.target.value)} /></div>
      <div className="summary-row"><span>Base imponible</span><span>{euros(base)}</span></div>
      <div className="summary-row"><span>IVA ({ivaPct}%)</span><span>{euros(iva)}</span></div>
      <div className="summary-row total"><span>Total</span><span>{euros(total)}</span></div>
      <div className="btn-row">
        <button className="btn btn-primary" disabled={sel.length===0||saving} onClick={()=>onGenerar({sel,base,ivaPct:Number(ivaPct),iva,total,observaciones})}>
          {saving?"Generando…":"Generar factura"}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

/* ============ VISTA FACTURA ============ */
function VistaFactura({ facturaId, notify, onVolver }) {
  const [factura, setFactura] = useState(null);
  const [lineas, setLineas] = useState([]);

  async function cargar() {
    const [{ data:f }, { data:l }] = await Promise.all([
      sb.from("facturas").select("*").eq("id", facturaId).single(),
      sb.from("factura_lineas").select("*").eq("factura_id", facturaId),
    ]);
    setFactura(f);
    setLineas(l||[]);
  }
  useEffect(() => { cargar(); }, [facturaId]);

  async function marcarEstado(estado) {
    await sb.from("facturas").update({ estado }).eq("id", facturaId);
    notify(estado==="pagada"?"Factura marcada como pagada.":"Factura marcada como pendiente.");
    cargar();
  }

  if (!factura) return <div style={{padding:40,color:"var(--metal)"}}>Cargando factura…</div>;

  return (
    <div>
      <div className="page-head no-print">
        <div><div className="page-eyebrow">Factura</div><div className="page-title">{factura.numero}</div></div>
        <div className="btn-row" style={{marginTop:0}}>
          <button className="btn btn-secondary btn-sm" onClick={onVolver}>← Volver</button>
          {factura.estado==="pendiente"
            ? <button className="btn btn-secondary btn-sm" onClick={()=>marcarEstado("pagada")}>Marcar como pagada</button>
            : <button className="btn btn-secondary btn-sm" onClick={()=>marcarEstado("pendiente")}>Marcar como pendiente</button>}
          <button className="btn btn-primary btn-sm" onClick={()=>window.print()}>
            <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Ico.imprimir style={{width:14,height:14}}/>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      <div className="invoice-paper">
        <div className="invoice-top">
          <div className="invoice-brand">
            <div style={{color:"var(--azul-700)"}}><LogoMark size={54}/></div>
            <div>
              <div className="invoice-brand-name">{TALLER.nombre}</div>
              <div className="invoice-brand-sub">{TALLER.actividad}</div>
              <div className="invoice-brand-sub">{TALLER.titular} · NIF {TALLER.nif}</div>
              <div className="invoice-brand-sub">{TALLER.direccion}, {TALLER.cp} {TALLER.localidad}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:16,alignItems:"center"}}>
            <div className="invoice-meta">
              <strong>{factura.numero}</strong>
              Fecha: {fechaBonita(factura.fecha)}
            </div>
            <div className={"invoice-stamp"+(factura.estado==="pagada"?" pagado":"")}>
              {factura.estado==="pagada"?"Pagado":"Pendiente"}
            </div>
          </div>
        </div>

        <div className="invoice-cols">
          <div className="invoice-col">
            <div className="invoice-section-title">Cliente</div>
            <p><strong>{factura.cliente_nombre}</strong></p>
            <p>{factura.cliente_dni||""}</p>
            <p>{factura.cliente_direccion||""}</p>
            <p>{factura.cliente_telefono||""}</p>
          </div>
          <div className="invoice-col">
            <div className="invoice-section-title">Vehículo</div>
            <p>{[factura.vehiculo_marca,factura.vehiculo_modelo].filter(Boolean).join(" ")||"—"}</p>
            <p>Matrícula: {factura.vehiculo_matricula}</p>
            {factura.vehiculo_anio && <p>Año: {factura.vehiculo_anio}</p>}
          </div>
        </div>

        <div className="invoice-section-title">Trabajos realizados</div>
        <table className="invoice-table">
          <thead><tr><th>Descripción</th><th>Piezas</th><th style={{textAlign:"right"}}>Importe</th></tr></thead>
          <tbody>
            {lineas.map((l,i) => (
              <tr key={i}>
                <td>{l.descripcion}</td>
                <td>{l.piezas_texto||"—"}</td>
                <td style={{textAlign:"right"}}>{euros(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="summary-row"><span>Base imponible</span><span>{euros(factura.base)}</span></div>
          <div className="summary-row"><span>IVA ({factura.iva_pct}%)</span><span>{euros(factura.iva)}</span></div>
          <div className="summary-row total"><span>Total</span><span>{euros(factura.total)}</span></div>
        </div>

        {factura.observaciones && <p style={{marginTop:18,fontSize:"0.85rem",color:"var(--metal)"}}><strong>Observaciones:</strong> {factura.observaciones}</p>}

        <div className="invoice-footer-note">
          {TALLER.nombre} · {TALLER.titular} · NIF {TALLER.nif} · {TALLER.direccion}, {TALLER.cp} {TALLER.localidad}
        </div>
      </div>
    </div>
  );
}

/* ============ LISTADO FACTURAS ============ */
function Facturas({ notify, abrirFactura }) {
  const [facturas, setFacturas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    sb.from("facturas").select("*").order("fecha", {ascending:false}).then(({data}) => setFacturas(data||[]));
  }, []);

  const filtradas = facturas.filter(f => (f.numero+" "+f.cliente_nombre).toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <div className="page-head">
        <div><div className="page-eyebrow">Facturación</div><div className="page-title">Facturas</div></div>
      </div>
      <div className="search-bar">
        <input placeholder="Buscar por número o cliente…" value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
      </div>
      <div className="card">
        {filtradas.length === 0 ? (
          <div className="empty-state"><Ico.factura /><div className="empty-state-title">{facturas.length===0?"Sin facturas todavía":"Sin resultados"}</div></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nº</th><th>Cliente</th><th>Matrícula</th><th>Fecha</th><th>Importe</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {filtradas.map(f => (
                  <tr key={f.id} className="client-row" onClick={()=>abrirFactura(f.id)}>
                    <td>{f.numero}</td>
                    <td>{f.cliente_nombre}</td>
                    <td>{f.vehiculo_matricula}</td>
                    <td>{fechaBonita(f.fecha)}</td>
                    <td>{euros(f.total)}</td>
                    <td><span className={"badge "+(f.estado==="pagada"?"badge-ok":"badge-pend")}>{f.estado==="pagada"?"Pagada":"Pendiente"}</span></td>
                    <td><button className="icon-btn" onClick={e=>{e.stopPropagation();abrirFactura(f.id);}}><Ico.ojo /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ APP PRINCIPAL ============ */
function App() {
  const [cargando, setCargando]       = useState(true);
  const [sesion, setSesion]           = useState(null);
  const [view, setView]               = useState("panel");
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [toast, setToast]             = useState(null);
  const [fichaId, setFichaId]         = useState(null);
  const [facturaId, setFacturaId]     = useState(null);
  const [modalFac, setModalFac]       = useState(null); // { cliente, trabajos }
  const [savingFac, setSavingFac]     = useState(false);

  const notify = useCallback((msg, type) => setToast({ msg, type, t: Date.now() }), []);

  // Verificar sesión al arrancar
  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
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

  async function generarFactura({ sel, base, ivaPct, iva, total, observaciones }) {
    setSavingFac(true);
    const { cliente } = modalFac;
    const year = new Date().getFullYear();

    // Obtener y actualizar el contador correlativo
    const { data: cnt } = await sb.from("contador_facturas").select("siguiente_numero").eq("anio", year).single();
    let seq = cnt ? cnt.siguiente_numero : 1;
    await sb.from("contador_facturas").upsert({ anio: year, siguiente_numero: seq + 1 });

    const numero = numeroFactura(seq, year);
    const fecha  = hoy();

    // Insertar factura
    const { data: fac, error } = await sb.from("facturas").insert({
      numero, fecha,
      cliente_id: cliente.id,
      cliente_nombre: cliente.nombre, cliente_dni: cliente.dni,
      cliente_direccion: cliente.direccion, cliente_telefono: cliente.telefono,
      vehiculo_marca: cliente.marca, vehiculo_modelo: cliente.modelo,
      vehiculo_matricula: cliente.matricula, vehiculo_anio: cliente.anio,
      base, iva_pct: ivaPct, iva, total, observaciones,
      estado: "pendiente",
    }).select().single();

    if (error) { notify("Error al generar factura: "+error.message, "error"); setSavingFac(false); return; }

    // Insertar líneas
    const lineas = sel.map(t => ({
      factura_id: fac.id, trabajo_id: t.id,
      descripcion: t.descripcion,
      piezas_texto: (t.trabajo_piezas||[]).map(p=>`${p.nombre} (x${p.cantidad})`).join(", "),
      total: t.total,
    }));
    if (lineas.length > 0) await sb.from("factura_lineas").insert(lineas);

    // Marcar trabajos como completados
    await sb.from("trabajos").update({ estado:"completado" }).in("id", sel.map(t=>t.id));

    setSavingFac(false);
    setModalFac(null);
    notify("Factura "+numero+" generada.");
    setFacturaId(fac.id);
    setView("verFactura");
  }

  if (cargando) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",color:"var(--azul-700)"}}>
      <div style={{textAlign:"center"}}><LogoMark size={50}/><div style={{marginTop:10,fontSize:"0.85rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>Cargando…</div></div>
    </div>
  );

  if (!sesion) return <Login onLogin={() => {}} />;

  // Comprobación de configuración pendiente
  const sinConfigurar = SUPABASE_URL.includes("XXXXXXXX");

  let contenido;
  if (sinConfigurar) {
    contenido = (
      <div>
        <div className="page-head"><div><div className="page-title">Configuración pendiente</div></div></div>
        <div className="banner-warn">
          <strong>⚠ Falta configurar Supabase.</strong> Abre el archivo <code>config.js</code> y sustituye <code>SUPABASE_URL</code> y <code>SUPABASE_ANON_KEY</code> con los valores reales de tu proyecto en <a href="https://supabase.com" target="_blank">supabase.com</a> → Settings → API.
        </div>
      </div>
    );
  } else if (view === "panel") {
    contenido = <Panel setView={setView} />;
  } else if (view === "clientes") {
    contenido = <Clientes notify={notify} abrirFicha={id => { setFichaId(id); setView("ficha"); }} />;
  } else if (view === "piezas") {
    contenido = <Piezas notify={notify} />;
  } else if (view === "facturas") {
    contenido = <Facturas notify={notify} abrirFactura={id => { setFacturaId(id); setView("verFactura"); }} />;
  } else if (view === "ficha" && fichaId) {
    contenido = <FichaCliente clienteId={fichaId} notify={notify}
      onVolver={() => { setFichaId(null); setView("clientes"); }}
      onFacturar={(cli, tr) => setModalFac({ cliente:cli, trabajos:tr })} />;
  } else if (view === "verFactura" && facturaId) {
    contenido = <VistaFactura facturaId={facturaId} notify={notify}
      onVolver={() => { setFacturaId(null); setView("facturas"); }} />;
  } else {
    contenido = <Panel setView={setView} />;
  }

  const navView = view === "ficha" ? "clientes" : view === "verFactura" ? "facturas" : view;

  return (
    <React.Fragment>
      <AppShell view={navView} setView={setView} userEmail={sesion.user?.email}
        onLogout={handleLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
        {contenido}
      </AppShell>
      <Toast toast={toast} onClose={() => setToast(null)} />
      {modalFac && (
        <Modal title={"Generar factura — "+modalFac.cliente.nombre} onClose={()=>setModalFac(null)} wide>
          <ConstructorFactura cliente={modalFac.cliente} trabajos={modalFac.trabajos}
            onGenerar={generarFactura} onCancel={()=>setModalFac(null)} saving={savingFac} />
        </Modal>
      )}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
