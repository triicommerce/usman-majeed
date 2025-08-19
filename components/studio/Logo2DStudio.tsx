import React, { useEffect, useRef, useState } from 'react';

export const Logo2DStudio: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any | null>(null);
  const [text, setText] = useState('Your Brand');

  useEffect(() => {
    let disposed = false;
    (async () => {
      if (!canvasRef.current) return;
      const mod = await import('fabric');
      // Support both default and named export patterns
      const fabricAny: any = (mod as any).fabric || (mod as any).default || mod;
      const canvas = new fabricAny.Canvas(canvasRef.current, { backgroundColor: '#0f172a' });
      if (disposed) {
        canvas.dispose();
        return;
      }
      fabricRef.current = canvas;
      const t = new fabricAny.IText(text, { left: 50, top: 50, fill: '#e2e8f0', fontFamily: 'Inter', fontSize: 48 });
      canvas.add(t);
      const circle = new fabricAny.Circle({ radius: 40, fill: '#06b6d4', left: 40, top: 140 });
      canvas.add(circle);
    })();
    return () => {
      disposed = true;
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
    };
  }, []);

  const exportPng = () => {
    if (!fabricRef.current) return;
    const data = fabricRef.current.toDataURL({ format: 'png', multiplier: 2 });
    const a = document.createElement('a');
    a.href = data;
    a.download = 'logo-2d.png';
    a.click();
  };

  const addShape = () => {
    if (!fabricRef.current) return;
    const FabricCtor = (fabricRef.current as any).constructor;
    const rect = new FabricCtor.Rect({ left: 180, top: 120, width: 80, height: 80, fill: '#22c55e', rx: 8, ry: 8 });
    fabricRef.current.add(rect);
  };

  const addText = () => {
    if (!fabricRef.current) return;
    const t = new (fabricRef.current as any).constructor.IText(text, { left: 80, top: 240, fill: '#eab308', fontFamily: 'Inter', fontSize: 36 });
    fabricRef.current.add(t);
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">2D Logo Designer</h2>
      <div className="flex gap-2 mb-3">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Text" className="bg-slate-800 border border-slate-700 rounded px-3 py-2" />
        <button className="px-3 py-2 bg-slate-700 rounded" onClick={addShape}>Add Shape</button>
        <button className="px-3 py-2 bg-slate-700 rounded" onClick={addText}>Add Text</button>
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPng}>Export PNG</button>
      </div>
      <canvas ref={canvasRef} width={800} height={400} className="w-full border border-slate-700 rounded" />
    </div>
  );
};

