import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Car, Wrench, Bell, FileText, Plus, MessageCircle, Search, X,
  LayoutDashboard, Users, Trash2, Edit3, Phone, Calendar, Gauge,
  CheckCircle2, Clock, AlertTriangle, ChevronRight, ChevronLeft, User, Megaphone,
  Cake, PhoneCall, Reply, CalendarCheck, CalendarDays, CalendarPlus,
  TrendingUp, Trophy, DollarSign, Filter, Check
} from "lucide-react";

/* ============================================================
   Murilo Pneus Auto Center — CRM
   v4: agenda de horários · filtros · dashboard de gestão
   (sobre v3: múltiplos veículos · lembrete por km · status de
    contato · campanhas)
   Persistência: window.storage (Claude) ou localStorage (prod)
   ============================================================ */

const THEME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

.mp-root{
  --bg:#0D1117; --surface:#151B23; --surface-2:#1C232E; --line:#262E3A; --line-strong:#34404F;
  --blue:#2B81C4; --blue-hi:#4C9BDB; --blue-soft:rgba(43,129,196,.15);
  --txt:#E7ECF3; --txt-2:#909BAA; --txt-3:#5B6675;
  --amber:#F5A623; --amber-soft:rgba(245,166,35,.13);
  --green:#3FB950; --green-soft:rgba(63,185,80,.13);
  --red:#E5534B; --red-soft:rgba(229,83,75,.13);
  --violet:#A371F7; --violet-soft:rgba(163,113,247,.14);
  font-family:'Inter',system-ui,sans-serif; color:var(--txt); background:var(--bg);
  min-height:100vh; -webkit-font-smoothing:antialiased; font-size:14px;
}
.mp-root *{box-sizing:border-box;}
.mp-title{font-family:'Inter',sans-serif;font-weight:800;letter-spacing:-.02em;}
.mp-mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums;}

.mp-shell{display:flex;min-height:100vh;}
.mp-nav{width:236px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--line);
  display:flex;flex-direction:column;padding:20px 12px;position:sticky;top:0;height:100vh;overflow-y:auto;}
.mp-brand{display:flex;align-items:center;gap:11px;padding:6px 8px 18px;margin-bottom:4px;border-bottom:1px solid var(--line);}
.mp-brand-name{font-family:'Inter';font-weight:800;font-size:15px;letter-spacing:-.01em;line-height:1;}
.mp-brand-sub{font-size:9.5px;letter-spacing:.16em;color:var(--txt-3);text-transform:uppercase;font-weight:600;margin-top:4px;}
.mp-navsec{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--txt-3);font-weight:600;padding:13px 12px 6px;}
.mp-navitem{display:flex;align-items:center;gap:11px;padding:9px 12px;border-radius:8px;
  color:var(--txt-2);font-weight:500;font-size:14px;cursor:pointer;border:none;background:none;
  width:100%;text-align:left;transition:.13s;margin-bottom:1px;}
.mp-navitem:hover{background:var(--surface-2);color:var(--txt);}
.mp-navitem.on{background:var(--blue-soft);color:var(--blue-hi);font-weight:600;}
.mp-navitem.on svg{color:var(--blue-hi);}
.mp-navbadge{margin-left:auto;background:var(--amber);color:#1a1206;font-size:11px;font-weight:700;
  min-width:19px;height:19px;border-radius:10px;display:grid;place-items:center;padding:0 6px;}

.mp-main{flex:1;min-width:0;padding:28px 34px 80px;max-width:1160px;}
.mp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:22px;flex-wrap:wrap;}
.mp-h1{font-family:'Inter';font-weight:800;letter-spacing:-.025em;font-size:28px;color:var(--txt);}
.mp-eyebrow{font-size:11px;letter-spacing:.16em;color:var(--blue-hi);text-transform:uppercase;font-weight:600;margin-bottom:6px;}

.mp-btn{display:inline-flex;align-items:center;gap:7px;background:var(--blue);color:#fff;border:none;
  padding:10px 15px;border-radius:8px;font-weight:600;font-size:13.5px;cursor:pointer;font-family:inherit;transition:.13s;}
.mp-btn:hover{background:var(--blue-hi);}
.mp-btn:active{transform:translateY(1px);}
.mp-btn.ghost{background:var(--surface-2);color:var(--txt);border:1px solid var(--line);}
.mp-btn.ghost:hover{background:var(--line);}
.mp-btn.wa{background:#1FA855;color:#fff;}
.mp-btn.wa:hover{background:#25c463;}
.mp-btn.sm{padding:7px 11px;font-size:12.5px;}
.mp-btn:disabled{opacity:.5;cursor:default;}
.mp-icbtn{background:none;border:1px solid var(--line);color:var(--txt-2);width:33px;height:33px;
  border-radius:8px;display:grid;place-items:center;cursor:pointer;transition:.13s;flex-shrink:0;}
.mp-icbtn:hover{border-color:var(--line-strong);color:var(--txt);}
.mp-icbtn.danger:hover{border-color:var(--red);color:var(--red);}
.mp-icbtn.go:hover{border-color:var(--green);color:var(--green);}

.mp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:22px;}
.mp-kpi{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px 17px 14px;}
.mp-kpi-label{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--txt-3);font-weight:600;margin-bottom:9px;display:flex;align-items:center;gap:7px;}
.mp-kpi-num{font-family:'JetBrains Mono';font-weight:700;font-size:30px;color:var(--txt);letter-spacing:-.02em;}
.mp-kpi-num.sm{font-size:24px;}
.mp-kpi-num.amber{color:var(--amber);} .mp-kpi-num.green{color:var(--green);} .mp-kpi-num.blue{color:var(--blue-hi);} .mp-kpi-num.violet{color:var(--violet);}
.mp-kpi-sub{font-size:11.5px;color:var(--txt-3);margin-top:4px;}

.mp-card{background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden;}
.mp-card-h{padding:15px 19px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.mp-card-t{font-family:'Inter';font-weight:700;font-size:15px;color:var(--txt);display:flex;align-items:center;gap:9px;letter-spacing:-.01em;}
.mp-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;}

.mp-radar-row{display:flex;align-items:center;gap:13px;padding:13px 19px;border-bottom:1px solid var(--line);transition:.1s;flex-wrap:wrap;}
.mp-radar-row:last-child{border-bottom:none;}
.mp-radar-row:hover{background:var(--surface-2);}
.mp-radar-row.done{opacity:.62;}
.mp-pulse{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.mp-pulse.late{background:var(--red);animation:mppulse 1.8s infinite;}
.mp-pulse.soon{background:var(--amber);}
.mp-pulse.ok{background:var(--green);}
@keyframes mppulse{0%{box-shadow:0 0 0 0 rgba(229,83,75,.55);}70%{box-shadow:0 0 0 8px rgba(229,83,75,0);}100%{box-shadow:0 0 0 0 rgba(229,83,75,0);}}
.mp-radar-info{flex:1;min-width:180px;}
.mp-radar-name{font-weight:600;font-size:14.5px;color:var(--txt);}
.mp-radar-meta{font-size:12.5px;color:var(--txt-2);margin-top:3px;display:flex;gap:13px;flex-wrap:wrap;align-items:center;}
.mp-radar-meta span{display:inline-flex;align-items:center;gap:5px;}
.mp-tag{font-size:11px;font-weight:600;padding:4px 9px;border-radius:6px;letter-spacing:.01em;white-space:nowrap;}
.mp-tag.late{background:var(--red-soft);color:#f08a83;} .mp-tag.soon{background:var(--amber-soft);color:var(--amber);} .mp-tag.ok{background:var(--green-soft);color:var(--green);}
.mp-tag.km{background:var(--blue-soft);color:var(--blue-hi);}
.mp-tag.done{background:var(--green-soft);color:var(--green);} .mp-tag.gray{background:var(--surface-2);color:var(--txt-3);}

.mp-contato{display:flex;gap:3px;}
.mp-cbtn{width:30px;height:30px;border-radius:7px;border:1px solid var(--line);background:var(--bg);
  color:var(--txt-3);display:grid;place-items:center;cursor:pointer;transition:.12s;}
.mp-cbtn:hover{border-color:var(--line-strong);color:var(--txt);}
.mp-cbtn.on-amber{background:var(--amber-soft);border-color:var(--amber);color:var(--amber);}
.mp-cbtn.on-blue{background:var(--blue-soft);border-color:var(--blue);color:var(--blue-hi);}
.mp-cbtn.on-green{background:var(--green-soft);border-color:var(--green);color:var(--green);}
.mp-cstamp{font-size:11px;color:var(--txt-3);white-space:nowrap;}

.mp-list-row{display:flex;align-items:center;gap:13px;padding:12px 19px;border-bottom:1px solid var(--line);}
.mp-list-row:last-child{border-bottom:none;}
.mp-list-row:hover{background:var(--surface-2);}
.mp-avatar{width:38px;height:38px;border-radius:9px;background:var(--blue-soft);color:var(--blue-hi);
  display:grid;place-items:center;font-family:'JetBrains Mono';font-weight:700;font-size:14px;flex-shrink:0;}
.mp-plate{font-family:'JetBrains Mono';font-weight:600;font-size:12px;letter-spacing:.06em;background:var(--surface-2);
  border:1px solid var(--line-strong);border-radius:5px;padding:3px 8px;color:var(--txt);text-transform:uppercase;white-space:nowrap;}
.mp-money{font-family:'JetBrains Mono';font-weight:700;font-size:16px;color:var(--txt);white-space:nowrap;}
.mp-count{font-size:11px;font-weight:600;color:var(--txt-3);background:var(--surface-2);border:1px solid var(--line);border-radius:20px;padding:2px 8px;}

.mp-empty{padding:46px 24px;text-align:center;color:var(--txt-2);}
.mp-empty svg{margin:0 auto 13px;color:var(--txt-3);}
.mp-empty h3{font-family:'Inter';font-weight:700;font-size:17px;color:var(--txt);margin:0 0 6px;}
.mp-empty p{font-size:13.5px;margin:0;}

.mp-search{display:flex;align-items:center;gap:9px;background:var(--surface-2);border:1px solid var(--line);
  border-radius:8px;padding:9px 12px;color:var(--txt);min-width:200px;}
.mp-search input{background:none;border:none;outline:none;color:var(--txt);font-family:inherit;font-size:13.5px;width:100%;}
.mp-search input::placeholder{color:var(--txt-3);}

.mp-filters{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:16px;}
.mp-fsel{display:flex;align-items:center;gap:7px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:0 10px;}
.mp-fsel select{background:none;border:none;outline:none;color:var(--txt);font-family:inherit;font-size:13px;padding:9px 4px;cursor:pointer;}
.mp-fsel svg{color:var(--txt-3);flex-shrink:0;}

.mp-overlay{position:fixed;inset:0;background:rgba(5,8,12,.74);backdrop-filter:blur(3px);
  display:grid;place-items:center;padding:18px;z-index:50;animation:mpfade .14s;}
@keyframes mpfade{from{opacity:0;}}
.mp-modal{background:var(--surface);border:1px solid var(--line-strong);border-radius:15px;width:100%;
  max-width:520px;max-height:92vh;overflow-y:auto;animation:mpup .18s;}
@keyframes mpup{from{transform:translateY(10px);opacity:0;}}
.mp-modal-h{padding:18px 21px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--surface);z-index:2;}
.mp-modal-t{font-family:'Inter';font-weight:700;font-size:18px;letter-spacing:-.01em;}
.mp-modal-b{padding:21px;}
.mp-modal-f{padding:15px 21px;border-top:1px solid var(--line);display:flex;gap:10px;justify-content:flex-end;position:sticky;bottom:0;background:var(--surface);}
.mp-field{margin-bottom:15px;}
.mp-field.row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mp-label{display:block;font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--txt-2);margin-bottom:7px;}
.mp-input,.mp-select,.mp-textarea{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:8px;
  padding:10px 12px;color:var(--txt);font-family:inherit;font-size:14px;outline:none;transition:.13s;}
