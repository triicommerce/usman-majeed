import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const SignsStudio: React.FC = () => {
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
    pdf.save('sign.pdf');
  };
  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Signs</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-8 rounded shadow" style={{ width: 600 }}>
        <div className="text-center">
          <div className="text-5xl font-extrabold">SALE</div>
          <div className="mt-4 text-2xl">50% OFF</div>
          <div className="mt-6">Limited time only</div>
        </div>
      </div>
    </div>
  );
};

