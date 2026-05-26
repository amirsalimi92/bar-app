import { useState, useEffect, useRef } from "react";

/* ── i18n ─────────────────────────────────────────────────────────────────── */
const LANG = {
  en: {
    appTitle:"Bar Inventory", switchLang:"DE",
    zones:{ left:"Left Section", beer:"Bar Section", cafe:"Café Section", right:"Right Section", top:"Top Section" },
    tabBar:"Bar", tabReport:"Report", tabProfiles:"Profiles", tabEdit:"Edit",
    back:"← Back", tapUnit:"Tap a unit below", emptyShelf:"Empty shelf",
    inStock:"In stock", needed:"Needed", complete:"✓ Done", defaultLabel:"Default",
    btnZero:"0", btnMax:"Max",
    reset:"Reset", resetTitle:"Reset Inventory?",
    resetText:"Entered quantities will be cleared.\nDefaults remain unchanged.",
    yesReset:"Yes, Reset", cancel:"Cancel",
    reportTitle:"Report", reportEmpty:"Everything stocked!", reportEmptySub:"Nothing to order",
    reportCount:"items to restock", shareReport:"Share Report (PDF)",
    storageHint:"Storage Location", storageHintPlaceholder:"e.g. Back room · Shelf 3", noHint:"No location set — tap to add",
    profilesTitle:"Profiles", activeLabel:"Active", importProfile:"Import Profile",
    exportProfile:"Export", rename:"Rename", deleteProfile:"Delete",
    defaultProfileLabel:"Default Profile", maxProfiles:"Maximum 4 profiles reached.",
    deleteProfileTitle:"Delete Profile?", deleteProfileText:"This profile and all its data will be removed.",
    yesDelete:"Yes, Delete", activate:"Activate",
    editTitle:"Edit Structure", addShelf:"+ Shelf", addItem:"+ Item",
    shelfPh:"Shelf name", itemPh:"Item name",
    importSuccess:"Profile imported!", importError:"Invalid profile file.", noItems:"No items.", items:"items",
    settings:"Settings", themeDark:"Dark", themeLight:"Light", themeLabel:"Theme",
  },
  de: {
    appTitle:"Bar Inventar", switchLang:"EN",
    zones:{ left:"Linker Bereich", beer:"Bar-Bereich", cafe:"Café-Bereich", right:"Rechter Bereich", top:"Oberer Bereich" },
    tabBar:"Bar", tabReport:"Bericht", tabProfiles:"Profile", tabEdit:"Bearbeiten",
    back:"← Zurück", tapUnit:"Einheit auswählen", emptyShelf:"Leeres Regal",
    inStock:"Vorhanden", needed:"Benötigt", complete:"✓ Fertig", defaultLabel:"Standard",
    btnZero:"0", btnMax:"Max",
    reset:"Reset", resetTitle:"Inventar zurücksetzen?",
    resetText:"Eingegebene Mengen werden gelöscht.\nStandardwerte bleiben erhalten.",
    yesReset:"Ja, zurücksetzen", cancel:"Abbrechen",
    reportTitle:"Bericht", reportEmpty:"Alles vorrätig!", reportEmptySub:"Nichts zu bestellen",
    reportCount:"Artikel fehlen", shareReport:"Bericht teilen (PDF)",
    storageHint:"Lagerort", storageHintPlaceholder:"z.B. Lagerraum · Regal 3", noHint:"Kein Lagerort – antippen",
    profilesTitle:"Profile", activeLabel:"Aktiv", importProfile:"Profil importieren",
    exportProfile:"Exportieren", rename:"Umbenennen", deleteProfile:"Löschen",
    defaultProfileLabel:"Standardprofil", maxProfiles:"Maximum 4 Profile erreicht.",
    deleteProfileTitle:"Profil löschen?", deleteProfileText:"Dieses Profil und alle Daten werden entfernt.",
    yesDelete:"Ja, löschen", activate:"Aktivieren",
    editTitle:"Struktur bearbeiten", addShelf:"+ Regal", addItem:"+ Artikel",
    shelfPh:"Regalname", itemPh:"Artikelname",
    importSuccess:"Profil importiert!", importError:"Ungültige Datei.", noItems:"Keine Artikel.", items:"Artikel",
    settings:"Einstellungen", themeDark:"Dunkel", themeLight:"Hell", themeLabel:"Design",
  },
};

/* ── Color palettes (dark / light) ──────────────────────────────────────────── */
const PAL = {
  dark:{
    appBg:"#111722", hBg:"#1A2236", hBdr:"#253047",
    surf:"#1C2840", surfAlt:"#162032",
    bdr:"#253047", bdrMid:"#2E3D55", bdrFaint:"#1E2D42",
    txt:"#F2EAE0", txtSub:"#A0B4C8", txtMut:"#6A80A0", txtFaint:"#334055",
    gold:"#D4A853", goldDk:"#B8860B", goldBg:"#221A08", goldBdr:"#2E2208",
    inp:"#141E30", inpBdr:"#2E4060",
    okBg:"#0F2818", okBdr:"#1A4828", okTxt:"#4AB870",
    infoBg:"#101E3A", infoBdr:"#1A3060", infoTxt:"#70A8E0",
    danger:"#A02020", dangerTxt:"#FFB0B0",
    progBg:"#1E2A3C", mBg:"rgba(0,0,0,.80)", mCard:"#1A2236",
    navBg:"#141E30", tabBg:"#1E2A3C",
  },
  light:{
    appBg:"#F0F3F8", hBg:"#FFFFFF", hBdr:"#DDE5EF",
    surf:"#FFFFFF", surfAlt:"#F5F8FC",
    bdr:"#DDE5EF", bdrMid:"#C8D5E0", bdrFaint:"#EEF2F8",
    txt:"#1A2535", txtSub:"#4A5E72", txtMut:"#8A9BAC", txtFaint:"#C0CCDA",
    gold:"#9A6808", goldDk:"#7A5205", goldBg:"#FFF8E8", goldBdr:"#E8D090",
    inp:"#FFFFFF", inpBdr:"#B8CADA",
    okBg:"#EDFAF3", okBdr:"#A0DDB8", okTxt:"#1A7A3C",
    infoBg:"#EEF4FC", infoBdr:"#A0C0E0", infoTxt:"#1A5A9A",
    danger:"#C02020", dangerTxt:"#FFFFFF",
    progBg:"#DDE5EF", mBg:"rgba(0,0,0,.5)", mCard:"#FFFFFF",
    navBg:"#FFFFFF", tabBg:"#E8EFF8",
  },
};

/* ── Zone themes (dark / light) ─────────────────────────────────────────────── */
const ZTH = {
  blue:{
    dark: {bg:"#060E1A",card:"#0B1A2C",bdr:"#142840",acc:"#3A8FD0",txt:"#5AAAE0",dim:"#1A2E44"},
    light:{bg:"#EAF3FC",card:"#F0F8FF",bdr:"#B8D8F0",acc:"#1868B8",txt:"#0A4A90",dim:"#8ABCE0"},
  },
  amber:{
    dark: {bg:"#110900",card:"#1C1100",bdr:"#382200",acc:"#C87A28",txt:"#E09038",dim:"#3A2000"},
    light:{bg:"#FFF8EE",card:"#FFFAF5",bdr:"#F0D8B0",acc:"#A06010",txt:"#7A4808",dim:"#D0A060"},
  },
  brown:{
    dark: {bg:"#100803",card:"#1A0F07",bdr:"#341E0A",acc:"#AC7238",txt:"#C88850",dim:"#382010"},
    light:{bg:"#FDF5EE",card:"#FFFAF7",bdr:"#EDD8C0",acc:"#885020",txt:"#623808",dim:"#C09068"},
  },
  teal:{
    dark: {bg:"#041010",card:"#071818",bdr:"#0C2A2C",acc:"#28AAAA",txt:"#40C0C0",dim:"#0E3030"},
    light:{bg:"#EBF9F9",card:"#F5FFFF",bdr:"#A8E8E8",acc:"#088888",txt:"#066666",dim:"#68C0C0"},
  },
  gold:{
    dark: {bg:"#0D0B00",card:"#161300",bdr:"#2A2300",acc:"#D4A853",txt:"#E8C070",dim:"#3A3000"},
    light:{bg:"#FDF9EE",card:"#FFFEF8",bdr:"#EEDD98",acc:"#9A7808",txt:"#786005",dim:"#C8A840"},
  },
};

/* ── Inventory builder helpers ───────────────────────────────────────────────── */
const it = (id,name,qty,hint="") => ({id,name,defaultQty:qty,storageHint:hint});
const sh = (id,name,items)        => ({id,name,items});
const un = (id,name,type,sections)=> ({id,name,type,sections});
const zn = (id,name,theme,icon,units)=>({id,name,theme,icon,units});

/* ── Lager location constants (German) ───────────────────────────────────────── */
const GKR  = "Großer Getränkekühlschrank";
const GR   = `${GKR} – rechte Seite`;
const GL   = `${GKR} – linke Seite`;
const GE   = `${GKR} – hintere Seite`;
const ALKF = "Alkoholkühlschrank";
const LGRM = "Lagerraum, neben den Getränkeregalen";
const TRLG = "Trockenlager";
const LGR  = "Lager";

