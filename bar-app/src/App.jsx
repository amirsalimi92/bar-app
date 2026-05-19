import { useState, useEffect, useRef } from "react";

// ── i18n ──────────────────────────────────────────────────────────────────────
const LANG = {
  en: {
    appTitle:"Bar Inventory", switchLang:"DE",
    tabBar:"Bar", tabReport:"Report", tabProfiles:"Profiles", tabEdit:"Edit",
    back:"← Back", tapUnit:"Tap a unit to see items", emptyShelf:"Empty shelf",
    inStock:"In stock", needed:"Needed", complete:"✓ Complete", defaultLabel:"Default",
    reset:"Reset", resetTitle:"Reset Inventory?",
    resetText:"Entered quantities will be cleared.\nDefaults remain unchanged.",
    yesReset:"Yes, Reset", cancel:"Cancel",
    reportTitle:"Report", reportEmpty:"Everything stocked!", reportEmptySub:"Nothing to order",
    reportCount:"items to restock", shareReport:"Share Report (PDF)",
    storageHint:"Storage Location", storageHintPlaceholder:"e.g. Back room · Shelf 3",
    noHint:"No location set — tap to add",
    profilesTitle:"Profiles", activeLabel:"Active",
    importProfile:"Import Profile", exportProfile:"Export",
    rename:"Rename", deleteProfile:"Delete", defaultProfileLabel:"Default Profile",
    maxProfiles:"Maximum 4 profiles reached.",
    deleteProfileTitle:"Delete Profile?", deleteProfileText:"This profile and all its data will be removed.",
    yesDelete:"Yes, Delete", activate:"Activate",
    editTitle:"Edit Structure", addShelf:"+ Shelf", addItem:"+ Item",
    shelfPlaceholder:"Shelf name", itemPlaceholder:"Item name",
    importSuccess:"Profile imported!", importError:"Invalid profile file.",
    noItems:"No items yet.", units:"units", items:"items",
    spirits:"Spirits", wines:"Wines & Syrups",
  },
  de: {
    appTitle:"Bar Inventar", switchLang:"EN",
    tabBar:"Bar", tabReport:"Bericht", tabProfiles:"Profile", tabEdit:"Bearbeiten",
    back:"← Zurück", tapUnit:"Einheit antippen", emptyShelf:"Leeres Regal",
    inStock:"Vorhanden", needed:"Benötigt", complete:"✓ Vollständig", defaultLabel:"Standard",
    reset:"Reset", resetTitle:"Inventar zurücksetzen?",
    resetText:"Eingegebene Mengen werden gelöscht.\nStandardwerte bleiben erhalten.",
    yesReset:"Ja, zurücksetzen", cancel:"Abbrechen",
    reportTitle:"Bericht", reportEmpty:"Alles vorrätig!", reportEmptySub:"Nichts zu bestellen",
    reportCount:"Artikel fehlen", shareReport:"Bericht teilen (PDF)",
    storageHint:"Lagerort", storageHintPlaceholder:"z.B. Lagerraum · Regal 3",
    noHint:"Kein Lagerort — antippen",
    profilesTitle:"Profile", activeLabel:"Aktiv",
    importProfile:"Profil importieren", exportProfile:"Exportieren",
    rename:"Umbenennen", deleteProfile:"Löschen", defaultProfileLabel:"Standardprofil",
    maxProfiles:"Maximum von 4 Profilen erreicht.",
    deleteProfileTitle:"Profil löschen?", deleteProfileText:"Dieses Profil und alle Daten werden entfernt.",
    yesDelete:"Ja, löschen", activate:"Aktivieren",
    editTitle:"Struktur bearbeiten", addShelf:"+ Regal", addItem:"+ Artikel",
    shelfPlaceholder:"Regalname", itemPlaceholder:"Artikelname",
    importSuccess:"Profil importiert!", importError:"Ungültige Profildatei.",
    noItems:"Noch keine Artikel.", units:"Einheiten", items:"Artikel",
    spirits:"Spirituosen", wines:"Weine & Sirupe",
  },
};

// ── Zone visual themes ─────────────────────────────────────────────────────────
const TH = {
  blue:  { bg:"#060E1A", card:"#0B1A2C", border:"#142840", accent:"#3A8FD0", text:"#5AAAE0", dim:"#1A2E44" },
  amber: { bg:"#110900", card:"#1C1100", border:"#382200", accent:"#C87A28", text:"#E09038", dim:"#3A2000" },
  brown: { bg:"#100803", card:"#1A0F07", border:"#341E0A", accent:"#AC7238", text:"#C88850", dim:"#382010" },
  teal:  { bg:"#041010", card:"#071818", border:"#0C2A2C", accent:"#28AAAA", text:"#40C0C0", dim:"#0E3030" },
  gold:  { bg:"#0D0B00", card:"#161300", border:"#2A2300", accent:"#D4A853", text:"#E8C070", dim:"#3A3000" },
};

// ── Inventory builders ────────────────────────────────────────────────────────
const item  = (id, name, qty, hint="") => ({ id, name, defaultQty:qty, storageHint:hint });
const shelf = (id, name, items)        => ({ id, name, items });
const unit  = (id, name, type, sections) => ({ id, name, type, sections });
const zone  = (id, name, theme, icon, units) => ({ id, name, theme, icon, units });

