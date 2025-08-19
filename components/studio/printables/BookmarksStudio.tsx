import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const BookmarksStudio: React.FC = () => {
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
    pdf.save('bookmarks.pdf');
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Bookmarks</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-6 rounded shadow" style={{ width: 600 }}>
        <div className="grid grid-cols-3 gap-4">
          {['Read More', 'Just One More Chapter', 'Book Lover'].map((title, i) => (
            <div key={i} className="h-64 border border-gray-300 rounded p-4 flex items-center justify-center text-center">
              <div className="font-semibold">{title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

