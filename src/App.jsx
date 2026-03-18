import { useState, useCallback, useRef } from "react";

/* ──────────────────────────────────────────
   DATASET DEFINITIONS
────────────────────────────────────────── */
const DATASETS = {
  street: {
    label: "Street Photography", trigger: "streetlora",
    color: "#e8a84c", icon: "🏙",
    sections: [
      { id: "location", label: "Location", required: true,
        chips: ["Johannesburg CBD","Maboneng Precinct","Soweto","Sandton",
                "Alexandra Township","Newtown","Braamfontein","Hillbrow",
                "Yeoville","Melville","Fordsburg","Diepsloot"] },
      { id: "elements", label: "Street Elements", multi: true,
        chips: ["minibus taxi rank","street vendors","spaza shop","street art / murals",
                "hand-painted signage","informal traders","pedestrian crowds",
                "hawker stalls","children playing","empty street","waste / litter"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday sun","golden hour warm light","overcast diffused",
                "blue hour / dusk","night artificial lighting","dawn / sunrise","dusty haze backlight"] },
      { id: "mood", label: "Mood / Atmosphere",
        chips: ["vibrant and busy","quiet and still","gritty urban energy",
                "warm community feel","chaotic and dynamic","industrial and stark","hopeful","melancholic"] }
    ]
  },
  architecture: {
    label: "Architecture", trigger: "archlora",
    color: "#7eb8d4", icon: "🏛",
    sections: [
      { id: "location", label: "Location / City", required: true,
        chips: ["Johannesburg","Cape Town","Durban","Pretoria","Soweto",
                "Sandton","Lagos","Nairobi","Cairo","Accra"] },
      { id: "style", label: "Architectural Style", required: true, multi: true,
        chips: ["brutalist concrete","colonial","modernist","art deco","vernacular",
                "industrial warehouse","RDP / social housing","corrugated iron",
                "glass curtain wall","heritage / Victorian"] },
      { id: "materials", label: "Primary Materials", multi: true,
        chips: ["exposed concrete","red brick","painted plaster","steel and glass",
                "corrugated iron","clay / earth","timber","stone","terracotta tiles"] },
      { id: "condition", label: "Building Condition",
        chips: ["pristine / new","well maintained","weathered patina",
                "decaying / abandoned","under construction","repurposed / adaptive reuse"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday sun","golden hour","soft overcast","dramatic shadow",
                "blue hour","night / artificial","interior natural light"] },
      { id: "mood", label: "Mood",
        chips: ["monumental","intimate","derelict","utopian","organic","oppressive","serene"] }
    ]
  },
  portraiture: {
    label: "Portraiture", trigger: "portraitlora",
    color: "#c47eb5", icon: "🧑",
    sections: [
      { id: "setting", label: "Setting / Environment", required: true,
        chips: ["outdoor street","market / informal","indoor natural light",
                "studio","workplace","home interior","township","urban rooftop","rural"] },
      { id: "subject", label: "Subject", multi: true,
        chips: ["elderly person","young adult","child","group of people",
                "vendor / trader","artist","community leader","worker"] },
      { id: "expression", label: "Expression / Emotion",
        chips: ["candid unaware","direct eye contact","laughing / joyful",
                "pensive / reflective","stern","intimate","proud"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["soft window light","harsh sun","golden hour","studio strobe",
                "backlit silhouette","ambient indoor","overcast flat","mixed available"] },
      { id: "framing", label: "Framing",
        chips: ["close-up face","head and shoulders","half body","full body","environmental portrait"] },
      { id: "mood", label: "Mood",
        chips: ["intimate","powerful","documentary","editorial","raw / unpolished","dignified","playful"] }
    ]
  },
  market: {
    label: "Markets & Informal Economy", trigger: "marketlora",
    color: "#7ed49a", icon: "🛒",
    sections: [
      { id: "location", label: "Location", required: true,
        chips: ["Johannesburg CBD","Warwick Market Durban","Cape Town CBD","Soweto",
                "Alexandra","Pretoria","Rural roadside","Township market"] },
      { id: "goods", label: "Goods / Trade", multi: true,
        chips: ["fresh produce","clothing and fabrics","street food","electronics",
                "traditional medicine / muthi","hardware","crafts and art","second-hand goods"] },
      { id: "crowd", label: "Crowd Density",
        chips: ["empty / slow","sparse","moderate","dense and busy","extremely crowded"] },
      { id: "lighting", label: "Lighting", required: true,
        chips: ["harsh midday","golden hour","overcast","artificial market lights","covered / shaded"] },
      { id: "mood", label: "Mood",
        chips: ["vibrant and colourful","chaotic energy","orderly","intimate","gritty","festive"] }
    ]
  },
  landscape: {
    label: "Landscape & Environment", trigger: "landscapelora",
    color: "#a8c47e", icon: "🌍",
    sections: [
      { id: "region", label: "Region / Biome", required: true,
        chips: ["Highveld grassland","Bushveld / savanna","Karoo semi-desert",
                "Drakensberg mountains","Coastal / Indian Ocean","Township periphery",
                "Peri-urban sprawl","Mine dumps Joburg"] },
      { id: "terrain", label: "Terrain Features", multi: true,
        chips: ["flat grassland","rocky outcrop","mine dump","informal settlement edge",
                "industrial zone","wetland","road / highway","open sky dominant"] },
      { id: "time", label: "Time of Day", required: true,
        chips: ["sunrise / dawn","morning","midday","afternoon","golden hour","sunset","blue hour","night"] },
      { id: "weather", label: "Weather / Atmosphere",
        chips: ["clear blue sky","dramatic clouds","overcast grey","haze / smog",
                "dust storm","rain / wet","storm approaching","fog / mist"] },
      { id: "mood", label: "Mood",
        chips: ["vast and open","intimate","harsh","lyrical","melancholic","hopeful","raw"] }
    ]
  }
};

/* ── Helpers ── */
const emptyState = (dsKey) => {
  const ds = DATASETS[dsKey];
  const obj = { _dataset: dsKey };
  ds.sections.forEach(s => {
    obj[s.id] = s.multi ? [] : "";
    obj[`${s.id}_other`] = "";
    obj[`${s.id}_other_on`] = false;
  });
  obj.notes = "";
  return obj;
};

const assembleCaption = (state) => {
  if (!state) return "";
  const ds = DATASETS[state._dataset];
  const parts = [ds.trigger];
  ds.sections.forEach(s => {
    if (s.multi) parts.push(...(state[s.id] || []));
    else if (state[s.id]) parts.push(state[s.id]);
    if (state[`${s.id}_other_on`] && state[`${s.id}_other`]?.trim())
      parts.push(state[`${s.id}_other`].trim());
  });
  if (state.notes?.trim()) parts.push(state.notes.trim());
  return parts.filter(Boolean).join(", ");
};

const isDone = (state) => {
  if (!state) return false;
  const ds = DATASETS[state._dataset];
  return ds.sections.filter(s => s.required).every(s => {
    const val = state[s.id];
    const other = state[`${s.id}_other_on`] && state[`${s.id}_other`]?.trim();
    return other || (s.multi ? val?.length > 0 : !!val);
  });
};

/* ── CSS ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .upload-screen {
    height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: #0f0e0e; border: 2px dashed #1e1c1a;
    cursor: pointer; font-family: 'Syne', sans-serif; gap: 10px;
    transition: border-color .2s, background .2s;
  }
  .upload-screen.drag-over { border-color: #e8a84c; background: #131110; }
  .upload-icon { font-size: 48px; line-height: 1; }
  .upload-title { font-size: 24px; font-weight: 800; color: #e8dfd4; }
  .upload-sub { font-size: 12px; color: #403830; }
  .upload-note {
    margin-top: 4px; font-size: 11px; color: #2c2820;
    border: 1px solid #1a1917; padding: 6px 14px; border-radius: 20px;
  }

  .app {
    font-family: 'Syne', sans-serif; background: #0f0e0e;
    color: #e8dfd4; height: 100vh; overflow: hidden;
    display: flex; flex-direction: column;
  }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 16px; border-bottom: 1px solid #1a1917;
    background: #0f0e0e; flex-shrink: 0; gap: 12px;
  }
  .logo { font-size: 14px; font-weight: 800; color: #e8dfd4; letter-spacing: -.02em; white-space: nowrap; }
  .logo span { color: #e8a84c; }
  .hdr-mid { display: flex; align-items: center; gap: 10px; flex: 1; justify-content: center; }
  .progress-text { font-size: 11px; color: #403830; white-space: nowrap; }
  .progress-bar-bg { width: 90px; height: 3px; background: #1a1917; border-radius: 3px; }
  .progress-bar-fill { height: 100%; border-radius: 3px; transition: width .3s; }
  .hdr-right { display: flex; gap: 7px; align-items: center; }
  .add-btn {
    padding: 5px 10px; background: transparent; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 5px; font-family: 'Syne', sans-serif;
    font-size: 11px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .add-btn:hover { border-color: #504840; color: #e8dfd4; }
  .dl-btn {
    padding: 5px 13px; background: #e8a84c; border: none; color: #111;
    border-radius: 5px; font-family: 'Syne', sans-serif; font-size: 11px;
    font-weight: 800; cursor: pointer; transition: background .15s; white-space: nowrap;
  }
  .dl-btn:hover:not(:disabled) { background: #f0bc6a; }
  .dl-btn:disabled { opacity: .4; cursor: not-allowed; }

  .body { flex: 1; min-height: 0; display: flex; overflow: hidden; }

  .img-panel {
    width: 52%; display: flex; flex-direction: column;
    border-right: 1px solid #1a1917; overflow: hidden;
  }
  .img-wrap {
    flex: 1; min-height: 0; display: flex;
    align-items: center; justify-content: center;
    background: #080707; overflow: hidden;
  }
  .main-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
  .img-footer {
    padding: 7px 13px; border-top: 1px solid #1a1917;
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .img-name {
    font-size: 10px; color: #2c2820; font-family: 'JetBrains Mono', monospace;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;
  }
  .img-nav { display: flex; align-items: center; gap: 7px; }
  .nav-btn {
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #e8dfd4; border-radius: 4px; font-family: 'Syne', sans-serif;
    font-size: 11px; cursor: pointer; transition: all .15s;
  }
  .nav-btn:hover:not(:disabled) { border-color: #e8a84c; color: #e8a84c; }
  .nav-btn:disabled { opacity: .2; cursor: default; }
  .nav-count { font-size: 11px; color: #403830; white-space: nowrap; }

  .ds-bar {
    padding: 8px 13px; border-bottom: 1px solid #1a1917;
    display: flex; gap: 5px; align-items: center; flex-shrink: 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .ds-bar::-webkit-scrollbar { display: none; }
  .ds-bar-label {
    font-size: 9px; color: #403830; white-space: nowrap;
    font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin-right: 2px;
  }
  .ds-chip {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .ds-chip:hover { border-color: #504840; color: #e8dfd4; }

  .form-panel { width: 48%; display: flex; flex-direction: column; overflow: hidden; }
  .form-scroll {
    flex: 1; min-height: 0; overflow-y: auto;
    padding: 14px; display: flex; flex-direction: column; gap: 14px;
    scrollbar-width: thin; scrollbar-color: #1e1c1a transparent;
  }

  .field { display: flex; flex-direction: column; gap: 7px; }
  .label {
    font-size: 9px; font-weight: 700; color: #504840;
    text-transform: uppercase; letter-spacing: .1em;
    display: flex; align-items: center; gap: 5px;
  }
  .req { font-size: 10px; }
  .multi-hint { font-size: 9px; color: #2c2820; font-weight: 400; text-transform: none; letter-spacing: 0; }
  .done-badge {
    margin-left: auto; display: inline-flex; align-items: center; gap: 3px;
    font-size: 9px; color: #5aaa7a; padding: 1px 6px;
    background: rgba(90,170,122,.08); border: 1px solid rgba(90,170,122,.2);
    border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
  }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; }
  .chip {
    padding: 4px 9px; background: #131110; border: 1px solid #1e1c1a;
    color: #403830; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s; line-height: 1.5;
  }
  .chip:hover { border-color: #504840; color: #e8dfd4; }
  .other-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .other-toggle {
    padding: 4px 9px; background: #131110; border: 1px dashed #252320;
    color: #2c2820; border-radius: 20px; font-family: 'Syne', sans-serif;
    font-size: 10px; cursor: pointer; transition: all .15s;
    line-height: 1.5; white-space: nowrap; flex-shrink: 0;
  }
  .other-toggle:hover { border-color: #504840; color: #e8dfd4; }
  .other-input {
    flex: 1; background: #131110; border: 1px solid #1e1c1a; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 5px 9px; outline: none; transition: border-color .15s; min-width: 0;
  }
  .other-input:focus { border-color: #e8a84c; }
  .notes-input {
    background: #131110; border: 1px solid #1a1917; color: #e8dfd4;
    border-radius: 6px; font-family: 'Syne', sans-serif; font-size: 11px;
    padding: 7px 10px; outline: none; transition: border-color .15s;
    resize: none; line-height: 1.6; width: 100%;
  }
  .notes-input:focus { border-color: #e8a84c; }
  .divider { border: none; border-top: 1px solid #1a1917; }

  .preview {
    background: #080707; border: 1px solid #1a1917;
    border-radius: 7px; padding: 11px;
  }
  .preview-label {
    font-size: 8px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .12em; margin-bottom: 7px;
  }
  .preview-text {
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    color: #605040; line-height: 1.8; word-break: break-all;
  }
  .preview-text .trigger { font-weight: 600; }

  .thumb-strip {
    display: flex; gap: 4px; padding: 6px 10px;
    background: #080707; border-top: 1px solid #1a1917;
    overflow-x: auto; flex-shrink: 0;
    scrollbar-width: thin; scrollbar-color: #1e1c1a transparent;
    height: 62px; align-items: center;
  }
  .thumb {
    position: relative; flex-shrink: 0; width: 48px; height: 48px;
    border-radius: 4px; overflow: hidden; border: 2px solid transparent;
    cursor: pointer; background: #131110; padding: 0; transition: border-color .15s;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumb:hover { border-color: #504840; }
  .done-dot {
    position: absolute; bottom: 2px; right: 2px;
    width: 13px; height: 13px; background: #5aaa7a;
    color: white; border-radius: 50%; font-size: 7px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; line-height: 1;
  }
`;

/* ── Chip Section Component ── */
function ChipSection({ section, state, update, accent }) {
  const val = state[section.id];
  const otherOn = !!state[`${section.id}_other_on`];
  const otherText = state[`${section.id}_other`] || "";

  const isOn = (chip) => section.multi ? (val || []).includes(chip) : val === chip;

  const toggle = (chip) => {
    if (section.multi) {
      const arr = val || [];
      update(section.id, arr.includes(chip) ? arr.filter(v => v !== chip) : [...arr, chip]);
    } else {
      update(section.id, val === chip ? "" : chip);
    }
  };

  const sectionDone = (() => {
    const other = otherOn && otherText.trim();
    return other || (section.multi ? (val || []).length > 0 : !!val);
  })();

  return (
    <div className="field">
      <label className="label">
        {section.label}
        {section.required && <span className="req" style={{ color: accent }}>*</span>}
        {section.multi && <span className="multi-hint">— select all that apply</span>}
        {section.required && sectionDone && (
          <span className="done-badge">✓</span>
        )}
      </label>

      <div className="chips">
        {section.chips.map(chip => (
          <button
            key={chip}
            className="chip"
            style={isOn(chip) ? {
              background: accent + "20",
              borderColor: accent,
              color: accent,
              fontWeight: 700
            } : {}}
            onClick={() => toggle(chip)}
          >{chip}</button>
        ))}
      </div>

      {/* Other row — always visible */}
      <div className="other-row">
        <button
          className="other-toggle"
          style={otherOn ? { borderStyle: "solid", borderColor: accent + "55", color: accent } : {}}
          onClick={() => update(`${section.id}_other_on`, !otherOn)}
        >+ other</button>
        {otherOn && (
          <input
            className="other-input"
            style={otherText ? { borderColor: accent + "50" } : {}}
            placeholder={`Describe custom ${section.label.toLowerCase()}…`}
            value={otherText}
            onChange={e => update(`${section.id}_other`, e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

/* ── Caption Preview ── */
function CaptionPreview({ state, accent }) {
  const full = assembleCaption(state);
  const trigger = DATASETS[state._dataset].trigger;
  const rest = full.slice(trigger.length);
  return (
    <div className="preview">
      <div className="preview-label" style={{ color: accent }}>
        Generated caption · training-ready .txt
      </div>
      <div className="preview-text">
        {full && full !== trigger
          ? <><span className="trigger" style={{ color: accent }}>{trigger}</span>{rest}</>
          : <span style={{ color: "#252320" }}>Fill in the fields above…</span>
        }
      </div>
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [images, setImages] = useState([]);
  const [caps, setCaps] = useState({});
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();

  const addFiles = useCallback(files => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    setImages(prev => {
      const names = new Set(prev.map(i => i.name));
      return [...prev, ...imgs
        .filter(f => !names.has(f.name))
        .map(f => ({ file: f, url: URL.createObjectURL(f), name: f.name }))];
    });
  }, []);

  const state = caps[idx] || emptyState("street");
  const accent = DATASETS[state._dataset]?.color || "#e8a84c";

  const update = (field, val) =>
    setCaps(p => ({ ...p, [idx]: { ...(p[idx] || emptyState("street")), [field]: val } }));

  const setDataset = (dsKey) =>
    setCaps(p => ({ ...p, [idx]: emptyState(dsKey) }));

  const doneCount = images.filter((_, i) => isDone(caps[i])).length;
  const pct = images.length ? (doneCount / images.length) * 100 : 0;

  const download = async () => {
    setBusy(true);
    try {
      await new Promise(res => {
        if (window.JSZip) return res();
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload = res; document.head.appendChild(s);
      });
      const zip = new window.JSZip();
      // Group by dataset trigger for separate Kohya folders
      const groups = {};
      for (let i = 0; i < images.length; i++) {
        const cap = caps[i] || emptyState("street");
        const trigger = DATASETS[cap._dataset].trigger;
        if (!groups[trigger]) groups[trigger] = [];
        groups[trigger].push({ img: images[i], cap });
      }
      for (const [trigger, items] of Object.entries(groups)) {
        const folder = zip.folder(`dataset/img/10_${trigger}`);
        for (const { img, cap } of items) {
          const base = img.name.replace(/\.[^.]+$/, "");
          folder.file(img.name, img.file);
          folder.file(`${base}.txt`, assembleCaption(cap));
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), download: "lora_dataset.zip"
      }).click();
    } finally { setBusy(false); }
  };

  /* Upload Screen */
  if (!images.length) return (
    <>
      <style>{CSS}</style>
      <div
        className={`upload-screen${drag ? " drag-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current.click()}
      >
        <input ref={fileRef} type="file" multiple accept="image/*"
          style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        <div className="upload-icon">🗂</div>
        <div className="upload-title">Drop your images here</div>
        <div className="upload-sub">Street · Architecture · Portraiture · Markets · Landscape</div>
        <div className="upload-note">JPG · PNG · WEBP · Drop all at once</div>
      </div>
    </>
  );

  const ds = DATASETS[state._dataset];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        <header className="header">
          <span className="logo">LoRA <span>Captioner</span></span>
          <div className="hdr-mid">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: accent }} />
            </div>
            <span className="progress-text">{doneCount} / {images.length} captioned</span>
          </div>
          <div className="hdr-right">
            <button className="add-btn" onClick={() => fileRef.current.click()}>+ Add images</button>
            <button className="dl-btn" onClick={download} disabled={busy}>
              {busy ? "Packing…" : "⬇ Download ZIP"}
            </button>
          </div>
          <input ref={fileRef} type="file" multiple accept="image/*"
            style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
        </header>

        <div className="body">

          {/* Image Panel */}
          <div className="img-panel">
            <div className="img-wrap">
              <img src={images[idx].url} alt={images[idx].name} className="main-img" />
            </div>
            <div className="img-footer">
              <span className="img-name">{images[idx].name}</span>
              <div className="img-nav">
                <button className="nav-btn" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}>← Prev</button>
                <span className="nav-count">{idx + 1} / {images.length}</span>
                <button className="nav-btn" onClick={() => setIdx(i => Math.min(images.length - 1, i + 1))} disabled={idx === images.length - 1}>Next →</button>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="form-panel">

            {/* Dataset type picker */}
            <div className="ds-bar">
              <span className="ds-bar-label">Type:</span>
              {Object.entries(DATASETS).map(([key, d]) => (
                <button
                  key={key}
                  className="ds-chip"
                  style={state._dataset === key ? {
                    background: d.color + "18", borderColor: d.color,
                    color: d.color, fontWeight: 700
                  } : {}}
                  onClick={() => setDataset(key)}
                >{d.icon} {d.label}</button>
              ))}
            </div>

            <div className="form-scroll">
              {ds.sections.map((section, i) => (
                <div key={section.id}>
                  <ChipSection section={section} state={state} update={update} accent={accent} />
                  {i < ds.sections.length - 1 && <hr className="divider" style={{ marginTop: 12 }} />}
                </div>
              ))}

              {/* Notes */}
              <div className="field">
                <label className="label">Additional details</label>
                <textarea
                  className="notes-input"
                  rows={2}
                  placeholder="Anything specific: sign text, landmark names, cultural context, photographer notes…"
                  value={state.notes || ""}
                  onChange={e => update("notes", e.target.value)}
                />
              </div>

              <CaptionPreview state={state} accent={accent} />
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="thumb-strip">
          {images.map((img, i) => (
            <button
              key={img.name + i}
              className="thumb"
              style={i === idx ? { borderColor: accent } : {}}
              onClick={() => setIdx(i)}
              title={img.name}
            >
              <img src={img.url} alt="" />
              {isDone(caps[i]) && <span className="done-dot">✓</span>}
            </button>
          ))}
        </div>

      </div>
    </>
  );
}