.mp-input:focus,.mp-select:focus,.mp-textarea:focus{border-color:var(--blue);box-shadow:0 0 0 3px var(--blue-soft);}
.mp-textarea{resize:vertical;min-height:64px;}
.mp-input.mono{font-family:'JetBrains Mono';letter-spacing:.05em;}

.mp-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:9px;}
.mp-chip{padding:6px 11px;border-radius:7px;border:1px solid var(--line);background:var(--bg);
  color:var(--txt-2);font-family:inherit;font-size:12.5px;font-weight:500;cursor:pointer;transition:.12s;}
.mp-chip:hover{border-color:var(--line-strong);color:var(--txt);}
.mp-chip.on{background:var(--blue-soft);border-color:var(--blue);color:var(--blue-hi);font-weight:600;}

.mp-veic{border:1px solid var(--line);border-radius:10px;padding:14px;margin-bottom:11px;background:var(--bg);}
.mp-veic-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.mp-veic-h b{font-size:13px;color:var(--txt-2);font-weight:600;display:flex;align-items:center;gap:7px;}
.mp-addveic{width:100%;border:1px dashed var(--line-strong);background:none;color:var(--txt-2);
  border-radius:9px;padding:11px;font-family:inherit;font-weight:600;font-size:13px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:7px;transition:.13s;}
.mp-addveic:hover{border-color:var(--blue);color:var(--blue-hi);}

.mp-wheel{position:relative;border:1px solid var(--line);border-radius:10px;background:var(--bg);overflow:hidden;}
.mp-wheel-sel{position:absolute;left:7px;right:7px;top:50%;height:36px;transform:translateY(-50%);
  border-radius:7px;background:var(--blue-soft);border:1px solid rgba(43,129,196,.4);pointer-events:none;}