/* ── Full bar inventory ──────────────────────────────────────────────────────── */
const DEFAULT_INVENTORY = [
  zn("left","Left Section","blue","❄️",[
    un("l1","Kühlschrank 1","fridge",[
      sh("l1t","Oben",[
        it("l1t_col33",  "Cola 0,33",      24, GR),
        it("l1t_col033", "Cola Zero 0,33", 24, GR),
      ]),
      sh("l1b","Unten",[
        it("l1b_col1",  "Cola 1L",      12, GR),
        it("l1b_col01", "Cola Zero 1L",  6, GR),
        it("l1b_spr1",  "Sprite 1L",     6, GR),
        it("l1b_fan1",  "Fanta 1L",      6, GR),
      ]),
    ]),
    un("l2","Kühlschrank 2","fridge",[
      sh("l2t","Oben",[
        it("l2t_weiz",  "Krombacher Weizen",        30, GE),
        it("l2t_weizd", "Krombacher Weizen Dunkel",  6, GE),
        it("l2t_erd",   "Erdinger",                  5, GE),
      ]),
      sh("l2b","Unten",[
        it("l2b_eitpf", "Eistee Pfirsich",           2, GR),
        it("l2b_eitlm", "Eistee Lemon",              2, GR),
        it("l2b_lsq",   "Lemon Squash",              5, GL),
        it("l2b_rhb",   "Rhabarber",                 4, GR),
        it("l2b_ban",   "Bananasaft",                2, GR),
        it("l2b_crb",   "Cranberrysaft",             2, GR),
        it("l2b_kir",   "Kirschsaft",                2, GR),
        it("l2b_joh",   "Schw. Johannisbeere",       2, GR),
      ]),
    ]),
    un("l3","Kühlschrank 3","fridge",[
      sh("l3t","Oben",[
        it("l3t_waf",  "Krombacher Weizen Alk.Frei", 25, GE),
        it("l3t_kaf",  "Krombacher Alk.Frei",         6, GE),
        it("l3t_raf",  "Krombacher Radler Alk.Frei",  6, GE),
        it("l3t_stnb", "Starnberger",                 4, GE),
      ]),
      sh("l3b","Unten",[
        it("l3b_marc", "Maracujasaft", 8, GR),
        it("l3b_anas", "Ananassaft",   4, GR),
        it("l3b_org",  "Orangensaft",  4, GR),
        it("l3b_apf",  "Apfelsaft",    4, GR),
      ]),
    ]),
    un("l4","Kühlschrank 4","fridge",[
      sh("l4t","Oben",[]),
      sh("l4b","Unten",[
        it("l4b_cor",  "Corona",     6, GE),
        it("l4b_desp", "Desperados", 6, GE),
        it("l4b_heink","Heineken",   9, GE),
        it("l4b_smby", "Somersby",   4, LGRM),
        it("l4b_vitm", "Vitamalz",   6, GE),
        it("l4b_bck",  "Becks",      6, GE),
        it("l4b_smig", "San Miguel", 6, GE),
      ]),
    ]),
  ]),

  zn("beer","Bar Section","amber","🍺",[
    un("b1","Schublade Links","drawer",[
      sh("b1m","Inhalt",[
        it("b1_ginger","Schweppes Gingerale", 6, LGRM),
        it("b1_tonic", "Schweppes Tonic",     6, LGRM),
      ]),
    ]),
    un("b2","Schublade Rechts","drawer",[
      sh("b2m","Inhalt",[
        it("b2_wbry", "Schweppes Wildberry",  6, LGRM),
        it("b2_wpch", "Schweppes Whitepeach", 6, LGRM),
      ]),
    ]),
  ]),

  zn("cafe","Café Section","brown","☕",[
    un("c1","Schrank Links","cabinet",[
      sh("c1m","Inhalt",[
        it("c1_esp",  "Café Espresso", 2, TRLG),
        it("c1_crem", "Café Crema",    2, TRLG),
        it("c1_milk", "Milch",         2, LGR),
      ]),
    ]),
    un("c2","Schrank Rechts","cabinet",[
      sh("c2m","Inhalt",[
        it("c2_matcha","Matcha Pulver", 1, TRLG),
        it("c2_schoki","Schoki Pulver", 1, TRLG),
        it("c2_wchok", "Schoki Weiß",   1, TRLG),
        it("c2_chai",  "Chai Tee",      1, TRLG),
      ]),
    ]),
  ]),

  zn("right","Right Section","teal","🧊",[
    un("r1","Kühlschrank 1","fridge",[
      sh("r1t","Oben",[
        it("r1t_ttree","Tonic Tree",              13, GR),
        it("r1t_gale", "Ginger Ale",               6, GR),
        it("r1t_pom",  "Schweppes Pomegranate",     3, GR),
        it("r1t_wbry", "Original Wildberry",        4, GR),
        it("r1t_gbr",  "Gingerbeer",               7, GR),
        it("r1t_blm",  "Bitterlemon",              7, GR),
        it("r1t_pgf",  "Pink Grapefruit",          12, GR),
        it("r1t_dtn",  "Dry Tonic",               11, GR),
      ]),
      sh("r1b","Unten",[]),
    ]),
    un("r2","Kühlschrank 2","fridge",[
      sh("r2t","Oben",[
        it("r2_bian",  "Bianco",      14, GL),
        it("r2_secco", "Secco",       14, GL),
        it("r2_char",  "Chardonnay",   7, GL),
      ]),
      sh("r2b","Unten",[
        it("r2b_happy","Happy Horas",  5, GL),
        it("r2b_lug",  "Lugano",       3, GL),
      ]),
    ]),
    un("r3","Kühlschrank 3","fridge",[
      sh("r3m","Inhalt",[
        it("r3_bnoir", "Blanc de Noir",    7, GL),
        it("r3_gburg", "Grauer Burgunder", 12, GL),
        it("r3_ries",  "Riesling Sommer",  7, GL),
      ]),
    ]),
    un("r4","Kühlschrank 4","fridge",[
      sh("r4t","Oben",[
        it("r4t_eff",  "Effect",            13, GR),
        it("r4t_wsm",  "Stillwasser 0,33",  21, GR),
        it("r4t_gsm",  "Spr.Wasser 0,33",   25, GR),
      ]),
      sh("r4b","Unten",[
        it("r4b_wlg",  "Still 1L",          15, GR),
        it("r4b_glg",  "Spr.Wasser 1L",     15, GR),
      ]),
    ]),
    un("r5","Kühlschrank 5","fridge",[
      sh("r5t","Oben",[]),
      sh("r5b","Unten",[
        it("r5b_fan",  "Fanta 0,33",  18, GR),
        it("r5b_mez",  "Mezzomix",    14, GR),
        it("r5b_spr",  "Sprite 0,33", 10, GR),
        it("r5b_limo", "Limo",         6, GE),
      ]),
    ]),
  ]),

  zn("top","Top Section","gold","🥃",[
    un("t1","Spirituosen 1","cabinet",[
      sh("t1m","Inhalt",[
        it("t1_trsec","Triple Sec",      5, ALKF),
        it("t1_teq",  "Tequila",         5, ALKF),
        it("t1_mbiz", "Marie Brizard",   5, ALKF),
        it("t1_pflik","Pfirsich Likör",  5, ALKF),
        it("t1_apbr", "Apricot Brandy",  5, ALKF),
        it("t1_wrum", "White Rum",       5, ALKF),
        it("t1_bcur", "Blue Curaçao",    5, ALKF),
        it("t1_dgin", "Dry Gin",         5, ALKF),
        it("t1_brum", "Brown Rum",       5, ALKF),
        it("t1_r73",  "Rum 73%",         5, ALKF),
        it("t1_vod",  "Vodka",           5, ALKF),
      ]),
    ]),
    un("t2","Spirituosen 2","cabinet",[
      sh("t2m","Inhalt",[
        it("t2_jaeg", "Jägermeister",  2, ALKF),
        it("t2_blft", "Berliner Luft", 2, ALKF),
        it("t2_samb", "Sambuca",       2, ALKF),
        it("t2_polr", "Polar Limes",   2, ALKF),
        it("t2_cach", "Cachaça",       5, ALKF),
        it("t2_cass", "Cassis",        5, ALKF),
        it("t2_hav",  "Havana Club",   5, ALKF),
        it("t2_apr",  "Aperol",        5, ALKF),
        it("t2_lilb", "Lillet Blanc",  5, ALKF),
        it("t2_lilr", "Lillet Rosé",   5, ALKF),
        it("t2_sart", "Sarti",         5, ALKF),
      ]),
    ]),
    un("t3","Spirituosen 3","cabinet",[
      sh("t3m","Inhalt",[
        it("t3_mex",  "Mexicana",      2, ALKF),
        it("t3_jam",  "Jameson",       2, ALKF),
        it("t3_gorr", "Gordon Rosé",   2, ALKF),
        it("t3_gor",  "Gordon",        2, ALKF),
        it("t3_abvd", "Absolut Vodka", 2, ALKF),
        it("t3_brzz", "Bacardi Razz",  2, ALKF),
        it("t3_bac",  "Bacardi",       2, ALKF),
        it("t3_bomb", "Bombay",        2, ALKF),
        it("t3_hend", "Hendrick's",    2, ALKF),
      ]),
    ]),
    un("t4","Spirituosen 4","cabinet",[
      sh("t4m","Inhalt",[
        it("t4_jd",   "Jack Daniel's",    2, ALKF),
        it("t4_jwlk", "Johnnie Walker",   2, ALKF),
        it("t4_chiv", "Chivas",           2, ALKF),
        it("t4_soco", "Southern Comfort", 2, ALKF),
        it("t4_jam2", "Jameson",          2, ALKF),
      ]),
    ]),
    un("t5","Weine & Sirupe","cabinet",[
      sh("t5m","Inhalt",[
        it("t5_shir",  "Shiraz",        5, ALKF),
        it("t5_merl",  "Merlot",        5, ALKF),
        it("t5_ross",  "Rosso",         5, ALKF),
        it("t5_prim",  "Primitivo",     5, ALKF),
        it("t5_zit",   "Zitronensaft",  5, GL),
        it("t5_lime",  "Lime Juice",    5, GL),
        it("t5_kahl",  "Kahlúa",        2, ALKF),
        it("t5_sugr",  "Zucker Sirup",  2, ALKF),
        it("t5_hora",  "Horas Rot",     5, ALKF),
        it("t5_oct",   "Octavo",        5, ALKF),
      ]),
    ]),
  ]),
];