// ── Full bar inventory ────────────────────────────────────────────────────────
const DEFAULT_INVENTORY = [
  zone("left","Left Section","blue","❄️",[
    unit("l1","Fridge 1","fridge",[
      shelf("l1t","Top",[
        item("l1t_coke_g","Coca-Cola (glass)",24),
        item("l1t_cokez_g","Coca-Cola Zero (glass)",24),
      ]),
      shelf("l1b","Bottom",[
        item("l1b_coke","Coca-Cola (bottle)",24),
        item("l1b_cokez","Coca-Cola Zero (bottle)",24),
        item("l1b_spr","Sprite (bottle)",12),
        item("l1b_fan","Fanta (bottle)",12),
      ]),
    ]),
    unit("l2","Fridge 2","fridge",[
      shelf("l2t","Top",[
        item("l2t_weiz","Weizen Beer",20),
        item("l2t_weizd","Dark Weizen Beer",12),
        item("l2t_erd","Erdinger",20),
      ]),
      shelf("l2b","Bottom",[
        item("l2b_itlem","Ice Tea Lemon",15),
        item("l2b_itpch","Ice Tea Peach",15),
        item("l2b_lsq","Lemon Squash",10),
        item("l2b_chr","Cherry Juice",8),
        item("l2b_crb","Cranberry Juice",8),
        item("l2b_rhb","Rhubarb Juice",6),
        item("l2b_ban","Banana Juice",6),
      ]),
    ]),
    unit("l3","Fridge 3","fridge",[
      shelf("l3t","Top",[
        item("l3t_weizna","Weizen Non-Alc.",15),
        item("l3t_krbna","Krombacher Non-Alc.",15),
        item("l3t_blue","Blue Beer",12),
      ]),
      shelf("l3b","Bottom",[
        item("l3b_marc","Maracuja Juice",8),
        item("l3b_pine","Pineapple Juice",8),
        item("l3b_orng","Orange Juice",12),
      ]),
    ]),
    unit("l4","Fridge 4","fridge",[
      shelf("l4t","Top",[]),
      shelf("l4b","Bottom",[
        item("l4b_corona","Corona",20),
        item("l4b_desp","Desperados",15),
        item("l4b_becks","Beck's",20),
        item("l4b_heink","Heineken",20),
      ]),
    ]),
  ]),

  zone("beer","Beer Section","amber","🍺",[
    unit("b1","Left Drawer","drawer",[
      shelf("b1m","Contents",[
        item("b1_tonic","Schorle Tonic",10),
        item("b1_ginger","Schorle Ginger",10),
      ]),
    ]),
    unit("b2","Right Drawer","drawer",[
      shelf("b2m","Contents",[
        item("b2_peach","Schorle Peach",10),
        item("b2_berry","Schorle Berry",10),
      ]),
    ]),
  ]),

  zone("cafe","Café Section","brown","☕",[
    unit("c1","Cabinet 1","cabinet",[
      shelf("c1m","Contents",[
        item("c1_milk","Milk",6),
        item("c1_crema","Café Crema",5),
        item("c1_esprs","Espresso",5),
      ]),
    ]),
    unit("c2","Cabinet 2","cabinet",[
      shelf("c2m","Contents",[
        item("c2_teablk","Black Tea",20),
        item("c2_teagrn","Green Tea",20),
        item("c2_teacam","Camomile Tea",15),
        item("c2_teafrt","Fruit Tea",15),
        item("c2_teasb","Sour & Bitter Tea",10),
        item("c2_matcha","Matcha",5),
        item("c2_chai","Chai Latte",5),
        item("c2_choc","Chocolate Powder",3),
        item("c2_wchoc","White Choc. Powder",3),
      ]),
    ]),
  ]),

  zone("right","Right Section","teal","🧊",[
    unit("r1","Fridge 1","fridge",[
      shelf("r1t","Top",[
        item("r1t_tind","Indian Tonic",20),
        item("r1t_tber","Berry Tonic",15),
        item("r1t_gbeer","Ginger Beer",15),
        item("r1t_gfrut","Grapefruit Tonic",15),
        item("r1t_elder","Elderflower Tonic",12),
        item("r1t_tpln","Regular Tonic",20),
      ]),
      shelf("r1b","Bottom",[]),
    ]),
    unit("r2","Fridge 2","fridge",[
      shelf("r2t","Top",[
        item("r2t_pros","Prosecco",8),
        item("r2t_bian","Bianco",6),
        item("r2t_char","Chardonnay",6),
      ]),
      shelf("r2b","Bottom",[
        item("r2b_rose","Rosé Wine",8),
      ]),
    ]),
    unit("r3","Fridge 3","fridge",[
      shelf("r3t","Top",[
        item("r3t_wwin","White Wine",8),
        item("r3t_grub","Grüner Veltliner",6),
        item("r3t_ries","Riesling Summer",6),
      ]),
      shelf("r3b","Bottom",[
        item("r3b_itpom","Ice Tea Pomegranate",12),
        item("r3b_itbrm","Ice Tea Brombeer",12),
        item("r3b_mango","Mango Puree",6),
        item("r3b_strw","Strawberry Puree",6),
        item("r3b_kiwi","Kiwi Puree",6),
        item("r3b_rasp","Raspberry Puree",6),
      ]),
    ]),
    unit("r4","Fridge 4","fridge",[
      shelf("r4t","Top",[
        item("r4t_wsm","Still Water (small)",24),
        item("r4t_gsm","Sparkling Water (small)",24),
        item("r4t_enrg","Energy Drink",15),
      ]),
      shelf("r4b","Bottom",[
        item("r4b_wlg","Still Water (large)",12),
        item("r4b_glg","Sparkling Water (large)",12),
      ]),
    ]),
    unit("r5","Fridge 5","fridge",[
      shelf("r5t","Top",[]),
      shelf("r5b","Bottom",[
        item("r5b_sprsm","Sprite (small)",20),
        item("r5b_fansm","Fanta (small)",20),
        item("r5b_mezzo","Mezzo Mix",15),
        item("r5b_lorn","Orange Lemonade",12),
        item("r5b_lpch","Peach Lemonade",12),
      ]),
    ]),
  ]),

  zone("top","Top Section","gold","🥃",[
    unit("t1","Spirits","cabinet",[
      shelf("t1m","Spirits",[
        item("t1_apr","Aperol",3),
        item("t1_lilb","Lillet Blanc",3),
        item("t1_lilr","Lillet Rosé",3),
        item("t1_vod","Vodka Absolut",3),
        item("t1_bomb","Gin Bombay",3),
        item("t1_hend","Gin Hendrick's",3),
        item("t1_jwlk","Johnnie Walker",2),
        item("t1_jbm","Jim Beam",2),
      ]),
    ]),
    unit("t2","Wines & Syrups","cabinet",[
      shelf("t2m","Wines & Syrups",[
        item("t2_ross","Rosso (Red)",4),
        item("t2_shir","Shiraz",4),
        item("t2_prim","Primitivo",4),
        item("t2_coffliq","Coffee Liqueur",2),
        item("t2_sugar","Sugar Syrup",3),
      ]),
    ]),
  ]),
];

const INIT_PROFILES = {
  default:{ id:"default", name:"My Bar", isDefault:true, inventory:DEFAULT_INVENTORY, currentQty:{} },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);

const flatItems = inv =>
  inv.flatMap(z => z.units.flatMap(u => u.sections.flatMap(s => s.items)));

const zoneProgress = (zone, cq) => {
  const items = zone.units.flatMap(u => u.sections.flatMap(s => s.items));
  if (!items.length) return 1;
  return items.filter(i => cq[i.id] !== undefined && cq[i.id] !== "").length / items.length;
};

const unitStatus = (unit, cq) => {
  const items = unit.sections.flatMap(s => s.items);
  if (!items.length) return "none";
  const f = items.filter(i => cq[i.id] !== undefined && cq[i.id] !== "").length;
  if (f === 0) return "empty"; if (f === items.length) return "done"; return "partial";
};

const shelfStatus = (shelf, cq) => {
  if (!shelf.items.length) return "none";
  const f = shelf.items.filter(i => cq[i.id] !== undefined && cq[i.id] !== "").length;
  if (f === 0) return "empty"; if (f === shelf.items.length) return "done"; return "partial";
};