.mp-wheel-scroll{overflow-y:auto;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;
  mask-image:linear-gradient(to bottom,transparent,#000 32%,#000 68%,transparent);
  -webkit-mask-image:linear-gradient(to bottom,transparent,#000 32%,#000 68%,transparent);}
.mp-wheel-scroll::-webkit-scrollbar{display:none;}
.mp-wheel-item{display:flex;align-items:center;justify-content:center;scroll-snap-align:center;
  font-family:'JetBrains Mono';font-weight:600;font-size:16px;cursor:pointer;user-select:none;
  transition:opacity .12s,transform .12s,color .12s;}

.mp-svc{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);}
.mp-svc:last-child{border-bottom:none;}
.mp-svc-dot{width:30px;height:30px;border-radius:8px;background:var(--surface-2);display:grid;place-items:center;flex-shrink:0;color:var(--blue-hi);}
.mp-by{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:var(--txt-3);}

.mp-seg{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;}

/* agenda */
.mp-daynav{display:flex;align-items:center;gap:8px;}
.mp-daylbl{font-family:'Inter';font-weight:700;font-size:15px;text-transform:capitalize;min-width:140px;text-align:center;}
.mp-time{font-family:'JetBrains Mono';font-weight:700;font-size:15px;color:var(--blue-hi);min-width:46px;text-align:center;}
.mp-ag-done .mp-time{color:var(--txt-3);}
.mp-ag-done .mp-radar-name{text-decoration:line-through;color:var(--txt-2);}

/* gráficos */
.mp-bars{display:flex;align-items:flex-end;gap:10px;height:170px;padding:14px 6px 0;}
.mp-bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;height:100%;justify-content:flex-end;min-width:0;}
.mp-bar-fill{width:100%;max-width:48px;background:linear-gradient(var(--blue-hi),var(--blue));border-radius:6px 6px 0 0;min-height:3px;transition:height .35s;}
.mp-bar-lbl{font-size:10.5px;color:var(--txt-3);text-align:center;text-transform:capitalize;white-space:nowrap;}
.mp-bar-val{font-family:'JetBrains Mono';font-size:10px;color:var(--txt-2);font-weight:600;white-space:nowrap;}
.mp-rank{display:flex;flex-direction:column;gap:13px;}
.mp-rank-top{display:flex;justify-content:space-between;align-items:baseline;font-size:13.5px;margin-bottom:6px;gap:10px;}
.mp-rank-top b{font-weight:600;}
.mp-rank-top span{font-family:'JetBrains Mono';font-size:12.5px;color:var(--txt-2);white-space:nowrap;}
.mp-rank-track{height:8px;background:var(--surface-2);border-radius:5px;overflow:hidden;}
.mp-rank-fill{height:100%;border-radius:5px;transition:width .35s;}

.mp-mobnav{display:none;}
@media(max-width:860px){
  .mp-nav{display:none;}
  .mp-main{padding:20px 15px 86px;}
  .mp-h1{font-size:24px;}
  .mp-kpis{grid-template-columns:repeat(2,1fr);}
  .mp-grid2{grid-template-columns:1fr;}
  .mp-mobnav{display:flex;position:fixed;bottom:0;left:0;right:0;background:var(--surface);
    border-top:1px solid var(--line);padding:7px 2px;z-index:40;overflow-x:auto;}
  .mp-mobnav button{flex:0 0 auto;min-width:60px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;
    border:none;color:var(--txt-3);font-size:9.5px;font-weight:600;font-family:inherit;padding:5px 3px;cursor:pointer;position:relative;}
  .mp-mobnav button.on{color:var(--blue-hi);}
  .mp-mobnav::-webkit-scrollbar{display:none;}
  .mp-field.row{grid-template-columns:1fr;}
  .mp-search{min-width:0;flex:1;}
  .mp-daylbl{min-width:0;font-size:13px;}
}
`;

/* ---------- referência ---------- */
const SERVICOS = {
  troca_oleo:  { nome: "Troca de óleo",       dias: 180, km: 10000, icon: Gauge },
  pneus:       { nome: "Troca de pneus",      dias: 730, km: 50000, icon: Car },
  alinhamento: { nome: "Alinhamento/balanc.", dias: 180, km: 10000, icon: Wrench },
  rodizio:     { nome: "Rodízio de pneus",    dias: 150, km: 10000, icon: Car },
  freios:      { nome: "Revisão de freios",   dias: 365, km: 20000, icon: AlertTriangle },
  revisao:     { nome: "Revisão geral",       dias: 365, km: 10000, icon: Wrench },
  outro:       { nome: "Outro serviço",       dias: 365, km: 0,     icon: Wrench },
};
const MARCAS = ["Volkswagen","Chevrolet","Fiat","Ford","Toyota","Hyundai","Honda","Renault",
  "Jeep","Nissan","Peugeot","Citroën","Kia","Mitsubishi","Mercedes-Benz","BMW","Audi","Volvo",
  "RAM","Chery","BYD","GWM","Suzuki","Land Rover"];
const MARCAS_TOP = ["Volkswagen","Chevrolet","Fiat","Ford","Toyota","Hyundai","Honda","Renault","Jeep"];
const KM_MES_PADRAO = 1000;

const CONTATOS = {
  chamado:   { label: "Chamado",   cor: "amber", icon: PhoneCall },
  respondeu: { label: "Respondeu", cor: "blue",  icon: Reply },
  agendou:   { label: "Agendou",   cor: "green", icon: CalendarCheck },
};
const PERIODOS = { mes: "Este mês", d90: "90 dias", ano: "Este ano", tudo: "Tudo" };

const STORAGE_KEY = "murilo:dados:v2";
const ANO_ATUAL = new Date().getFullYear();
const hoje = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtData = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("pt-BR") : "—";
const fmtDM = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "";
const fmtDiaSemana = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }) : "";
const fmtR = (v) => "R$ " + Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const diasEntre = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const dataMs = (s) => new Date(s + "T00:00:00").getTime();
const soDigitos = (t) => (t || "").replace(/\D/g, "");
const waNumero = (tel) => { let d = soDigitos(tel); if (d.length <= 11) d = "55" + d; return d; };
const initials = (n) => (n || "?").trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
const veicLabel = (v) => v ? ([v.marca, v.modelo].filter(Boolean).join(" ") || "Veículo") : "";
const primeiroNome = (n) => (n || "").trim().split(/\s+/)[0] || "";
const addDias = (s, n) => new Date(dataMs(s) + n * 86400000).toISOString().slice(0, 10);
const inicioDe = (preset) => {
  const n = new Date();
  if (preset === "mes") return new Date(n.getFullYear(), n.getMonth(), 1).getTime();
  if (preset === "d90") return Date.now() - 90 * 86400000;
  if (preset === "ano") return new Date(n.getFullYear(), 0, 1).getTime();
  return 0;
};

/* ---------- migração ---------- */
function migrar(d) {
  const clientes = (d.clientes || []).map(c => {
    if (c.veiculos) return { contato: null, aniversario: "", ...c };
    const temVeic = c.marca || c.modelo || c.placa || c.veiculo || c.ano;
    return {
      ...c,
      veiculos: temVeic ? [{ id: uid(), marca: c.marca || "", modelo: c.modelo || c.veiculo || "", placa: c.placa || "", ano: c.ano || ANO_ATUAL, kmMedioMes: KM_MES_PADRAO }] : [],
      contato: c.contato || null, aniversario: c.aniversario || "",
    };
  });
  const servicos = (d.servicos || []).map(s => {
    if (s.veiculoId) return s;
    const c = clientes.find(x => x.id === s.clienteId);
    return { ...s, veiculoId: c && c.veiculos[0] ? c.veiculos[0].id : null };
  });
  return { clientes, servicos, orcamentos: d.orcamentos || [], agendamentos: d.agendamentos || [] };
}

/* ---------- storage ---------- */
const store = {
  async get(key) {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      try { return await window.storage.get(key); } catch (e) {}
    }
    try { const v = localStorage.getItem(key); return v ? { key, value: v } : null; } catch (e) { return null; }
  },
  async set(key, value) {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      try { return await window.storage.set(key, value); } catch (e) {}
    }
    try { localStorage.setItem(key, value); } catch (e) {}
    return { key, value };
  },
};

/* ---------- emblema ---------- */
function MuriloMark({ size = 40 }) {
  const raios = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 - 90) * Math.PI / 180;
    raios.push(<line key={i} x1={50 + 4 * Math.cos(a)} y1={40 + 4 * Math.sin(a)} x2={50 + 11 * Math.cos(a)} y2={40 + 11 * Math.sin(a)} stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 39 H76 L50 73 Z" fill="var(--blue)" stroke="var(--blue)" strokeWidth="13" strokeLinejoin="round" />
      <circle cx="50" cy="69" r="4.5" fill="var(--blue)" />
      <ellipse cx="50" cy="40" rx="17" ry="21" fill="#fff" stroke="var(--blue)" strokeWidth="2.5" />
      <circle cx="50" cy="40" r="13" fill="var(--blue)" />
      {raios}<circle cx="50" cy="40" r="3.4" fill="#fff" /><circle cx="50" cy="40" r="1.3" fill="var(--blue)" />
    </svg>
  );
}

/* ---------- retorno (tempo E km) ---------- */
function calcRetorno(veiculo, svcs) {
  const kmMes = Number(veiculo.kmMedioMes) || KM_MES_PADRAO;
  let prox = null;
  svcs.forEach(s => {
    const regra = SERVICOS[s.tipo]; if (!regra) return;
    const base = dataMs(s.data);
    let vencMs = base + regra.dias * 86400000; let motivo = "tempo";
    if (regra.km && s.km && kmMes > 0) {
      const vencKmMs = base + (regra.km / kmMes) * 30 * 86400000;
      if (vencKmMs < vencMs) { vencMs = vencKmMs; motivo = "km"; }
    }
    const venc = new Date(vencMs).toISOString().slice(0, 10);
    if (!prox || venc < prox.venc) prox = { venc, tipo: s.tipo, nome: regra.nome, motivo, km: regra.km };
  });
  return prox;
}

export default function MuriloCRM() {
  const [view, setView] = useState("painel");
  const [carregado, setCarregado] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await store.get(STORAGE_KEY);
        if (r && r.value) {
          const d = migrar(JSON.parse(r.value));
          setClientes(d.clientes); setServicos(d.servicos); setOrcamentos(d.orcamentos); setAgendamentos(d.agendamentos);
        }
      } catch (e) {}
      setCarregado(true);
    })();
  }, []);

  useEffect(() => {
    if (!carregado) return;
    const t = setTimeout(async () => {
      try { await store.set(STORAGE_KEY, JSON.stringify({ clientes, servicos, orcamentos, agendamentos })); }
      catch (e) { console.error("Falha ao salvar", e); }
    }, 300);
    return () => clearTimeout(t);
  }, [clientes, servicos, orcamentos, agendamentos, carregado]);

  const retornos = useMemo(() => {
    const out = [];
    clientes.forEach(c => {
      (c.veiculos || []).forEach(v => {
        const svcs = servicos.filter(s => s.clienteId === c.id && s.veiculoId === v.id);
        const prox = calcRetorno(v, svcs);
        if (!prox) return;
        const d = diasEntre(hoje(), prox.venc);
        out.push({ key: c.id + "_" + v.id, cliente: c, veiculo: v, ...prox, dias: d, status: d < 0 ? "late" : d <= 30 ? "soon" : "ok" });
      });
    });
    return out.sort((a, b) => {
      const aD = a.cliente.contato && a.cliente.contato.status === "agendou";
      const bD = b.cliente.contato && b.cliente.contato.status === "agendou";
      if (aD !== bD) return aD ? 1 : -1;
      return a.dias - b.dias;
    });
  }, [clientes, servicos]);

  const setContato = (clienteId, status) =>
    setClientes(prev => prev.map(c => c.id === clienteId ? { ...c, contato: status ? { status, data: hoje() } : null } : c));

  const pend = retornos.filter(r => r.status !== "ok" && !(r.cliente.contato && r.cliente.contato.status === "agendou")).length;
  const agHoje = agendamentos.filter(a => a.data === hoje() && a.status === "agendado").length;
  const ctx = { clientes, setClientes, servicos, setServicos, orcamentos, setOrcamentos, agendamentos, setAgendamentos, retornos, setContato };

  const NAV = [
    { sec: "Gestão" },
    { id: "painel", icon: LayoutDashboard, label: "Painel", badge: pend },
    { id: "agenda", icon: CalendarDays, label: "Agenda", badge: agHoje },
    { id: "clientes", icon: Users, label: "Clientes" },
    { id: "servicos", icon: Wrench, label: "Serviços" },
    { id: "orcamentos", icon: FileText, label: "Orçamentos" },
    { sec: "Analisar" },
    { id: "gestao", icon: TrendingUp, label: "Dashboard" },
    { sec: "Crescer" },
    { id: "campanhas", icon: Megaphone, label: "Campanhas" },
  ];
  const mobItems = NAV.filter(n => n.id);

  return (
    <div className="mp-root">
      <style>{THEME_CSS}</style>
      <div className="mp-shell">
        <nav className="mp-nav">
          <div className="mp-brand">
            <MuriloMark size={42} />
            <div><div className="mp-brand-name">Murilo Pneus</div><div className="mp-brand-sub">Auto Center</div></div>
          </div>
          {NAV.map((n, i) => n.sec
            ? <div className="mp-navsec" key={"s" + i}>{n.sec}</div>
            : <NavItem key={n.id} icon={n.icon} label={n.label} on={view === n.id} onClick={() => setView(n.id)} badge={n.badge} />)}
          <div style={{ marginTop: "auto", padding: "12px 12px 2px", fontSize: 10.5, color: "var(--txt-3)", lineHeight: 1.5 }}>Dados salvos neste navegador.</div>
        </nav>

        <main className="mp-main">
          {!carregado ? <div className="mp-empty" style={{ paddingTop: 120 }}>Carregando…</div> : <>
            {view === "painel" && <Painel ctx={ctx} go={setView} />}
            {view === "agenda" && <Agenda ctx={ctx} />}
            {view === "clientes" && <Clientes ctx={ctx} />}
            {view === "servicos" && <Servicos ctx={ctx} />}
            {view === "orcamentos" && <Orcamentos ctx={ctx} />}
            {view === "gestao" && <Dashboard ctx={ctx} />}
            {view === "campanhas" && <Campanhas ctx={ctx} />}
          </>}
        </main>
      </div>

      <div className="mp-mobnav">
        {mobItems.map(n => <MobNav key={n.id} icon={n.icon} label={n.label} on={view === n.id} onClick={() => setView(n.id)} badge={n.badge} />)}
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, on, onClick, badge }) {
  return <button className={"mp-navitem" + (on ? " on" : "")} onClick={onClick}><Icon size={17} /> {label}{badge > 0 && <span className="mp-navbadge">{badge}</span>}</button>;
}
function MobNav({ icon: Icon, label, on, onClick, badge }) {
  return (
    <button className={on ? "on" : ""} onClick={onClick}>
      <div style={{ position: "relative" }}><Icon size={19} />
        {badge > 0 && <span style={{ position: "absolute", top: -5, right: -9, background: "var(--amber)", color: "#1a1206", fontSize: 9, fontWeight: 700, minWidth: 15, height: 15, borderRadius: 8, display: "grid", placeItems: "center", padding: "0 3px" }}>{badge}</span>}
      </div>{label}
    </button>
  );
}

/* ===================== PAINEL ===================== */
function Painel({ ctx, go }) {
  const { clientes, orcamentos, retornos, setContato } = ctx;
  const [fStatus, setFStatus] = useState("pend");
  const aprovados = orcamentos.filter(o => o.status === "aprovado");
  const semResp = orcamentos.filter(o => o.status === "enviado");
  const nVeic = clientes.reduce((a, c) => a + (c.veiculos ? c.veiculos.length : 0), 0);
  const isPend = (r) => r.status !== "ok" && !(r.cliente.contato && r.cliente.contato.status === "agendou");
  const pendN = retornos.filter(isPend).length;

  const vis = retornos.filter(r => {
    if (fStatus === "pend") return isPend(r);
    if (fStatus === "late") return r.status === "late";
    if (fStatus === "soon") return r.status === "soon";
    return true;
  });

  return (
    <>
      <div className="mp-head"><div><div className="mp-eyebrow">Visão geral</div><h1 className="mp-h1">Painel da oficina</h1></div></div>
      <div className="mp-kpis">
        <Kpi icon={Users} label="Clientes" num={clientes.length} />
        <Kpi icon={Bell} label="Retornos a chamar" num={pendN} tone={pendN ? "amber" : ""} />
        <Kpi icon={Car} label="Veículos" num={nVeic} tone="blue" />
        <Kpi icon={CheckCircle2} label="Orçam. aprovados" num={aprovados.length} tone="green" />
      </div>

      <div className="mp-card">
        <div className="mp-card-h">
          <div className="mp-card-t"><Bell size={17} color="var(--amber)" /> Radar de retorno</div>
          <div className="mp-chips" style={{ margin: 0 }}>
            {[["pend", "A chamar"], ["late", "Vencidos"], ["soon", "Vencendo"], ["todos", "Todos"]].map(([k, l]) =>
              <button key={k} className={"mp-chip" + (fStatus === k ? " on" : "")} onClick={() => setFStatus(k)}>{l}</button>)}
          </div>
        </div>
        {vis.length === 0 ? (
          <div className="mp-empty"><Bell size={32} /><h3>{retornos.length ? "Nada nesse filtro" : "Sem retornos ainda"}</h3>
            <p>{retornos.length ? "Troque o filtro acima." : "Registre um serviço para o CRM avisar quando o veículo precisa voltar."}</p>
            {!retornos.length && <button className="mp-btn" style={{ marginTop: 15 }} onClick={() => go("servicos")}><Plus size={15} /> Registrar serviço</button>}
          </div>
        ) : vis.slice(0, 20).map(r => <RadarRow key={r.key} r={r} setContato={setContato} />)}
      </div>

      {semResp.length > 0 && (
        <div className="mp-card" style={{ marginTop: 18 }}>
          <div className="mp-card-h"><div className="mp-card-t"><Clock size={16} color="var(--blue-hi)" /> Orçamentos sem resposta</div></div>
          {semResp.map(o => {
            const c = clientes.find(x => x.id === o.clienteId);
            return (
              <div className="mp-list-row" key={o.id}>
                <div className="mp-avatar">{initials(c && c.nome)}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div className="mp-radar-name">{c ? c.nome : "—"}</div><div className="mp-radar-meta"><span>{o.descricao}</span></div></div>
                <div className="mp-money">{fmtR(o.valor)}</div>
                {c && <WaButton tel={c.telefone} msg={msgOrcamento(c, o)} small />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
function Kpi({ icon: Icon, label, num, tone, sub, small }) {
  return (
    <div className="mp-kpi">
      <div className="mp-kpi-label"><Icon size={13} /> {label}</div>
      <div className={"mp-kpi-num " + (small ? "sm " : "") + (tone || "")}>{num}</div>
      {sub && <div className="mp-kpi-sub">{sub}</div>}
    </div>
  );
}
function RadarRow({ r, setContato }) {
  const txt = r.dias < 0 ? `Atrasado ${Math.abs(r.dias)}d` : r.dias === 0 ? "Vence hoje" : `Em ${r.dias} dias`;
  const v = veicLabel(r.veiculo); const ct = r.cliente.contato; const done = ct && ct.status === "agendou";
  return (
    <div className={"mp-radar-row" + (done ? " done" : "")}>
      <div className={"mp-pulse " + r.status} />
      <div className="mp-radar-info">
        <div className="mp-radar-name">{r.cliente.nome}</div>
        <div className="mp-radar-meta">
          <span><Wrench size={12} /> {r.nome}</span>
          {v && <span><Car size={12} /> {v}</span>}
          {r.veiculo.placa && <span className="mp-plate">{r.veiculo.placa}</span>}
        </div>
      </div>
      {r.motivo === "km" && <span className="mp-tag km" title="Previsto pela quilometragem">~{r.km / 1000}k km</span>}
      <span className={"mp-tag " + r.status}>{txt}</span>
      <ContatoControl contato={ct} onSet={(st) => setContato(r.cliente.id, st)} />
      <WaButton tel={r.cliente.telefone} msg={msgRetorno(r)} small onAfter={() => { if (!ct || ct.status === "chamado") setContato(r.cliente.id, "chamado"); }} />
    </div>
  );
}
function ContatoControl({ contato, onSet }) {
  const cur = contato && contato.status;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {contato && contato.status === "chamado" && <span className="mp-cstamp">{fmtDM(contato.data)}</span>}
      <div className="mp-contato">
        {Object.entries(CONTATOS).map(([st, info]) => {
          const I = info.icon; const on = cur === st;
          return <button key={st} className={"mp-cbtn" + (on ? " on-" + info.cor : "")} title={on ? info.label + " — clique p/ limpar" : "Marcar: " + info.label} onClick={() => onSet(cur === st ? null : st)}><I size={14} /></button>;
        })}
      </div>
    </div>
  );
}

/* ===================== AGENDA ===================== */
function Agenda({ ctx }) {
  const { clientes, agendamentos, setAgendamentos } = ctx;
  const [modo, setModo] = useState("dia");
  const [dia, setDia] = useState(hoje());
  const [novo, setNovo] = useState(false);

  const salvar = (a) => { setAgendamentos(prev => [...prev, { ...a, id: uid(), status: "agendado" }]); setNovo(false); };
  const setStatus = (id, st) => setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: st } : a));
  const remover = (id) => { if (confirm("Remover agendamento?")) setAgendamentos(prev => prev.filter(a => a.id !== id)); };

  const lista = useMemo(() => {
    let l = agendamentos.filter(a => a.status !== "cancelado");
    if (modo === "dia") l = l.filter(a => a.data === dia);
    else l = l.filter(a => a.data >= hoje() && a.status === "agendado");
    return l.sort((a, b) => (a.data + (a.hora || "")).localeCompare(b.data + (b.hora || "")));
  }, [agendamentos, modo, dia]);

  const dadosDe = (a) => {
    const c = clientes.find(x => x.id === a.clienteId);
    const v = c && (c.veiculos || []).find(x => x.id === a.veiculoId);
    return { c, v };
  };

  return (
    <>
      <div className="mp-head">
        <div><div className="mp-eyebrow">Operação</div><h1 className="mp-h1">Agenda</h1></div>
        <button className="mp-btn" disabled={!clientes.length} onClick={() => setNovo(true)}><CalendarPlus size={15} /> Agendar</button>
      </div>

      <div className="mp-filters">
        <div className="mp-chips" style={{ margin: 0 }}>
          <button className={"mp-chip" + (modo === "dia" ? " on" : "")} onClick={() => setModo("dia")}>Por dia</button>
          <button className={"mp-chip" + (modo === "prox" ? " on" : "")} onClick={() => setModo("prox")}>Próximos</button>
        </div>
        {modo === "dia" && (
          <div className="mp-daynav" style={{ marginLeft: "auto" }}>
            <button className="mp-icbtn" onClick={() => setDia(addDias(dia, -1))}><ChevronLeft size={16} /></button>
            <span className="mp-daylbl">{dia === hoje() ? "Hoje" : fmtDiaSemana(dia)}</span>
            <button className="mp-icbtn" onClick={() => setDia(addDias(dia, 1))}><ChevronRight size={16} /></button>
            {dia !== hoje() && <button className="mp-btn ghost sm" onClick={() => setDia(hoje())}>Hoje</button>}
          </div>
        )}
      </div>

      <div className="mp-card">
        {lista.length === 0 ? (
          <div className="mp-empty"><CalendarDays size={32} /><h3>{modo === "dia" ? "Nada agendado nesse dia" : "Nenhum horário futuro"}</h3>
            <p>Use o botão <b>Agendar</b> para marcar um serviço.</p></div>
        ) : lista.map(a => {
          const { c, v } = dadosDe(a); const r = SERVICOS[a.tipo] || SERVICOS.outro;
          const done = a.status === "concluido";
          return (
            <div className={"mp-radar-row" + (done ? " mp-ag-done done" : "")} key={a.id}>
              <div className="mp-time">{a.hora || "—"}</div>
              <div className="mp-radar-info">
                <div className="mp-radar-name">{c ? c.nome : "—"}</div>
                <div className="mp-radar-meta">
                  <span><Wrench size={12} /> {r.nome}</span>
                  {v && <span><Car size={12} /> {veicLabel(v)}</span>}
                  {v && v.placa && <span className="mp-plate">{v.placa}</span>}
                  {modo === "prox" && <span><Calendar size={12} /> {fmtDM(a.data)}</span>}
                </div>
                {a.obs && <div style={{ fontSize: 12.5, color: "var(--txt-3)", marginTop: 3 }}>{a.obs}</div>}
              </div>
              {done && <span className="mp-tag done">Concluído</span>}
              {!done && c && <WaButton tel={c.telefone} msg={msgAgendamento(a, c, v, r.nome)} small />}
              {!done && <button className="mp-icbtn go" title="Concluir" onClick={() => setStatus(a.id, "concluido")}><Check size={16} /></button>}
              <button className="mp-icbtn danger" onClick={() => remover(a.id)}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>

      {novo && <AgendamentoModal clientes={clientes} diaBase={dia} onSave={salvar} onClose={() => setNovo(false)} />}
    </>
  );
}

function AgendamentoModal({ clientes, diaBase, onSave, onClose }) {
  const comVeic = clientes.filter(c => (c.veiculos || []).length);
  const [f, setF] = useState(() => {
    const c0 = comVeic[0] || clientes[0];
    return { clienteId: c0 ? c0.id : "", veiculoId: c0 && c0.veiculos && c0.veiculos[0] ? c0.veiculos[0].id : "", tipo: "troca_oleo", data: diaBase || hoje(), hora: "09:00", obs: "" };
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const cliente = clientes.find(c => c.id === f.clienteId);
  const veiculos = cliente ? (cliente.veiculos || []) : [];
  const trocaCliente = (id) => { const c = clientes.find(x => x.id === id); setF(p => ({ ...p, clienteId: id, veiculoId: c && c.veiculos && c.veiculos[0] ? c.veiculos[0].id : "" })); };

  return (
    <Modal title="Agendar serviço" onClose={onClose}
      footer={<><button className="mp-btn ghost" onClick={onClose}>Cancelar</button>
        <button className="mp-btn" disabled={!f.clienteId || !f.veiculoId} onClick={() => onSave(f)}>Agendar</button></>}>
      <Field label="Cliente">
        <select className="mp-select" value={f.clienteId} onChange={e => trocaCliente(e.target.value)}>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </Field>
      <Field label="Veículo">
        {veiculos.length === 0 ? <div style={{ fontSize: 13, color: "var(--amber)" }}>Cliente sem veículo. Edite o cliente e adicione um.</div>
          : <select className="mp-select" value={f.veiculoId} onChange={e => set("veiculoId", e.target.value)}>
              {veiculos.map(v => <option key={v.id} value={v.id}>{veicLabel(v)}{v.placa ? ` · ${v.placa}` : ""}</option>)}
            </select>}
      </Field>
      <Field label="Serviço">
        <select className="mp-select" value={f.tipo} onChange={e => set("tipo", e.target.value)}>
          {Object.entries(SERVICOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}
        </select>
      </Field>
      <div className="mp-field row">
        <div><label className="mp-label">Data</label><input type="date" className="mp-input" value={f.data} onChange={e => set("data", e.target.value)} /></div>
        <div><label className="mp-label">Hora</label><input type="time" className="mp-input mono" value={f.hora} onChange={e => set("hora", e.target.value)} /></div>
      </div>
      <Field label="Observação"><textarea className="mp-textarea" value={f.obs} onChange={e => set("obs", e.target.value)} placeholder="Ex.: trazer o pneu reserva…" /></Field>
    </Modal>
  );
}

/* ===================== CLIENTES ===================== */
function Clientes({ ctx }) {
  const { clientes, setClientes, servicos } = ctx;
  const [busca, setBusca] = useState("");
  const [fMarca, setFMarca] = useState("");
  const [edit, setEdit] = useState(null);
  const [detalhe, setDetalhe] = useState(null);

  const marcasUsadas = useMemo(() => [...new Set(clientes.flatMap(c => (c.veiculos || []).map(v => v.marca).filter(Boolean)))].sort(), [clientes]);
  const txtBusca = (c) => (c.nome + " " + (c.telefone || "") + " " + (c.veiculos || []).map(v => veicLabel(v) + " " + (v.placa || "")).join(" ")).toLowerCase();
  const filtrados = clientes.filter(c =>
    txtBusca(c).includes(busca.toLowerCase()) &&
    (!fMarca || (c.veiculos || []).some(v => v.marca === fMarca)));

  const salvar = (c) => { setClientes(prev => c.id ? prev.map(x => x.id === c.id ? c : x) : [...prev, { ...c, id: uid(), criadoEm: hoje() }]); setEdit(null); };
  const remover = (id) => { if (confirm("Remover este cliente?")) setClientes(prev => prev.filter(x => x.id !== id)); };

  return (
    <>
      <div className="mp-head">
        <div><div className="mp-eyebrow">Cadastro</div><h1 className="mp-h1">Clientes</h1></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="mp-search"><Search size={15} color="var(--txt-3)" /><input placeholder="Buscar…" value={busca} onChange={e => setBusca(e.target.value)} /></div>
          <div className="mp-fsel"><Filter size={14} /><select value={fMarca} onChange={e => setFMarca(e.target.value)}><option value="">Todas as marcas</option>{marcasUsadas.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          <button className="mp-btn" onClick={() => setEdit({})}><Plus size={15} /> Novo</button>
        </div>
      </div>

      <div className="mp-card">
        {filtrados.length === 0 ? (
          <div className="mp-empty"><Users size={32} /><h3>Nenhum cliente</h3><p>{clientes.length ? "Nada nesse filtro." : "Cadastre o primeiro cliente e seus veículos."}</p></div>
        ) : filtrados.map(c => {
          const vs = c.veiculos || []; const v0 = vs[0];
          return (
            <div className="mp-list-row" key={c.id}>
              <div className="mp-avatar">{initials(c.nome)}</div>
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setDetalhe(c)}>
                <div className="mp-radar-name">{c.nome}</div>
                <div className="mp-radar-meta">
                  {c.telefone && <span><Phone size={12} /> {c.telefone}</span>}
                  {v0 && <span><Car size={12} /> {veicLabel(v0)}{vs.length > 1 ? "" : (v0.ano ? ` · ${v0.ano}` : "")}</span>}
                  {vs.length > 1 && <span className="mp-count">+{vs.length - 1} veículo{vs.length - 1 > 1 ? "s" : ""}</span>}
                </div>
              </div>
              {v0 && v0.placa && <span className="mp-plate">{v0.placa}</span>}
              <button className="mp-icbtn" onClick={() => setDetalhe(c)} title="Histórico"><ChevronRight size={16} /></button>
              <button className="mp-icbtn" onClick={() => setEdit(c)}><Edit3 size={15} /></button>
              <button className="mp-icbtn danger" onClick={() => remover(c.id)}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>

      {edit && <ClienteModal cliente={edit} onSave={salvar} onClose={() => setEdit(null)} />}
      {detalhe && <DetalheModal cliente={detalhe} servicos={servicos.filter(s => s.clienteId === detalhe.id)} onClose={() => setDetalhe(null)} />}
    </>
  );
}

function novoVeiculo() { return { id: uid(), marca: "", modelo: "", placa: "", ano: ANO_ATUAL, kmMedioMes: KM_MES_PADRAO }; }

function ClienteModal({ cliente, onSave, onClose }) {
  const [f, setF] = useState(() => ({
    nome: "", telefone: "", aniversario: "", contato: null, ...cliente,
    veiculos: (cliente.veiculos && cliente.veiculos.length) ? cliente.veiculos : [novoVeiculo()],
  }));
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const setVeic = (id, k, v) => setF(p => ({ ...p, veiculos: p.veiculos.map(x => x.id === id ? { ...x, [k]: v } : x) }));
  const addVeic = () => setF(p => ({ ...p, veiculos: [...p.veiculos, novoVeiculo()] }));
  const delVeic = (id) => setF(p => ({ ...p, veiculos: p.veiculos.filter(x => x.id !== id) }));
  const ok = f.nome.trim() && f.telefone.trim();

  return (
    <Modal title={cliente.id ? "Editar cliente" : "Novo cliente"} onClose={onClose}
      footer={<><button className="mp-btn ghost" onClick={onClose}>Cancelar</button>
        <button className="mp-btn" disabled={!ok} onClick={() => onSave(f)}>Salvar cliente</button></>}>
      <Field label="Nome"><input className="mp-input" value={f.nome} onChange={e => set("nome", e.target.value)} placeholder="Ex.: João Pereira" /></Field>
      <div className="mp-field row">
        <div><label className="mp-label">WhatsApp</label><input className="mp-input" value={f.telefone} onChange={e => set("telefone", e.target.value)} placeholder="(55) 99999-9999" /></div>
        <div><label className="mp-label">Aniversário</label><input type="date" className="mp-input" value={f.aniversario || ""} onChange={e => set("aniversario", e.target.value)} /></div>
      </div>
      <label className="mp-label">Veículos</label>
      {f.veiculos.map((v, i) => (
        <div className="mp-veic" key={v.id}>
          <div className="mp-veic-h"><b><Car size={14} /> Veículo {i + 1}</b>
            {f.veiculos.length > 1 && <button className="mp-icbtn danger" style={{ width: 28, height: 28 }} onClick={() => delVeic(v.id)}><Trash2 size={14} /></button>}</div>
          <div className="mp-chips">{MARCAS_TOP.map(m => <button key={m} type="button" className={"mp-chip" + (v.marca === m ? " on" : "")} onClick={() => setVeic(v.id, "marca", m)}>{m}</button>)}</div>
          <input className="mp-input" list="mp-marcas" style={{ marginBottom: 10 }} value={v.marca} onChange={e => setVeic(v.id, "marca", e.target.value)} placeholder="Outra marca — digite ou escolha" />
          <input className="mp-input" style={{ marginBottom: 10 }} value={v.modelo} onChange={e => setVeic(v.id, "modelo", e.target.value)} placeholder="Modelo — ex.: Gol, Onix, HB20" />
          <div className="mp-field row" style={{ marginBottom: 10 }}>
            <div><label className="mp-label">Placa</label><input className="mp-input mono" value={v.placa} onChange={e => setVeic(v.id, "placa", e.target.value.toUpperCase())} placeholder="ABC1D23" maxLength={8} /></div>
            <div><label className="mp-label">Km / mês</label><input className="mp-input mono" value={v.kmMedioMes} onChange={e => setVeic(v.id, "kmMedioMes", e.target.value.replace(/\D/g, ""))} placeholder="1000" /></div>
          </div>
          <label className="mp-label">Ano</label>
          <WheelPicker value={Number(v.ano) || ANO_ATUAL} onChange={val => setVeic(v.id, "ano", val)} min={1980} max={ANO_ATUAL + 1} width={150} />
        </div>
      ))}
      <button className="mp-addveic" onClick={addVeic}><Plus size={15} /> Adicionar outro veículo</button>
      <datalist id="mp-marcas">{MARCAS.map(m => <option key={m} value={m} />)}</datalist>
    </Modal>
  );
}

function DetalheModal({ cliente, servicos, onClose }) {
  const ord = [...servicos].sort((a, b) => b.data.localeCompare(a.data));
  const vs = cliente.veiculos || [];
  const veicById = (id) => vs.find(v => v.id === id);
  return (
    <Modal title={cliente.nome} onClose={onClose}
      footer={<><WaButton tel={cliente.telefone} msg={`Olá ${primeiroNome(cliente.nome)}, aqui é da Murilo Pneus Auto Center! `} />
        <button className="mp-btn ghost" onClick={onClose}>Fechar</button></>}>
      <div className="mp-radar-meta" style={{ marginBottom: 16 }}>
        {cliente.telefone && <span><Phone size={13} /> {cliente.telefone}</span>}
        {cliente.aniversario && <span><Cake size={13} /> {fmtData(cliente.aniversario)}</span>}
      </div>
      <label className="mp-label">Veículos</label>
      <div style={{ marginBottom: 18 }}>
        {vs.length === 0 ? <p style={{ color: "var(--txt-2)", fontSize: 14 }}>Nenhum veículo.</p> : vs.map(v => (
          <div key={v.id} className="mp-radar-meta" style={{ padding: "7px 0", borderBottom: "1px solid var(--line)" }}>
            <span><Car size={13} /> {veicLabel(v)}{v.ano ? ` · ${v.ano}` : ""}</span>{v.placa && <span className="mp-plate">{v.placa}</span>}
          </div>
        ))}
      </div>
      <label className="mp-label">Histórico de serviços</label>
      {ord.length === 0 ? <p style={{ color: "var(--txt-2)", fontSize: 14 }}>Nenhum serviço registrado ainda.</p>
        : ord.map(s => {
          const r = SERVICOS[s.tipo] || SERVICOS.outro; const I = r.icon; const v = veicById(s.veiculoId);
          return (
            <div className="mp-svc" key={s.id}>
              <div className="mp-svc-dot"><I size={15} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.nome}{v && <span style={{ color: "var(--txt-3)", fontWeight: 400 }}> · {veicLabel(v)}</span>}</div>
                <div className="mp-radar-meta">
                  <span><Calendar size={12} /> {fmtData(s.data)}</span>
                  {s.km && <span className="mp-mono"><Gauge size={12} /> {Number(s.km).toLocaleString("pt-BR")} km</span>}
                  {s.valor && <span className="mp-mono">{fmtR(s.valor)}</span>}
                  {s.colaborador && <span className="mp-by"><User size={11} /> {s.colaborador}</span>}
                </div>
                {s.obs && <div style={{ fontSize: 13, color: "var(--txt-2)", marginTop: 4 }}>{s.obs}</div>}
              </div>
            </div>
          );
        })}
    </Modal>
  );
}

/* ===================== SERVIÇOS ===================== */
function Servicos({ ctx }) {
  const { clientes, servicos, setServicos } = ctx;
  const [novo, setNovo] = useState(false);
  const [fColab, setFColab] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fPer, setFPer] = useState("tudo");
  const colabs = useMemo(() => [...new Set(servicos.map(s => s.colaborador).filter(Boolean))], [servicos]);

  const ini = inicioDe(fPer);
  const ord = servicos
    .filter(s => (!fColab || s.colaborador === fColab) && (!fTipo || s.tipo === fTipo) && dataMs(s.data) >= ini)
    .sort((a, b) => b.data.localeCompare(a.data));

  const veicLabelOf = (clienteId, veiculoId) => {
    const c = clientes.find(x => x.id === clienteId);
    const v = c && (c.veiculos || []).find(x => x.id === veiculoId);
    return v ? veicLabel(v) + (v.placa ? ` · ${v.placa}` : "") : "";
  };
  const salvar = (s) => { setServicos(prev => [...prev, { ...s, id: uid() }]); setNovo(false); };
  const remover = (id) => { if (confirm("Remover serviço?")) setServicos(prev => prev.filter(x => x.id !== id)); };

  return (
    <>
      <div className="mp-head">
        <div><div className="mp-eyebrow">Histórico</div><h1 className="mp-h1">Serviços</h1></div>
        <button className="mp-btn" disabled={!clientes.length} onClick={() => setNovo(true)}><Plus size={15} /> Registrar serviço</button>
      </div>

      <div className="mp-filters">
        <div className="mp-fsel"><Calendar size={14} /><select value={fPer} onChange={e => setFPer(e.target.value)}>{Object.entries(PERIODOS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
        <div className="mp-fsel"><Wrench size={14} /><select value={fTipo} onChange={e => setFTipo(e.target.value)}><option value="">Todos os serviços</option>{Object.entries(SERVICOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></div>
        <div className="mp-fsel"><User size={14} /><select value={fColab} onChange={e => setFColab(e.target.value)}><option value="">Todos colaboradores</option>{colabs.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
      </div>

      <div className="mp-card">
        {!clientes.length ? (
          <div className="mp-empty"><Users size={32} /><h3>Cadastre um cliente primeiro</h3><p>Os serviços ficam vinculados a um veículo do cliente.</p></div>
        ) : ord.length === 0 ? (
          <div className="mp-empty"><Wrench size={32} /><h3>Nenhum serviço</h3><p>{servicos.length ? "Nada nesse filtro." : "Registre o primeiro serviço realizado."}</p></div>
        ) : ord.map(s => {
          const c = clientes.find(x => x.id === s.clienteId); const r = SERVICOS[s.tipo] || SERVICOS.outro; const I = r.icon;
          return (
            <div className="mp-list-row" key={s.id}>
              <div className="mp-svc-dot" style={{ width: 38, height: 38 }}><I size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mp-radar-name">{r.nome} <span style={{ color: "var(--txt-3)", fontWeight: 400 }}>· {c ? c.nome : "—"}</span></div>
                <div className="mp-radar-meta">
                  <span><Calendar size={12} /> {fmtData(s.data)}</span>
                  {veicLabelOf(s.clienteId, s.veiculoId) && <span><Car size={12} /> {veicLabelOf(s.clienteId, s.veiculoId)}</span>}
                  {s.km && <span className="mp-mono"><Gauge size={12} /> {Number(s.km).toLocaleString("pt-BR")} km</span>}
                  {s.valor && <span className="mp-mono">{fmtR(s.valor)}</span>}
                  {s.colaborador && <span className="mp-by"><User size={11} /> {s.colaborador}</span>}
                </div>
              </div>
              <button className="mp-icbtn danger" onClick={() => remover(s.id)}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>
      {novo && <ServicoModal clientes={clientes} colabs={colabs} onSave={salvar} onClose={() => setNovo(false)} />}
    </>
  );
}

function ServicoModal({ clientes, colabs, onSave, onClose, inicial }) {
  const comVeic = clientes.filter(c => (c.veiculos || []).length);
  const [f, setF] = useState(() => {
    const c0 = comVeic[0] || clientes[0];
    return { clienteId: c0 ? c0.id : "", veiculoId: c0 && c0.veiculos && c0.veiculos[0] ? c0.veiculos[0].id : "", tipo: "troca_oleo", data: hoje(), km: "", valor: "", colaborador: "", obs: "", ...inicial };
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const cliente = clientes.find(c => c.id === f.clienteId);
  const veiculos = cliente ? (cliente.veiculos || []) : [];
  const trocaCliente = (id) => { const c = clientes.find(x => x.id === id); setF(p => ({ ...p, clienteId: id, veiculoId: c && c.veiculos && c.veiculos[0] ? c.veiculos[0].id : "" })); };

  return (
    <Modal title="Registrar serviço" onClose={onClose}
      footer={<><button className="mp-btn ghost" onClick={onClose}>Cancelar</button>
        <button className="mp-btn" disabled={!f.clienteId || !f.veiculoId} onClick={() => onSave(f)}>Salvar serviço</button></>}>
      <Field label="Cliente"><select className="mp-select" value={f.clienteId} onChange={e => trocaCliente(e.target.value)}>{clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></Field>
      <Field label="Veículo">
        {veiculos.length === 0 ? <div style={{ fontSize: 13, color: "var(--amber)" }}>Esse cliente não tem veículo. Edite o cliente e adicione um.</div>
          : <select className="mp-select" value={f.veiculoId} onChange={e => set("veiculoId", e.target.value)}>{veiculos.map(v => <option key={v.id} value={v.id}>{veicLabel(v)}{v.placa ? ` · ${v.placa}` : ""}</option>)}</select>}
      </Field>
      <Field label="Tipo de serviço"><select className="mp-select" value={f.tipo} onChange={e => set("tipo", e.target.value)}>{Object.entries(SERVICOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></Field>
      <div className="mp-field row">
        <div><label className="mp-label">Data</label><input type="date" className="mp-input" value={f.data} onChange={e => set("data", e.target.value)} /></div>
        <div><label className="mp-label">KM atual</label><input className="mp-input mono" value={f.km} onChange={e => set("km", e.target.value.replace(/\D/g, ""))} placeholder="80000" /></div>
      </div>
      <div className="mp-field row">
        <div><label className="mp-label">Valor (R$)</label><input className="mp-input mono" value={f.valor} onChange={e => set("valor", e.target.value.replace(/[^\d.,]/g, ""))} placeholder="350" /></div>
        <div><label className="mp-label">Colaborador</label><input className="mp-input" list="mp-colabs" value={f.colaborador} onChange={e => set("colaborador", e.target.value)} placeholder="Quem fez" /><datalist id="mp-colabs">{colabs.map(c => <option key={c} value={c} />)}</datalist></div>
      </div>
      <Field label="Observação"><textarea className="mp-textarea" value={f.obs} onChange={e => set("obs", e.target.value)} placeholder="Ex.: marca dos pneus, peças trocadas…" /></Field>
      <div style={{ fontSize: 12, color: "var(--txt-3)" }}>Retorno por <b style={{ color: "var(--txt-2)" }}>tempo</b> (~{Math.round(SERVICOS[f.tipo].dias / 30)} meses){SERVICOS[f.tipo].km ? <> ou <b style={{ color: "var(--txt-2)" }}>{SERVICOS[f.tipo].km / 1000} mil km</b>, o que vier primeiro</> : ""}.</div>
    </Modal>
  );
}

/* ===================== ORÇAMENTOS ===================== */
function Orcamentos({ ctx }) {
  const { clientes, orcamentos, setOrcamentos } = ctx;
  const [novo, setNovo] = useState(false);
  const ord = [...orcamentos].sort((a, b) => b.data.localeCompare(a.data));
  const salvar = (o) => { setOrcamentos(prev => [...prev, { ...o, id: uid() }]); setNovo(false); };
  const status = (id, st) => setOrcamentos(prev => prev.map(o => o.id === id ? { ...o, status: st } : o));
  const remover = (id) => { if (confirm("Remover orçamento?")) setOrcamentos(prev => prev.filter(x => x.id !== id)); };
  const STAT = { enviado: { t: "Sem resposta", c: "soon" }, aprovado: { t: "Aprovado", c: "ok" }, recusado: { t: "Recusado", c: "late" } };

  return (
    <>
      <div className="mp-head"><div><div className="mp-eyebrow">Vendas</div><h1 className="mp-h1">Orçamentos</h1></div>
        <button className="mp-btn" disabled={!clientes.length} onClick={() => setNovo(true)}><Plus size={15} /> Novo orçamento</button></div>
      <div className="mp-card">
        {ord.length === 0 ? (
          <div className="mp-empty"><FileText size={32} /><h3>Nenhum orçamento</h3><p>Registre orçamentos enviados e acompanhe quem aprovou.</p></div>
        ) : ord.map(o => {
          const c = clientes.find(x => x.id === o.clienteId); const st = STAT[o.status] || STAT.enviado;
          return (
            <div className="mp-list-row" key={o.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mp-radar-name">{c ? c.nome : "—"} <span style={{ color: "var(--txt-3)", fontWeight: 400 }}>· {fmtData(o.data)}</span></div>
                <div className="mp-radar-meta"><span>{o.descricao}</span></div>
              </div>
              <div className="mp-money">{fmtR(o.valor)}</div>
              <span className={"mp-tag " + st.c}>{st.t}</span>
              {o.status === "enviado" && <>
                <button className="mp-icbtn go" title="Aprovado" onClick={() => status(o.id, "aprovado")} style={{ color: "var(--green)" }}><CheckCircle2 size={16} /></button>
                <button className="mp-icbtn danger" title="Recusado" onClick={() => status(o.id, "recusado")}><X size={16} /></button>
              </>}
              {c && <WaButton tel={c.telefone} msg={msgOrcamento(c, o)} small />}
              <button className="mp-icbtn danger" onClick={() => remover(o.id)}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>
      {novo && <OrcamentoModal clientes={clientes} onSave={salvar} onClose={() => setNovo(false)} />}
    </>
  );
}
function OrcamentoModal({ clientes, onSave, onClose }) {
  const [f, setF] = useState({ clienteId: clientes[0] ? clientes[0].id : "", descricao: "", valor: "", status: "enviado", data: hoje() });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Novo orçamento" onClose={onClose}
      footer={<><button className="mp-btn ghost" onClick={onClose}>Cancelar</button>
        <button className="mp-btn" disabled={!f.descricao.trim()} onClick={() => onSave(f)}>Salvar</button></>}>
      <Field label="Cliente"><select className="mp-select" value={f.clienteId} onChange={e => set("clienteId", e.target.value)}>{clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></Field>
      <Field label="Descrição"><input className="mp-input" value={f.descricao} onChange={e => set("descricao", e.target.value)} placeholder="Ex.: 4 pneus 175/70 R14 + alinhamento" /></Field>
      <div className="mp-field row">
        <div><label className="mp-label">Valor (R$)</label><input className="mp-input mono" value={f.valor} onChange={e => set("valor", e.target.value.replace(/[^\d.,]/g, ""))} placeholder="1800" /></div>
        <div><label className="mp-label">Data</label><input type="date" className="mp-input" value={f.data} onChange={e => set("data", e.target.value)} /></div>
      </div>
    </Modal>
  );
}

/* ===================== DASHBOARD ===================== */
function Dashboard({ ctx }) {
  const { servicos, orcamentos } = ctx;
  const [per, setPer] = useState("mes");
  const ini = inicioDe(per);

  const d = useMemo(() => {
    const svcs = servicos.filter(s => dataMs(s.data) >= ini);
    const fat = svcs.reduce((a, s) => a + (Number(s.valor) || 0), 0);
    const ticket = svcs.length ? fat / svcs.length : 0;
    const orcs = orcamentos.filter(o => dataMs(o.data) >= ini);
    const aprov = orcs.filter(o => o.status === "aprovado").length;
    const conv = orcs.length ? (aprov / orcs.length) * 100 : 0;

    const porMes = {};
    svcs.forEach(s => { const k = s.data.slice(0, 7); porMes[k] = (porMes[k] || 0) + (Number(s.valor) || 0); });
    const meses = Object.keys(porMes).sort().slice(-8).map(k => ({
      k, label: new Date(k + "-01T00:00:00").toLocaleDateString("pt-BR", { month: "short" }), val: porMes[k],
    }));

    const tip = {};
    svcs.forEach(s => { const r = SERVICOS[s.tipo] || SERVICOS.outro; tip[r.nome] = tip[r.nome] || { n: 0, v: 0 }; tip[r.nome].n++; tip[r.nome].v += Number(s.valor) || 0; });
    const tipos = Object.entries(tip).map(([nome, o]) => ({ nome, ...o })).sort((a, b) => b.n - a.n).slice(0, 6);

    const col = {};
    svcs.forEach(s => { const c = s.colaborador || "Sem registro"; col[c] = col[c] || { n: 0, v: 0 }; col[c].n++; col[c].v += Number(s.valor) || 0; });
    const colabs = Object.entries(col).map(([nome, o]) => ({ nome, ...o })).sort((a, b) => b.v - a.v).slice(0, 6);

    return { fat, ticket, conv, aprov, nOrc: orcs.length, nServ: svcs.length, meses, tipos, colabs };
  }, [servicos, orcamentos, ini]);

  return (
    <>
      <div className="mp-head"><div><div className="mp-eyebrow">Analisar</div><h1 className="mp-h1">Dashboard de gestão</h1></div></div>

      <div className="mp-seg">
        {Object.entries(PERIODOS).map(([k, l]) => <button key={k} className={"mp-chip" + (per === k ? " on" : "")} onClick={() => setPer(k)}>{l}</button>)}
      </div>

      <div className="mp-kpis">
        <Kpi icon={DollarSign} label="Faturamento" num={fmtR(d.fat)} tone="green" small />
        <Kpi icon={Wrench} label="Serviços" num={d.nServ} tone="blue" />
        <Kpi icon={TrendingUp} label="Ticket médio" num={fmtR(d.ticket)} small />
        <Kpi icon={CheckCircle2} label="Conversão orçam." num={Math.round(d.conv) + "%"} tone="violet" sub={`${d.aprov} de ${d.nOrc} aprovados`} />
      </div>

      <div className="mp-card">
        <div className="mp-card-h"><div className="mp-card-t"><TrendingUp size={16} color="var(--blue-hi)" /> Faturamento por mês</div></div>
        {d.meses.length === 0 ? <div className="mp-empty"><TrendingUp size={30} /><h3>Sem dados no período</h3><p>Registre serviços com valor para ver o gráfico.</p></div>
          : <Bars data={d.meses} />}
      </div>

      <div className="mp-grid2">
        <div className="mp-card">
          <div className="mp-card-h"><div className="mp-card-t"><Wrench size={16} color="var(--blue-hi)" /> Serviços mais vendidos</div></div>
          <div style={{ padding: "16px 19px" }}>
            {d.tipos.length === 0 ? <div className="mp-empty" style={{ padding: 20 }}><p>Sem dados.</p></div>
              : <RankBars items={d.tipos.map(t => ({ nome: t.nome, val: t.n, sub: `${t.n}× · ${fmtR(t.v)}` }))} max={Math.max(...d.tipos.map(t => t.n))} cor="var(--blue)" />}
          </div>
        </div>
        <div className="mp-card">
          <div className="mp-card-h"><div className="mp-card-t"><Trophy size={16} color="var(--amber)" /> Ranking de colaborador</div></div>
          <div style={{ padding: "16px 19px" }}>
            {d.colabs.length === 0 ? <div className="mp-empty" style={{ padding: 20 }}><p>Sem dados.</p></div>
              : <RankBars items={d.colabs.map(c => ({ nome: c.nome, val: c.v, sub: `${c.n} serviço${c.n > 1 ? "s" : ""} · ${fmtR(c.v)}` }))} max={Math.max(...d.colabs.map(c => c.v))} cor="var(--amber)" />}
          </div>
        </div>
      </div>
    </>
  );
}
function Bars({ data }) {
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div className="mp-bars">
      {data.map(d => (
        <div className="mp-bar" key={d.k}>
          <div className="mp-bar-val">{d.val >= 1000 ? (d.val / 1000).toFixed(1).replace(".0", "") + "k" : d.val}</div>
          <div className="mp-bar-fill" style={{ height: `${Math.max(3, (d.val / max) * 100)}%` }} />
          <div className="mp-bar-lbl">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
function RankBars({ items, max, cor }) {
  return (
    <div className="mp-rank">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mp-rank-top"><b>{it.nome}</b><span>{it.sub}</span></div>
          <div className="mp-rank-track"><div className="mp-rank-fill" style={{ width: `${Math.max(4, (it.val / max) * 100)}%`, background: cor }} /></div>
        </div>
      ))}
    </div>
  );
}

/* ===================== CAMPANHAS ===================== */
const SEGMENTOS = {
  aniversario: { label: "Aniversariantes do mês", icon: Cake },
  retorno: { label: "Retornos vencidos/vencendo", icon: Bell },
  servico_antigo: { label: "Sem serviço há um tempo", icon: Clock },
  todos: { label: "Todos os clientes", icon: Users },
};
const TEMPLATES = {
  aniversario: "Olá {nome}! 🎉 A Murilo Pneus Auto Center passou pra desejar feliz aniversário! Como presente, preparamos uma condição especial pra você este mês. Quer aproveitar? 🚗",
  retorno: "Olá {nome}! Aqui é da Murilo Pneus Auto Center 🔧. Notamos que seu veículo está na época de revisão/manutenção. Que tal agendar com a gente e deixar tudo certinho? 🚗",
  servico_antigo: "Olá {nome}! Já faz um tempo desde seu último serviço na Murilo Pneus Auto Center. Vamos dar aquela cuidada no seu carro? Temos uma condição especial pra você. 🔧",
  todos: "Olá {nome}! A Murilo Pneus Auto Center está com novidades e condições especiais este mês. Passa aqui pra conferir! 🚗🔧",
};
function Campanhas({ ctx }) {
  const { clientes, servicos, retornos } = ctx;
  const [seg, setSeg] = useState("aniversario");
  const [msg, setMsg] = useState(TEMPLATES.aniversario);
  const [tipoAntigo, setTipoAntigo] = useState("troca_oleo");
  const [mesesAntigo, setMesesAntigo] = useState(6);
  const trocaSeg = (s) => { setSeg(s); setMsg(TEMPLATES[s]); };

  const alvo = useMemo(() => {
    if (seg === "aniversario") { const m = new Date().getMonth(); return clientes.filter(c => c.aniversario && new Date(c.aniversario + "T00:00:00").getMonth() === m); }
    if (seg === "retorno") { const ids = new Set(retornos.filter(r => r.status !== "ok").map(r => r.cliente.id)); return clientes.filter(c => ids.has(c.id)); }
    if (seg === "servico_antigo") {
      const limite = Date.now() - mesesAntigo * 30 * 86400000;
      return clientes.filter(c => { const svcs = servicos.filter(s => s.clienteId === c.id && s.tipo === tipoAntigo); if (!svcs.length) return false; return Math.max(...svcs.map(s => dataMs(s.data))) < limite; });
    }
    return clientes;
  }, [seg, clientes, servicos, retornos, tipoAntigo, mesesAntigo]);

  return (
    <>
      <div className="mp-head"><div><div className="mp-eyebrow">Crescer</div><h1 className="mp-h1">Campanhas</h1></div></div>
      <div className="mp-seg">
        {Object.entries(SEGMENTOS).map(([s, info]) => { const I = info.icon; return <button key={s} className={"mp-chip" + (seg === s ? " on" : "")} onClick={() => trocaSeg(s)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px" }}><I size={14} /> {info.label}</button>; })}
      </div>
      {seg === "servico_antigo" && (
        <div className="mp-card" style={{ marginBottom: 16, padding: 16 }}>
          <div className="mp-field row" style={{ marginBottom: 0 }}>
            <div><label className="mp-label">Serviço</label><select className="mp-select" value={tipoAntigo} onChange={e => setTipoAntigo(e.target.value)}>{Object.entries(SERVICOS).map(([k, v]) => <option key={k} value={k}>{v.nome}</option>)}</select></div>
            <div><label className="mp-label">Há mais de (meses)</label><input className="mp-input mono" value={mesesAntigo} onChange={e => setMesesAntigo(Number(e.target.value.replace(/\D/g, "")) || 0)} /></div>
          </div>
        </div>
      )}
      <div className="mp-card" style={{ marginBottom: 16, padding: 16 }}>
        <label className="mp-label">Mensagem da campanha</label>
        <textarea className="mp-textarea" style={{ minHeight: 96 }} value={msg} onChange={e => setMsg(e.target.value)} />
        <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 8 }}>Use <b style={{ color: "var(--txt-2)" }}>{"{nome}"}</b>, trocado pelo primeiro nome de cada cliente.</div>
      </div>
      <div className="mp-card">
        <div className="mp-card-h"><div className="mp-card-t"><Megaphone size={16} color="var(--violet)" /> Destinatários</div><span className="mp-count">{alvo.length} cliente{alvo.length !== 1 ? "s" : ""}</span></div>
        {alvo.length === 0 ? <div className="mp-empty"><Users size={30} /><h3>Nenhum cliente nesse grupo</h3><p>Ajuste o segmento ou cadastre mais informações (ex.: aniversário).</p></div>
          : alvo.map(c => (
            <div className="mp-list-row" key={c.id}>
              <div className="mp-avatar">{initials(c.nome)}</div>
              <div style={{ flex: 1, minWidth: 0 }}><div className="mp-radar-name">{c.nome}</div><div className="mp-radar-meta">{c.telefone && <span><Phone size={12} /> {c.telefone}</span>}</div></div>
              <WaButton tel={c.telefone} msg={msg.replace(/\{nome\}/g, primeiroNome(c.nome))} small />
            </div>
          ))}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--txt-3)", marginTop: 14, lineHeight: 1.5 }}>Envio por cliente, um clique cada (abre o WhatsApp com a mensagem pronta). Disparo automático em massa só com a WhatsApp Cloud API.</div>
    </>
  );
}

/* ===================== ROLETA ===================== */
function WheelPicker({ value, onChange, min, max, width = 150 }) {
  const ITEM = 36, VIS = 5;
  const anos = useMemo(() => { const a = []; for (let y = max; y >= min; y--) a.push(y); return a; }, [min, max]);
  const ref = useRef(null); const settle = useRef(null);
  const [center, setCenter] = useState(() => Math.max(0, anos.indexOf(value)));
  useEffect(() => { const i = Math.max(0, anos.indexOf(value)); if (ref.current) ref.current.scrollTop = i * ITEM; setCenter(i); }, []);
  const onScroll = () => {
    const i = Math.round(ref.current.scrollTop / ITEM);
    if (i !== center) setCenter(i);
    clearTimeout(settle.current);
    settle.current = setTimeout(() => { const c = Math.min(anos.length - 1, Math.max(0, Math.round(ref.current.scrollTop / ITEM))); onChange(anos[c]); }, 90);
  };
  const goTo = (i) => ref.current && ref.current.scrollTo({ top: i * ITEM, behavior: "smooth" });
  return (
    <div className="mp-wheel" style={{ width }}>
      <div className="mp-wheel-sel" />
      <div className="mp-wheel-scroll" ref={ref} onScroll={onScroll} style={{ height: ITEM * VIS }}>
        <div style={{ height: ITEM * ((VIS - 1) / 2) }} />
        {anos.map((y, i) => { const dist = Math.min(2, Math.abs(i - center)); return <div key={y} className="mp-wheel-item" onClick={() => goTo(i)} style={{ height: ITEM, opacity: 1 - dist * 0.32, transform: `scale(${1 - dist * 0.1})`, color: i === center ? "var(--blue-hi)" : "var(--txt-2)", fontSize: i === center ? 19 : 16 }}>{y}</div>; })}
        <div style={{ height: ITEM * ((VIS - 1) / 2) }} />
      </div>
    </div>
  );
}

/* ===================== BASE ===================== */
function Modal({ title, children, footer, onClose }) {
  useEffect(() => { const h = (e) => e.key === "Escape" && onClose(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  return (
    <div className="mp-overlay" onClick={onClose}>
      <div className="mp-modal" onClick={e => e.stopPropagation()}>
        <div className="mp-modal-h"><div className="mp-modal-t">{title}</div><button className="mp-icbtn" onClick={onClose}><X size={17} /></button></div>
        <div className="mp-modal-b">{children}</div>
        {footer && <div className="mp-modal-f">{footer}</div>}
      </div>
    </div>
  );
}
function Field({ label, children }) { return <div className="mp-field"><label className="mp-label">{label}</label>{children}</div>; }
function WaButton({ tel, msg, small, onAfter }) {
  if (!tel) return null;
  const open = () => { window.open(`https://wa.me/${waNumero(tel)}?text=${encodeURIComponent(msg)}`, "_blank"); if (onAfter) onAfter(); };
  return <button className={"mp-btn wa" + (small ? " sm" : "")} onClick={open} title="Abrir no WhatsApp"><MessageCircle size={small ? 14 : 15} /> {small ? "WhatsApp" : "Abrir WhatsApp"}</button>;
}