const INIT_PROFILES = {
  default:{ id:"default", name:"My Bar", isDefault:true, inventory:DEFAULT_INVENTORY, currentQty:{} },
};

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
const uid       = () => Math.random().toString(36).slice(2,9);
const flatItems = inv => inv.flatMap(z=>z.units.flatMap(u=>u.sections.flatMap(s=>s.items)));
const zonePct   = (zone,cq) => {
  const all = zone.units.flatMap(u=>u.sections.flatMap(s=>s.items));
  return all.length ? all.filter(i=>cq[i.id]!==undefined&&cq[i.id]!=="").length/all.length : 1;
};
const unitSt = (unit,cq)=>{
  const all=unit.sections.flatMap(s=>s.items);
  if(!all.length) return "none";
  const f=all.filter(i=>cq[i.id]!==undefined&&cq[i.id]!=="").length;
  return f===0?"empty":f===all.length?"done":"partial";
};
const shelfSt = (s,cq)=>{
  if(!s.items.length) return "none";
  const f=s.items.filter(i=>cq[i.id]!==undefined&&cq[i.id]!=="").length;
  return f===0?"empty":f===s.items.length?"done":"partial";
};

/* ══════════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════════ */
export default function BarApp() {
  const ls = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const ss = (k,v) => { try { localStorage.setItem(k,v); } catch {} };

  const [lang,      setLang]      = useState(()=>ls("bar_lang")||"en");
  const [themeMode, setThemeMode] = useState(()=>ls("bar_theme")||"dark");
  const [profiles,  setProfiles]  = useState(()=>{ try{const s=ls("bar_pv6");return s?JSON.parse(s):INIT_PROFILES;}catch{return INIT_PROFILES;} });
  const [activePid, setActivePid] = useState(()=>ls("bar_apid")||"default");
  const [tab,       setTab]       = useState("bar");
  const [zoneId,    setZoneId]    = useState(null);
  const [openUid,   setOpenUid]   = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [showSett,  setShowSett]  = useState(false);
  const [toast,     setToast]     = useState(null);
  const [doneIds,   setDoneIds]   = useState(new Set()); // report done-items — lives at App level to survive tab switches
  const [exportModal, setExportModal] = useState(null); // { name, json }
  const [shareModal,  setShareModal]  = useState(null); // report text string
  const fileRef = useRef(null);

  const T  = LANG[lang];
  const C  = PAL[themeMode];

  const profile   = profiles[activePid]||profiles["default"];
  const inventory = profile.inventory;
  const currentQty= profile.currentQty;

  useEffect(()=>{ const l=document.createElement("link"); l.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap"; l.rel="stylesheet"; document.head.appendChild(l); return()=>document.head.removeChild(l); },[]);
  useEffect(()=>{ try{localStorage.setItem("bar_pv6",JSON.stringify(profiles));}catch{} },[profiles]);
  useEffect(()=>{ ss("bar_apid",activePid); },[activePid]);
  useEffect(()=>{ ss("bar_lang",lang); },[lang]);
  useEffect(()=>{ ss("bar_theme",themeMode); },[themeMode]);

  const toast$ = (msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const patchP  = (pid,field,val)=>setProfiles(p=>({...p,[pid]:{...p[pid],[field]:val}}));
  const patchInv= (inv)=>patchP(activePid,"inventory",inv);

  // Generic item patcher across zones
  const patchItem=(uid_,sid,iid,p)=>patchInv(inventory.map(z=>({
    ...z,units:z.units.map(u=>u.id!==uid_?u:{
      ...u,sections:u.sections.map(s=>s.id!==sid?s:{
        ...s,items:s.items.map(i=>i.id!==iid?i:{...i,...p})
      })
    })
  })));

  const setQty      = (id,v)=>patchP(activePid,"currentQty",{...currentQty,[id]:v});
  const saveDefault = (uid_,sid,iid,v)=>{ const n=parseInt(v); if(!isNaN(n)&&n>=0) patchItem(uid_,sid,iid,{defaultQty:n}); };
  const updateHint  = (iid,hint)=>patchInv(inventory.map(z=>({
    ...z,units:z.units.map(u=>({
      ...u,sections:u.sections.map(s=>({
        ...s,items:s.items.map(i=>i.id!==iid?i:{...i,storageHint:hint})
      }))
    }))
  })));

  const handleReset = ()=>{ patchP(activePid,"currentQty",{}); setDoneIds(new Set()); setShowReset(false); setOpenUid(null); };

  const exportProfile = pid=>{
    const p=profiles[pid];
    const json=JSON.stringify({_type:"BarInventoryProfile",_version:"2.0",name:p.name,exportedAt:new Date().toISOString(),inventory:p.inventory},null,2);
    // Try native download first
    try {
      const blob=new Blob([json],{type:"application/json"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download=`${p.name.replace(/\s+/g,"_")}.barprofile.json`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
      toast$("Download started ✓");
    } catch {
      // Fallback: show JSON in copy modal (e.g. sandboxed iframe)
      setExportModal({ name: p.name, json });
    }
  };

  const handleImport = e=>{
    const file=e.target.files?.[0]; if(!file)return;
    if(Object.keys(profiles).length>=4){toast$(T.maxProfiles,"err");return;}
    const r=new FileReader();
    r.onload=ev=>{ try{ const d=JSON.parse(ev.target.result); if(d._type!=="BarInventoryProfile")throw new Error(); const nid=uid(); setProfiles(p=>({...p,[nid]:{id:nid,name:d.name||"Imported",isDefault:false,inventory:d.inventory,currentQty:{}}})); toast$(T.importSuccess); }catch{ toast$(T.importError,"err"); } };
    r.readAsText(file); e.target.value="";
  };

  // Edit helpers
  const addShelf =(zid,uid_)=>{ const s={id:uid(),name:"Neues Regal",items:[]}; patchInv(inventory.map(z=>z.id!==zid?z:{...z,units:z.units.map(u=>u.id!==uid_?u:{...u,sections:[...u.sections,s]})})); };
  const remShelf =(zid,uid_,sid)=>patchInv(inventory.map(z=>z.id!==zid?z:{...z,units:z.units.map(u=>u.id!==uid_?u:{...u,sections:u.sections.filter(s=>s.id!==sid)})}));
  const updShelf =(zid,uid_,sid,p)=>patchInv(inventory.map(z=>z.id!==zid?z:{...z,units:z.units.map(u=>u.id!==uid_?u:{...u,sections:u.sections.map(s=>s.id!==sid?s:{...s,...p})})}));
  const addItm   =(uid_,sid)=>{ const i={id:uid(),name:"Neuer Artikel",defaultQty:10,storageHint:""}; patchInv(inventory.map(z=>({...z,units:z.units.map(u=>u.id!==uid_?u:{...u,sections:u.sections.map(s=>s.id!==sid?s:{...s,items:[...s.items,i]})})})));};
  const remItm   =(uid_,sid,iid)=>{ patchInv(inventory.map(z=>({...z,units:z.units.map(u=>u.id!==uid_?u:{...u,sections:u.sections.map(s=>s.id!==sid?s:{...s,items:s.items.filter(i=>i.id!==iid)})})})));const q={...currentQty};delete q[iid];patchP(activePid,"currentQty",q); };

  // Only show items that have been entered AND still need restocking
  const reportItems = ()=>flatItems(inventory)
    .filter(i => currentQty[i.id] !== undefined && currentQty[i.id] !== "")
    .map(i=>{ const c=parseInt(currentQty[i.id]); return{...i,needed:Math.max(0,i.defaultQty-c)}; })
    .filter(i=>i.needed>0);

  const allItems = flatItems(inventory);
  const filled   = allItems.filter(i=>currentQty[i.id]!==undefined&&currentQty[i.id]!=="").length;
  const total    = allItems.length;
  const pct      = total?(filled/total)*100:0;
  const report   = reportItems();
  const pList    = Object.values(profiles);
  const selZone  = zoneId?inventory.find(z=>z.id===zoneId):null;

  const switchTab = t=>{ setTab(t); setZoneId(null); setOpenUid(null); };

  // Common button styles that depend on C
  const dangerBtn = { flex:1,padding:11,borderRadius:12,border:"none",background:`linear-gradient(135deg,${C.danger},${C.danger}cc)`,color:C.dangerTxt,cursor:"pointer",fontSize:13,fontWeight:600 };
  const cancelBtn = { flex:1,padding:11,borderRadius:12,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:13,fontWeight:600 };

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:${C.appBg};transition:background .3s}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield} input{outline:none} button{font-family:inherit}
        .zone-tile:active{transform:scale(.97)} .unit-card:active{transform:scale(.95)}
        @keyframes fadeUp   {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn    {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
      `}</style>

      <div style={{minHeight:"100vh",maxWidth:430,margin:"0 auto",backgroundColor:C.appBg,color:C.txt,fontFamily:"'DM Sans',system-ui,sans-serif",display:"flex",flexDirection:"column",transition:"background .3s,color .3s"}}>

        {/* Header */}
        <header style={{padding:"11px 14px 9px",background:C.hBg,borderBottom:`1px solid ${C.hBdr}`,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"background .3s"}}>
          <div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.gold,lineHeight:1}}>{T.appTitle}</h1>
            <p style={{fontSize:10,color:C.txtMut,marginTop:2}}>{profile.name} · {filled}/{total} {T.items}</p>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={()=>setLang(l=>l==="en"?"de":"en")} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${C.bdrMid}`,backgroundColor:C.tabBg,color:C.infoTxt,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:.8}}>{T.switchLang}</button>
            <button onClick={()=>setShowSett(true)} style={{padding:"5px 9px",borderRadius:14,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:14}}>⚙️</button>
            <button onClick={()=>setShowReset(true)} style={{padding:"5px 9px",borderRadius:14,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:themeMode==="dark"?"#4A2828":"#AA4040",cursor:"pointer",fontSize:13,fontWeight:700}}>↺</button>
          </div>
        </header>

        {/* Progress */}
        <div style={{height:2,backgroundColor:C.progBg}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.goldDk},${C.gold})`,transition:"width .5s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${C.gold}55`}} />
        </div>

        {/* Profile tabs */}
        <div style={{display:"flex",gap:5,padding:"6px 14px",backgroundColor:C.navBg,borderBottom:`1px solid ${C.hBdr}`,overflowX:"auto",scrollbarWidth:"none",transition:"background .3s"}}>
          {pList.map(p=>(
            <button key={p.id} onClick={()=>{setActivePid(p.id);setZoneId(null);setOpenUid(null);}} style={{padding:"4px 12px",borderRadius:14,border:"none",flexShrink:0,backgroundColor:activePid===p.id?C.gold:C.tabBg,color:activePid===p.id?(themeMode==="dark"?"#080B10":"#FFF8E8"):C.txtMut,cursor:"pointer",fontSize:11,fontWeight:600,transition:"all .2s"}}>
              {p.isDefault?`★ ${p.name}`:p.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {tab==="bar"&&!selZone&&<HomeScreen T={T} C={C} themeMode={themeMode} inventory={inventory} currentQty={currentQty} onZoneClick={id=>{setZoneId(id);setOpenUid(null);}}/>}
          {tab==="bar"&&selZone&&<ZoneScreen T={T} C={C} themeMode={themeMode} zone={selZone} currentQty={currentQty} openUid={openUid} onUnitClick={id=>setOpenUid(p=>p===id?null:id)} onSetQty={setQty} onSaveDefault={saveDefault} onBack={()=>{setZoneId(null);setOpenUid(null);}}/>}
          {tab==="report"&&<ReportView T={T} C={C} reportItems={report} onUpdateHint={updateHint} onGoToBar={()=>switchTab("bar")} doneIds={doneIds} setDoneIds={setDoneIds}/>}
          {tab==="profiles"&&<ProfilesView T={T} C={C} themeMode={themeMode} profiles={pList} activePid={activePid} onExport={exportProfile} onImport={()=>fileRef.current?.click()} onDelete={pid=>{const n={...profiles};delete n[pid];setProfiles(n);if(activePid===pid)setActivePid("default");}} onRename={(pid,name)=>setProfiles(p=>({...p,[pid]:{...p[pid],name}}))} onActivate={id=>{setActivePid(id);setZoneId(null);setOpenUid(null);}}/>}
          {tab==="edit"&&<EditView T={T} C={C} inventory={inventory} onAddShelf={addShelf} onRemShelf={remShelf} onUpdShelf={updShelf} onAddItm={addItm} onRemItm={remItm} onUpdItm={(uid_,sid,iid,p)=>patchItem(uid_,sid,iid,p)}/>}
        </div>

        {/* Bottom nav */}
        <nav style={{display:"flex",borderTop:`1px solid ${C.hBdr}`,backgroundColor:C.navBg,transition:"background .3s"}}>
          {[{id:"bar",icon:"🏠",label:T.tabBar},{id:"report",icon:"📊",label:T.tabReport,badge:report.length},{id:"profiles",icon:"👤",label:T.tabProfiles},{id:"edit",icon:"✏️",label:T.tabEdit}].map(t=>(
            <button key={t.id} onClick={()=>switchTab(t.id)} style={{flex:1,padding:"9px 4px 7px",border:"none",backgroundColor:"transparent",color:tab===t.id?C.gold:C.txtFaint,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative",transition:"color .2s"}}>
              <span style={{fontSize:17}}>{t.icon}</span>
              <span style={{fontSize:9,fontWeight:600,letterSpacing:.2}}>{t.label}</span>
              {t.badge>0&&<div style={{position:"absolute",top:5,right:"calc(50% - 18px)",backgroundColor:C.gold,color:themeMode==="dark"?"#080B10":"#FFF8E0",borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700}}>{t.badge}</div>}
            </button>
          ))}
        </nav>

        {/* Settings modal */}
        {showSett&&(
          <Modal C={C} onClose={()=>setShowSett(false)}>
            <div style={{fontSize:26,marginBottom:8}}>⚙️</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:16}}>{T.settings}</div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:11,color:C.txtMut,marginBottom:8,textTransform:"uppercase",letterSpacing:.8}}>{T.themeLabel}</div>
              <div style={{display:"flex",gap:8}}>
                {["dark","light"].map(m=>(
                  <button key={m} onClick={()=>setThemeMode(m)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${themeMode===m?C.gold:C.bdrMid}`,backgroundColor:themeMode===m?C.goldBg:"transparent",color:themeMode===m?C.gold:C.txtMut,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all .2s"}}>
                    {m==="dark"?`🌙 ${T.themeDark}`:`☀️ ${T.themeLight}`}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={()=>setShowSett(false)} style={{...cancelBtn,marginTop:14}}>{T.cancel}</button>
          </Modal>
        )}

        {/* Reset modal */}
        {showReset&&(
          <Modal C={C} onClose={()=>setShowReset(false)}>
            <div style={{fontSize:26,marginBottom:8}}>↺</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:C.gold,marginBottom:8}}>{T.resetTitle}</div>
            <p style={{fontSize:12,color:C.txtMut,marginBottom:20,lineHeight:1.65,whiteSpace:"pre-line"}}>{T.resetText}</p>
            <div style={{display:"flex",gap:10}}><button onClick={handleReset} style={dangerBtn}>{T.yesReset}</button><button onClick={()=>setShowReset(false)} style={cancelBtn}>{T.cancel}</button></div>
          </Modal>
        )}

        {/* Toast */}
        {toast&&<div style={{position:"fixed",bottom:76,left:"50%",transform:"translateX(-50%)",backgroundColor:toast.type==="err"?(themeMode==="dark"?"#5A1010":"#FFEAEA"):(themeMode==="dark"?"#0E2A18":"#EAFAF3"),border:`1px solid ${toast.type==="err"?(themeMode==="dark"?"#8B2020":"#FFAAAA"):(themeMode==="dark"?"#1A5A30":"#A0DDB8")}`,color:toast.type==="err"?(themeMode==="dark"?"#FFB0B0":"#C02020"):(themeMode==="dark"?"#80E8A0":"#1A7A3C"),padding:"10px 20px",borderRadius:20,fontSize:12,fontWeight:600,zIndex:300,animation:"fadeIn .2s ease",whiteSpace:"nowrap"}}>{toast.msg}</div>}

        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{display:"none"}}/>

        {/* Share Report modal — in-app fallback when Web Share API is unavailable */}
        {shareModal&&(
          <Modal C={C} onClose={()=>setShareModal(null)}>
            <div style={{fontSize:22,marginBottom:6}}>📤</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.gold,marginBottom:10}}>{T.reportTitle}</div>
            <textarea readOnly value={shareModal}
              onClick={e=>{ e.target.select(); navigator.clipboard?.writeText(shareModal).catch(()=>{}); }}
              style={{width:"100%",height:180,padding:"10px",borderRadius:9,border:`1px solid ${C.bdrMid}`,backgroundColor:C.surfAlt,color:C.txt,fontSize:13,fontFamily:"'DM Sans',sans-serif",resize:"none",lineHeight:1.7,marginBottom:10,textAlign:"left"}}
            />
            <p style={{fontSize:10,color:C.txtMut,marginBottom:12}}>Tap the text above to select &amp; copy, then paste into WhatsApp / Telegram.</p>
            <button
              onClick={()=>{ navigator.clipboard?.writeText(shareModal).then(()=>{ toast$("Copied ✓"); setShareModal(null); }).catch(()=>{}); }}
              style={{width:"100%",padding:11,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.goldDk},${C.gold}bb)`,color:C.appBg,fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:8}}>
              📋 Copy to Clipboard
            </button>
            <button onClick={()=>setShareModal(null)} style={{width:"100%",padding:9,borderRadius:10,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:12}}>
              Close
            </button>
          </Modal>
        )}

        {/* Export JSON modal — fallback when download is blocked (e.g. sandboxed iframe) */}
        {exportModal&&(
          <Modal C={C} onClose={()=>setExportModal(null)}>
            <div style={{fontSize:22,marginBottom:6}}>📋</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.gold,marginBottom:4}}>{exportModal.name}</div>
            <p style={{fontSize:11,color:C.txtMut,marginBottom:10}}>Copy this JSON and send it to others:</p>
            <textarea readOnly value={exportModal.json}
              onClick={e=>e.target.select()}
              style={{width:"100%",height:130,padding:"8px",borderRadius:8,border:`1px solid ${C.bdrMid}`,backgroundColor:C.surfAlt,color:C.infoTxt,fontSize:10,fontFamily:"monospace",resize:"none",marginBottom:10}}
            />
            <button onClick={()=>{
              navigator.clipboard?.writeText(exportModal.json).then(()=>toast$("Copied to clipboard ✓")).catch(()=>{});
              setExportModal(null);
            }} style={{width:"100%",padding:10,borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.goldDk},${C.gold}bb)`,color:C.appBg,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              Copy to Clipboard
            </button>
          </Modal>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════ HOME SCREEN ════════════════════════════════════════ */
function HomeScreen({T,C,themeMode,inventory,currentQty,onZoneClick}) {
  const gz = id => inventory.find(z=>z.id===id);
  return (
    <div style={{flex:1,overflowY:"auto",backgroundColor:C.appBg}}>
      {/* Pendant lights */}
      <div style={{height:42,display:"flex",alignItems:"flex-end",justifyContent:"space-around",padding:"0 28px",background:`linear-gradient(180deg,${C.hBg} 0%,transparent 100%)`}}>
        {[0,1,2,3,4].map(i=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:1,height:20,backgroundColor:C.bdrMid}}/>
            <div style={{width:8,height:8,borderRadius:"50% 50% 40% 40%",backgroundColor:C.gold,boxShadow:`0 0 8px ${C.gold}88,0 0 20px ${C.gold}33`}}/>
          </div>
        ))}
      </div>

      <div style={{padding:"8px 12px 24px"}}>
        {/* TOP full-width */}
        <ZoneTile zone={gz("top")} cq={currentQty} tm={themeMode} T={T} onClick={()=>onZoneClick("top")} style={{height:68,marginBottom:10}}/>
        {/* Middle row */}
        <div style={{display:"flex",gap:8,height:170}}>
          <ZoneTile zone={gz("left")} cq={currentQty} tm={themeMode} T={T} onClick={()=>onZoneClick("left")} style={{flex:2.5}}/>
          <div style={{flex:1.8,display:"flex",flexDirection:"column",gap:8}}>
            <ZoneTile zone={gz("beer")} cq={currentQty} tm={themeMode} T={T} onClick={()=>onZoneClick("beer")} style={{flex:1}}/>
            <ZoneTile zone={gz("cafe")} cq={currentQty} tm={themeMode} T={T} onClick={()=>onZoneClick("cafe")} style={{flex:1}}/>
          </div>
          <ZoneTile zone={gz("right")} cq={currentQty} tm={themeMode} T={T} onClick={()=>onZoneClick("right")} style={{flex:3}}/>
        </div>
        {/* Bar counter */}
        <div style={{height:12,marginTop:10,background:"linear-gradient(180deg,#9B6E3A,#7A5228)",borderRadius:"5px 5px 0 0",boxShadow:"0 -3px 12px rgba(0,0,0,.5)"}}/>
        <div style={{height:22,background:"linear-gradient(180deg,#5C3A14,#3A2008)",borderBottom:"3px solid #220D00",borderRadius:"0 0 3px 3px"}}/>
        {/* Progress pills */}
        <div style={{display:"flex",gap:5,marginTop:14,flexWrap:"wrap"}}>
          {inventory.map(z=>{ const th=ZTH[z.theme][themeMode]; const p=zonePct(z,currentQty); return(
            <div key={z.id} onClick={()=>onZoneClick(z.id)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",borderRadius:10,backgroundColor:th.card,border:`1px solid ${th.bdr}`,cursor:"pointer",flex:"1 1 auto",transition:"all .2s"}}>
              <span style={{fontSize:12}}>{z.icon}</span>
              <div style={{flex:1,height:3,backgroundColor:th.bdr,borderRadius:2}}>
                <div style={{height:"100%",width:`${p*100}%`,backgroundColor:th.acc,borderRadius:2,transition:"width .5s ease"}}/>
              </div>
              <span style={{fontSize:9,color:th.dim}}>{Math.round(p*100)}%</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function ZoneTile({zone,cq,tm,T,onClick,style}) {
  const th = ZTH[zone.theme][tm];
  const p  = zonePct(zone,cq);
  const tot= zone.units.reduce((s,u)=>s+u.sections.reduce((s2,sec)=>s2+sec.items.length,0),0);
  return (
    <div className="zone-tile" onClick={onClick} style={{backgroundColor:th.card,border:`1px solid ${th.bdr}`,borderRadius:14,padding:"10px 11px",cursor:"pointer",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",overflow:"hidden",transition:"transform .12s",boxShadow:`0 4px 18px rgba(0,0,0,.35)`,...style}}>
      <div style={{position:"absolute",top:-20,right:-20,width:60,height:60,borderRadius:"50%",backgroundColor:th.acc,opacity:.08,filter:"blur(18px)",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <span style={{fontSize:18,lineHeight:1}}>{zone.icon}</span>
        <div style={{display:"flex",gap:3,flexWrap:"wrap",maxWidth:55,justifyContent:"flex-end"}}>
          {zone.units.map(u=>{ const s=unitSt(u,cq); return <div key={u.id} style={{width:7,height:7,borderRadius:2,backgroundColor:s==="done"?th.acc:s==="partial"?th.acc+"60":th.dim,transition:"background .3s"}}/>; })}
        </div>
      </div>
      <div>
        <div style={{fontSize:11,fontWeight:600,color:th.txt,lineHeight:1.2}}>{T.zones[zone.id]}</div>
        <div style={{fontSize:9,color:th.dim,marginTop:2}}>{zone.units.length} · {tot} {/* items */}</div>
      </div>
      <div style={{height:2,backgroundColor:th.dim,borderRadius:1,marginTop:5}}>
        <div style={{height:"100%",width:`${p*100}%`,backgroundColor:th.acc,borderRadius:1,transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════ ZONE SCREEN ═══════════════════════════════════════ */
function ZoneScreen({T,C,themeMode,zone,currentQty,openUid,onUnitClick,onSetQty,onSaveDefault,onBack}) {
  const th       = ZTH[zone.theme][themeMode];
  const openUnit = zone.units.find(u=>u.id===openUid)||null;
  const cols     = Math.min(zone.units.length<=2?2:zone.units.length<=4?4:5, zone.units.length);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"9px 15px",background:`linear-gradient(180deg,${th.card},${C.appBg})`,borderBottom:`1px solid ${th.bdr}`,display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:th.acc,cursor:"pointer",fontSize:12,fontWeight:700,padding:0}}>{T.back}</button>
        <div style={{width:1,height:12,backgroundColor:th.bdr}}/>
        <span style={{fontSize:12}}>{zone.icon}</span>
        <span style={{fontSize:13,fontWeight:600,color:th.txt}}>{T.zones[zone.id]}</span>
      </div>
      <div style={{padding:"12px",backgroundColor:th.bg,display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:9,flexShrink:0}}>
        {zone.units.map(u=><UnitCard key={u.id} unit={u} cq={currentQty} th={th} C={C} isOpen={openUid===u.id} onClick={()=>onUnitClick(u.id)}/>)}
      </div>
      {openUnit?(
        <div style={{flex:1,overflowY:"auto",borderTop:`1px solid ${th.bdr}`,animation:"slideUp .2s cubic-bezier(.4,0,.2,1)"}}>
          <UnitPanel T={T} C={C} th={th} unit={openUnit} currentQty={currentQty} onSetQty={onSetQty} onSaveDefault={onSaveDefault} onClose={()=>onUnitClick(null)}/>
        </div>
      ):(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:5,color:C.txtFaint}}>
          <div style={{fontSize:18}}>↑</div><div style={{fontSize:11}}>{T.tapUnit}</div>
        </div>
      )}
    </div>
  );
}

function UnitCard({unit,cq,th,C,isOpen,onClick}) {
  const isFridge=unit.type==="fridge";
  const st={none:th.bdr+"30",empty:C.appBg,partial:th.acc+"25",done:th.acc+"40"};
  const dot={none:th.dim,empty:C.bdrMid,partial:th.acc,done:th.acc};
  return (
    <div className="unit-card" onClick={onClick} style={{backgroundColor:isOpen?th.card:C.surfAlt,border:`1px solid ${isOpen?th.acc+"70":C.bdr}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all .2s",boxShadow:isOpen?`0 0 14px ${th.acc}25`:"none"}}>
      <div style={{padding:"7px 6px 3px"}}>
        {unit.sections.map((s,idx)=>{ const status=shelfSt(s,cq); return(
          <div key={s.id}>
            {idx>0&&<div style={{height:unit.type==="drawer"?5:1,backgroundColor:C.bdr,margin:unit.type==="drawer"?"3px 2px":"1px 4px"}}/>}
            <div style={{height:unit.type==="drawer"?22:24,borderRadius:4,backgroundColor:st[status],display:"flex",alignItems:"center",justifyContent:"center",transition:"background .3s"}}>
              <div style={{width:6,height:6,borderRadius:"50%",backgroundColor:dot[status],boxShadow:status==="done"||status==="partial"?`0 0 5px ${th.acc}90`:"none",transition:"all .3s"}}/>
            </div>
          </div>
        );})}
      </div>
      {isFridge&&<div style={{display:"flex",justifyContent:"flex-start",padding:"2px 5px 3px"}}><div style={{width:2,height:14,backgroundColor:C.bdrMid,borderRadius:1}}/></div>}
      <div style={{padding:"2px 5px 7px",textAlign:"center"}}><div style={{fontSize:9,color:isOpen?th.txt:C.txtMut,lineHeight:1.2}}>{unit.name}</div></div>
    </div>
  );
}

/* ═══════════════════════ UNIT PANEL ════════════════════════════════════════ */
function UnitPanel({T,C,th,unit,currentQty,onSetQty,onSaveDefault,onClose}) {
  const [editId, setEditId]   = useState(null);
  const [tempVal,setTempVal]  = useState("");
  return (
    <div style={{padding:"13px 15px 28px",backgroundColor:C.appBg}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:th.txt}}>{unit.name}</div>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.txtMut,cursor:"pointer",fontSize:17,lineHeight:1}}>✕</button>
      </div>
      {unit.sections.map(shelf=>(
        <div key={shelf.id} style={{marginBottom:14}}>
          {unit.sections.length>1&&(
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,${th.bdr},transparent)`}}/>
              <span style={{fontSize:9,color:th.dim,textTransform:"uppercase",letterSpacing:.7}}>{shelf.name}</span>
              <div style={{height:1,flex:1,background:`linear-gradient(90deg,transparent,${th.bdr})`}}/>
            </div>
          )}
          {shelf.items.length===0?<div style={{fontSize:11,color:C.txtFaint,fontStyle:"italic",padding:"3px 0"}}>{T.emptyShelf}</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {shelf.items.map((itm,i)=>{
                const val=currentQty[itm.id]??""; const num=parseInt(val);
                const needed=isNaN(num)?null:Math.max(0,itm.defaultQty-num);
                const editing=editId===itm.id; const done=needed!==null&&needed===0;
                return (
                  <div key={itm.id} style={{backgroundColor:C.surf,borderRadius:10,padding:"10px 12px",border:`1px solid ${done?C.okBdr:C.bdr}`,animation:`fadeUp .14s ease ${i*.04}s both`,transition:"border-color .3s"}}>
                    {/* Name row */}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:13,fontWeight:500,color:C.txt}}>{itm.name}</span>
                      {editing?(
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          <input type="number" min="0" value={tempVal} onChange={e=>setTempVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){onSaveDefault(unit.id,shelf.id,itm.id,tempVal);setEditId(null);}}} style={{width:48,padding:"2px 5px",borderRadius:5,border:`1px solid ${C.gold}`,backgroundColor:C.inp,color:C.txt,fontSize:12,textAlign:"center"}} autoFocus/>
                          <button onClick={()=>{onSaveDefault(unit.id,shelf.id,itm.id,tempVal);setEditId(null);}} style={{padding:"2px 8px",borderRadius:5,border:"none",backgroundColor:C.okBg,color:C.okTxt,cursor:"pointer",fontSize:11,fontWeight:700}}>✓</button>
                          <button onClick={()=>setEditId(null)} style={{padding:"2px 6px",borderRadius:5,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:11}}>✕</button>
                        </div>
                      ):(
                        <button onClick={()=>{setEditId(itm.id);setTempVal(String(itm.defaultQty));}} style={{padding:"2px 8px",borderRadius:5,border:`1px solid ${C.bdr}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:10,display:"flex",alignItems:"center",gap:3}}>
                          {T.defaultLabel}: {itm.defaultQty} <span style={{fontSize:8}}>✏</span>
                        </button>
                      )}
                    </div>
                    {/* Input row with 0 / MAX buttons */}
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:10,color:C.txtMut,whiteSpace:"nowrap"}}>{T.inStock}:</span>
                      {/* Quick 0 button */}
                      <button onClick={()=>onSetQty(itm.id,"0")} style={{padding:"6px 9px",borderRadius:7,border:`1px solid ${C.bdrMid}`,backgroundColor:C.surfAlt,color:C.txtMut,cursor:"pointer",fontSize:11,fontWeight:600,flexShrink:0,transition:"all .15s"}}>{T.btnZero}</button>
                      {/* Number input */}
                      <input type="number" min="0" placeholder="—" value={val} onChange={e=>onSetQty(itm.id,e.target.value)} style={{width:58,padding:"7px 6px",borderRadius:7,border:`1px solid ${val!==""?C.inpBdr:C.bdr}`,backgroundColor:C.inp,color:C.txt,fontSize:16,textAlign:"center",fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}/>
                      {/* Quick MAX button */}
                      <button onClick={()=>onSetQty(itm.id,String(itm.defaultQty))} style={{padding:"6px 9px",borderRadius:7,border:`1px solid ${th.bdr}`,backgroundColor:th.card||C.surfAlt,color:th.acc,cursor:"pointer",fontSize:11,fontWeight:600,flexShrink:0,transition:"all .15s"}}>{T.btnMax}</button>
                      {/* Result badge */}
                      {needed!==null&&(
                        <div style={{flex:1,padding:"7px 7px",borderRadius:7,textAlign:"center",fontSize:12,fontWeight:600,backgroundColor:done?C.okBg:C.infoBg,border:`1px solid ${done?C.okBdr:C.infoBdr}`,color:done?C.okTxt:C.infoTxt,transition:"all .3s"}}>
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

/* ═══════════════════════ REPORT VIEW ═══════════════════════════════════════ */
function ReportView({T,C,reportItems,onUpdateHint,onGoToBar,doneIds,setDoneIds}) {
  const [openId,  setOpenId]  = useState(null);
  const [editId,  setEditId]  = useState(null);
  const [draft,   setDraft]   = useState("");

  const setSwitchToBar = () => onGoToBar();

  const toggleDone = (id, e) => {
    e.stopPropagation();
    setDoneIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    // Close hint panel when marking done
    setOpenId(p => p === id ? null : p);
  };

  // Sort: pending items first, done items at bottom
  const sorted = [...reportItems].sort((a,b) => {
    const da = doneIds.has(a.id), db = doneIds.has(b.id);
    return da === db ? 0 : da ? 1 : -1;
  });

  const pendingCount = sorted.filter(i => !doneIds.has(i.id)).length;
  const text = sorted.map(i=>`${i.needed}x  ${i.name}`).join("\n");

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",backgroundColor:C.appBg}}>

      {reportItems.length===0?(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
          <div style={{width:60,height:60,borderRadius:"50%",backgroundColor:C.okBg,border:`1px solid ${C.okBdr}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>✓</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.okTxt}}>{T.reportEmpty}</div>
          <div style={{fontSize:12,color:C.txtMut}}>{T.reportEmptySub}</div>
        </div>
      ):(
        <>
          {/* Fixed header with Back + Share buttons */}
          <div style={{padding:"14px 15px 10px",flexShrink:0,borderBottom:`1px solid ${C.bdr}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold}}>{T.reportTitle}</div>
              <div style={{display:"flex",gap:7}}>
                {/* Back to Bar */}
                <button onClick={()=>setSwitchToBar(true)}
                  style={{padding:"6px 12px",borderRadius:10,border:`1px solid ${C.bdrMid}`,backgroundColor:C.surfAlt,color:C.txtSub,cursor:"pointer",fontSize:12,fontWeight:600}}>
                  🏠 {T.tabBar}
                </button>
                {/* Share */}
                <button onClick={async ()=>{
                  const shareText=`${T.reportTitle}\n${"─".repeat(28)}\n${text}\n${"─".repeat(28)}`;
                  if(navigator.share){try{await navigator.share({title:T.reportTitle,text:shareText});return;}catch(e){if(e.name==="AbortError")return;}}
                  setShareModal(shareText);
                }} style={{padding:"6px 12px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.goldDk},${C.gold}bb)`,color:"#0C0800",cursor:"pointer",fontSize:12,fontWeight:700}}>
                  📤
                </button>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:11,color:C.txtMut}}>{pendingCount} {T.reportCount}</span>
              {doneIds.size>0&&<span style={{fontSize:11,color:C.okTxt}}>· {doneIds.size} ✓</span>}
            </div>
          </div>

          {/* Scrollable list — takes remaining space */}
          <div style={{flex:1,overflowY:"auto",padding:"0 15px",paddingBottom:8}}>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {sorted.map((itm,i)=>{
                const isOpen   = openId===itm.id;
                const isEditing= editId===itm.id;
                const isDone   = doneIds.has(itm.id);
                const hasHint  = itm.storageHint&&itm.storageHint.trim()!=="";
                return(
                  <div key={itm.id} style={{opacity:isDone?.5:1,transition:"opacity .3s",animation:`fadeUp .16s ease ${Math.min(i,.15)*100}ms both`}}>
                    {/* Main row */}
                    <div onClick={()=>{if(!isDone){setOpenId(p=>p===itm.id?null:itm.id);setEditId(null);}}}
                      style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",
                        backgroundColor:isDone?C.okBg:isOpen?C.surfAlt:C.surf,
                        borderRadius:isOpen&&!isDone?"11px 11px 0 0":11,
                        border:`1px solid ${isDone?C.okBdr:isOpen?C.bdrMid:C.bdr}`,
                        borderBottom:isOpen&&!isDone?"none":undefined,
                        cursor:isDone?"default":"pointer",userSelect:"none",transition:"all .25s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
                        {!isDone&&<span style={{fontSize:9,color:C.txtMut,flexShrink:0,transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▼</span>}
                        {isDone&&<span style={{fontSize:13,color:C.okTxt,flexShrink:0}}>✓</span>}
                        <span style={{fontSize:14,color:isDone?C.okTxt:C.txt,textDecoration:isDone?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{itm.name}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
                        {/* Quantity badge */}
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,
                          color:isDone?C.okTxt:C.gold,
                          backgroundColor:isDone?C.okBg:C.goldBg,
                          border:`1px solid ${isDone?C.okBdr:C.goldBdr}`,
                          padding:"2px 11px",borderRadius:7,minWidth:40,textAlign:"center",transition:"all .25s"}}>
                          {itm.needed}
                        </div>
                        {/* Done toggle button */}
                        <button onClick={e=>toggleDone(itm.id,e)}
                          title={isDone?"Mark as pending":"Mark as collected"}
                          style={{width:30,height:30,borderRadius:8,border:`1px solid ${isDone?C.okBdr:C.bdrMid}`,
                            backgroundColor:isDone?C.okBg:C.surfAlt,
                            color:isDone?C.okTxt:C.txtMut,
                            cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",
                            flexShrink:0,transition:"all .2s"}}>
                          {isDone?"↩":"✓"}
                        </button>
                      </div>
                    </div>

                    {/* Location hint panel */}
                    {isOpen&&!isDone&&(
                      <div style={{padding:"10px 12px 12px",backgroundColor:C.surfAlt,border:`1px solid ${C.bdrMid}`,borderTop:"none",borderRadius:"0 0 11px 11px",animation:"slideDown .17s cubic-bezier(.4,0,.2,1)"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                          <div style={{fontSize:10,color:C.txtMut,textTransform:"uppercase",letterSpacing:.7}}>📍 {T.storageHint}</div>
                          {!isEditing&&<button onClick={e=>{e.stopPropagation();setEditId(itm.id);setDraft(itm.storageHint||"");}} style={{background:"none",border:"none",color:C.txtMut,cursor:"pointer",fontSize:11}}>✏</button>}
                        </div>
                        {isEditing?(
                          <div onClick={e=>e.stopPropagation()}>
                            <input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){onUpdateHint(itm.id,draft.trim());setEditId(null);}}} placeholder={T.storageHintPlaceholder} style={{width:"100%",padding:"7px 10px",borderRadius:7,border:`1px solid ${C.gold}`,backgroundColor:C.inp,color:C.txt,fontSize:12,fontFamily:"'DM Sans',sans-serif",marginBottom:7}} autoFocus/>
                            <div style={{display:"flex",gap:6}}>
                              <button onClick={()=>{onUpdateHint(itm.id,draft.trim());setEditId(null);}} style={{flex:1,padding:7,borderRadius:7,border:"none",backgroundColor:C.okBg,color:C.okTxt,cursor:"pointer",fontSize:12,fontWeight:700}}>✓ Save</button>
                              <button onClick={()=>setEditId(null)} style={{padding:"7px 11px",borderRadius:7,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:12}}>✕</button>
                            </div>
                          </div>
                        ):(
                          <div style={{padding:"7px 10px",borderRadius:7,backgroundColor:hasHint?C.infoBg:C.surf,border:`1px solid ${hasHint?C.infoBdr:C.bdr}`,color:hasHint?C.infoTxt:C.txtMut,fontSize:12,fontStyle:hasHint?"normal":"italic"}}>
                            {hasHint?itm.storageHint:T.noHint}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </>
      )}
    </div>
  );
}

/* ═══════════════════════ PROFILES VIEW ═════════════════════════════════════ */
function ProfilesView({T,C,themeMode,profiles,activePid,onExport,onImport,onDelete,onRename,onActivate}) {
  const [renId,setRenId]=useState(null); const [renV,setRenV]=useState(""); const [delId,setDelId]=useState(null);
  const dangerBtn={flex:1,padding:10,borderRadius:11,border:"none",background:`linear-gradient(135deg,${C.danger},${C.danger}cc)`,color:C.dangerTxt,cursor:"pointer",fontSize:13,fontWeight:600};
  const cancelBtn={flex:1,padding:10,borderRadius:11,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:13,fontWeight:600};
  return (
    <div style={{flex:1,padding:"18px 15px",overflowY:"auto",backgroundColor:C.appBg}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold,marginBottom:4}}>{T.profilesTitle}</div>
      <div style={{fontSize:11,color:C.txtMut,marginBottom:16}}>{profiles.length}/4</div>
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
        {profiles.map((p,i)=>(
          <div key={p.id} style={{backgroundColor:activePid===p.id?C.goldBg:C.surf,border:`1px solid ${activePid===p.id?C.goldBdr:C.bdr}`,borderRadius:13,padding:13,animation:`fadeUp .18s ease ${i*.07}s both`}}>
            {renId===p.id?(
              <div style={{display:"flex",gap:7,marginBottom:11}}>
                <input value={renV} onChange={e=>setRenV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){onRename(p.id,renV);setRenId(null);}}} style={{flex:1,padding:"6px 9px",borderRadius:7,border:`1px solid ${C.gold}`,backgroundColor:C.inp,color:C.txt,fontSize:13}} autoFocus/>
                <button onClick={()=>{onRename(p.id,renV);setRenId(null);}} style={{padding:"6px 11px",borderRadius:7,border:"none",backgroundColor:C.okBg,color:C.okTxt,cursor:"pointer",fontWeight:700}}>✓</button>
                <button onClick={()=>setRenId(null)} style={{padding:"6px 9px",borderRadius:7,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer"}}>✕</button>
              </div>
            ):(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:activePid===p.id?C.gold:C.txt}}>{p.isDefault?"★ ":""}{p.name}</div>
                  <div style={{fontSize:9,color:C.txtMut,marginTop:2}}>{p.isDefault?T.defaultProfileLabel:"Custom"}{activePid===p.id?` · ${T.activeLabel}`:""}</div>
                </div>
                <button onClick={()=>{setRenId(p.id);setRenV(p.name);}} style={{padding:"4px 9px",borderRadius:7,border:`1px solid ${C.bdr}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:11}}>✏ {T.rename}</button>
              </div>
            )}
            <div style={{display:"flex",gap:6}}>
              {activePid!==p.id&&<button onClick={()=>onActivate(p.id)} style={{flex:1,padding:7,borderRadius:7,border:"none",background:`linear-gradient(135deg,${C.goldDk},${C.gold}bb)`,color:themeMode==="dark"?"#0C0A03":"#FFF8E0",cursor:"pointer",fontSize:11,fontWeight:700}}>{T.activate}</button>}
              <button onClick={()=>onExport(p.id)} style={{flex:1,padding:7,borderRadius:7,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.infoTxt,cursor:"pointer",fontSize:11,fontWeight:600}}>↑ {T.exportProfile}</button>
              {!p.isDefault&&<button onClick={()=>setDelId(p.id)} style={{padding:"7px 10px",borderRadius:7,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.danger,cursor:"pointer",fontSize:12}}>🗑</button>}
            </div>
          </div>
        ))}
      </div>
      {profiles.length<4?<button onClick={onImport} style={{width:"100%",padding:12,borderRadius:12,border:`1px dashed ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>↓ {T.importProfile}</button>:<div style={{textAlign:"center",fontSize:12,color:C.txtMut}}>{T.maxProfiles}</div>}
      {delId&&<Modal C={C} onClose={()=>setDelId(null)}><div style={{fontSize:24,marginBottom:8}}>🗑</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.gold,marginBottom:8}}>{T.deleteProfileTitle}</div><p style={{fontSize:12,color:C.txtMut,marginBottom:18}}>{T.deleteProfileText}</p><div style={{display:"flex",gap:9}}><button onClick={()=>{onDelete(delId);setDelId(null);}} style={dangerBtn}>{T.yesDelete}</button><button onClick={()=>setDelId(null)} style={cancelBtn}>{T.cancel}</button></div></Modal>}
    </div>
  );
}

/* ═══════════════════════ EDIT VIEW ══════════════════════════════════════════ */
function EditView({T,C,inventory,onAddShelf,onRemShelf,onUpdShelf,onAddItm,onRemItm,onUpdItm}) {
  const [expZ,setExpZ]=useState(null); const [expU,setExpU]=useState(null); const [expS,setExpS]=useState(null);
  const [eId,setEId]=useState(null); const [eV,setEV]=useState("");
  const IE=({id,cur,onSave,ph})=>eId===id?(
    <div style={{display:"flex",gap:4,flex:1}}>
      <input value={eV} onChange={e=>setEV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(onSave(eV),setEId(null))} placeholder={ph} style={{flex:1,padding:"3px 7px",borderRadius:5,border:`1px solid ${C.gold}`,backgroundColor:C.inp,color:C.txt,fontSize:11}} autoFocus/>
      <button onClick={()=>{onSave(eV);setEId(null);}} style={{padding:"3px 7px",borderRadius:5,border:"none",backgroundColor:C.okBg,color:C.okTxt,cursor:"pointer",fontSize:10}}>✓</button>
      <button onClick={()=>setEId(null)} style={{padding:"3px 6px",borderRadius:5,border:`1px solid ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:10}}>✕</button>
    </div>
  ):(
    <button onClick={()=>{setEId(id);setEV(cur);}} style={{background:"none",border:"none",color:C.txtMut,cursor:"pointer",fontSize:11,padding:"1px 5px"}}>✏</button>
  );
  const rb={padding:"2px 6px",borderRadius:5,border:`1px solid ${C.danger}40`,backgroundColor:"transparent",color:C.danger,cursor:"pointer",fontSize:10};
  return (
    <div style={{flex:1,padding:"16px 14px",overflowY:"auto",backgroundColor:C.appBg}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold,marginBottom:16}}>{T.editTitle}</div>
      {inventory.map((z,zi)=>{ const th=ZTH[z.theme]["dark"]; return(
        <div key={z.id} style={{backgroundColor:C.surf,borderRadius:13,marginBottom:9,border:`1px solid ${C.bdr}`,overflow:"hidden",animation:`fadeUp .16s ease ${zi*.06}s both`}}>
          <div onClick={()=>setExpZ(p=>p===z.id?null:z.id)} style={{display:"flex",alignItems:"center",padding:"10px 12px",gap:7,cursor:"pointer"}}>
            <span style={{fontSize:10,color:th.acc}}>{expZ===z.id?"▼":"▶"}</span>
            <span style={{fontSize:11}}>{z.icon}</span>
            <span style={{fontSize:12,fontWeight:600,color:C.txt,flex:1}}>{T.zones[z.id]}</span>
          </div>
          {expZ===z.id&&(
            <div style={{borderTop:`1px solid ${C.bdr}`,padding:"7px 11px 11px"}}>
              {z.units.map(u=>(
                <div key={u.id} style={{marginBottom:7,backgroundColor:C.surfAlt,borderRadius:9,border:`1px solid ${C.bdrFaint}`,overflow:"hidden"}}>
                  <div onClick={()=>setExpU(p=>p===u.id?null:u.id)} style={{display:"flex",alignItems:"center",padding:"7px 10px",gap:5,cursor:"pointer"}}>
                    <span style={{fontSize:9,color:C.txtMut}}>{expU===u.id?"▼":"▶"}</span>
                    <span style={{fontSize:11,color:C.txtSub,flex:1}}>{u.name} <span style={{color:C.txtFaint}}>({u.sections.reduce((s,sh)=>s+sh.items.length,0)})</span></span>
                  </div>
                  {expU===u.id&&(
                    <div style={{borderTop:`1px solid ${C.bdrFaint}`,padding:"6px 10px 9px"}}>
                      {u.sections.map(sh=>(
                        <div key={sh.id} style={{marginBottom:7,backgroundColor:C.surf,borderRadius:7,border:`1px solid ${C.bdrFaint}`,overflow:"hidden"}}>
                          <div style={{display:"flex",alignItems:"center",padding:"6px 9px",gap:5}}>
                            <button onClick={()=>setExpS(p=>p===sh.id?null:sh.id)} style={{background:"none",border:"none",color:C.txtMut,cursor:"pointer",fontSize:9}}>{expS===sh.id?"▼":"▶"}</button>
                            <span style={{fontSize:11,color:C.txtSub,flex:1}}>{sh.name} ({sh.items.length})</span>
                            <IE id={`sh_${sh.id}`} cur={sh.name} ph={T.shelfPh} onSave={v=>onUpdShelf(z.id,u.id,sh.id,{name:v})}/>
                            <button onClick={()=>onRemShelf(z.id,u.id,sh.id)} style={rb}>✕</button>
                          </div>
                          {expS===sh.id&&(
                            <div style={{borderTop:`1px solid ${C.bdrFaint}`,padding:"5px 9px 8px"}}>
                              {sh.items.length===0&&<div style={{fontSize:10,color:C.txtFaint,fontStyle:"italic",padding:"3px 0 5px"}}>{T.noItems}</div>}
                              {sh.items.map(itm=>(
                                <div key={itm.id} style={{paddingBottom:8,marginBottom:4,borderBottom:`1px solid ${C.bdrFaint}`}}>
                                  <div style={{display:"flex",alignItems:"center",gap:5,paddingTop:5}}>
                                    <span style={{flex:1,fontSize:11,color:C.txtSub}}>{itm.name}</span>
                                    <input type="number" min="0" value={itm.defaultQty} onChange={e=>onUpdItm(u.id,sh.id,itm.id,{defaultQty:parseInt(e.target.value)||0})} style={{width:38,padding:"2px 3px",borderRadius:4,border:`1px solid ${C.bdrMid}`,backgroundColor:C.inp,color:C.gold,fontSize:10,textAlign:"center"}}/>
                                    <IE id={`i_${itm.id}`} cur={itm.name} ph={T.itemPh} onSave={v=>onUpdItm(u.id,sh.id,itm.id,{name:v})}/>
                                    <button onClick={()=>onRemItm(u.id,sh.id,itm.id)} style={{...rb,fontSize:9,padding:"2px 5px"}}>✕</button>
                                  </div>
                                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}>
                                    <span style={{fontSize:9,color:C.txtMut}}>📍</span>
                                    <input type="text" value={itm.storageHint||""} onChange={e=>onUpdItm(u.id,sh.id,itm.id,{storageHint:e.target.value})} placeholder={T.storageHintPlaceholder} style={{flex:1,padding:"4px 7px",borderRadius:5,border:`1px solid ${C.bdrFaint}`,backgroundColor:C.inp,color:C.infoTxt,fontSize:10,fontFamily:"'DM Sans',sans-serif"}}/>
                                  </div>
                                </div>
                              ))}
                              <button onClick={()=>onAddItm(u.id,sh.id)} style={{marginTop:5,padding:"4px 9px",borderRadius:6,border:`1px dashed ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:10}}>{T.addItem}</button>
                            </div>
                          )}
                        </div>
                      ))}
                      <button onClick={()=>onAddShelf(z.id,u.id)} style={{width:"100%",marginTop:3,padding:6,borderRadius:8,border:`1px dashed ${C.bdrMid}`,backgroundColor:"transparent",color:C.txtMut,cursor:"pointer",fontSize:10}}>{T.addShelf}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );})}
    </div>
  );
}

/* ═══════════════════════ MODAL ══════════════════════════════════════════════ */
function Modal({C,children,onClose}) {
  return (
    <div style={{position:"fixed",inset:0,backgroundColor:C.mBg,display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20,backdropFilter:"blur(5px)"}} onClick={onClose}>
      <div style={{backgroundColor:C.mCard,border:`1px solid ${C.bdrMid}`,borderRadius:18,padding:"22px 18px",maxWidth:295,width:"100%",textAlign:"center",animation:"popIn .17s ease"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
