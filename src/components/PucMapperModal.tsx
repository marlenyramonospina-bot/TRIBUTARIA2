import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { PUC_CATALOG, PucAccountInfo } from '../data/pucCatalog';

interface PucMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PucMapperModal: React.FC<PucMapperModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESOS', 'GASTOS', 'COSTOS'];

  const filtered = PUC_CATALOG.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Diccionario Pedagógico SENA: PUC ↔ Renglones DIAN
              </h3>
              <p className="text-xs text-slate-300">
                Aprende qué casillas oficiales de los formularios DIAN se alimentan de cada cuenta contable del PUC.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código (ej: 2408), nombre o concepto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No se encontraron cuentas con el criterio de búsqueda.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.code}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-300">
                      {item.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.nature === 'DEBITO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      Nat. {item.nature}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Form mappings */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex flex-wrap gap-2">
                  <span className="font-semibold text-slate-600 text-[11px] flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    Destino en Formularios DIAN:
                  </span>

                  {item.taxFormMapping.form110Row && (
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-mono text-[11px]">
                      <strong>F110 (Renta PJ):</strong> R{item.taxFormMapping.form110Row.rowNumber} - {item.taxFormMapping.form110Row.rowName}
                    </span>
                  )}
                  {item.taxFormMapping.form300Row && (
                    <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 font-mono text-[11px]">
                      <strong>F300 (IVA):</strong> R{item.taxFormMapping.form300Row.rowNumber} - {item.taxFormMapping.form300Row.rowName}
                    </span>
                  )}
                  {item.taxFormMapping.form350Row && (
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-mono text-[11px]">
                      <strong>F350 (Retefuente):</strong> R{item.taxFormMapping.form350Row.rowNumber} - {item.taxFormMapping.form350Row.rowName}
                    </span>
                  )}
                  {item.taxFormMapping.form310Row && (
                    <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 font-mono text-[11px]">
                      <strong>F310 (INC):</strong> R{item.taxFormMapping.form310Row.rowNumber} - {item.taxFormMapping.form310Row.rowName}
                    </span>
                  )}
                  {item.taxFormMapping.form420Row && (
                    <span className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-mono text-[11px]">
                      <strong>F420 (Patrimonio):</strong> R{item.taxFormMapping.form420Row.rowNumber} - {item.taxFormMapping.form420Row.rowName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-700">Criterio Fiscal:</strong> {item.notes}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition"
          >
            Entendido, Volver al Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