const S = {
  dangerBtn:{ flex:1, padding:11, borderRadius:12, border:"none", background:"linear-gradient(135deg,#8B1A1A,#5A1010)", color:"#FFB0B0", cursor:"pointer", fontSize:13, fontWeight:600 },
  cancelBtn:{ flex:1, padding:11, borderRadius:12, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A6A7C", cursor:"pointer", fontSize:13, fontWeight:600 },
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function BarApp() {
  const [lang,       setLang]       = useState(() => { try { return localStorage.getItem("bar_lang")||"en"; } catch { return "en"; } });
  const [profiles,   setProfiles]   = useState(() => { try { const s=localStorage.getItem("bar_pv5"); return s?JSON.parse(s):INIT_PROFILES; } catch { return INIT_PROFILES; } });
  const [activePid,  setActivePid]  = useState(() => { try { return localStorage.getItem("bar_apid")||"default"; } catch { return "default"; } });
  const [tab,        setTab]        = useState("bar");
  const [zoneId,     setZoneId]     = useState(null); // null = home screen
  const [openUnitId, setOpenUnitId] = useState(null);
  const [showReset,  setShowReset]  = useState(false);
  const [toast,      setToast]      = useState(null);
  const fileRef = useRef(null);
  const T = LANG[lang];

  const profile    = profiles[activePid] || profiles["default"];
  const inventory  = profile.inventory;
  const currentQty = profile.currentQty;

  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap";
    l.rel  = "stylesheet"; document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  useEffect(() => { try { localStorage.setItem("bar_pv5",  JSON.stringify(profiles));  } catch {} }, [profiles]);
  useEffect(() => { try { localStorage.setItem("bar_apid", activePid);                 } catch {} }, [activePid]);
  useEffect(() => { try { localStorage.setItem("bar_lang", lang);                      } catch {} }, [lang]);

  const toast$ = (msg, type="ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2800); };

  const patchProfile = (pid, field, value) =>
    setProfiles(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: value } }));

  // Generic inventory updater (traverses Zone > Unit > Shelf > Item)
  const patchInv = inv => patchProfile(activePid, "inventory", inv);

  const patchItem = (unitId, shelfId, itemId, p) =>
    patchInv(inventory.map(z => ({
      ...z, units: z.units.map(u => u.id!==unitId ? u : {
        ...u, sections: u.sections.map(s => s.id!==shelfId ? s : {
          ...s, items: s.items.map(i => i.id!==itemId ? i : { ...i, ...p })
        })
      })
    })));

  const setQty       = (id, val) => patchProfile(activePid, "currentQty", { ...currentQty, [id]: val });
  const saveDefault  = (uid_, sid, iid, val) => { const n=parseInt(val); if (!isNaN(n)&&n>=0) patchItem(uid_, sid, iid, { defaultQty: n }); };
  const updateHint   = (iid, hint) => patchInv(inventory.map(z => ({
    ...z, units: z.units.map(u => ({
      ...u, sections: u.sections.map(s => ({
        ...s, items: s.items.map(i => i.id!==iid ? i : { ...i, storageHint: hint })
      }))
    }))
  })));

  const handleReset = () => { patchProfile(activePid, "currentQty", {}); setShowReset(false); setOpenUnitId(null); };

  // Export: storageHint travels with items inside inventory
  const exportProfile = pid => {
    const p = profiles[pid];
    const blob = new Blob([JSON.stringify({ _type:"BarInventoryProfile", _version:"2.0", name:p.name, exportedAt:new Date().toISOString(), inventory:p.inventory }, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${p.name.replace(/\s+/g,"_")}.barprofile.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = e => {
    const file = e.target.files?.[0]; if (!file) return;
    if (Object.keys(profiles).length>=4) { toast$(T.maxProfiles,"err"); return; }
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d._type!=="BarInventoryProfile") throw new Error();
        const nid = uid();
        setProfiles(prev => ({ ...prev, [nid]:{ id:nid, name:d.name||"Imported", isDefault:false, inventory:d.inventory, currentQty:{} } }));
        toast$(T.importSuccess);
      } catch { toast$(T.importError,"err"); }
    };
    r.readAsText(file); e.target.value="";
  };

  // Edit helpers
  const addShelf  = (zid, uid_) => {
    const s = { id:uid(), name:"New Shelf", items:[] };
    patchInv(inventory.map(z => z.id!==zid ? z : { ...z, units:z.units.map(u => u.id!==uid_ ? u : { ...u, sections:[...u.sections, s] }) }));
  };
  const remShelf  = (zid, uid_, sid) =>
    patchInv(inventory.map(z => z.id!==zid ? z : { ...z, units:z.units.map(u => u.id!==uid_ ? u : { ...u, sections:u.sections.filter(s=>s.id!==sid) }) }));
  const updShelf  = (zid, uid_, sid, p) =>
    patchInv(inventory.map(z => z.id!==zid ? z : { ...z, units:z.units.map(u => u.id!==uid_ ? u : { ...u, sections:u.sections.map(s=>s.id!==sid?s:{...s,...p}) }) }));
  const addItm    = (uid_, sid) => {
    const i = { id:uid(), name:"New Item", defaultQty:10, storageHint:"" };
    patchInv(inventory.map(z => ({ ...z, units:z.units.map(u => u.id!==uid_ ? u : { ...u, sections:u.sections.map(s=>s.id!==sid?s:{...s,items:[...s.items,i]}) }) })));
  };
  const remItm    = (uid_, sid, iid) => {
    patchInv(inventory.map(z => ({ ...z, units:z.units.map(u => u.id!==uid_?u:{ ...u, sections:u.sections.map(s=>s.id!==sid?s:{...s,items:s.items.filter(i=>i.id!==iid)}) }) })));
    const q = { ...currentQty }; delete q[iid]; patchProfile(activePid,"currentQty",q);
  };

  const reportItems = () => flatItems(inventory).map(i => {
    const cur = parseInt(currentQty[i.id]??""); const needed = isNaN(cur)?i.defaultQty:Math.max(0,i.defaultQty-cur);
    return { ...i, needed };
  }).filter(i=>i.needed>0);

  const { filled, total } = (() => {
    const all = flatItems(inventory);
    return { filled:all.filter(i=>currentQty[i.id]!==undefined&&currentQty[i.id]!=="").length, total:all.length };
  })();

  const pct = total ? (filled/total)*100 : 0;
  const report = reportItems();
  const pList  = Object.values(profiles);
  const selZone = zoneId ? inventory.find(z=>z.id===zoneId) : null;

  const switchTab = t => { setTab(t); setZoneId(null); setOpenUnitId(null); };

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#07090E}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield} input{outline:none} button{font-family:inherit}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn    {from{opacity:0;transform:scale(0.93)}     to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn   {from{opacity:0}                           to{opacity:1}}
        .zone-tile:active{transform:scale(0.97)}
        .unit-card:active{transform:scale(0.96)}
      `}</style>

      <div style={{ minHeight:"100vh", maxWidth:430, margin:"0 auto", backgroundColor:"#07090E", color:"#E8DDD0", fontFamily:"'DM Sans',system-ui,sans-serif", display:"flex", flexDirection:"column" }}>

        {/* ── Header ── */}
        <header style={{ padding:"12px 16px 10px", background:"linear-gradient(180deg,#0F1520,#0A0D14)", borderBottom:"1px solid #151D2B", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#D4A853", lineHeight:1 }}>{T.appTitle}</h1>
            <p style={{ fontSize:10, color:"#2E3D50", marginTop:2 }}>{profile.name} · {filled}/{total} {T.items}</p>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={()=>setLang(l=>l==="en"?"de":"en")} style={{ padding:"5px 11px", borderRadius:14, border:"1px solid #1E2A3A", backgroundColor:"#141C28", color:"#5A8FD0", cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:1 }}>{T.switchLang}</button>
            <button onClick={()=>setShowReset(true)} style={{ padding:"5px 10px", borderRadius:14, border:"1px solid #2A1818", backgroundColor:"transparent", color:"#4A2828", cursor:"pointer", fontSize:13, fontWeight:700 }}>↺</button>
          </div>
        </header>

        {/* Progress bar */}
        <div style={{ height:2, backgroundColor:"#141C28" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#B8860B,#E8C87A)", transition:"width .5s cubic-bezier(.4,0,.2,1)", boxShadow:"0 0 8px rgba(212,168,83,.35)" }} />
        </div>

        {/* Profile tabs */}
        <div style={{ display:"flex", gap:6, padding:"7px 14px", backgroundColor:"#0A0D14", borderBottom:"1px solid #151D2B", overflowX:"auto", scrollbarWidth:"none" }}>
          {pList.map(p=>(
            <button key={p.id} onClick={()=>{ setActivePid(p.id); setZoneId(null); setOpenUnitId(null); }} style={{ padding:"4px 12px", borderRadius:14, border:"none", flexShrink:0, backgroundColor:activePid===p.id?"#D4A853":"#141C28", color:activePid===p.id?"#080B10":"#5A6A7C", cursor:"pointer", fontSize:11, fontWeight:600, transition:"all .2s" }}>
              {p.isDefault?`★ ${p.name}`:p.name}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {tab==="bar" && !selZone && (
            <HomeScreen T={T} inventory={inventory} currentQty={currentQty} onZoneClick={id=>{ setZoneId(id); setOpenUnitId(null); }} />
          )}
          {tab==="bar" && selZone && (
            <ZoneScreen T={T} zone={selZone} currentQty={currentQty} openUnitId={openUnitId}
              onUnitClick={id=>setOpenUnitId(prev=>prev===id?null:id)}
              onSetQty={setQty} onSaveDefault={saveDefault}
              onBack={()=>{ setZoneId(null); setOpenUnitId(null); }} />
          )}
          {tab==="report"   && <ReportView T={T} reportItems={report} onUpdateHint={updateHint} />}
          {tab==="profiles" && <ProfilesView T={T} profiles={pList} activePid={activePid} onExport={exportProfile} onImport={()=>fileRef.current?.click()} onDelete={pid=>{ const n={...profiles}; delete n[pid]; setProfiles(n); if(activePid===pid) setActivePid("default"); }} onRename={(pid,name)=>setProfiles(prev=>({...prev,[pid]:{...prev[pid],name}}))} onActivate={id=>{ setActivePid(id); setZoneId(null); setOpenUnitId(null); }} />}
          {tab==="edit"     && <EditView T={T} inventory={inventory} onAddShelf={addShelf} onRemShelf={remShelf} onUpdShelf={updShelf} onAddItm={addItm} onRemItm={remItm} onUpdItm={(uid_,sid,iid,p)=>patchItem(uid_,sid,iid,p)} />}
        </div>

        {/* Bottom nav */}
        <nav style={{ display:"flex", borderTop:"1px solid #151D2B", backgroundColor:"#0A0D14" }}>
          {[
            { id:"bar",      icon:"🏠", label:T.tabBar },
            { id:"report",   icon:"📊", label:T.tabReport, badge:report.length },
            { id:"profiles", icon:"👤", label:T.tabProfiles },
            { id:"edit",     icon:"✏️", label:T.tabEdit },
          ].map(t=>(
            <button key={t.id} onClick={()=>switchTab(t.id)} style={{ flex:1, padding:"9px 4px 7px", border:"none", backgroundColor:"transparent", color:tab===t.id?"#D4A853":"#2E3D50", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, position:"relative", transition:"color .2s" }}>
              <span style={{ fontSize:17 }}>{t.icon}</span>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:.2 }}>{t.label}</span>
              {t.badge>0&&<div style={{ position:"absolute", top:5, right:"calc(50% - 18px)", backgroundColor:"#D4A853", color:"#080B10", borderRadius:"50%", width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700 }}>{t.badge}</div>}
            </button>
          ))}
        </nav>

        {/* Reset modal */}
        {showReset&&(
          <Modal onClose={()=>setShowReset(false)}>
            <div style={{ fontSize:26, marginBottom:8 }}>↺</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#D4A853", marginBottom:8 }}>{T.resetTitle}</div>
            <p style={{ fontSize:12, color:"#3A4A5C", marginBottom:20, lineHeight:1.65, whiteSpace:"pre-line" }}>{T.resetText}</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={handleReset} style={S.dangerBtn}>{T.yesReset}</button>
              <button onClick={()=>setShowReset(false)} style={S.cancelBtn}>{T.cancel}</button>
            </div>
          </Modal>
        )}

        {/* Toast */}
        {toast&&(
          <div style={{ position:"fixed", bottom:76, left:"50%", transform:"translateX(-50%)", backgroundColor:toast.type==="err"?"#5A1010":"#0E2A18", border:`1px solid ${toast.type==="err"?"#8B2020":"#1A5A30"}`, color:toast.type==="err"?"#FFB0B0":"#80E8A0", padding:"10px 20px", borderRadius:20, fontSize:12, fontWeight:600, zIndex:300, animation:"fadeIn .2s ease", whiteSpace:"nowrap" }}>{toast.msg}</div>
        )}

        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display:"none" }} />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ T, inventory, currentQty, onZoneClick }) {
  const gz = id => inventory.find(z=>z.id===id);

  return (
    <div style={{ flex:1, overflowY:"auto", backgroundColor:"#07090E" }}>
      {/* Pendant lights decoration */}
      <div style={{ height:44, display:"flex", alignItems:"flex-end", justifyContent:"space-around", padding:"0 30px", background:"linear-gradient(180deg,#0A0E16 0%,transparent 100%)" }}>
        {[0,1,2,3,4].map(i=>(
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:1, height:22, backgroundColor:"#1A2535" }} />
            <div style={{ width:9, height:9, borderRadius:"50% 50% 40% 40%", backgroundColor:"#D4A853", boxShadow:"0 0 10px rgba(212,168,83,.45),0 0 22px rgba(212,168,83,.15)" }} />
          </div>
        ))}
      </div>

      <div style={{ padding:"10px 13px 24px" }}>
        {/* TOP zone — full width */}
        <ZoneTile zone={gz("top")} currentQty={currentQty} onClick={()=>onZoneClick("top")}
          style={{ height:72, marginBottom:10 }} />

        {/* Middle row: LEFT | BEER+CAFE | RIGHT */}
        <div style={{ display:"flex", gap:9, height:176 }}>
          <ZoneTile zone={gz("left")} currentQty={currentQty} onClick={()=>onZoneClick("left")}
            style={{ flex:2.5 }} />

          <div style={{ flex:1.8, display:"flex", flexDirection:"column", gap:9 }}>
            <ZoneTile zone={gz("beer")} currentQty={currentQty} onClick={()=>onZoneClick("beer")}
              style={{ flex:1 }} />
            <ZoneTile zone={gz("cafe")} currentQty={currentQty} onClick={()=>onZoneClick("cafe")}
              style={{ flex:1 }} />
          </div>

          <ZoneTile zone={gz("right")} currentQty={currentQty} onClick={()=>onZoneClick("right")}
            style={{ flex:3 }} />
        </div>

        {/* Bar counter */}
        <div style={{ height:13, marginTop:11, background:"linear-gradient(180deg,#9B6E3A,#7A5228)", borderRadius:"6px 6px 0 0", boxShadow:"0 -3px 14px rgba(0,0,0,.7)" }} />
        <div style={{ height:24, background:"linear-gradient(180deg,#5C3A14,#3A2008)", borderBottom:"3px solid #220D00", borderRadius:"0 0 4px 4px" }} />

        {/* Zone progress summary */}
        <div style={{ display:"flex", gap:6, marginTop:16, flexWrap:"wrap" }}>
          {inventory.map(z=>{
            const p = zoneProgress(z, currentQty);
            return (
              <div key={z.id} onClick={()=>onZoneClick(z.id)} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:10, backgroundColor:TH[z.theme].card, border:`1px solid ${TH[z.theme].border}`, cursor:"pointer", flex:"1 1 auto" }}>
                <span style={{ fontSize:13 }}>{z.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ height:3, backgroundColor:TH[z.theme].border, borderRadius:2 }}>
                    <div style={{ height:"100%", width:`${p*100}%`, backgroundColor:TH[z.theme].accent, borderRadius:2, transition:"width .5s ease" }} />
                  </div>
                </div>
                <span style={{ fontSize:9, color:TH[z.theme].dim }}>{Math.round(p*100)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Zone tile on home screen
function ZoneTile({ zone, currentQty, onClick, style }) {
  const th = TH[zone.theme];
  const p  = zoneProgress(zone, currentQty);
  const totalItems = zone.units.reduce((s,u)=>s+u.sections.reduce((s2,sec)=>s2+sec.items.length,0),0);

  return (
    <div className="zone-tile" onClick={onClick} style={{
      backgroundColor:th.card, border:`1px solid ${th.border}`, borderRadius:16,
      padding:"10px 11px", cursor:"pointer", display:"flex", flexDirection:"column",
      justifyContent:"space-between", position:"relative", overflow:"hidden",
      transition:"transform .12s, box-shadow .12s",
      boxShadow:`0 4px 20px rgba(0,0,0,.5)`,
      ...style,
    }}>
      {/* Corner glow */}
      <div style={{ position:"absolute", top:-24, right:-24, width:70, height:70, borderRadius:"50%", backgroundColor:th.accent, opacity:.07, filter:"blur(22px)", pointerEvents:"none" }} />

      {/* Top row: icon + unit dots */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <span style={{ fontSize:20, lineHeight:1 }}>{zone.icon}</span>
        {/* Mini unit status dots */}
        <div style={{ display:"flex", gap:3, flexWrap:"wrap", maxWidth:60, justifyContent:"flex-end" }}>
          {zone.units.map(u=>{
            const st = unitStatus(u, currentQty);
            return <div key={u.id} style={{ width:7, height:7, borderRadius:2, backgroundColor:st==="done"?th.accent:st==="partial"?th.accent+"60":th.dim, transition:"background .3s" }} />;
          })}
        </div>
      </div>

      {/* Name + count */}
      <div>
        <div style={{ fontSize:12, fontWeight:600, color:th.text, lineHeight:1.2 }}>{zone.name}</div>
        <div style={{ fontSize:9, color:th.dim, marginTop:2 }}>{zone.units.length} {/* T.units */} · {totalItems}</div>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, backgroundColor:th.dim, borderRadius:1, marginTop:5, opacity:.8 }}>
        <div style={{ height:"100%", width:`${p*100}%`, backgroundColor:th.accent, borderRadius:1, transition:"width .5s ease" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ZONE SCREEN
// ══════════════════════════════════════════════════════════════════════════════
function ZoneScreen({ T, zone, currentQty, openUnitId, onUnitClick, onSetQty, onSaveDefault, onBack }) {
  const th = TH[zone.theme];
  const openUnit = zone.units.find(u=>u.id===openUnitId)||null;
  const cols = Math.min(zone.units.length, zone.units.length<=2 ? 2 : zone.units.length<=4 ? 4 : 5);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Zone header with back */}
      <div style={{ padding:"10px 16px", background:`linear-gradient(180deg,${th.card},#0A0D14)`, borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:th.accent, cursor:"pointer", fontSize:13, fontWeight:700, padding:0, display:"flex", alignItems:"center", gap:4 }}>
          {T.back}
        </button>
        <div style={{ width:1, height:14, backgroundColor:th.border }} />
        <span style={{ fontSize:13 }}>{zone.icon}</span>
        <span style={{ fontSize:14, fontWeight:600, color:th.text }}>{zone.name}</span>
      </div>

      {/* Units grid */}
      <div style={{ padding:"14px", backgroundColor:th.bg, display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:10, flexShrink:0 }}>
        {zone.units.map(u=>(
          <UnitCard key={u.id} unit={u} currentQty={currentQty} th={th}
            isOpen={openUnitId===u.id} onClick={()=>onUnitClick(u.id)} />
        ))}
      </div>

      {/* Item panel or hint */}
      {openUnit ? (
        <div style={{ flex:1, overflowY:"auto", borderTop:`1px solid ${th.border}`, animation:"slideUp .22s cubic-bezier(.4,0,.2,1)" }}>
          <UnitPanel T={T} unit={openUnit} th={th} currentQty={currentQty}
            onSetQty={onSetQty} onSaveDefault={onSaveDefault} onClose={()=>onUnitClick(null)} />
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:5, color:"#1C2535" }}>
          <div style={{ fontSize:18 }}>↑</div>
          <div style={{ fontSize:11 }}>{T.tapUnit}</div>
        </div>
      )}
    </div>
  );
}

