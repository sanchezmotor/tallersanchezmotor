// ============================================================
// SÁNCHEZ MOTOR — CONFIGURACIÓN DE SUPABASE
// ============================================================
// INSTRUCCIONES:
// 1. Entra en tu proyecto de Supabase → Settings → API
// 2. Copia "Project URL" y pégala en SUPABASE_URL
// 3. Copia "anon public" (la clave pública) y pégala en SUPABASE_ANON_KEY
// 4. Guarda el archivo y sube los cambios a GitHub
// ============================================================

const SUPABASE_URL      = "https://miwwxqkzcqzvkthycugk.supabase.co";   // ← cambia esto
const SUPABASE_ANON_KEY = "sb_publishable_d3_TFUl2WxSbyOdKICv75A_VClT579L";   // ← cambia esto

// Datos del taller (aparecen en las facturas)
const TALLER = {
  nombre:    "Sánchez Motor",
  actividad: "Electromecánica y Neumáticos",
  titular:   "Antonio M. Sánchez Triguero",
  nif:       "80.058.091-J",
  direccion: "C/ Huerta San Juan S/N",
  cp:        "06160",
  localidad: "Barcarrota (Badajoz)",
};
