
import React from 'react';
import type { Supplier } from '../types';
import { Card } from './shared/Card';
import { Loader } from './shared/Loader';
import { TruckIcon } from './icons/TruckIcon';

interface SupplierFinderProps {
  suppliers?: Supplier[];
  isLoading: boolean;
}

export const SupplierFinder: React.FC<SupplierFinderProps> = ({ suppliers, isLoading }) => {
  const content = () => {
    if (isLoading) {
      return <Loader message="Searching for suppliers..." />;
    }
    if (!suppliers || suppliers.length === 0) {
      return <p className="text-slate-400 text-center py-4">No potential suppliers found.</p>;
    }
    return (
      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {suppliers.map((supplier, index) => (
          <li key={index} className="bg-slate-800/50 p-4 rounded-lg">
            <a href={supplier.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:underline mb-1 block">
              {supplier.name}
            </a>
            <p className="text-sm text-slate-400">{supplier.details}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Potential Suppliers" icon={<TruckIcon />}>
      {content()}
    </Card>
  );
};
