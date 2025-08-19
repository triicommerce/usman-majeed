import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const MapsStudio: React.FC = () => {
  const [title, setTitle] = useState('Event Map');
  const ref = useRef<HTMLDivElement | null>(null);
  const exportPdf = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    pdf.addImage(imgData, 'PNG', (pageWidth - w) / 2, 40, w, h);
    pdf.save('map.pdf');
  };
  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Maps</h2>
      <div className="flex gap-2 mb-3">
        <input value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-3 py-2" />
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-6 rounded shadow" style={{ width: 600, height: 800 }}>
        <div className="text-center text-2xl font-bold mb-4">{title}</div>
        <div className="w-full h-[680px] bg-gray-100 border relative">
          <div className="absolute left-6 top-6">Legend:</div>
          <div className="absolute right-6 bottom-6 text-xs text-gray-600">Scale 1:1000</div>
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

