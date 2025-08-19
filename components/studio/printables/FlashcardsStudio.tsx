import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Card = { front: string; back: string };

export const FlashcardsStudio: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { front: 'Capital of France', back: 'Paris' },
    { front: '2 + 2', back: '4' },
    { front: 'Atomic number of Oxygen', back: '8' },
    { front: 'Largest ocean', back: 'Pacific' },
  ]);
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
    pdf.save('flashcards.pdf');
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Flashcards</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-6 rounded shadow" style={{ width: 600 }}>
        <div className="grid grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="border border-gray-300 rounded p-4">
              <div className="font-semibold">Q: {c.front}</div>
              <div className="mt-2 text-gray-700">A: {c.back}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

