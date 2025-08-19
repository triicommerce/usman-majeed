import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const WorksheetsStudio: React.FC = () => {
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
    pdf.save('worksheet.pdf');
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Worksheets</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-8 rounded shadow" style={{ width: 600 }}>
        <div className="text-center text-2xl font-bold mb-4">Math Worksheet</div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-300 py-2">
              <div>{i + 1}) 12 + {i} =</div>
              <div className="w-40 h-8 border border-gray-400"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