/* ----- mensagens ----- */
function msgRetorno(r) {
  const nome = primeiroNome(r.cliente.nome); const v = veicLabel(r.veiculo);
  const veic = v ? ` do seu ${v}` : ""; const placa = r.veiculo.placa ? ` (placa ${r.veiculo.placa})` : "";
  const quando = r.dias < 0 ? "já passou da data recomendada" : "está chegando a hora";
  return `Olá ${nome}, aqui é da Murilo Pneus Auto Center! 🔧\n\nNotamos que ${quando} de fazer *${r.nome.toLowerCase()}*${veic}${placa}. Quer agendar com a gente? Deixamos tudo certinho pra você. 🚗`;
}
function msgOrcamento(c, o) {
  const nome = primeiroNome(c.nome); const valor = o.valor ? ` no valor de R$ ${Number(o.valor).toLocaleString("pt-BR")}` : "";
  return `Olá ${nome}, aqui é da Murilo Pneus Auto Center! 🔧\n\nSobre o orçamento de *${o.descricao}*${valor}: ainda tem interesse? Estamos à disposição para fechar e agendar o serviço. 🚗`;
}
function msgAgendamento(a, c, v, tipoNome) {
  const nome = primeiroNome(c ? c.nome : ""); const veic = v ? ` do seu ${veicLabel(v)}` : "";
  return `Olá ${nome}, aqui é da Murilo Pneus Auto Center! 🔧\n\nConfirmando seu horário: *${(tipoNome || "serviço").toLowerCase()}*${veic} no dia ${fmtDM(a.data)}${a.hora ? ` às ${a.hora}` : ""}. Até lá! 🚗`;
}