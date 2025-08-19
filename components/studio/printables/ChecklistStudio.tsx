import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ChecklistStudio: React.FC = () => {
  const [items, setItems] = useState<string[]>(['Task 1', 'Task 2']);
  const [input, setInput] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  const add = () => {
    if (!input.trim()) return;
    setItems(prev => prev.concat(input.trim()));
    setInput('');
  };

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
    pdf.save('checklist.pdf');
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Checklist</h2>
      <div className="flex gap-2 mb-3">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add item" className="bg-slate-800 border border-slate-700 rounded px-3 py-2" />
        <button className="px-3 py-2 bg-slate-700 rounded" onClick={add}>Add</button>
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-8 rounded shadow" style={{ width: 600 }}>
        <h3 className="text-2xl font-bold mb-4">Checklist</h3>
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-gray-400" />
              <div>{it}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

