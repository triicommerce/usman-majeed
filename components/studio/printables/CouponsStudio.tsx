import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Coupon = { title: string; subtitle: string; code: string };

export const CouponsStudio: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { title: '20% OFF', subtitle: 'Any item', code: 'SAVE20' },
    { title: 'BOGO', subtitle: 'Buy 1 Get 1', code: 'BOGO' },
    { title: 'FREE', subtitle: 'Shipping', code: 'SHIPFREE' },
    { title: '$5 OFF', subtitle: 'Orders $25+', code: 'FIVEOFF' },
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
    pdf.save('coupons.pdf');
  };

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Printable Coupons</h2>
      <div className="mb-2">
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={exportPdf}>Export PDF</button>
      </div>
      <div ref={ref} className="bg-white text-black p-6 rounded shadow" style={{ width: 600 }}>
        <div className="grid grid-cols-2 gap-4">
          {coupons.map((c, i) => (
            <div key={i} className="border-2 border-dashed border-gray-400 p-4 rounded">
              <div className="text-xl font-bold">{c.title}</div>
              <div className="text-sm">{c.subtitle}</div>
              <div className="mt-3 text-xs">Use code:</div>
              <div className="font-mono text-lg tracking-widest">{c.code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

