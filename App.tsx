
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { jsPDF } from "jspdf";
import { Language, LANGS, PAPER_DATA, UNIT_CONV, Translations } from './types';

const App: React.FC = () => {
  // --- State ---
  const [langCode, setLangCode] = useState<Language>('en');
  const [unit, setUnit] = useState<string>('cm');
  const [image, setImage] = useState<{ url: string; width: number; height: number; dpi: number } | null>(null);
  const [paperName, setPaperName] = useState<string>('A4');
  const [orientation, setOrientation] = useState<'port' | 'land'>('port');
  const [customPaper, setCustomPaper] = useState({ w: 21, h: 29.7 });
  const [margins, setMargins] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  
  const [marginInputs, setMarginInputs] = useState({ 
    top: '', bottom: '', left: '', right: '' 
  });

  const [sizeMode, setSizeMode] = useState<'res' | 'total' | 'pages' | 'perc'>('res');
  const [totalSize, setTotalSize] = useState({ w: 100, h: 100 });
  const [pagesCount, setPagesCount] = useState({ w: 2, h: 2 });
  const [percentage, setPercentage] = useState(100);
  const [alignment, setAlignment] = useState<string>('TL');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPaperMenu, setShowPaperMenu] = useState(false);
  const [modal, setModal] = useState<{ title: string; message: string; show: boolean } | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const t: Translations = LANGS[langCode];
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Resize Observer para canvas dinâmico ---
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sysLang = navigator.language.toLowerCase();
    if (sysLang.startsWith('pt')) setLangCode('pt');
    else if (sysLang.startsWith('es')) setLangCode('es');
    else setLangCode('en');
  }, []);

  useEffect(() => {
    setMargins({
      top: parseFloat(marginInputs.top) || 0,
      bottom: parseFloat(marginInputs.bottom) || 0,
      left: parseFloat(marginInputs.left) || 0,
      right: parseFloat(marginInputs.right) || 0,
    });
  }, [marginInputs]);

  const getPaperDims = useCallback(() => {
    let [pw, ph] = paperName === 'Custom' ? [customPaper.w * 10, customPaper.h * 10] : PAPER_DATA[paperName];
    if (orientation === 'land') [pw, ph] = [ph, pw];
    return [pw, ph];
  }, [paperName, customPaper, orientation]);

  useEffect(() => {
    if (image) {
      const [pw, ph] = getPaperDims();
      const mt = margins.top * 10, mb = margins.bottom * 10, ml = margins.left * 10, mr = margins.right * 10;
      const utilW = Math.max(1, pw - ml - mr);
      const utilH = Math.max(1, ph - mt - mb);
      const tw = (image.width / image.dpi) * 25.4;
      const th = (image.height / image.dpi) * 25.4;
      const cols = Math.ceil(tw / utilW);
      const rows = Math.ceil(th / utilH);

      setPagesCount({ w: Math.max(1, cols), h: Math.max(1, rows) });
      const conv = UNIT_CONV[unit];
      setTotalSize({
        w: Number((tw / conv).toFixed(1)),
        h: Number((th / conv).toFixed(1))
      });
    }
  }, [image, getPaperDims, margins, unit]);

  const handleMarginChange = (key: keyof typeof marginInputs, val: string) => {
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      setMarginInputs(prev => ({ ...prev, [key]: val }));
    }
  };

  const calculatePosterDims = useCallback(() => {
    if (!image) return { tw: 0, th: 0, cols: 1, rows: 1, utilW: 0, utilH: 0, pw: 0, ph: 0 };
    const [pw, ph] = getPaperDims();
    const conv = UNIT_CONV[unit];
    const mt = margins.top * 10, mb = margins.bottom * 10, ml = margins.left * 10, mr = margins.right * 10;
    const utilW = Math.max(1, pw - ml - mr);
    const utilH = Math.max(1, ph - mt - mb);
    const aspect = image.width / image.height;

    let tw = 0, th = 0;
    if (sizeMode === 'pages') {
      const targetW = pagesCount.w * utilW;
      const targetH = pagesCount.h * utilH;
      if (targetW / aspect <= targetH) {
        tw = targetW; th = targetW / aspect;
      } else {
        th = targetH; tw = targetH * aspect;
      }
    } else if (sizeMode === 'total') {
      const reqW = totalSize.w * conv;
      const reqH = totalSize.h * conv;
      if (reqW / aspect <= reqH) {
        tw = reqW; th = reqW / aspect;
      } else {
        th = reqH; tw = reqH * aspect;
      }
    } else if (sizeMode === 'res') {
      tw = (image.width / image.dpi) * 25.4;
      th = (image.height / image.dpi) * 25.4;
    } else if (sizeMode === 'perc') {
      const baseW = (image.width / image.dpi) * 25.4;
      const baseH = (image.height / image.dpi) * 25.4;
      tw = baseW * (percentage / 100);
      th = baseH * (percentage / 100);
    }

    const cols = Math.ceil(tw / utilW);
    const rows = Math.ceil(th / utilH);
    return { tw, th, cols: Math.max(1, cols), rows: Math.max(1, rows), utilW, utilH, pw, ph };
  }, [image, getPaperDims, unit, margins, sizeMode, totalSize, pagesCount, percentage]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !image || containerSize.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { tw, th, cols, rows, utilW, utilH, pw, ph } = calculatePosterDims();
    const displayCols = sizeMode === 'pages' ? pagesCount.w : cols;
    const displayRows = sizeMode === 'pages' ? pagesCount.h : rows;
    const totalGridW = displayCols * pw;
    const totalGridH = displayRows * ph;

    const padding = 40; 
    const availableW = containerSize.width - padding * 2;
    const availableH = containerSize.height - padding * 2;
    const scale = Math.min(availableW / totalGridW, availableH / totalGridH);

    canvas.width = containerSize.width;
    canvas.height = containerSize.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startX = (canvas.width - totalGridW * scale) / 2;
    const startY = (canvas.height - totalGridH * scale) / 2;

    const mt = margins.top * 10;
    const mb = margins.bottom * 10;
    const ml = margins.left * 10;
    const mr = margins.right * 10;

    let offX = 0, offY = 0;
    const totalContentW = displayCols * utilW;
    const totalContentH = displayRows * utilH;
    
    if (alignment.includes('C')) offX = Math.max(0, (totalContentW - tw) / 2);
    else if (alignment.includes('R')) offX = Math.max(0, (totalContentW - tw));
    if (['ML', 'C', 'MR'].includes(alignment)) offY = Math.max(0, (totalContentH - th) / 2);
    else if (alignment.startsWith('B')) offY = Math.max(0, (totalContentH - th));

    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 40;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.fillRect(startX, startY, totalGridW * scale, totalGridH * scale);
    ctx.shadowBlur = 0;

    const imgObj = new Image();
    imgObj.src = image.url;
    imgObj.onload = () => {
      ctx.save();
      ctx.beginPath();
      for (let r = 0; r < displayRows; r++) {
        for (let c = 0; c < displayCols; c++) {
          const ux = startX + (c * pw + ml) * scale;
          const uy = startY + (r * ph + mt) * scale;
          ctx.rect(ux, uy, utilW * scale, utilH * scale);
        }
      }
      ctx.clip();
      
      const imgStartX = startX + ml * scale + offX * scale;
      const imgStartY = startY + mt * scale + offY * scale;
      ctx.drawImage(imgObj, imgStartX, imgStartY, tw * scale, th * scale);
      ctx.restore();

      // Desenhar bordas físicas do papel (Linha preta sólida)
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.setLineDash([]);
      for (let c = 0; c <= displayCols; c++) {
        const lx = startX + c * pw * scale;
        ctx.beginPath(); ctx.moveTo(lx, startY); ctx.lineTo(lx, startY + totalGridH * scale); ctx.stroke();
      }
      for (let r = 0; r <= displayRows; r++) {
        const ly = startY + r * ph * scale;
        ctx.beginPath(); ctx.moveTo(startX, ly); ctx.lineTo(startX + totalGridW * scale, ly); ctx.stroke();
      }

      // NOVO: Desenhar MARGENS INTERNAS (Linha tracejada cinza)
      ctx.strokeStyle = '#888888';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]); // Define o estilo tracejado
      for (let r = 0; r < displayRows; r++) {
        for (let c = 0; c < displayCols; c++) {
          const pageX = startX + (c * pw) * scale;
          const pageY = startY + (r * ph) * scale;
          
          // Desenha o retângulo da margem interna para cada folha
          ctx.strokeRect(
            pageX + ml * scale, 
            pageY + mt * scale, 
            utilW * scale, 
            utilH * scale
          );
        }
      }

      // Desenhar Limite da Imagem (Linha tracejada verde)
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(imgStartX, imgStartY, tw * scale, th * scale);
      ctx.setLineDash([]);
    };
  }, [image, calculatePosterDims, alignment, margins, sizeMode, pagesCount, containerSize]);

  const handleLoadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage({ url: event.target?.result as string, width: img.width, height: img.height, dpi: 72 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePDF = async () => {
    if (!image) return;
    const { tw, th, cols, rows, utilW, utilH, pw, ph } = calculatePosterDims();
    const totalImageAreaW = cols * utilW;
    const totalImageAreaH = rows * utilH;
    let offX = 0, offY = 0;
    if (alignment.includes('C')) offX = (totalImageAreaW - tw) / 2;
    else if (alignment.includes('R')) offX = (totalImageAreaW - tw);
    if (['ML', 'C', 'MR'].includes(alignment)) offY = (totalImageAreaH - th) / 2;
    else if (alignment.startsWith('B')) offY = (totalImageAreaH - th);
    const doc = new jsPDF({
      orientation: orientation === 'port' ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pw, ph]
    });
    let pagesAdded = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (pagesAdded > 0) doc.addPage([pw, ph], orientation === 'port' ? 'portrait' : 'landscape');
        const xPos = (margins.left * 10) + offX - (c * utilW);
        const yPos = (margins.top * 10) + offY - (r * utilH);
        doc.addImage(image.url, 'JPEG', xPos, yPos, tw, th);
        doc.setFillColor(255, 255, 255);
        if (margins.top > 0) doc.rect(0, 0, pw, margins.top * 10, 'F');
        if (margins.bottom > 0) doc.rect(0, ph - (margins.bottom * 10), pw, margins.bottom * 10, 'F');
        if (margins.left > 0) doc.rect(0, 0, margins.left * 10, ph, 'F');
        if (margins.right > 0) doc.rect(pw - (margins.right * 10), 0, margins.right * 10, ph, 'F');
        pagesAdded++;
      }
    }
    doc.save(`poster_${Date.now()}.pdf`);
    setModal({ title: t.success, message: t.pdf_success.replace('{}', pagesAdded.toString()), show: true });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen overflow-hidden bg-[#0a0a0a]">
      {/* ÁREA DE PREVIEW (ESQUERDA) */}
      <div ref={containerRef} className="flex-1 h-full relative overflow-hidden bg-[#000000] flex items-center justify-center">
        {image ? (
          <>
            <canvas ref={previewCanvasRef} className="block transition-opacity duration-300" />
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 text-xs font-bold text-[#2ecc71] shadow-2xl z-10 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="opacity-40 uppercase text-[9px] tracking-tighter">{t.pages_txt}</span>
                <span className="text-lg">{calculatePosterDims().cols * calculatePosterDims().rows}</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10"></div>
              <div className="flex flex-col">
                <span className="opacity-40 uppercase text-[9px] tracking-tighter">Total Size</span>
                <span className="text-lg">{Math.round(calculatePosterDims().tw/10)}x{Math.round(calculatePosterDims().th/10)} cm</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center opacity-10 flex flex-col items-center">
            <i className="fa-solid fa-images text-[12rem] text-white"></i>
            <p className="text-3xl font-black uppercase tracking-[0.5em] text-white mt-8">{t.load}</p>
          </div>
        )}
      </div>

      {/* BARRA LATERAL (DIREITA) */}
      <div className="w-full md:w-[400px] h-full overflow-y-auto bg-[#141414] border-l border-white/5 p-6 space-y-6 shrink-0 z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-black tracking-tighter text-white">POSTER<span className="text-[#2ecc71]">FORGE</span></h1>
          <button onClick={() => setShowPreferences(!showPreferences)} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-[#2ecc71] hover:rotate-90 active:scale-90" title={t.pref}>
            <i className="fa-solid fa-gear text-xl"></i>
          </button>
        </div>

        {showPreferences && (
          <div className="bg-[#1e1e1e] p-5 rounded-3xl border border-white/10 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div>
              <label className="block text-xs font-black uppercase mb-2 opacity-50 tracking-widest">{t.unit}</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full bg-[#252525] border border-white/5 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-[#2ecc71]/20">
                {Object.keys(UNIT_CONV).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-2 opacity-50 tracking-widest">{t.lang}</label>
              <select value={langCode} onChange={(e) => setLangCode(e.target.value as Language)} className="w-full bg-[#252525] border border-white/5 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-[#2ecc71]/20">
                {Object.keys(LANGS).map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="block w-full bg-[#2ecc71] hover:bg-[#27ae60] text-center py-5 rounded-[2rem] font-black cursor-pointer transition-all shadow-lg text-white hover:scale-[1.02] active:scale-95 text-sm tracking-widest uppercase">
            <i className="fa-solid fa-folder-open mr-2"></i> {t.load}
            <input type="file" className="hidden" accept="image/*" onChange={handleLoadImage} />
          </label>
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.2em] opacity-40">{t.formato}</h3>
          <div className="relative">
            <button onClick={() => setShowPaperMenu(!showPaperMenu)} className="w-full bg-[#1e1e1e] text-left p-5 rounded-3xl flex justify-between items-center border border-white/5 hover:border-[#2ecc71]/40 text-white transition-all shadow-xl">
              <span className="truncate font-bold">
                {paperName === 'Custom' ? t.custom : paperName} 
                &nbsp; <span className="opacity-30 text-xs font-normal">({(getPaperDims()[0] / 10).toFixed(1)} x {(getPaperDims()[1] / 10).toFixed(1)} cm)</span>
              </span>
              <i className={`fa-solid fa-chevron-down text-[#2ecc71] shrink-0 ml-2 transition-transform duration-300 ${showPaperMenu ? 'rotate-180' : ''}`}></i>
            </button>
            {showPaperMenu && (
              <div className="absolute top-full left-0 w-full bg-[#1e1e1e] border border-white/10 rounded-[2rem] mt-3 z-50 max-h-80 overflow-y-auto shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-2 space-y-1 animate-in fade-in zoom-in-95">
                {Object.entries(PAPER_DATA).map(([name, dims]) => (
                  <div key={name} className="p-4 hover:bg-[#2ecc71] hover:text-white rounded-2xl cursor-pointer transition-colors group" onClick={() => { setPaperName(name); setShowPaperMenu(false); }}>
                    <div className="font-black text-sm uppercase">{name === 'Custom' ? t.custom : name}</div>
                    <div className="text-[10px] opacity-50 group-hover:opacity-100">
                      {name === 'Custom' ? '' : `${(dims[0]/10).toFixed(1)} x ${(dims[1]/10).toFixed(1)} cm`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {paperName === 'Custom' && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
            <div>
              <label className="text-[10px] mb-2 block text-white/30 font-black uppercase tracking-widest">{t.width_cm}</label>
              <input type="number" step="0.1" value={customPaper.w} onChange={e => setCustomPaper({...customPaper, w: +e.target.value})} className="w-full bg-[#1e1e1e] border border-white/5 p-4 rounded-3xl text-white outline-none focus:ring-2 ring-[#2ecc71]/20 font-bold" />
            </div>
            <div>
              <label className="text-[10px] mb-2 block text-white/30 font-black uppercase tracking-widest">{t.height_cm}</label>
              <input type="number" step="0.1" value={customPaper.h} onChange={e => setCustomPaper({...customPaper, h: +e.target.value})} className="w-full bg-[#1e1e1e] border border-white/5 p-4 rounded-3xl text-white outline-none focus:ring-2 ring-[#2ecc71]/20 font-bold" />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setOrientation('port')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${orientation === 'port' ? 'bg-white text-black shadow-lg scale-105' : 'bg-[#1e1e1e] text-white/20 hover:text-white/40'}`}>
            <i className="fa-solid fa-file mr-2"></i> {t.port}
          </button>
          <button onClick={() => setOrientation('land')} className={`flex-1 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${orientation === 'land' ? 'bg-white text-black shadow-lg scale-105' : 'bg-[#1e1e1e] text-white/20 hover:text-white/40'}`}>
            <i className="fa-solid fa-image mr-2"></i> {t.land}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.2em] opacity-40">{t.m_label}</h3>
          <div className="flex flex-col items-center bg-[#1e1e1e] p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
            <div className="w-24 mb-3">
              <input type="number" step="0.1" value={marginInputs.top} placeholder="0" onChange={e => handleMarginChange('top', e.target.value)} className="w-full bg-black/40 p-3 rounded-2xl text-center text-xs font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" />
              <span className="block text-[9px] text-white/20 text-center mt-2 font-black uppercase tracking-tighter">{t.m_sup}</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="w-20">
                <input type="number" step="0.1" value={marginInputs.left} placeholder="0" onChange={e => handleMarginChange('left', e.target.value)} className="w-full bg-black/40 p-3 rounded-2xl text-center text-xs font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" />
                <span className="block text-[9px] text-white/20 text-center mt-2 font-black uppercase tracking-tighter">{t.m_esq}</span>
              </div>
              <div className="w-20 h-24 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center shadow-inner group">
                <i className="fa-solid fa-file-lines text-3xl text-white/5 group-hover:text-[#2ecc71]/20 transition-colors"></i>
              </div>
              <div className="w-20">
                <input type="number" step="0.1" value={marginInputs.right} placeholder="0" onChange={e => handleMarginChange('right', e.target.value)} className="w-full bg-black/40 p-3 rounded-2xl text-center text-xs font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" />
                <span className="block text-[9px] text-white/20 text-center mt-2 font-black uppercase tracking-tighter">{t.m_dir}</span>
              </div>
            </div>
            <div className="w-24 mt-3">
              <input type="number" step="0.1" value={marginInputs.bottom} placeholder="0" onChange={e => handleMarginChange('bottom', e.target.value)} className="w-full bg-black/40 p-3 rounded-2xl text-center text-xs font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" />
              <span className="block text-[9px] text-white/20 text-center mt-2 font-black uppercase tracking-tighter">{t.m_inf}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.2em] opacity-40">{t.poster_title}</h3>
          <div className="space-y-2 bg-[#1e1e1e] p-3 rounded-[2rem] border border-white/5 shadow-xl">
            <label className="flex items-center gap-4 cursor-pointer group p-4 hover:bg-white/5 rounded-2xl transition-all">
              <input type="radio" checked={sizeMode === 'res'} onChange={() => setSizeMode('res')} className="accent-[#2ecc71] w-4 h-4" />
              <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">{t.mode_res}</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-4 cursor-pointer group p-4 hover:bg-white/5 rounded-2xl transition-all">
                <input type="radio" checked={sizeMode === 'total'} onChange={() => setSizeMode('total')} className="accent-[#2ecc71] w-4 h-4" />
                <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">{t.mode_total} ({unit})</span>
              </label>
              {sizeMode === 'total' && (
                <div className="grid grid-cols-2 gap-3 pl-12 pr-4 pb-4 animate-in slide-in-from-top-4">
                  <input type="number" value={totalSize.w} onChange={e => setTotalSize({...totalSize, w: +e.target.value})} className="bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" placeholder={t.width} />
                  <input type="number" value={totalSize.h} onChange={e => setTotalSize({...totalSize, h: +e.target.value})} className="bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" placeholder={t.height} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-4 cursor-pointer group p-4 hover:bg-white/5 rounded-2xl transition-all">
                <input type="radio" checked={sizeMode === 'pages'} onChange={() => setSizeMode('pages')} className="accent-[#2ecc71] w-4 h-4" />
                <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">{t.mode_pages}</span>
              </label>
              {sizeMode === 'pages' && (
                <div className="grid grid-cols-2 gap-3 pl-12 pr-4 pb-4 animate-in slide-in-from-top-4">
                  <input type="number" min="1" value={pagesCount.w} onChange={e => setPagesCount({...pagesCount, w: Math.max(1, +e.target.value)})} className="bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" placeholder={t.pg_w} />
                  <input type="number" min="1" value={pagesCount.h} onChange={e => setPagesCount({...pagesCount, h: Math.max(1, +e.target.value)})} className="bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" placeholder={t.pg_h} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-4 cursor-pointer group p-4 hover:bg-white/5 rounded-2xl transition-all">
                <input type="radio" checked={sizeMode === 'perc'} onChange={() => setSizeMode('perc')} className="accent-[#2ecc71] w-4 h-4" />
                <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">{t.mode_perc}</span>
              </label>
              {sizeMode === 'perc' && (
                <div className="pl-12 pr-4 pb-4 animate-in slide-in-from-top-4">
                  <input type="number" min="1" value={percentage} onChange={e => setPercentage(Math.max(1, +e.target.value))} className="w-full bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none text-white focus:ring-2 ring-[#2ecc71]/40" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-[#2ecc71] uppercase tracking-[0.2em] opacity-40">{t.align_title}</h3>
          <div className="grid grid-cols-3 gap-3 w-fit mx-auto bg-[#1e1e1e] p-3 rounded-[2rem] border border-white/5 shadow-2xl">
            {['TL', 'TC', 'TR', 'ML', 'C', 'MR', 'BL', 'BC', 'BR'].map(pos => {
              let iconClass = 'fa-circle';
              if (pos === 'TL') iconClass = 'fa-arrow-up-left';
              else if (pos === 'TC') iconClass = 'fa-arrow-up';
              else if (pos === 'TR') iconClass = 'fa-arrow-up-right';
              else if (pos === 'ML') iconClass = 'fa-arrow-left';
              else if (pos === 'C') iconClass = 'fa-arrows-to-dot';
              else if (pos === 'MR') iconClass = 'fa-arrow-right';
              else if (pos === 'BL') iconClass = 'fa-arrow-down-left';
              else if (pos === 'BC') iconClass = 'fa-arrow-down';
              else if (pos === 'BR') iconClass = 'fa-arrow-down-right';

              return (
                <button 
                  key={pos} 
                  onClick={() => setAlignment(pos)} 
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all ${alignment === pos ? 'bg-[#2ecc71] text-white shadow-[0_10px_30px_rgba(46,204,113,0.4)] scale-110 z-10' : 'hover:bg-white/5 text-white/10 hover:text-white/30'}`}
                >
                  <i className={`fa-solid ${iconClass} text-xl`}></i>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleGeneratePDF} disabled={!image} className={`w-full py-8 rounded-[2.5rem] font-black text-lg tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all transform active:scale-95 mb-12 uppercase ${image ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-white' : 'bg-[#1e1e1e] text-white/5 cursor-not-allowed border border-white/5'}`}>
          <i className="fa-solid fa-file-pdf mr-3"></i> {t.save}
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 animate-in fade-in duration-500">
          <div className="bg-[#141414] rounded-[3rem] p-12 max-w-sm w-full text-center border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] scale-in-center">
            <div className="text-[#2ecc71] text-8xl mb-8 animate-bounce-short">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="text-3xl font-black mb-4 text-white tracking-tighter">{modal.title}</h2>
            <p className="text-white/40 leading-relaxed mb-10 font-medium">{modal.message}</p>
            <button onClick={() => setModal(null)} className="bg-[#2ecc71] hover:bg-[#27ae60] w-full py-6 rounded-[2rem] font-black text-white transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