// Unit card (fridge/drawer/cabinet visual)
function UnitCard({ unit, currentQty, th, isOpen, onClick }) {
  const isFridge  = unit.type==="fridge";
  const isDrawer  = unit.type==="drawer";
  const statusColors = { none:"#111620", empty:"#161E2A", partial:th.accent+"20", done:th.accent+"30" };
  const dotColors    = { none:"#1A2535", empty:"#2E3D50", partial:th.accent, done:th.accent };
  const dotGlows     = { none:"none", empty:"none", partial:`0 0 5px ${th.accent}60`, done:`0 0 6px ${th.accent}` };

  return (
    <div className="unit-card" onClick={onClick} style={{
      backgroundColor:isOpen?th.card:"#0A0D14",
      border:`1px solid ${isOpen?th.accent+"50":th.border}`,
      borderRadius:12, overflow:"hidden", cursor:"pointer",
      transition:"all .2s", boxShadow:isOpen?`0 0 16px ${th.accent}20`:"none",
    }}>
      {/* Unit graphic */}
      <div style={{ padding:"8px 6px 4px" }}>
        {unit.sections.map((s,idx)=>{
          const st = shelfStatus(s, currentQty);
          return (
            <div key={s.id}>
              {idx>0&&<div style={{ height:isDrawer?5:1, backgroundColor:th.border, margin:isDrawer?"3px 2px":"1px 4px" }} />}
              <div style={{ height:isDrawer?22:26, borderRadius:4, backgroundColor:statusColors[st], display:"flex", alignItems:"center", justifyContent:"center", transition:"background .3s" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", backgroundColor:dotColors[st], boxShadow:dotGlows[st], transition:"all .3s" }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Fridge handle */}
      {isFridge&&<div style={{ display:"flex", justifyContent:"flex-start", padding:"2px 5px 4px" }}><div style={{ width:2, height:16, backgroundColor:th.border, borderRadius:1 }} /></div>}
      {/* Unit name */}
      <div style={{ padding:"3px 6px 8px", textAlign:"center" }}>
        <div style={{ fontSize:9, color:isOpen?th.text:"#2E3D50", lineHeight:1.2 }}>{unit.name}</div>
      </div>
    </div>
  );
}

// Unit panel — shows all shelves + items for the selected unit
function UnitPanel({ T, unit, th, currentQty, onSetQty, onSaveDefault, onClose }) {
  const [editId,  setEditId]  = useState(null);
  const [tempVal, setTempVal] = useState("");

  return (
    <div style={{ padding:"14px 16px 28px" }}>
      {/* Panel header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:th.text }}>{unit.name}</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#2E3D50", cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
      </div>

      {unit.sections.map(shelf=>(
        <div key={shelf.id} style={{ marginBottom:16 }}>
          {/* Shelf label */}
          {unit.sections.length>1&&(
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${th.border},transparent)` }} />
              <span style={{ fontSize:9, color:th.dim, textTransform:"uppercase", letterSpacing:.8 }}>{shelf.name}</span>
              <div style={{ height:1, flex:1, background:`linear-gradient(90deg,transparent,${th.border})` }} />
            </div>
          )}

          {shelf.items.length===0 ? (
            <div style={{ fontSize:11, color:"#1C2535", fontStyle:"italic", padding:"4px 0" }}>{T.emptyShelf}</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {shelf.items.map((itm,i)=>{
                const val=currentQty[itm.id]??""; const num=parseInt(val);
                const needed=isNaN(num)?null:Math.max(0,itm.defaultQty-num);
                const editing=editId===itm.id; const done=needed!==null&&needed===0;
                return (
                  <div key={itm.id} style={{ backgroundColor:"#0C1320", borderRadius:10, padding:"10px 12px", border:`1px solid ${done?"#152518":"#141D2B"}`, animation:`fadeUp .15s ease ${i*.04}s both` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:13, fontWeight:500, color:"#C0CCD8" }}>{itm.name}</span>
                      {editing?(
                        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <input type="number" min="0" value={tempVal} onChange={e=>setTempVal(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ onSaveDefault(unit.id,shelf.id,itm.id,tempVal); setEditId(null); } }} style={{ width:50, padding:"2px 5px", borderRadius:5, border:"1px solid #D4A853", backgroundColor:"#080B10", color:"#E8DDD0", fontSize:12, textAlign:"center" }} autoFocus />
                          <button onClick={()=>{ onSaveDefault(unit.id,shelf.id,itm.id,tempVal); setEditId(null); }} style={{ padding:"2px 8px", borderRadius:5, border:"none", backgroundColor:"#1A6A35", color:"#80E8A0", cursor:"pointer", fontSize:11 }}>✓</button>
                          <button onClick={()=>setEditId(null)} style={{ padding:"2px 6px", borderRadius:5, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A6A7C", cursor:"pointer", fontSize:11 }}>✕</button>
                        </div>
                      ):(
                        <button onClick={()=>{ setEditId(itm.id); setTempVal(String(itm.defaultQty)); }} style={{ padding:"2px 8px", borderRadius:5, border:"1px solid #1E2D3E", backgroundColor:"transparent", color:"#3A4D60", cursor:"pointer", fontSize:10, display:"flex", alignItems:"center", gap:3 }}>
                          {T.defaultLabel}: {itm.defaultQty} <span style={{ fontSize:8 }}>✏</span>
                        </button>
                      )}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:10, color:"#2E3D50", whiteSpace:"nowrap" }}>{T.inStock}:</span>
                      <input type="number" min="0" placeholder="—" value={val} onChange={e=>onSetQty(itm.id,e.target.value)} style={{ width:62, padding:"7px 8px", borderRadius:7, border:`1px solid ${val!==""?"#243040":"#141D2B"}`, backgroundColor:"#080B10", color:"#E8DDD0", fontSize:16, textAlign:"center", fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s" }} />
                      {needed!==null&&(
                        <div style={{ flex:1, padding:"7px 8px", borderRadius:7, textAlign:"center", fontSize:12, fontWeight:600, background:done?"linear-gradient(135deg,#091A0C,#071208)":"linear-gradient(135deg,#09142A,#070E1E)", border:`1px solid ${done?"#132418":"#141E30"}`, color:done?"#3A9A5C":"#5A8FD0", transition:"all .3s" }}>
                          {done?T.complete:`${T.needed}: ${needed}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// REPORT VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ReportView({ T, reportItems, onUpdateHint }) {
  const [openId,    setOpenId]    = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft,     setDraft]     = useState("");
  const text = reportItems.map(i=>`${i.needed}x  ${i.name}`).join("\n");

  return (
    <div style={{ flex:1, padding:"20px 16px 28px", overflowY:"auto" }}>
      {reportItems.length===0?(
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:12 }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#091A0C,#071208)", border:"1px solid #132418", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>✓</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"#2D8A4E" }}>{T.reportEmpty}</div>
          <div style={{ fontSize:12, color:"#1E2D3E" }}>{T.reportEmptySub}</div>
        </div>
      ):(
        <>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#D4A853", marginBottom:4 }}>{T.reportTitle}</div>
          <div style={{ fontSize:11, color:"#2E3D50", marginBottom:18 }}>{reportItems.length} {T.reportCount}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
            {reportItems.map((itm,i)=>{
              const isOpen=openId===itm.id; const isEditing=editingId===itm.id;
              const hasHint=itm.storageHint&&itm.storageHint.trim()!=="";
              return (
                <div key={itm.id} style={{ animation:`fadeUp .17s ease ${i*.04}s both` }}>
                  <div onClick={()=>{ setOpenId(p=>p===itm.id?null:itm.id); setEditingId(null); }} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:isOpen?"linear-gradient(135deg,#111828,#0C1422)":"linear-gradient(135deg,#0C1320,#08101A)", borderRadius:isOpen?"12px 12px 0 0":12, border:`1px solid ${isOpen?"#1E2D40":"#141D2B"}`, borderBottom:isOpen?"none":undefined, cursor:"pointer", userSelect:"none", transition:"background .2s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:10, color:"#2E3D50", display:"inline-block", transition:"transform .2s", transform:isOpen?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
                      <span style={{ fontSize:14, color:"#B0BCC8" }}>{itm.name}</span>
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:"#D4A853", background:"linear-gradient(135deg,#140F04,#0C0A03)", border:"1px solid #221A06", padding:"2px 12px", borderRadius:8, minWidth:50, textAlign:"center" }}>{itm.needed}</div>
                  </div>
                  {isOpen&&(
                    <div style={{ padding:"11px 14px 13px", background:"linear-gradient(135deg,#0A1020,#080D18)", border:"1px solid #1E2D40", borderTop:"1px solid #131E30", borderRadius:"0 0 12px 12px", animation:"slideDown .17s cubic-bezier(.4,0,.2,1)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div style={{ fontSize:10, color:"#2E3D50", textTransform:"uppercase", letterSpacing:.8 }}>📍 {T.storageHint}</div>
                        {!isEditing&&<button onClick={e=>{ e.stopPropagation(); setEditingId(itm.id); setDraft(itm.storageHint||""); }} style={{ background:"none", border:"none", color:"#3A4D60", cursor:"pointer", fontSize:11 }}>✏</button>}
                      </div>
                      {isEditing?(
                        <div onClick={e=>e.stopPropagation()}>
                          <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ onUpdateHint(itm.id,draft.trim()); setEditingId(null); } }} placeholder={T.storageHintPlaceholder} style={{ width:"100%", padding:"8px 10px", borderRadius:8, border:"1px solid #D4A853", backgroundColor:"#080B10", color:"#E8DDD0", fontSize:13, fontFamily:"'DM Sans',sans-serif", marginBottom:8 }} autoFocus />
                          <div style={{ display:"flex", gap:7 }}>
                            <button onClick={()=>{ onUpdateHint(itm.id,draft.trim()); setEditingId(null); }} style={{ flex:1, padding:7, borderRadius:8, border:"none", background:"linear-gradient(135deg,#1A6A35,#104820)", color:"#80E8A0", cursor:"pointer", fontSize:12, fontWeight:700 }}>✓ Save</button>
                            <button onClick={()=>setEditingId(null)} style={{ padding:"7px 12px", borderRadius:8, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A6A7C", cursor:"pointer", fontSize:12 }}>✕</button>
                          </div>
                        </div>
                      ):(
                        <div style={{ padding:"7px 11px", borderRadius:8, backgroundColor:hasHint?"#0F1E30":"#0A0D14", border:`1px solid ${hasHint?"#172F4E":"#141D2B"}`, color:hasHint?"#8ABEDC":"#2E3D50", fontSize:13, fontStyle:hasHint?"normal":"italic" }}>
                          {hasHint?itm.storageHint:T.noHint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={()=>alert(`${T.reportTitle}:\n\n${text}\n\n─────────────\n(React Native: PDF + native share sheet)`)} style={{ width:"100%", padding:14, borderRadius:14, border:"none", background:"linear-gradient(135deg,#B8860B,#8B6508)", color:"#0C0A03", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 18px rgba(212,168,83,.18)" }}>
            📤 {T.shareReport}
          </button>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILES VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ProfilesView({ T, profiles, activePid, onExport, onImport, onDelete, onRename, onActivate }) {
  const [renId, setRenId]   = useState(null);
  const [renVal, setRenVal] = useState("");
  const [delId, setDelId]   = useState(null);
  return (
    <div style={{ flex:1, padding:"20px 16px", overflowY:"auto" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#D4A853", marginBottom:4 }}>{T.profilesTitle}</div>
      <div style={{ fontSize:11, color:"#2E3D50", marginBottom:18 }}>{profiles.length} / 4 profiles</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:18 }}>
        {profiles.map((p,i)=>(
          <div key={p.id} style={{ background:activePid===p.id?"linear-gradient(135deg,#1A1408,#100D05)":"linear-gradient(135deg,#0C1320,#08101A)", border:`1px solid ${activePid===p.id?"#2A200A":"#141D2B"}`, borderRadius:14, padding:14, animation:`fadeUp .18s ease ${i*.07}s both` }}>
            {renId===p.id?(
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <input value={renVal} onChange={e=>setRenVal(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ onRename(p.id,renVal); setRenId(null); } }} style={{ flex:1, padding:"7px 10px", borderRadius:8, border:"1px solid #D4A853", backgroundColor:"#080B10", color:"#E8DDD0", fontSize:14 }} autoFocus />
                <button onClick={()=>{ onRename(p.id,renVal); setRenId(null); }} style={{ padding:"7px 12px", borderRadius:8, border:"none", background:"#1A6A35", color:"#80E8A0", cursor:"pointer", fontWeight:700 }}>✓</button>
                <button onClick={()=>setRenId(null)} style={{ padding:"7px 10px", borderRadius:8, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A6A7C", cursor:"pointer" }}>✕</button>
              </div>
            ):(
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:activePid===p.id?"#D4A853":"#C0CCD8" }}>{p.isDefault?"★ ":""}{p.name}</div>
                  <div style={{ fontSize:9, color:"#2E3D50", marginTop:2 }}>{p.isDefault?T.defaultProfileLabel:"Custom profile"}{activePid===p.id?` · ${T.activeLabel}`:""}</div>
                </div>
                <button onClick={()=>{ setRenId(p.id); setRenVal(p.name); }} style={{ padding:"5px 10px", borderRadius:8, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#3A4D60", cursor:"pointer", fontSize:11 }}>✏ {T.rename}</button>
              </div>
            )}
            <div style={{ display:"flex", gap:7 }}>
              {activePid!==p.id&&<button onClick={()=>onActivate(p.id)} style={{ flex:1, padding:7, borderRadius:8, border:"none", background:"linear-gradient(135deg,#B8860B,#8B6508)", color:"#0C0A03", cursor:"pointer", fontSize:11, fontWeight:700 }}>{T.activate}</button>}
              <button onClick={()=>onExport(p.id)} style={{ flex:1, padding:7, borderRadius:8, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A8FD0", cursor:"pointer", fontSize:11, fontWeight:600 }}>↑ {T.exportProfile}</button>
              {!p.isDefault&&<button onClick={()=>setDelId(p.id)} style={{ padding:"7px 11px", borderRadius:8, border:"1px solid #2A1818", backgroundColor:"transparent", color:"#5A3030", cursor:"pointer", fontSize:12 }}>🗑</button>}
            </div>
          </div>
        ))}
      </div>
      {profiles.length<4?<button onClick={onImport} style={{ width:"100%", padding:13, borderRadius:14, border:"1px dashed #1E2A3A", backgroundColor:"transparent", color:"#3A4D60", cursor:"pointer", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>↓ {T.importProfile}</button>:<div style={{ textAlign:"center", fontSize:12, color:"#2E3D50" }}>{T.maxProfiles}</div>}
      {delId&&<Modal onClose={()=>setDelId(null)}><div style={{ fontSize:26, marginBottom:8 }}>🗑</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#D4A853", marginBottom:8 }}>{T.deleteProfileTitle}</div><p style={{ fontSize:12, color:"#3A4A5C", marginBottom:20 }}>{T.deleteProfileText}</p><div style={{ display:"flex", gap:10 }}><button onClick={()=>{ onDelete(delId); setDelId(null); }} style={S.dangerBtn}>{T.yesDelete}</button><button onClick={()=>setDelId(null)} style={S.cancelBtn}>{T.cancel}</button></div></Modal>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EDIT VIEW — Zone (fixed) > Unit (fixed) > Shelf (editable) > Item (editable)
// ══════════════════════════════════════════════════════════════════════════════
function EditView({ T, inventory, onAddShelf, onRemShelf, onUpdShelf, onAddItm, onRemItm, onUpdItm }) {
  const [expZ,  setExpZ]  = useState(null);
  const [expU,  setExpU]  = useState(null);
  const [expS,  setExpS]  = useState(null);
  const [editId,setEditId] = useState(null);
  const [editV, setEditV]  = useState("");

  const InlineEdit = ({ id, cur, onSave, ph }) => editId===id ? (
    <div style={{ display:"flex", gap:4, flex:1 }}>
      <input value={editV} onChange={e=>setEditV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(onSave(editV),setEditId(null))} placeholder={ph} style={{ flex:1, padding:"3px 7px", borderRadius:5, border:"1px solid #D4A853", backgroundColor:"#080B10", color:"#E8DDD0", fontSize:11 }} autoFocus />
      <button onClick={()=>{ onSave(editV); setEditId(null); }} style={{ padding:"3px 7px", borderRadius:5, border:"none", background:"#1A6A35", color:"#80E8A0", cursor:"pointer", fontSize:10 }}>✓</button>
      <button onClick={()=>setEditId(null)} style={{ padding:"3px 6px", borderRadius:5, border:"1px solid #1E2A3A", backgroundColor:"transparent", color:"#5A6A7C", cursor:"pointer", fontSize:10 }}>✕</button>
    </div>
  ) : (
    <button onClick={()=>{ setEditId(id); setEditV(cur); }} style={{ background:"none", border:"none", color:"#5A6A7C", cursor:"pointer", fontSize:11, padding:"1px 5px" }}>✏</button>
  );

  return (
    <div style={{ flex:1, padding:"18px 16px", overflowY:"auto" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#D4A853", marginBottom:18 }}>{T.editTitle}</div>
      {inventory.map((z,zi)=>{
        const zh=TH[z.theme];
        return (
          <div key={z.id} style={{ backgroundColor:"#0C1320", borderRadius:14, marginBottom:10, border:`1px solid ${zh.border}`, overflow:"hidden", animation:`fadeUp .17s ease ${zi*.06}s both` }}>
            <div onClick={()=>setExpZ(p=>p===z.id?null:z.id)} style={{ display:"flex", alignItems:"center", padding:"11px 13px", gap:8, cursor:"pointer" }}>
              <span style={{ fontSize:11, color:zh.accent }}>{expZ===z.id?"▼":"▶"}</span>
              <span style={{ fontSize:11 }}>{z.icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color:zh.text, flex:1 }}>{z.name}</span>
            </div>
            {expZ===z.id&&(
              <div style={{ borderTop:`1px solid ${zh.border}`, padding:"8px 12px 12px" }}>
                {z.units.map(u=>(
                  <div key={u.id} style={{ marginBottom:8, backgroundColor:"#080B10", borderRadius:10, border:"1px solid #141D2B", overflow:"hidden" }}>
                    <div onClick={()=>setExpU(p=>p===u.id?null:u.id)} style={{ display:"flex", alignItems:"center", padding:"8px 11px", gap:6, cursor:"pointer" }}>
                      <span style={{ fontSize:10, color:"#3A4D60" }}>{expU===u.id?"▼":"▶"}</span>
                      <span style={{ fontSize:12, color:"#8A9BB0", flex:1 }}>{u.name} <span style={{ color:"#2E3D50" }}>({u.sections.reduce((s,sh)=>s+sh.items.length,0)})</span></span>
                    </div>
                    {expU===u.id&&(
                      <div style={{ borderTop:"1px solid #141D2B", padding:"6px 11px 10px" }}>
                        {u.sections.map(sh=>(
                          <div key={sh.id} style={{ marginBottom:8, backgroundColor:"#06090E", borderRadius:8, border:"1px solid #0F1A26", overflow:"hidden" }}>
                            <div style={{ display:"flex", alignItems:"center", padding:"7px 10px", gap:5 }}>
                              <button onClick={()=>setExpS(p=>p===sh.id?null:sh.id)} style={{ background:"none", border:"none", color:"#2E3D50", cursor:"pointer", fontSize:10 }}>{expS===sh.id?"▼":"▶"}</button>
                              <span style={{ fontSize:11, color:"#6A7D90", flex:1 }}>{sh.name} ({sh.items.length})</span>
                              <InlineEdit id={`sh_${sh.id}`} cur={sh.name} ph={T.shelfPlaceholder} onSave={v=>onUpdShelf(z.id,u.id,sh.id,{ name:v })} />
                              <button onClick={()=>onRemShelf(z.id,u.id,sh.id)} style={{ padding:"2px 6px", borderRadius:5, border:"1px solid #2A1818", backgroundColor:"transparent", color:"#5A3030", cursor:"pointer", fontSize:10 }}>✕</button>
                            </div>
                            {expS===sh.id&&(
                              <div style={{ borderTop:"1px solid #0F1A26", padding:"5px 10px 8px" }}>
                                {sh.items.length===0&&<div style={{ fontSize:10, color:"#1C2535", padding:"3px 0 6px", fontStyle:"italic" }}>{T.noItems}</div>}
                                {sh.items.map(itm=>(
                                  <div key={itm.id} style={{ paddingBottom:8, marginBottom:4, borderBottom:"1px solid #0A1018" }}>
                                    <div style={{ display:"flex", alignItems:"center", gap:5, paddingTop:5 }}>
                                      <span style={{ flex:1, fontSize:11, color:"#6A7D90" }}>{itm.name}</span>
                                      <input type="number" min="0" value={itm.defaultQty} onChange={e=>onUpdItm(u.id,sh.id,itm.id,{ defaultQty:parseInt(e.target.value)||0 })} style={{ width:40, padding:"2px 4px", borderRadius:4, border:"1px solid #1E2A3A", backgroundColor:"#080B10", color:"#D4A853", fontSize:10, textAlign:"center" }} />
                                      <InlineEdit id={`i_${itm.id}`} cur={itm.name} ph={T.itemPlaceholder} onSave={v=>onUpdItm(u.id,sh.id,itm.id,{ name:v })} />
                                      <button onClick={()=>onRemItm(u.id,sh.id,itm.id)} style={{ padding:"2px 5px", borderRadius:4, border:"1px solid #2A1818", backgroundColor:"transparent", color:"#5A3030", cursor:"pointer", fontSize:9 }}>✕</button>
                                    </div>
                                    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
                                      <span style={{ fontSize:9, color:"#2E3D50" }}>📍</span>
                                      <input type="text" value={itm.storageHint||""} onChange={e=>onUpdItm(u.id,sh.id,itm.id,{ storageHint:e.target.value })} placeholder={T.storageHintPlaceholder} style={{ flex:1, padding:"4px 8px", borderRadius:5, border:"1px solid #1A2535", backgroundColor:"#080B10", color:"#6A8FAA", fontSize:10, fontFamily:"'DM Sans',sans-serif" }} />
                                    </div>
                                  </div>
                                ))}
                                <button onClick={()=>onAddItm(u.id,sh.id)} style={{ marginTop:5, padding:"4px 9px", borderRadius:6, border:"1px dashed #1E2A3A", backgroundColor:"transparent", color:"#3A4D60", cursor:"pointer", fontSize:10 }}>{T.addItem}</button>
                              </div>
                            )}
                          </div>
                        ))}
                        <button onClick={()=>onAddShelf(z.id,u.id)} style={{ width:"100%", marginTop:4, padding:6, borderRadius:8, border:"1px dashed #1E2A3A", backgroundColor:"transparent", color:"#3A4D60", cursor:"pointer", fontSize:10 }}>{T.addShelf}</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Shared Modal ──────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,.85)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:20, backdropFilter:"blur(5px)" }} onClick={onClose}>
      <div style={{ backgroundColor:"#0F1520", border:"1px solid #1E2A3A", borderRadius:20, padding:"24px 20px", maxWidth:300, width:"100%", textAlign:"center", animation:"popIn .18s ease" }} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
